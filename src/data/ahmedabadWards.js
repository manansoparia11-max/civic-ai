// Ahmedabad Municipal Corporation (AMC) Zones & Wards
export const AMC_ZONES = [
  {
    id: "north-west",
    name: "North West Zone",
    wards: [
      { id: "ward-08", name: "Ward 8 - Vastrapur", office: "Bodakdev Civic Center", contact: "079-26871020" },
      { id: "ward-09", name: "Ward 9 - Bodakdev", office: "Sindhu Bhavan Zonal Office", contact: "079-26871021" },
      { id: "ward-10", name: "Ward 10 - Thaltej", office: "Thaltej Ward Office", contact: "079-26871022" },
      { id: "ward-01", name: "Ward 1 - Gota", office: "Gota Civic Center", contact: "079-27661001" },
      { id: "ward-02", name: "Ward 2 - Chandlodiya", office: "Chandlodiya Office", contact: "079-27661002" },
      { id: "ward-07", name: "Ward 7 - Ghatlodiya", office: "Ghatlodiya Civic Center", contact: "079-27431007" },
    ]
  },
  {
    id: "west",
    name: "West Zone",
    wards: [
      { id: "ward-14", name: "Ward 14 - Navrangpura", office: "Navrangpura Ward Office (Near Stadium)", contact: "079-26561014" },
      { id: "ward-15", name: "Ward 15 - Naranpura", office: "Naranpura Civic Center", contact: "079-27471015" },
      { id: "ward-16", name: "Ward 16 - Paldi", office: "Paldi Cross Roads Civic Center", contact: "079-26571016" },
      { id: "ward-17", name: "Ward 17 - Vasna", office: "Vasna Ward Office", contact: "079-26601017" },
      { id: "ward-18", name: "Ward 18 - Usmanpura", office: "Riverfront Zonal Office", contact: "079-27551018" },
      { id: "ward-19", name: "Ward 19 - Sabarmati", office: "Sabarmati Civic Center", contact: "079-27501019" },
    ]
  },
  {
    id: "south-west",
    name: "South West Zone",
    wards: [
      { id: "ward-11", name: "Ward 11 - Satellite & Jodhpur", office: "Jodhpur Ward Office", contact: "079-26921011" },
      { id: "ward-12", name: "Ward 12 - Vejalpur & Prahladnagar", office: "Vejalpur Civic Center", contact: "079-26821012" },
      { id: "ward-13", name: "Ward 13 - Sarkhej & Bopal", office: "Bopal-Ghuma Municipal Office", contact: "079-29701013" },
      { id: "ward-20", name: "Ward 20 - Maktampura", office: "Maktampura Ward Office", contact: "079-26831020" },
    ]
  },
  {
    id: "central",
    name: "Central Zone (Heritage City)",
    wards: [
      { id: "ward-21", name: "Ward 21 - Khadia", office: "Khadia Heritage Ward Office", contact: "079-22141021" },
      { id: "ward-23", name: "Ward 23 - Jamalpur", office: "Jamalpur Ward Office", contact: "079-22131023" },
      { id: "ward-24", name: "Ward 24 - Shahpur", office: "Shahpur Civic Center", contact: "079-25621024" },
      { id: "ward-25", name: "Ward 25 - Dariapur", office: "Dariapur Zonal Office", contact: "079-22161025" },
    ]
  },
  {
    id: "south",
    name: "South Zone",
    wards: [
      { id: "ward-22", name: "Ward 22 - Maninagar", office: "Maninagar Civic Center (Near Kankaria)", contact: "079-25461022" },
      { id: "ward-26", name: "Ward 26 - Isanpur", office: "Isanpur Ward Office", contact: "079-25831026" },
      { id: "ward-27", name: "Ward 27 - Vatva", office: "Vatva GIDC Civic Center", contact: "079-25891027" },
      { id: "ward-28", name: "Ward 28 - Danilimda", office: "Danilimda Ward Office", contact: "079-25321028" },
    ]
  },
  {
    id: "north",
    name: "North Zone",
    wards: [
      { id: "ward-03", name: "Ward 3 - Chandkheda", office: "Chandkheda Civic Center (IOC Road)", contact: "079-27511003" },
      { id: "ward-04", name: "Ward 4 - Motera", office: "Motera Stadium Civic Center", contact: "079-27511004" },
      { id: "ward-05", name: "Ward 5 - Saijpur Bogha", office: "Saijpur Ward Office", contact: "079-22811005" },
      { id: "ward-06", name: "Ward 6 - Naroda", office: "Naroda Zonal Office", contact: "079-22821006" },
    ]
  },
  {
    id: "east",
    name: "East Zone",
    wards: [
      { id: "ward-29", name: "Ward 29 - Bapunagar", office: "Bapunagar Civic Center", contact: "079-22741029" },
      { id: "ward-30", name: "Ward 30 - Amraiwadi", office: "Amraiwadi Ward Office", contact: "079-22771030" },
      { id: "ward-31", name: "Ward 31 - Gomtipur", office: "Gomtipur Ward Office", contact: "079-22161031" },
      { id: "ward-32", name: "Ward 32 - Odhav", office: "Odhav Civic Center", contact: "079-22871032" },
    ]
  }
];

export const ALL_WARDS = AMC_ZONES.flatMap(zone => 
  zone.wards.map(ward => ({ ...ward, zoneName: zone.name, zoneId: zone.id }))
);

export const AMC_DEPARTMENTS = [
  { id: "dept-roads", name: "Roads & Buildings Project Dept", head: "Shri Rajesh Patel (SE, West Zone)", code: "R&B-AMC" },
  { id: "dept-swm", name: "Solid Waste Management Dept", head: "Dr. Mihir Trivedi (Chief Medical Officer)", code: "SWM-AMC" },
  { id: "dept-light", name: "Street Lighting & Electrical Dept", head: "Er. Bhavesh Shah (Executive Engineer)", code: "SLED-AMC" },
  { id: "dept-water", name: "Water Supply & Drainage Dept", head: "Er. Kalpesh Modi (City Engineer)", code: "WSDD-AMC" },
  { id: "dept-encroach", name: "Estate & Encroachment Removal", head: "Shri Aniket Joshi (Deputy Estate Officer)", code: "EERD-AMC" },
  { id: "dept-garden", name: "Parks & Garden Department", head: "Smt. Neeta Dave (Director of Parks)", code: "PGD-AMC" },
];
