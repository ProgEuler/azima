// Mock data shared by admin and provider pages.
// Realistic-looking but never fetched.

export type Role = "admin" | "provider" | "user";
export type UserStatus = "active" | "invited" | "suspended" | "pending";
export type ProviderStatus = "active" | "pending" | "suspended" | "invited";
export type OrderStatus = "paid" | "pending" | "refunded" | "failed";
export type NotificationChannel = "email" | "sms" | "push";
export type NotificationStatus = "delivered" | "bounced" | "queued" | "failed";
export type RequestStatus = "open" | "in_progress" | "completed" | "cancelled";
export type ServiceStatus = "active" | "paused" | "draft";
export type EarningStatus = "paid" | "pending" | "refunded";

export const currentUser = {
  name: "Shaban Haider",
  email: "shaban@azima.app",
  role: "admin" as Role,
  avatar: "https://github.com/shabanhr.png",
  joinedAt: "Mar 14, 2024",
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
};

export const adminUsers: AdminUser[] = [
  { id: "u_001", name: "Amelia Park",   email: "amelia.park@azima.app",   role: "user",     status: "active",    createdAt: "Apr 02, 2024" },
  { id: "u_002", name: "Daniel Wu",     email: "daniel.wu@azima.app",     role: "provider", status: "active",    createdAt: "Mar 28, 2024" },
  { id: "u_003", name: "Priya Shah",    email: "priya.shah@azima.app",    role: "user",     status: "invited",   createdAt: "Sep 12, 2025" },
  { id: "u_004", name: "Marcus Klein",  email: "marcus.k@azima.app",      role: "provider", status: "pending",   createdAt: "Sep 09, 2025" },
  { id: "u_005", name: "Sara Lindqvist", email: "sara.l@azima.app",       role: "user",     status: "active",    createdAt: "Aug 30, 2025" },
  { id: "u_006", name: "Omar Haddad",   email: "omar.h@azima.app",        role: "provider", status: "suspended", createdAt: "Aug 18, 2025" },
  { id: "u_007", name: "Yuki Tanaka",   email: "yuki.t@azima.app",        role: "user",     status: "active",    createdAt: "Jul 22, 2025" },
  { id: "u_008", name: "Hannah Reilly", email: "hannah.r@azima.app",      role: "admin",    status: "active",    createdAt: "Jan 10, 2024" },
  { id: "u_009", name: "Felix Brun",    email: "felix.b@azima.app",       role: "user",     status: "active",    createdAt: "Jun 14, 2025" },
  { id: "u_010", name: "Naila Rahman",  email: "naila.r@azima.app",       role: "user",     status: "suspended", createdAt: "May 03, 2025" },
  { id: "u_011", name: "Joaquin Vela",  email: "joaquin.v@azima.app",     role: "provider", status: "active",    createdAt: "Apr 27, 2025" },
  { id: "u_012", name: "Maya Chen",     email: "maya.c@azima.app",        role: "user",     status: "invited",   createdAt: "Apr 11, 2025" },
];

export type AdminProvider = {
  id: string;
  name: string;
  specialty: string;
  status: ProviderStatus;
  joinedAt: string;
  rating: number;
};

export const adminProviders: AdminProvider[] = [
  { id: "p_001", name: "Daniel Wu",      specialty: "Massage Therapy",    status: "active",    joinedAt: "Mar 28, 2024", rating: 4.9 },
  { id: "p_002", name: "Marcus Klein",   specialty: "Personal Training",  status: "pending",   joinedAt: "Sep 09, 2025", rating: 0 },
  { id: "p_003", name: "Omar Haddad",    specialty: "Nutrition Coaching", status: "suspended", joinedAt: "Aug 18, 2025", rating: 4.2 },
  { id: "p_004", name: "Joaquin Vela",   specialty: "Yoga",               status: "active",    joinedAt: "Apr 27, 2025", rating: 4.7 },
  { id: "p_005", name: "Aiko Nakamura",  specialty: "Acupuncture",        status: "active",    joinedAt: "Mar 02, 2025", rating: 4.8 },
  { id: "p_006", name: "Ravi Mehta",     specialty: "Physiotherapy",      status: "active",    joinedAt: "Feb 14, 2025", rating: 4.6 },
  { id: "p_007", name: "Lena Ortiz",     specialty: "Life Coaching",      status: "pending",   joinedAt: "Jan 30, 2025", rating: 0 },
  { id: "p_008", name: "Tomas Petrov",   specialty: "Massage Therapy",    status: "active",    joinedAt: "Dec 11, 2024", rating: 4.5 },
  { id: "p_009", name: "Camila Reyes",   specialty: "Nutrition Coaching", status: "active",    joinedAt: "Nov 05, 2024", rating: 4.9 },
  { id: "p_010", name: "Bashir Khan",    specialty: "Personal Training",  status: "active",    joinedAt: "Oct 21, 2024", rating: 4.4 },
];

export type AdminOrder = {
  id: string;
  customer: string;
  service: string;
  total: number;
  status: OrderStatus;
  date: string;
};

export const adminOrders: AdminOrder[] = [
  { id: "ORD-1042", customer: "Amelia Park",    service: "Deep Tissue Massage",  total: 120, status: "paid",     date: "Sep 02, 2025" },
  { id: "ORD-1041", customer: "Felix Brun",     service: "1:1 Coaching Session", total: 90,  status: "pending",  date: "Sep 02, 2025" },
  { id: "ORD-1040", customer: "Sara Lindqvist", service: "Yoga Class",           total: 35,  status: "paid",     date: "Sep 01, 2025" },
  { id: "ORD-1039", customer: "Yuki Tanaka",    service: "Nutrition Plan",       total: 75,  status: "paid",     date: "Sep 01, 2025" },
  { id: "ORD-1038", customer: "Maya Chen",      service: "Acupuncture",          total: 110, status: "refunded", date: "Aug 31, 2025" },
  { id: "ORD-1037", customer: "Priya Shah",     service: "Physiotherapy",        total: 95,  status: "failed",   date: "Aug 30, 2025" },
  { id: "ORD-1036", customer: "Naila Rahman",   service: "Personal Training",    total: 60,  status: "paid",     date: "Aug 30, 2025" },
  { id: "ORD-1035", customer: "Hannah Reilly",  service: "Massage Therapy",      total: 120, status: "paid",     date: "Aug 29, 2025" },
  { id: "ORD-1034", customer: "Amelia Park",    service: "Life Coaching",        total: 80,  status: "paid",     date: "Aug 28, 2025" },
  { id: "ORD-1033", customer: "Felix Brun",     service: "Yoga Class",           total: 35,  status: "refunded", date: "Aug 27, 2025" },
  { id: "ORD-1032", customer: "Yuki Tanaka",    service: "Deep Tissue Massage",  total: 120, status: "paid",     date: "Aug 27, 2025" },
  { id: "ORD-1031", customer: "Sara Lindqvist", service: "Nutrition Plan",       total: 75,  status: "paid",     date: "Aug 26, 2025" },
];

export type AdminNotification = {
  id: string;
  channel: NotificationChannel;
  recipient: string;
  subject: string;
  status: NotificationStatus;
  sentAt: string;
};

export const adminNotifications: AdminNotification[] = [
  { id: "n_001", channel: "email", recipient: "amelia.park@azima.app",   subject: "Your booking is confirmed",       status: "delivered", sentAt: "2 min ago" },
  { id: "n_002", channel: "sms",   recipient: "+1 415 555 0102",         subject: "Reminder: tomorrow at 10:00",     status: "delivered", sentAt: "14 min ago" },
  { id: "n_003", channel: "push",  recipient: "Felix Brun",              subject: "New message from provider",       status: "delivered", sentAt: "32 min ago" },
  { id: "n_004", channel: "email", recipient: "yuki.t@azima.app",        subject: "Receipt for #ORD-1040",           status: "bounced",   sentAt: "1 h ago" },
  { id: "n_005", channel: "email", recipient: "priya.shah@azima.app",    subject: "Welcome to Azima",                status: "delivered", sentAt: "2 h ago" },
  { id: "n_006", channel: "sms",   recipient: "+44 20 7946 0958",        subject: "Verification code: 418293",       status: "queued",    sentAt: "3 h ago" },
  { id: "n_007", channel: "push",  recipient: "Maya Chen",               subject: "Service paused by provider",      status: "delivered", sentAt: "5 h ago" },
  { id: "n_008", channel: "email", recipient: "naila.r@azima.app",       subject: "Account suspended notice",        status: "failed",    sentAt: "6 h ago" },
  { id: "n_009", channel: "email", recipient: "hannah.r@azima.app",      subject: "Weekly admin digest",             status: "delivered", sentAt: "8 h ago" },
  { id: "n_010", channel: "sms",   recipient: "+1 628 555 0144",         subject: "Appointment cancelled",           status: "delivered", sentAt: "10 h ago" },
  { id: "n_011", channel: "email", recipient: "omar.h@azima.app",        subject: "Policy update required",          status: "bounced",   sentAt: "12 h ago" },
  { id: "n_012", channel: "push",  recipient: "Joaquin Vela",            subject: "2 new requests",                  status: "delivered", sentAt: "1 d ago" },
];

// Provider-facing mock data
export type ProviderRequest = {
  id: string;
  client: string;
  service: string;
  requestedFor: string;
  status: RequestStatus;
  amount: number;
};

export const providerRequests: ProviderRequest[] = [
  { id: "r_001", client: "Amelia Park",    service: "Deep Tissue Massage", requestedFor: "Sep 04, 10:00", status: "open",        amount: 120 },
  { id: "r_002", client: "Felix Brun",     service: "Recovery Session",    requestedFor: "Sep 04, 14:30", status: "in_progress", amount: 90  },
  { id: "r_003", client: "Sara Lindqvist", service: "Sports Massage",      requestedFor: "Sep 05, 09:00", status: "open",        amount: 110 },
  { id: "r_004", client: "Yuki Tanaka",    service: "Deep Tissue Massage", requestedFor: "Sep 03, 16:00", status: "completed",   amount: 120 },
  { id: "r_005", client: "Maya Chen",      service: "Swedish Massage",     requestedFor: "Sep 02, 11:00", status: "cancelled",   amount: 95  },
  { id: "r_006", client: "Hannah Reilly",  service: "Couples Massage",     requestedFor: "Sep 06, 18:00", status: "open",        amount: 220 },
  { id: "r_007", client: "Naila Rahman",   service: "Deep Tissue Massage", requestedFor: "Sep 03, 08:30", status: "completed",   amount: 120 },
  { id: "r_008", client: "Priya Shah",     service: "Recovery Session",    requestedFor: "Sep 07, 13:00", status: "open",        amount: 90  },
];

export type ProviderService = {
  id: string;
  name: string;
  description: string;
  price: number;
  bookings: number;
  status: ServiceStatus;
};

export const providerServices: ProviderService[] = [
  { id: "s_001", name: "Deep Tissue Massage",  description: "60-min targeted work for chronic tension.",         price: 120, bookings: 42, status: "active" },
  { id: "s_002", name: "Recovery Session",     description: "45-min stretch + mobility focused session.",       price: 90,  bookings: 28, status: "active" },
  { id: "s_003", name: "Sports Massage",       description: "Pre- or post-event work for athletes.",            price: 110, bookings: 17, status: "active" },
  { id: "s_004", name: "Swedish Massage",      description: "Classic full-body relaxation massage.",            price: 95,  bookings: 31, status: "paused" },
  { id: "s_005", name: "Couples Massage",      description: "Side-by-side 60-min session for two guests.",      price: 220, bookings: 9,  status: "active" },
  { id: "s_006", name: "On-site Corporate",    description: "In-office chair massage for teams.",               price: 75,  bookings: 0,  status: "draft"  },
];

export type ProviderEarning = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: EarningStatus;
};

export const providerEarnings: ProviderEarning[] = [
  { id: "e_001", date: "Sep 02, 2025", description: "Deep Tissue Massage — Amelia Park",     amount: 120, status: "paid" },
  { id: "e_002", date: "Sep 01, 2025", description: "Recovery Session — Felix Brun",          amount: 90,  status: "pending" },
  { id: "e_003", date: "Sep 01, 2025", description: "Sports Massage — Yuki Tanaka",           amount: 110, status: "paid" },
  { id: "e_004", date: "Aug 31, 2025", description: "Swedish Massage — Maya Chen",            amount: 95,  status: "refunded" },
  { id: "e_005", date: "Aug 30, 2025", description: "Couples Massage — Hannah Reilly",        amount: 220, status: "paid" },
  { id: "e_006", date: "Aug 29, 2025", description: "Deep Tissue Massage — Naila Rahman",     amount: 120, status: "paid" },
  { id: "e_007", date: "Aug 28, 2025", description: "Recovery Session — Amelia Park",         amount: 90,  status: "paid" },
  { id: "e_008", date: "Aug 27, 2025", description: "Deep Tissue Massage — Sara Lindqvist",   amount: 120, status: "paid" },
];

export type ProviderAppointment = {
  id: string;
  date: string;        // ISO yyyy-mm-dd
  startHour: number;   // 0–23
  durationHours: number;
  client: string;
  service: string;
};

// Five mock appointments across the current week.
const _today = new Date();
function _dayOffset(daysFromMonday: number, hour: number): string {
  // Compute this week's Monday at given hour.
  const day = _today.getDay(); // 0=Sun
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const d = new Date(_today);
  d.setDate(d.getDate() + mondayOffset + daysFromMonday);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const providerAppointments: ProviderAppointment[] = [
  { id: "a_001", date: _dayOffset(0, 9),  startHour: 9,  durationHours: 1, client: "Amelia Park",    service: "Deep Tissue Massage" },
  { id: "a_002", date: _dayOffset(0, 14), startHour: 14, durationHours: 1, client: "Felix Brun",     service: "Recovery Session" },
  { id: "a_003", date: _dayOffset(1, 10), startHour: 10, durationHours: 1, client: "Yuki Tanaka",    service: "Swedish Massage" },
  { id: "a_004", date: _dayOffset(2, 16), startHour: 16, durationHours: 2, client: "Hannah Reilly",  service: "Couples Massage" },
  { id: "a_005", date: _dayOffset(4, 11), startHour: 11, durationHours: 1, client: "Sara Lindqvist", service: "Deep Tissue Massage" },
];

// KPIs (pre-computed so pages stay declarative).
export const adminOverviewKpis = {
  users:       { label: "Total users",       value: "12,481", delta: "+4.2%", trend: "up"   as const },
  providers:   { label: "Active providers",  value: "284",    delta: "+1.8%", trend: "up"   as const },
  orders:      { label: "Orders this month", value: "1,209",  delta: "-2.4%", trend: "down" as const },
  revenue:     { label: "Revenue (MTD)",     value: "$84.2k", delta: "+8.1%", trend: "up"   as const },
};

export const providerDashboardKpis = {
  openRequests:   { label: "Open requests",    value: "12",    delta: "+3",   trend: "up"   as const },
  earningsMtd:    { label: "Earnings (MTD)",  value: "$1,840", delta: "+12%", trend: "up"   as const },
  upcomingBookings: { label: "Upcoming",      value: "5",     delta: "+1",   trend: "up"   as const },
  avgRating:      { label: "Avg rating",      value: "4.8",   delta: "+0.1", trend: "up"   as const },
};

export const adminOrdersKpis = {
  total: { label: "Total orders",     value: "1,209",  delta: "-2.4%", trend: "down" as const },
  revenue: { label: "Revenue",        value: "$84.2k", delta: "+8.1%", trend: "up"   as const },
  avgValue: { label: "Avg order value", value: "$69.6", delta: "+1.2%", trend: "up"   as const },
};

export const notificationKpis = {
  delivered: { label: "Delivered", value: "8,412", delta: "+5.1%", trend: "up"   as const },
  bounced:   { label: "Bounced",   value: "112",   delta: "-0.4%", trend: "down" as const },
  queued:    { label: "Queued",    value: "44",    delta: "+12",   trend: "up"   as const },
  failed:    { label: "Failed",    value: "9",     delta: "-3",    trend: "down" as const },
};

export const requestKpis = {
  open:        { label: "Open",        value: "5",  delta: "+2",  trend: "up"   as const },
  inProgress:  { label: "In progress", value: "2",  delta: "+1",  trend: "up"   as const },
  completed:   { label: "Completed",   value: "18", delta: "+4",  trend: "up"   as const },
  cancelled:   { label: "Cancelled",   value: "3",  delta: "-1",  trend: "down" as const },
};

export const earningsKpis = {
  thisMonth: { label: "This month",  value: "$1,840", delta: "+12%", trend: "up"   as const },
  lastMonth: { label: "Last month",  value: "$2,105", delta: "+4%",  trend: "up"   as const },
  ytd:       { label: "Year to date", value: "$18,420", delta: "+22%", trend: "up"  as const },
};

// Sparkline series (7 points). Used by chart placeholders.
export const ordersSparkline = [22, 28, 25, 31, 34, 29, 36];
export const earningsSparkline = [180, 220, 260, 240, 290, 310, 285];

// Activity feed (admin overview).
export type ActivityItem = {
  id: string;
  text: string;
  time: string;
  iconKey: "user" | "order" | "provider" | "alert" | "billing";
};

export const activityFeed: ActivityItem[] = [
  { id: "ac_01", text: "New provider Marcus Klein applied",          time: "5 min ago",  iconKey: "provider" },
  { id: "ac_02", text: "Order ORD-1042 was paid",                    time: "12 min ago", iconKey: "order" },
  { id: "ac_03", text: "User Naila Rahman was suspended",            time: "1 h ago",    iconKey: "alert" },
  { id: "ac_04", text: "Provider Omar Haddad was suspended",          time: "2 h ago",    iconKey: "alert" },
  { id: "ac_05", text: "Refund issued for ORD-1038",                 time: "3 h ago",    iconKey: "billing" },
  { id: "ac_06", text: "New user Amelia Park signed up",             time: "5 h ago",    iconKey: "user" },
  { id: "ac_07", text: "Provider Aiko Nakamura updated pricing",     time: "8 h ago",    iconKey: "provider" },
  { id: "ac_08", text: "Order ORD-1037 failed at checkout",          time: "1 d ago",    iconKey: "alert" },
  { id: "ac_09", text: "12 new orders placed in the last 24 h",      time: "1 d ago",    iconKey: "order" },
  { id: "ac_10", text: "Weekly billing summary generated",           time: "2 d ago",    iconKey: "billing" },
];

// Admin Catering Platform Overview Data
export type FinancialMetric = {
  id: string;
  title: string;
  amount: string;
  subtext: string;
  iconType: "cash" | "card" | "warning" | "calendar";
  isAlert?: boolean;
};

export const adminPlatformFinances: FinancialMetric[] = [
  {
    id: "cash_collect",
    title: "Cash to collect",
    amount: "$2,228",
    subtext: "3 accepted orders · handed over on the day",
    iconType: "cash",
  },
  {
    id: "already_paid",
    title: "Already paid online",
    amount: "$1,584",
    subtext: "2 orders · card or Apple Pay",
    iconType: "card",
  },
  {
    id: "cash_owed",
    title: "Delivered, cash owed",
    amount: "$180",
    subtext: "1 order not settled yet",
    iconType: "warning",
    isAlert: true,
  },
  {
    id: "booked_month",
    title: "Booked this month",
    amount: "$522",
    subtext: "Last month $0",
    iconType: "calendar",
  },
];

export type OrderProgressStage = {
  id: string;
  label: string;
  count: number;
  color: string;
  barColor: string;
};

export const adminOrderStages: OrderProgressStage[] = [
  { id: "awaiting_reply", label: "Awaiting reply", count: 4, color: "#EAB308", barColor: "bg-[#EAB308]" },
  { id: "reconfirming", label: "Re-confirming", count: 0, color: "#C7C2BB", barColor: "bg-[#C7C2BB]" },
  { id: "awaiting_call", label: "Awaiting call", count: 1, color: "#E59880", barColor: "bg-[#E59880]" },
  { id: "contacted", label: "Contacted", count: 1, color: "#C05621", barColor: "bg-[#C05621]" },
  { id: "preparing", label: "Preparing", count: 1, color: "#5C2417", barColor: "bg-[#5C2417]" },
  { id: "on_the_way", label: "On the way", count: 1, color: "#2F7455", barColor: "bg-[#2F7455]" },
];

export type OrderInProgress = {
  id: string;
  orderCode: string;
  customerName: string;
  catererName: string;
  eventName: string;
  guestCount: number;
  amount: string;
  stageName: string;
  stageDuration: string;
  isOverdue?: boolean;
};

export const adminOrdersInProgress: OrderInProgress[] = [
  {
    id: "ord_p1",
    orderCode: "AZ-2418",
    customerName: "Omar Naimneh",
    catererName: "Socart Catering",
    eventName: "Iftar Gathering",
    guestCount: 35,
    amount: "$560",
    stageName: "Contacted",
    stageDuration: "40h in this stage",
  },
  {
    id: "ord_p2",
    orderCode: "AZ-2377",
    customerName: "Omar Naimneh",
    catererName: "Socart Catering",
    eventName: "Weekend Dinner",
    guestCount: 60,
    amount: "$1,470",
    stageName: "Awaiting call",
    stageDuration: "7h in this stage",
  },
  {
    id: "ord_p3",
    orderCode: "AZ-2444",
    customerName: "Layla Karam",
    catererName: "Yummy Catering",
    eventName: "Corporate Breakfast",
    guestCount: 45,
    amount: "$315",
    stageName: "Awaiting reply",
    stageDuration: "6h in this stage",
    isOverdue: true,
  },
  {
    id: "ord_p4",
    orderCode: "AZ-2402",
    customerName: "Omar Naimneh",
    catererName: "Sweet House",
    eventName: "Team Lunch",
    guestCount: 18,
    amount: "$144",
    stageName: "Preparing",
    stageDuration: "3h in this stage",
  },
  {
    id: "ord_p5",
    orderCode: "AZ-2455",
    customerName: "Layla Karam",
    catererName: "Yummy Catering",
    eventName: "Sunday Family Lunch",
    guestCount: 22,
    amount: "$242",
    stageName: "Awaiting reply",
    stageDuration: "2h in this stage",
  },
];

export type UpcomingEvent = {
  id: string;
  date: string;
  time: string;
  eventName: string;
  customerName: string;
  details: string;
  amount: string;
  statusBadge: {
    label: string;
    variant: "covered" | "awaiting" | "nofood";
  };
  imageSrc: string;
};

export const adminUpcomingSevenDays: UpcomingEvent[] = [
  {
    id: "ev_1",
    date: "30 Aug",
    time: "1:00 PM",
    eventName: "Team Lunch",
    customerName: "Omar Naimneh",
    details: "lunch · 18guests · 2 caterers",
    amount: "$342",
    statusBadge: {
      label: "Covered",
      variant: "covered",
    },
    imageSrc: "/images/overview/team-lunch.jpg",
  },
  {
    id: "ev_2",
    date: "1 Sep",
    time: "9:00 AM",
    eventName: "Corporate Breakfast",
    customerName: "Layla Karam",
    details: "breakfast · 45guests · Yummy Catering",
    amount: "$315",
    statusBadge: {
      label: "Awaiting caterer",
      variant: "awaiting",
    },
    imageSrc: "/images/overview/corporate-breakfast.jpg",
  },
  {
    id: "ev_3",
    date: "3 Sep",
    time: "8:30 PM",
    eventName: "Layla's Birthday",
    customerName: "Layla Karam",
    details: "dinner · 24guests · No caterer yet",
    amount: "—",
    statusBadge: {
      label: "No food ordered",
      variant: "nofood",
    },
    imageSrc: "/images/overview/birthday-dinner.jpg",
  },
];

export type UserOccasionItem = {
  id: string;
  title: string;
  date: string;
  mealType: string;
  guests: number;
  amount: string;
  status: "Rejected" | "Contact confirmed" | "Preparing" | "Covered";
  imageSrc: string;
};

export type AdminHostUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  occasions: number;
  booked: string;
  status: "active" | "suspended";
  avatarImage?: string;
  avatarInitials: string;
  hostSince: string;
  address: string;
  ordersCount: number;
  cancelledOrders: number;
  cancellationRate: string;
  liveOccasions: number;
  occasionsList: UserOccasionItem[];
};

export const adminHostUsers: AdminHostUser[] = [
  {
    id: "omar-naimneh",
    name: "Omar Naimneh",
    email: "omar@azima.app",
    phone: "+961 3 112 440",
    occasions: 4,
    booked: "$4,412",
    status: "active",
    avatarInitials: "ON",
    hostSince: "31 Jul 2026",
    address: "Mar Mikhael, Beirut",
    ordersCount: 8,
    cancelledOrders: 0,
    cancellationRate: "0%",
    liveOccasions: 6,
    occasionsList: [
      {
        id: "occ_1",
        title: "Weekend Dinner",
        date: "20 Sep 2026",
        mealType: "Dinner",
        guests: 60,
        amount: "$840",
        status: "Rejected",
        imageSrc: "/images/overview/birthday-dinner.jpg",
      },
      {
        id: "occ_2",
        title: "Iftar Gathering",
        date: "8 Sep 2026",
        mealType: "Iftar",
        guests: 35,
        amount: "$560",
        status: "Contact confirmed",
        imageSrc: "/images/overview/birthday-dinner.jpg",
      },
      {
        id: "occ_3",
        title: "Team Lunch",
        date: "31 Aug 2026",
        mealType: "Lunch",
        guests: 18,
        amount: "$144",
        status: "Preparing",
        imageSrc: "/images/overview/team-lunch.jpg",
      },
    ],
  },
  {
    id: "layla-karam",
    name: "Layla Karam",
    email: "layla.karam@mail.com",
    phone: "+961 3 887 902",
    occasions: 3,
    booked: "$557",
    status: "active",
    avatarImage: "/images/avatars/layla.jpg",
    avatarInitials: "LK",
    hostSince: "12 May 2026",
    address: "Achrafieh, Beirut",
    ordersCount: 5,
    cancelledOrders: 0,
    cancellationRate: "0%",
    liveOccasions: 2,
    occasionsList: [
      {
        id: "occ_l1",
        title: "Corporate Breakfast",
        date: "1 Sep 2026",
        mealType: "Breakfast",
        guests: 45,
        amount: "$315",
        status: "Contact confirmed",
        imageSrc: "/images/overview/corporate-breakfast.jpg",
      },
      {
        id: "occ_l2",
        title: "Sunday Family Lunch",
        date: "24 Aug 2026",
        mealType: "Lunch",
        guests: 22,
        amount: "$242",
        status: "Covered",
        imageSrc: "/images/overview/team-lunch.jpg",
      },
    ],
  },
  {
    id: "rami-haddad",
    name: "Rami Haddad",
    email: "rami.h@mail.com",
    phone: "+961 3 220 114",
    occasions: 0,
    booked: "—",
    status: "suspended",
    avatarImage: "/images/avatars/rami.jpg",
    avatarInitials: "RH",
    hostSince: "18 Aug 2025",
    address: "Hamra, Beirut",
    ordersCount: 1,
    cancelledOrders: 1,
    cancellationRate: "100%",
    liveOccasions: 0,
    occasionsList: [],
  },
  {
    id: "nour-saab",
    name: "Nour Saab",
    email: "nour.saab@mail.com",
    phone: "+961 76 119 220",
    occasions: 0,
    booked: "—",
    status: "active",
    avatarInitials: "NS",
    hostSince: "05 Jun 2026",
    address: "Badaro, Beirut",
    ordersCount: 0,
    cancelledOrders: 0,
    cancellationRate: "0%",
    liveOccasions: 0,
    occasionsList: [],
  },
  {
    id: "dana-khoury",
    name: "Dana Khoury",
    email: "dana.khoury@mail.com",
    phone: "+961 3 909 112",
    occasions: 0,
    booked: "—",
    status: "active",
    avatarImage: "/images/avatars/dana.jpg",
    avatarInitials: "DK",
    hostSince: "19 Jul 2026",
    address: "Dbayeh, Mount Lebanon",
    ordersCount: 0,
    cancelledOrders: 0,
    cancellationRate: "0%",
    liveOccasions: 0,
    occasionsList: [],
  },
  {
    id: "fadi-nassar",
    name: "Fadi Nassar",
    email: "fadi.nassar@mail.com",
    phone: "+961 71 662 004",
    occasions: 0,
    booked: "—",
    status: "active",
    avatarImage: "/images/avatars/fadi.jpg",
    avatarInitials: "FN",
    hostSince: "28 Jun 2026",
    address: "Verdun, Beirut",
    ordersCount: 0,
    cancelledOrders: 0,
    cancellationRate: "0%",
    liveOccasions: 0,
    occasionsList: [],
  },
  {
    id: "maya-fares",
    name: "Maya Fares",
    email: "maya.fares@mail.com",
    phone: "+961 70 331 208",
    occasions: 0,
    booked: "—",
    status: "active",
    avatarImage: "/images/avatars/maya.jpg",
    avatarInitials: "MF",
    hostSince: "02 Aug 2026",
    address: "Mansourieh, Mount Lebanon",
    ordersCount: 0,
    cancelledOrders: 0,
    cancellationRate: "0%",
    liveOccasions: 0,
    occasionsList: [],
  },
  {
    id: "karim-abou-zeid",
    name: "Karim Abou Zeid",
    email: "karim.az@mail.com",
    phone: "+961 3 774 615",
    occasions: 0,
    booked: "—",
    status: "active",
    avatarInitials: "KA",
    hostSince: "14 Jul 2026",
    address: "Jounieh, Mount Lebanon",
    ordersCount: 0,
    cancelledOrders: 0,
    cancellationRate: "0%",
    liveOccasions: 0,
    occasionsList: [],
  },
  {
    id: "hiba-mansour",
    name: "Hiba Mansour",
    email: "hiba.mansour@mail.com",
    phone: "+961 76 402 883",
    occasions: 0,
    booked: "—",
    status: "suspended",
    avatarInitials: "HM",
    hostSince: "22 Jun 2026",
    address: "Tripoli, North Lebanon",
    ordersCount: 0,
    cancelledOrders: 0,
    cancellationRate: "0%",
    liveOccasions: 0,
    occasionsList: [],
  },
];

export type PendingApprovalProvider = {
  id: string;
  name: string;
  category: string;
  city: string;
  phone: string;
  menuItemsToReview: number;
  imageSrc: string;
};

export const adminPendingApprovals: PendingApprovalProvider[] = [
  {
    id: "dessert-corner",
    name: "Dessert Corner",
    category: "Sweets",
    city: "Saida",
    phone: "+961 7 118 442",
    menuItemsToReview: 4,
    imageSrc: "/images/providers/dessert-corner.jpg",
  },
];

export type CatererRequestStatus = {
  label: string;
  subtext: string;
  color: "green" | "red";
};

export type CatererMenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageSrc: string;
};

export type CatererMenuCategory = {
  title: string;
  items: CatererMenuItem[];
};

export type CatererOrder = {
  id: string;
  code: string;
  eventName: string;
  date: string;
  guests: number;
  amount: string;
  status: "Awaiting response" | "On the way" | "Delivered";
  imageSrc: string;
};

export type CatererAccount = {
  id: string;
  name: string;
  rating: number;
  reviewsCount?: number;
  category: string;
  isSuspended?: boolean;
  capacity: number;
  requestStatus: CatererRequestStatus;
  liveOrders: number;
  deliveredOrders: number;
  imageSrc: string;
  ownerName?: string;
  description?: string;
  phone?: string;
  email?: string;
  city?: string;
  acceptanceRate?: string;
  acceptanceDecisions?: number;
  menuItemsCount?: number;
  priceRange?: string;
  tradingTerms?: {
    availabilityMode: string;
    availabilityNote: string;
    bookingLeadTime: string;
    bookingLeadNote: string;
    bookingsAccepted: string;
    bookingsNote: string;
    deliversTo: string;
    deliveryFee: string;
    hostCollection: string;
    blackoutDates: string;
  };
  menuCategories?: CatererMenuCategory[];
  ordersList?: CatererOrder[];
};

export const adminCatererProviders: CatererAccount[] = [
  {
    id: "socart-catering",
    name: "Socart Catering",
    rating: 4.8,
    category: "Catering",
    capacity: 20,
    requestStatus: {
      label: "Accepting requests",
      subtext: "Books any date",
      color: "green",
    },
    liveOrders: 2,
    deliveredOrders: 1,
    imageSrc: "/images/providers/socart.jpg",
  },
  {
    id: "yummy-catering",
    name: "Yummy Catering",
    rating: 4.6,
    reviewsCount: 98,
    category: "Catering",
    capacity: 10,
    ownerName: "Hadi Nassar",
    description: "Live grill stations and hot mains prepared on site, with a uniformed serving team.",
    phone: "+961 3 991 204",
    email: "kitchen@yummy.example",
    city: "Beirut",
    requestStatus: {
      label: "Auto-accepting",
      subtext: "Books any date",
      color: "green",
    },
    liveOrders: 5,
    deliveredOrders: 0,
    acceptanceRate: "100%",
    acceptanceDecisions: 1,
    menuItemsCount: 8,
    priceRange: "$2.50–$24 per guest",
    imageSrc: "/images/providers/yummy.jpg",
    tradingTerms: {
      availabilityMode: "Auto-accepting",
      availabilityNote: "They reply to each request themselves.",
      bookingLeadTime: "Books any date",
      bookingLeadNote: "Hosts can book them for any date, including tomorrow.",
      bookingsAccepted: "10–300 guests",
      bookingsNote: "Hosts outside this range cannot select them.",
      deliversTo: "Hamra · Verdun · Ras Beirut · Manara",
      deliveryFee: "$15",
      hostCollection: "Hamra Street 118, Beirut",
      blackoutDates: "5 Sep 2026 - 12 Sep 2026",
    },
    menuCategories: [
      {
        title: "Mezze & starters",
        items: [
          {
            id: "m_1",
            name: "Hummus & moutabal spread",
            description: "Both dips with olive oil, sumac and fresh bread",
            price: "$4.50",
            imageSrc: "/images/providers/hummus.jpg",
          },
        ],
      },
      {
        title: "Mains",
        items: [
          {
            id: "m_2",
            name: "Mixed grill station",
            description: "Taouk, kafta and lamb grilled to order in front of guests",
            price: "$18",
            imageSrc: "/images/providers/mixed-grill.jpg",
          },
          {
            id: "m_3",
            name: "Shish taouk platter",
            description: "Marinated chicken skewers with garlic sauce and pita",
            price: "$12",
            imageSrc: "/images/providers/shish-taouk.jpg",
          },
          {
            id: "m_4",
            name: "Lunch set menu",
            description: "One grill, one side and a salad, plated per guest",
            price: "$11",
            imageSrc: "/images/providers/lunch-set.jpg",
          },
          {
            id: "m_5",
            name: "Kafta & arayes station",
            description: "Minced lamb kafta and crisp arayes bread, made live",
            price: "$13",
            imageSrc: "/images/providers/kafta.jpg",
          },
          {
            id: "m_6",
            name: "Charcoal lamb chops",
            description: "Trimmed chops over charcoal, finished with sumac",
            price: "$24",
            imageSrc: "/images/providers/lamb-chops.jpg",
          },
        ],
      },
      {
        title: "Sides & salads",
        items: [
          {
            id: "m_7",
            name: "Grilled vegetable spread",
            description: "Charred aubergine, peppers and courgette in olive oil",
            price: "$6",
            imageSrc: "/images/providers/vegetables.jpg",
          },
          {
            id: "m_8",
            name: "Saj bread & pickles",
            description: "Thin saj baked on site, with pickles and olives",
            price: "$2.50",
            imageSrc: "/images/providers/saj-bread.jpg",
          },
        ],
      },
    ],
    ordersList: [
      {
        id: "ord_y1",
        code: "AZ-2431",
        eventName: "Iftar Gathering",
        date: "8 Sep 2026",
        guests: 35,
        amount: "$420",
        status: "Awaiting response",
        imageSrc: "/images/overview/birthday-dinner.jpg",
      },
      {
        id: "ord_y2",
        code: "AZ-2356",
        eventName: "Team Lunch",
        date: "31 Aug 2026",
        guests: 18,
        amount: "$198",
        status: "On the way",
        imageSrc: "/images/overview/team-lunch.jpg",
      },
      {
        id: "ord_y3",
        code: "AZ-2444",
        eventName: "Corporate Breakfast",
        date: "2 Sep 2026",
        guests: 45,
        amount: "$315",
        status: "Awaiting response",
        imageSrc: "/images/overview/corporate-breakfast.jpg",
      },
      {
        id: "ord_y4",
        code: "AZ-2451",
        eventName: "Weekend Dinner",
        date: "20 Sep 2026",
        guests: 60,
        amount: "$1,440",
        status: "Awaiting response",
        imageSrc: "/images/overview/birthday-dinner.jpg",
      },
      {
        id: "ord_y5",
        code: "AZ-2455",
        eventName: "Sunday Family Lunch",
        date: "11 Sep 2026",
        guests: 22,
        amount: "$242",
        status: "Awaiting response",
        imageSrc: "/images/overview/team-lunch.jpg",
      },
    ],
  },
  {
    id: "fresh-juice-bar",
    name: "Fresh Juice Bar",
    rating: 4.5,
    category: "Drinks",
    isSuspended: true,
    capacity: 10,
    requestStatus: {
      label: "Stopped by azima",
      subtext: "Hidden from hosts",
      color: "red",
    },
    liveOrders: 0,
    deliveredOrders: 0,
    imageSrc: "/images/providers/juice-bar.jpg",
  },
  {
    id: "sweet-house",
    name: "Sweet House",
    rating: 4.7,
    category: "Sweets",
    capacity: 15,
    requestStatus: {
      label: "Accepting requests",
      subtext: "Needs 48 hours notice",
      color: "green",
    },
    liveOrders: 1,
    deliveredOrders: 0,
    imageSrc: "/images/providers/sweet-house.jpg",
  },
  {
    id: "golden-buffet",
    name: "Golden Buffet",
    rating: 4.4,
    category: "Catering",
    capacity: 100,
    requestStatus: {
      label: "Not available",
      subtext: "Needs 48 hours notice",
      color: "red",
    },
    liveOrders: 0,
    deliveredOrders: 0,
    imageSrc: "/images/providers/golden-buffet.jpg",
  },
];
