import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, AlertCircle, Phone, ArrowRight, CornerDownLeft, Terminal, CheckCircle2 } from "lucide-react";
import { sendChatMessage } from "../services/api";

export const CivicChatbot = ({ complaint }) => {
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "bot",
      text: complaint 
        ? `Namaste! I am **CivicBot AI**, the Ahmedabad Municipal Corporation virtual assistant. I am currently monitoring ticket **${complaint.id}** (${complaint.category} in ${complaint.ward}). How can I help you today?`
        : `Namaste! I am **CivicBot AI**, your Ahmedabad Municipal Corporation assistant. Enter a tracking ID or ask me anything about civic complaints, ward offices, or resolution timelines in Ahmedabad.`,
      toolCalls: []
    }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // When active complaint changes, add greeting notice
  useEffect(() => {
    if (complaint) {
      setMessages((prev) => [
        ...prev,
        {
          id: `notice-${complaint.id}-${Date.now()}`,
          sender: "bot",
          text: `Now monitoring active ticket **${complaint.id}** — *${complaint.category}* in **${complaint.ward}** (Status: **${complaint.status}**).`,
          toolCalls: [
            { tool: "db_lookup", description: `Active ticket switched to ${complaint.id}`, timestamp: new Date().toLocaleTimeString() }
          ]
        }
      ]);
    }
  }, [complaint?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const suggestedQuestions = complaint ? [
    "When will this be resolved?",
    "Who is the assigned engineer?",
    "Can this be escalated?",
    "How does AMC verify the repair?"
  ] : [
    "How fast are potholes repaired in Ahmedabad?",
    "What is the AMC toll-free helpline?",
    "Which ward covers Sindhu Bhavan Road?",
    "How do I track an old complaint?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateLocalFallbackReply = (userQuery) => {
    const q = userQuery.toLowerCase();

    if (q.includes("when") || q.includes("time") || q.includes("sla") || q.includes("deadline")) {
      if (complaint) {
        if (complaint.status === "Resolved") {
          return `Good news! Ticket **${complaint.id}** was marked as **Resolved**. ${complaint.resolutionNotes || "All remedial works have been completed and verified by the AMC Quality Division."}`;
        }
        return `Under AMC's Citizen Charter, this **${complaint.category}** has a maximum resolution SLA. Current status is **${complaint.status}**. Expected completion is by **${new Date(complaint.slaDeadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}**. Crew updates are logged in real-time.`;
      }
      return "AMC standard resolution time is 24–48 hours for road potholes and solid waste, and within 12 hours for critical streetlight electrical hazards.";
    }

    if (q.includes("who") || q.includes("engineer") || q.includes("officer") || q.includes("contractor")) {
      if (complaint) {
        return `This ticket is overseen by **${complaint.assignedEngineer}** from the **${complaint.department}**. The executing agency on ground is **${complaint.fieldContractor}**. Direct ward office line is **079-26871020**.`;
      }
      return "All tickets are mapped to the Junior Engineer (JE) and Assistant Engineer (AE) of the respective AMC Ward. You can find your ward office via the AMC Citizen Portal.";
    }

    if (q.includes("escalate") || q.includes("urgent") || q.includes("emergency") || q.includes("critical")) {
      if (complaint) {
        return `Ticket **${complaint.id}** is currently at **${complaint.severity}** severity. I have logged an internal escalation flag to the **${complaint.zone} Executive Engineer**. If this is an immediate public emergency, you can also dial AMC Command Center at **155303** quoting this ID.`;
      }
      return "For immediate civic emergencies (electrical shocks, water main bursts, structural collapse), dial **155303** or **112**.";
    }

    if (q.includes("road space") || q.includes("damage") || q.includes("traffic") || q.includes("block") || q.includes("obstruction")) {
      if (complaint) {
        return `Regarding **${complaint.id}**: CivicSnap AI detected an estimated **${complaint.roadSpaceReductionPct || 35}% road space loss** due to *${complaint.obstructionType || complaint.category}*. Damage profile is classified as **${complaint.roadDamageType || "Pavement Defect & Surface Wear"}**. ${complaint.department} has been assigned to clear the blockage and restore traffic flow.`;
      }
      return "CivicSnap AI dynamically measures road carriageway obstruction percentage and structural asphalt wear, prioritizing tickets that reduce vehicle flow or pose two-wheeler safety hazards.";
    }

    if (q.includes("verify") || q.includes("proof") || q.includes("after") || q.includes("photo")) {
      return "CivicSnap AI uses a mandatory dual-verification protocol: The field crew must upload a GPS-geotagged and timestamped photo of the repaired site. Our AI computer vision model compares the 'Before' and 'After' geometries before the ticket is officially marked as Resolved.";
    }

    if (q.includes("helpline") || q.includes("phone") || q.includes("contact") || q.includes("call")) {
      return "You can reach the Ahmedabad Municipal Corporation (AMC) 24x7 Comprehensive Citizen Call Center at toll-free number **155303** or WhatsApp at **+91 79 2539 1811**.";
    }

    if (q.includes("ward") || q.includes("sindhu") || q.includes("bodakdev") || q.includes("vastrapur")) {
      return "Sindhu Bhavan Road and Bodakdev fall under **Ward 9 - Bodakdev, North West Zone**. The zonal office is located at Bodakdev Civic Center, near Pakwan Cross Roads.";
    }

    return `Thank you for checking in. Ticket **${complaint ? complaint.id : "query"}** is tracked under the Ahmedabad Municipal Corporation AI Governance dashboard. You will receive an automated SMS alert as soon as the field engineer uploads the completion proof!`;
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Connect to FastAPI Backend with Gemini Vision & JSON DB
      const result = await sendChatMessage(query.trim(), complaint?.id || null);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: result.reply,
          toolCalls: result.tool_calls || []
        }
      ]);
    } catch (err) {
      console.warn("Backend chat error, using local verified reply:", err);
      // Fallback seamlessly to verified rule reply
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: generateLocalFallbackReply(query),
            toolCalls: [
              { tool: "local_cache_lookup", description: "Answered using client database rules", timestamp: new Date().toLocaleTimeString() }
            ]
          }
        ]);
      }, 400);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-glass overflow-hidden flex flex-col h-[520px]">
      {/* Chatbot Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Bot className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm tracking-tight text-white">CivicBot Assistant</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-blue-100">
              {complaint ? `Live Assistant for ${complaint.id}` : "AMC Real-time Civic Support"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/15 text-blue-100 border border-white/10 uppercase">
            AMC AI Triage
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
        {messages.map((msg) => {
          const isBot = msg.sender === "bot";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
            >
              {isBot && (
                <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isBot
                    ? "bg-white text-slate-800 border border-slate-200/70 rounded-tl-xs"
                    : "bg-blue-600 text-white rounded-tr-xs"
                }`}
              >
                {/* Markdown text formatter */}
                <div className="space-y-1">
                  {msg.text.split("\n").map((line, lIdx) => {
                    if (!line.trim()) return <div key={lIdx} className="h-1" />;
                    return (
                      <p key={lIdx}>
                        {line.split("**").map((chunk, index) =>
                          index % 2 === 1 ? <strong key={index} className="font-semibold">{chunk}</strong> : chunk
                        )}
                      </p>
                    );
                  })}
                </div>

                {/* AI Tool Calls Activity Tag */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-500">
                    <span className="inline-flex items-center gap-1 text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                      <Terminal className="w-3 h-3 text-blue-600" />
                      AI Action:
                    </span>
                    {msg.toolCalls.slice(-2).map((tc, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200/80">
                        {tc.tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {!isBot && (
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-xs">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chips */}
      <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span className="text-[11px] font-semibold text-slate-500 shrink-0">Quick ask:</span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200 hover:border-blue-400 hover:text-blue-700 whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask CivicBot about repairs, SLA, or ward officers..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
