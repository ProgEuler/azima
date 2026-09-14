export interface ProviderOrderItem {
	id: string;
	name: string;
	rate: string;
	price: string;
	imageSrc: string;
}

export interface ProviderRequest {
	id: string;
	code: string;
	title: string;
	askedTime: string;
	dueTime: string;
	mealTag: string;
	isNew?: boolean;
	status: "Awaiting response" | "Accepted" | "Rejected";
	coverImage: string;
	dateTime: string;
	timeSubtext: string;
	guests: string;
	delivery: string;
	deliveryType: "venue" | "pickup";
	total: string;
	items: ProviderOrderItem[];
	hostNote?: string | null;
	timelineGroup: "This week" | "This month";
}

export const INITIAL_PROVIDER_REQUESTS: ProviderRequest[] = [
	{
		id: "req_1",
		code: "AZ-2444",
		title: "Corporate Breakfast",
		askedTime: "asked 6h ago",
		dueTime: "In 3 days",
		mealTag: "BREAKFAST",
		isNew: false,
		status: "Awaiting response",
		coverImage: "/images/overview/corporate-breakfast.jpg",
		dateTime: "1 Sep 2026 · 9:00 AM",
		timeSubtext: "Morning",
		guests: "45 to cook for",
		delivery: "Beirut Digital District",
		deliveryType: "venue",
		total: "$315 in cash",
		timelineGroup: "This week",
		hostNote: "Two of the team are vegetarian, and please keep nuts off everything.",
		items: [
			{
				id: "item_1",
				name: "Saj bread & pickles",
				rate: "$2.50 per guest × 45 guests",
				price: "$112.50",
				imageSrc: "/images/providers/saj-bread.jpg",
			},
			{
				id: "item_2",
				name: "Hummus & moutabal spread",
				rate: "$4.50 per guest × 45 guests",
				price: "$202.50",
				imageSrc: "/images/providers/hummus.jpg",
			},
		],
	},
	{
		id: "req_2",
		code: "AZ-2431",
		title: "Iftar Gathering",
		askedTime: "asked 35m ago",
		dueTime: "In 9 days",
		mealTag: "IFTAR",
		isNew: true,
		status: "Awaiting response",
		coverImage: "/images/overview/birthday-dinner.jpg",
		dateTime: "7 Sep 2026 · 6:30 PM",
		timeSubtext: "Evening",
		guests: "35 to cook for",
		delivery: "Green Garden, Beirut",
		deliveryType: "venue",
		total: "$420 in cash",
		timelineGroup: "This month",
		items: [
			{
				id: "item_3",
				name: "Shish taouk platter",
				rate: "$12 per guest × 35 guests",
				price: "$420",
				imageSrc: "/images/providers/shish-taouk.jpg",
			},
		],
	},
	{
		id: "req_3",
		code: "AZ-2455",
		title: "Sunday Family Lunch",
		askedTime: "asked 2h ago",
		dueTime: "In 12 days",
		mealTag: "LUNCH",
		isNew: false,
		status: "Awaiting response",
		coverImage: "/images/overview/team-lunch.jpg",
		dateTime: "10 Sep 2026 · 1:30 PM",
		timeSubtext: "Lunch",
		guests: "22 to cook for",
		delivery: "Host collects",
		deliveryType: "pickup",
		total: "$242 in cash",
		timelineGroup: "This month",
		items: [
			{
				id: "item_4",
				name: "Lunch set menu",
				rate: "$11 per guest × 22 guests",
				price: "$242",
				imageSrc: "/images/providers/lunch-set.jpg",
			},
		],
	},
	{
		id: "req_4",
		code: "AZ-2451",
		title: "Weekend Dinner",
		askedTime: "asked 12m ago",
		dueTime: "In 21 days",
		mealTag: "DINNER",
		isNew: true,
		status: "Awaiting response",
		coverImage: "/images/overview/birthday-dinner.jpg",
		dateTime: "19 Sep 2026 · 8:00 PM",
		timeSubtext: "Evening",
		guests: "60 to cook for",
		delivery: "Broumana Terrace",
		deliveryType: "venue",
		total: "$1,440 paid online",
		timelineGroup: "This month",
		items: [
			{
				id: "item_5",
				name: "Mixed grill station",
				rate: "$18 per guest × 60 guests",
				price: "$1,080",
				imageSrc: "/images/providers/mixed-grill.jpg",
			},
			{
				id: "item_6",
				name: "Grilled vegetable spread",
				rate: "$6 per guest × 60 guests",
				price: "$360",
				imageSrc: "/images/providers/vegetables.jpg",
			},
		],
	},
];

export interface ProviderActiveOrder {
	id: string;
	code: string;
	title: string;
	meta: string;
	status: "On the way" | "Delivered";
}

export const INITIAL_ACTIVE_ORDERS: ProviderActiveOrder[] = [
	{
		id: "act_1",
		code: "AZ-2356",
		title: "Team Lunch",
		meta: "30 Aug 2026 · 1:00 PM · 18 guests · $198",
		status: "On the way",
	},
];

export type EarningsJobMethod = "Cash collected" | "Paid online";

export interface EarningsJob {
	code: string;
	title: string;
	date: string;
	guests: string;
	amount: string;
	method: EarningsJobMethod;
}

export interface MonthEarnings {
	id: string;
	label: string;
	monthLabel: string;
	total: string;
	jobsDelivered: number;
	cashAmount: string;
	onlineAmount: string;
	jobs: EarningsJob[];
}

export const PROVIDER_EARNINGS: MonthEarnings[] = [
	{
		id: "aug-26",
		label: "Aug 26",
		monthLabel: "August 2026",
		total: "$1,638",
		jobsDelivered: 2,
		cashAmount: "$198",
		onlineAmount: "$1,440",
		jobs: [
			{
				code: "AZ-2451",
				title: "Weekend Dinner",
				date: "29 Aug",
				guests: "60 guests",
				amount: "$1,440",
				method: "Paid online",
			},
			{
				code: "AZ-2356",
				title: "Team Lunch",
				date: "29 Aug",
				guests: "18 guests",
				amount: "$198",
				method: "Cash collected",
			},
		],
	},
	{
		id: "jul-26",
		label: "Jul 26",
		monthLabel: "July 2026",
		total: "$2,140",
		jobsDelivered: 4,
		cashAmount: "$640",
		onlineAmount: "$1,500",
		jobs: [],
	},
	{
		id: "jun-26",
		label: "Jun 26",
		monthLabel: "June 2026",
		total: "$1,890",
		jobsDelivered: 3,
		cashAmount: "$450",
		onlineAmount: "$1,440",
		jobs: [],
	},
	{
		id: "may-26",
		label: "May 26",
		monthLabel: "May 2026",
		total: "$2,520",
		jobsDelivered: 5,
		cashAmount: "$720",
		onlineAmount: "$1,800",
		jobs: [],
	},
	{
		id: "apr-26",
		label: "Apr 26",
		monthLabel: "April 2026",
		total: "$1,275",
		jobsDelivered: 2,
		cashAmount: "$275",
		onlineAmount: "$1,000",
		jobs: [],
	},
	{
		id: "mar-26",
		label: "Mar 26",
		monthLabel: "March 2026",
		total: "$980",
		jobsDelivered: 2,
		cashAmount: "$380",
		onlineAmount: "$600",
		jobs: [],
	},
];

export const MENU_COURSES = [
	"Mezze & starters",
	"Mains",
	"Sides",
	"Desserts",
	"Drinks",
] as const;

export type MenuCourse = (typeof MENU_COURSES)[number];

export interface MenuItem {
	id: string;
	course: MenuCourse;
	title: string;
	description: string;
	pricePerGuest: number;
	imageSrc?: string;
}

export const INITIAL_MENU_ITEMS: MenuItem[] = [
	{
		id: "hummus",
		course: "Mezze & starters",
		title: "Hummus & moutabal spread",
		description: "Both dips with olive oil, sumac and fresh bread",
		pricePerGuest: 4.5,
		imageSrc: "/images/providers/hummus.jpg",
	},
	{
		id: "mixed-grill",
		course: "Mains",
		title: "Mixed grill station",
		description: "Taouk, kafta and lamb grilled to order in front of guests",
		pricePerGuest: 18,
		imageSrc: "/images/providers/mixed-grill.jpg",
	},
	{
		id: "shish-taouk",
		course: "Mains",
		title: "Shish taouk platter",
		description: "Marinated chicken skewers with garlic sauce and pita",
		pricePerGuest: 12,
		imageSrc: "/images/providers/shish-taouk.jpg",
	},
	{
		id: "lunch-set",
		course: "Mains",
		title: "Lunch set menu",
		description: "One grill, one side and a salad, plated per guest",
		pricePerGuest: 11,
		imageSrc: "/images/providers/lunch-set.jpg",
	},
	{
		id: "saj-bread",
		course: "Mezze & starters",
		title: "Saj bread & pickles",
		description: "Fresh saj bread served with olives, labneh and pickles",
		pricePerGuest: 2.5,
		imageSrc: "/images/providers/saj-bread.jpg",
	},
	{
		id: "vegetables",
		course: "Sides",
		title: "Grilled vegetable spread",
		description: "Charred peppers, zucchini and eggplant with tahini",
		pricePerGuest: 6,
		imageSrc: "/images/providers/vegetables.jpg",
	},
	{
		id: "dessert-corner",
		course: "Desserts",
		title: "Dessert corner",
		description: "Kunafa, maamoul and seasonal fresh fruit",
		pricePerGuest: 7,
		imageSrc: "/images/providers/dessert-corner.jpg",
	},
	{
		id: "juice-bar",
		course: "Drinks",
		title: "Fresh juice bar",
		description: "Orange, lemon-mint and seasonal fruit juices",
		pricePerGuest: 4,
		imageSrc: "/images/providers/juice-bar.jpg",
	},
];
