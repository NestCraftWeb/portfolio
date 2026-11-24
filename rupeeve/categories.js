// PaisaKhata — Expanded Categories (17 total, India-specific)
import {
  Fuel, ShoppingCart, UtensilsCrossed, Users, Film, Zap, HeartPulse,
  Car, ShoppingBag, MoreHorizontal, PiggyBank, Wallet, Home as HomeIcon,
  Scissors, Dumbbell, GraduationCap, Plane,
} from 'lucide-react';

export const CATEGORIES = [
  {
    id: 'fuel', label: 'Fuel', icon: Fuel, color: '#E07B39',
    keywords: [
      'petrol', 'diesel', 'fuel', 'pump', 'hp ', 'iocl', 'indian oil',
      'bharat petroleum', 'hpcl', 'bpcl', 'reliance petro', 'essar oil',
      'nayara', 'shell', 'cng', 'png', 'gas station', 'filling station',
      'hpcl pump', 'iocl pump', 'fuel station', 'autofuel',
    ],
  },
  {
    id: 'groceries', label: 'Groceries', icon: ShoppingCart, color: '#4D7C0F',
    keywords: [
      'grocery', 'groceries', 'kirana', 'bigbasket', 'dmart', 'd-mart',
      'grofers', 'blinkit', 'zepto', 'reliance fresh', 'more supermarket',
      'spencer', 'vegetable', 'provision', 'supermarket', 'sabzi', 'mandi',
      'star bazaar', 'nature basket', 'easyday', 'hypermarket', 'heritage fresh',
      'jiomart', 'milk', 'dairy', 'ration', 'wholesale', 'fresh2home', 'licious',
      'meat', 'fish', 'egg', 'bread', 'atta', 'rice', 'dal', 'oil', 'sugar',
    ],
  },
  {
    id: 'food', label: 'Food & Dining', icon: UtensilsCrossed, color: '#C2410C',
    keywords: [
      'zomato', 'swiggy', 'restaurant', 'cafe', 'domino', 'mcdonald', 'kfc',
      'starbucks', 'dhaba', 'pizza', 'biryani', 'bakery', 'food',
      'eatery', 'dine', 'burger', 'sandwich', 'haldiram', 'bikanervala',
      'subway', 'dunkin', 'baskin', 'ice cream', 'chai', 'coffee',
      'dining', 'canteen', 'mess', 'tiffin', 'lunch', 'dinner', 'breakfast',
      'ccd', 'cafe coffee day', 'barista', 'theobroma', 'thickshake', 'faasos',
      'box8', 'freshmenu', 'behrouz', 'biryani by kilo', 'wow momo', 'chaayos',
    ],
  },
  {
    id: 'lent', label: 'Lending', icon: Users, color: '#7C3AED', keywords: [],
  },
  {
    id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#BE185D',
    keywords: [
      'amazon', 'flipkart', 'myntra', 'ajio', 'mall', 'nykaa', 'meesho',
      'snapdeal', 'tatacliq', 'reliance digital', 'croma', 'vijay sales',
      'lifestyle', 'shoppers stop', 'pantaloons', 'westside', 'zara', 'h&m',
      'fashion', 'clothes', 'garment', 'boutique', 'jewel', 'electronics',
      'mobile', 'laptop', 'gadget', 'cosmetic', 'beauty', 'makeup',
      'lenskart', 'pepperfry', 'urban ladder', 'ikea', 'decathlon',
      'firstcry', 'hopscotch', 'bewakoof', 'the man company', 'mamaearth',
    ],
  },
  {
    id: 'bills', label: 'Bills & Recharge', icon: Zap, color: '#1D4ED8',
    keywords: [
      'electricity', 'recharge', 'broadband', 'wifi', 'dth', 'gas bill',
      'water bill', 'jio', 'airtel', 'bsnl', 'vi ', 'vodafone', 'idea',
      'postpaid', 'prepaid', 'tatasky', 'dish tv', 'sun direct', 'd2h',
      'hathway', 'act fibernet', 'spectranet', 'you broadband', 'asianet',
      'mseb', 'bescom', 'tneb', 'uppcl', 'bses', 'tpddl', 'adani electricity',
      'municipal', 'property tax', 'maintenance', 'society', 'insurance premium',
      'mahanagar gas', 'indraprastha gas', 'gujarat gas', 'mngl',
      'telephone', 'internet', 'piped gas', 'cylinder', 'lpg',
    ],
  },
  {
    id: 'entertainment', label: 'Entertainment', icon: Film, color: '#B45309',
    keywords: [
      'movie', 'netflix', 'hotstar', 'bookmyshow', 'pvr', 'inox', 'spotify',
      'prime video', 'cinema', 'youtube', 'zee5', 'sonyliv', 'voot', 'jiocinema',
      'ott', 'subscription', 'gaming', 'steam', 'playstore', 'appstore',
      'concert', 'event', 'theme park', 'amusement', 'bowling', 'game',
      'apple music', 'gaana', 'jiosaavn', 'amazon music', 'hungama',
      'disney', 'mxplayer', 'alt balaji', 'eros now', 'lionsgate',
    ],
  },
  {
    id: 'health', label: 'Health & Medical', icon: HeartPulse, color: '#0F766E',
    keywords: [
      'pharmacy', 'medical', 'hospital', 'doctor', 'chemist', 'apollo',
      'medplus', 'clinic', 'medicine', 'health', 'diagnostic', 'lab',
      'pathology', 'scan', 'xray', 'mri', 'physiotherapy', 'dentist',
      'optician', 'spectacles', 'lens', 'wellness', 'ayurvedic', 'homeopathy',
      'tata 1mg', 'netmeds', 'pharmeasy', 'practo', 'thyrocare', 'metropolis',
      'lal pathlabs', 'fortis', 'max hospital', 'manipal', 'columbia asia',
      'aster', 'medanta', 'aiims', 'vaccination', 'test',
    ],
  },
  {
    id: 'transport', label: 'Transport', icon: Car, color: '#4338CA',
    keywords: [
      'uber', 'ola', 'metro', 'rapido', 'irctc', 'parking', 'toll', 'fastag',
      'bus', 'auto', 'taxi', 'rickshaw', 'bmtc', 'best bus', 'dtc', 'mmts',
      'local train', 'railway', 'makemytrip', 'redbus', 'abhibus', 'goibibo',
      'ola electric', 'bounce', 'yulu', 'vogo', 'drivezy', 'airport',
      'cab', 'bike taxi', 'shuttle', 'volvo', 'sleeper', 'ksrtc', 'tsrtc',
    ],
  },
  {
    id: 'education', label: 'Education', icon: GraduationCap, color: '#0369A1',
    keywords: [
      'school', 'college', 'university', 'tuition', 'coaching', 'course',
      'udemy', 'coursera', 'byju', 'unacademy', 'vedantu', 'skill', 'training',
      'book', 'stationery', 'fees', 'admission', 'exam', 'test', 'library',
      'toppr', 'khan academy', 'whitehat jr', 'coding', 'language class',
      'iit', 'iim', 'neet', 'jee', 'upsc', 'gate', 'cat coaching',
    ],
  },
  {
    id: 'personal', label: 'Personal Care', icon: Scissors, color: '#6D28D9',
    keywords: [
      'salon', 'parlour', 'haircut', 'barber', 'spa', 'massage', 'grooming',
      'laundry', 'dry clean', 'ironing', 'tailor', 'cobbler', 'repair',
      'ustraa', 'bombay shaving', 'sugar cosmetics', 'lakme', 'wella',
      'urban clap', 'urbanclap', 'urbanco', 'housejoy',
    ],
  },
  {
    id: 'fitness', label: 'Fitness & Sports', icon: Dumbbell, color: '#15803D',
    keywords: [
      'gym', 'fitness', 'yoga', 'cult fit', 'cult.fit', 'gold gym', 'anytime fitness',
      'swimming', 'sports', 'badminton', 'cricket', 'football', 'crossfit',
      'healthify', 'cure.fit', 'snap fitness', 'talwalkars', 'fitpass',
      'protein', 'supplement', 'whey', 'creatine', 'healthkart',
    ],
  },
  {
    id: 'travel', label: 'Travel & Hotels', icon: Plane, color: '#B91C1C',
    keywords: [
      'oyo', 'treebo', 'fabhotel', 'zostel', 'airbnb', 'homestay',
      'resort', 'lodge', 'accommodation', 'trip', 'vacation', 'tour',
      'cleartrip', 'yatra', 'ease my trip', 'thomas cook', 'cox and kings',
      'flight', 'airline', 'indigo', 'airindia', 'spicejet', 'vistara',
      'akasa', 'holiday', 'travel', 'travelport', 'booking.com',
    ],
  },
  {
    id: 'savings', label: 'Savings & Invest', icon: PiggyBank, color: '#0D9488',
    keywords: [
      'mutual fund', 'sip', 'zerodha', 'groww', 'upstox', 'mf', 'fd',
      'fixed deposit', 'ppf', 'nps', 'lic', 'investment', 'demat', 'stock',
      'share', 'nifty', 'sensex', 'gold', 'rd ', 'recurring deposit',
      'smallcase', 'scripbox', 'coin', 'paytm money', 'kuvera', 'etmoney',
    ],
  },
  {
    id: 'emi', label: 'EMI & Loans', icon: Wallet, color: '#92400E',
    keywords: [
      'emi', 'loan', 'credit card', 'repayment', 'bajaj finance', 'hdfc loan',
      'home loan', 'car loan', 'personal loan', 'finance', 'bnpl', 'lazypay',
      'simpl', 'slice', 'fibe', 'kreditbee', 'moneyview', 'fairkash',
      'cashkaro', 'early salary', 'navi', 'stashfin', 'indifi',
    ],
  },
  {
    id: 'rent', label: 'Rent & Housing', icon: HomeIcon, color: '#1E40AF',
    keywords: [
      'rent', 'pg ', 'paying guest', 'hostel', 'flat', 'apartment', 'housing',
      'landlord', 'owner', 'house', 'room rent', 'deposit', 'lease',
      'nobroker', 'magicbricks', '99acres', 'nestaway', 'stanza living',
    ],
  },
  {
    id: 'other', label: 'Other', icon: MoreHorizontal, color: '#6B7280', keywords: [],
  },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
