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
