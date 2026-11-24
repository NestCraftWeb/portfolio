// Rupeeve — Categories Definition (17 Indian Categories + Keywords & MCC Mapping)
import {
  Fuel, ShoppingCart, UtensilsCrossed, Users, Film, Zap, HeartPulse,
  Car, ShoppingBag, MoreHorizontal, PiggyBank, Wallet, Home as HomeIcon,
  Scissors, Dumbbell, GraduationCap, Plane
} from 'lucide-react';

export const CATEGORIES = [
  {
    id: 'food',
    label: 'Food & Dining',
    icon: UtensilsCrossed,
    color: '#FF6B4A',
    mcc: ['5812', '5814', '5811'],
    keywords: [
      'zomato', 'swiggy', 'restaurant', 'cafe', 'domino', 'mcdonald', 'kfc',
      'starbucks', 'dhaba', 'pizza', 'biryani', 'bakery', 'food', 'eatery',
      'dine', 'burger', 'sandwich', 'haldiram', 'bikanervala', 'subway',
      'dunkin', 'baskin', 'ice cream', 'chai', 'coffee', 'dining', 'canteen',
      'mess', 'tiffin', 'lunch', 'dinner', 'breakfast', 'ccd', 'chaayos',
      'barista', 'theobroma', 'behrouz', 'wow momo', 'eats', 'hotel'
    ]
  },
  {
    id: 'groceries',
    label: 'Groceries',
    icon: ShoppingCart,
    color: '#10B981',
    mcc: ['5411', '5499', '5422'],
    keywords: [
      'grocery', 'groceries', 'kirana', 'bigbasket', 'dmart', 'd-mart',
      'grofers', 'blinkit', 'zepto', 'reliance fresh', 'more supermarket',
      'spencer', 'vegetable', 'provision', 'supermarket', 'sabzi', 'mandi',
      'star bazaar', 'jiomart', 'milk', 'dairy', 'ration', 'fresh2home',
      'licious', 'meat', 'fish', 'egg', 'bread', 'atta', 'rice', 'dal'
    ]
  },
  {
    id: 'fuel',
    label: 'Fuel & Gas',
    icon: Fuel,
    color: '#F59E0B',
    mcc: ['5541', '5542'],
    keywords: [
      'petrol', 'diesel', 'fuel', 'pump', 'hp ', 'iocl', 'indian oil',
      'bharat petroleum', 'hpcl', 'bpcl', 'reliance petro', 'nayara',
      'shell', 'cng', 'png', 'gas station', 'filling station'
    ]
  },
  {
    id: 'transport',
    label: 'Transport & Travel',
    icon: Car,
    color: '#3B82F6',
    mcc: ['4121', '4111', '4131'],
    keywords: [
      'uber', 'ola', 'metro', 'rapido', 'irctc', 'parking', 'toll',
      'fastag', 'bus', 'auto', 'taxi', 'rickshaw', 'local train', 'railway',
      'redbus', 'abhibus', 'yulu', 'bounce', 'bike taxi', 'cab', 'airport'
    ]
  },
  {
    id: 'shopping',
    label: 'Shopping',
    icon: ShoppingBag,
    color: '#EC4899',
    mcc: ['5311', '5651', '5691', '5999'],
    keywords: [
      'amazon', 'flipkart', 'myntra', 'ajio', 'mall', 'nykaa', 'meesho',
      'snapdeal', 'tatacliq', 'reliance digital', 'croma', 'vijay sales',
      'lifestyle', 'shoppers stop', 'pantaloons', 'westside', 'zara',
      'h&m', 'fashion', 'clothes', 'electronics', 'mobile', 'laptop',
      'lenskart', 'pepperfry', 'ikea', 'decathlon'
    ]
  },
  {
    id: 'bills',
    label: 'Bills & Utilities',
    icon: Zap,
    color: '#6366F1',
    mcc: ['4900', '4814', '4899'],
    keywords: [
      'electricity', 'recharge', 'broadband', 'wifi', 'dth', 'gas bill',
      'water bill', 'jio', 'airtel', 'bsnl', 'vi ', 'vodafone', 'postpaid',
      'prepaid', 'tatasky', 'dish tv', 'act fibernet', 'mseb', 'bescom',
      'uppcl', 'bses', 'adani electricity', 'piped gas', 'cylinder', 'lpg'
    ]
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    icon: Film,
    color: '#D946EF',
    mcc: ['7832', '7999'],
    keywords: [
      'movie', 'netflix', 'hotstar', 'bookmyshow', 'pvr', 'inox',
      'spotify', 'prime video', 'cinema', 'youtube', 'zee5', 'sonyliv',
      'jiocinema', 'ott', 'subscription', 'gaming', 'steam', 'playstore',
      'appstore', 'concert', 'event', 'apple music'
    ]
  },
  {
    id: 'health',
    label: 'Health & Medical',
    icon: HeartPulse,
    color: '#14B8A6',
    mcc: ['5912', '8011', '8062'],
    keywords: [
      'pharmacy', 'medical', 'hospital', 'doctor', 'chemist', 'apollo',
      'medplus', 'clinic', 'medicine', 'diagnostic', 'lab', 'xray',
      'dentist', 'tata 1mg', 'netmeds', 'pharmeasy', 'practo', 'fortis'
    ]
  },
  {
    id: 'lent',
    label: 'Lending & Udhar',
    icon: Users,
    color: '#8B5CF6',
    mcc: [],
    keywords: ['borrowed', 'loaned', 'udhar', 'lent']
  },
  {
    id: 'education',
    label: 'Education',
    icon: GraduationCap,
    color: '#0284C7',
    mcc: ['8220', '8299'],
    keywords: [
      'school', 'college', 'university', 'tuition', 'coaching', 'course',
      'udemy', 'coursera', 'fees', 'admission', 'exam', 'books', 'stationery'
    ]
  },
  {
    id: 'personal',
    label: 'Personal Care',
    icon: Scissors,
    color: '#A855F7',
    mcc: ['7230', '7298'],
    keywords: ['salon', 'parlour', 'haircut', 'barber', 'spa', 'massage', 'grooming', 'urbanclap']
  },
  {
    id: 'fitness',
    label: 'Fitness & Sports',
    icon: Dumbbell,
    color: '#22C55E',
    mcc: ['7997'],
    keywords: ['gym', 'fitness', 'yoga', 'cult fit', 'cult.fit', 'sports', 'swimming', 'protein']
  },
  {
    id: 'travel',
    label: 'Flights & Hotels',
    icon: Plane,
    color: '#EF4444',
    mcc: ['3000', '7011'],
    keywords: [
      'oyo', 'airbnb', 'hotel', 'resort', 'flight', 'airline', 'indigo',
      'airindia', 'makemytrip', 'goibibo', 'cleartrip', 'booking.com'
    ]
  },
  {
    id: 'savings',
    label: 'Investments',
    icon: PiggyBank,
    color: '#059669',
    mcc: ['6211'],
    keywords: ['mutual fund', 'sip', 'zerodha', 'groww', 'upstox', 'fd', 'fixed deposit', 'gold', 'stocks']
  },
  {
    id: 'emi',
    label: 'EMI & Loans',
    icon: Wallet,
    color: '#B45309',
    mcc: ['6012'],
    keywords: ['emi', 'loan', 'credit card', 'bajaj finance', 'repayment', 'simpl', 'lazypay']
  },
  {
    id: 'rent',
    label: 'Rent & Housing',
    icon: HomeIcon,
    color: '#1D4ED8',
    mcc: ['6513'],
    keywords: ['rent', 'pg ', 'hostel', 'flat', 'apartment', 'housing', 'landlord', 'maintenance']
  },
  {
    id: 'other',
    label: 'General / Other',
    icon: MoreHorizontal,
    color: '#64748B',
    mcc: [],
    keywords: []
  }
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

export function detectCategory(text, mcc = null) {
  if (mcc) {
    const byMcc = CATEGORIES.find(c => c.mcc && c.mcc.includes(String(mcc)));
    if (byMcc) return byMcc.id;
  }
  if (!text) return 'other';
  const t = text.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords && cat.keywords.some(k => t.includes(k))) return cat.id;
  }
  return 'other';
}
