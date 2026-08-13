export const COMPANY = {
  name: "Avertech",
  legal: "Avertech Services Pvt. Ltd.",
};

export type VisitStatus =
  | "registration_started"
  | "details_submitted"
  | "otp_verification"
  | "verified"
  | "waiting_approval"
  | "host_notified"
  | "host_arrived"
  | "checked_in"
  | "meeting_in_progress"
  | "completed"
  | "cancelled";

export const STATUS_META: Record<
  VisitStatus,
  { label: string; tone: "neutral" | "info" | "success" | "warning" | "danger" }
> = {
  registration_started: { label: "Registration Started", tone: "neutral" },
  details_submitted: { label: "Details Submitted", tone: "neutral" },
  otp_verification: { label: "OTP Verification", tone: "warning" },
  verified: { label: "Verified", tone: "info" },
  waiting_approval: { label: "Waiting for Approval", tone: "warning" },
  host_notified: { label: "Host Notified", tone: "info" },
  host_arrived: { label: "Host Arrived", tone: "info" },
  checked_in: { label: "Checked In", tone: "success" },
  meeting_in_progress: { label: "Meeting in Progress", tone: "success" },
  completed: { label: "Visit Completed", tone: "neutral" },
  cancelled: { label: "Visit Cancelled", tone: "danger" },
};

export const LIVE_STATUS_FLOW: VisitStatus[] = [
  "checked_in",
  "host_notified",
  "host_arrived",
  "meeting_in_progress",
  "completed",
];

export type Host = {
  id: string;
  name: string;
  designation: string;
  department: string;
  initials: string;
};

export const HOSTS: Host[] = [
  {
    id: "h1",
    name: "Rahul Sharma",
    designation: "Engineering Manager",
    department: "Engineering",
    initials: "RS",
  },
  {
    id: "h2",
    name: "Priya Sharma",
    designation: "Client Partner",
    department: "Client Success",
    initials: "PS",
  },
  {
    id: "h3",
    name: "Aditya Menon",
    designation: "Head of Product",
    department: "Product",
    initials: "AM",
  },
  {
    id: "h4",
    name: "Neha Kulkarni",
    designation: "Talent Lead",
    department: "People & Culture",
    initials: "NK",
  },
  {
    id: "h5",
    name: "Vikram Iyer",
    designation: "Finance Controller",
    department: "Finance",
    initials: "VI",
  },
  {
    id: "h6",
    name: "Sana Qureshi",
    designation: "Facilities Manager",
    department: "Administration",
    initials: "SQ",
  },
];

export const VISIT_TYPES = [
  "Meeting",
  "Interview",
  "Business Discussion",
  "Delivery",
  "Vendor",
  "Client Visit",
  "Other",
] as const;

export const DURATIONS = ["15 minutes", "30 minutes", "1 hour", "2 hours", "Half day"] as const;

export type PersonalDetails = {
  fullName: string;
  mobile: string;
  email: string;
  company: string;
  designation: string;
};

export type VisitDetails = {
  hostId: string;
  department: string;
  purpose: string;
  visitType: string;
  duration: string;
  reference: string;
};

export type PastVisit = {
  id: string;
  date: string;
  hostName: string;
  department: string;
  purpose: string;
  status: VisitStatus;
};

export type VisitorProfile = {
  visitorId: string;
  personal: PersonalDetails;
  totalVisits: number;
  lastVisit: string;
  history: PastVisit[];
};

export const KNOWN_VISITOR: VisitorProfile = {
  visitorId: "VIS-2026-00087",
  personal: {
    fullName: "John Doe",
    mobile: "98765 43210",
    email: "john.doe@abctech.com",
    company: "ABC Technologies",
    designation: "Solutions Architect",
  },
  totalVisits: 12,
  lastVisit: "02 Aug 2026",
  history: [
    {
      id: "VIS-2026-00071",
      date: "13 August 2026",
      hostName: "Rahul Sharma",
      department: "Engineering",
      purpose: "Business Meeting",
      status: "completed",
    },
    {
      id: "VIS-2026-00058",
      date: "02 August 2026",
      hostName: "Priya Sharma",
      department: "Client Success",
      purpose: "Client Discussion",
      status: "completed",
    },
    {
      id: "VIS-2026-00041",
      date: "18 July 2026",
      hostName: "Aditya Menon",
      department: "Product",
      purpose: "Product Roadmap Review",
      status: "completed",
    },
  ],
};

export const emptyPersonal: PersonalDetails = {
  fullName: "",
  mobile: "",
  email: "",
  company: "",
  designation: "",
};

export const emptyVisit: VisitDetails = {
  hostId: "",
  department: "",
  purpose: "",
  visitType: "",
  duration: "30 minutes",
  reference: "",
};

export function generateVisitId() {
  const n = Math.floor(100 + Math.random() * 800);
  return `VIS-2026-00${n}`;
}

export function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export function maskMobile(mobile: string) {
  const digits = mobile.replace(/\D/g, "");
  if (digits.length < 4) return "+91 XXXXX XXXXX";
  return `+91 XXXXX ${digits.slice(-5)}`;
}
