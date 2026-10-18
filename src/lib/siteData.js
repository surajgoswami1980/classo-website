// Marketing site data for MyClasses (adapted from the Edunova content set,
// rebranded + aligned with per-student pricing). Icons use lucide-react.
import {
  Users, GraduationCap, ClipboardCheck, CreditCard, Calendar,
  FileText, BookOpen, Bell, Bus, Library, UserPlus, Settings, Rocket,
} from 'lucide-react';

export const features = [
  {
    icon: Users,
    title: 'Student Management',
    description: 'Complete student lifecycle management from admission to alumni tracking.',
    details: [
      'Admission & enrollment management',
      'Student profiles with photo & documents',
      'Class & section allocation',
      'Promotion & transfer management',
      'Bulk CSV import',
    ],
  },
  {
    icon: GraduationCap,
    title: 'Teacher & Staff Management',
    description: 'Streamline HR operations for teaching and non-teaching staff.',
    details: [
      'Staff profiles & documents',
      'Class incharge & subject assignment',
      'Payroll & payslips',
      'Attendance & leave',
      'Department & designation management',
    ],
  },
  {
    icon: ClipboardCheck,
    title: 'Attendance Management',
    description: 'Digital attendance for students and staff with real-time tracking.',
    details: [
      'App-based attendance',
      'Mark previous days & edit records',
      'Auto alerts to parents',
      'Monthly calendar view',
      'Reports & analytics',
    ],
  },
  {
    icon: CreditCard,
    title: 'Fee Management',
    description: 'Automated fee collection with online payment via Razorpay.',
    details: [
      'Custom fee structures per class',
      'Online payment via Razorpay',
      'Auto invoice & receipt generation',
      'Due reminders & defaulter tracking',
      'Discounts & scholarships',
    ],
  },
  {
    icon: Calendar,
    title: 'Timetable & Events',
    description: 'Period scheduling plus event publishing with ticketing and banners.',
    details: [
      'Class timetable builder',
      'Event creation & publishing',
      'Paid events with Razorpay',
      'Banners & popups',
      'Reminders & notifications',
    ],
  },
  {
    icon: FileText,
    title: 'Exams & Report Cards',
    description: 'Complete examination management from marks entry to report cards.',
    details: [
      'Marks entry & grading',
      'Auto report card generation',
      'Result analytics',
      'Grade & marks customization',
      'Board-wise formats',
    ],
  },
  {
    icon: BookOpen,
    title: 'Assignments',
    description: 'Digital homework distribution and submission tracking.',
    details: [
      'Subject-wise assignments',
      'File upload & submission',
      'Deadline tracking',
      'Parent notification',
      'Completion analytics',
    ],
  },
  {
    icon: Bell,
    title: 'Notifications & Push',
    description: 'Multi-channel communication via Push, Email and SMS.',
    details: [
      'Firebase push (mobile & web)',
      'In-app notifications',
      'Target by class / section / all',
      'Event-triggered alerts',
      'Background queue delivery',
    ],
  },
  {
    icon: Bus,
    title: 'Transport Management',
    description: 'Route planning and fleet management for school buses.',
    details: [
      'Route & stop planning',
      'Vehicle & driver management',
      'Student assignment',
      'Document expiry alerts',
      'Transport fee integration',
    ],
  },
  {
    icon: Library,
    title: 'Library & Store',
    description: 'Digital library plus an in-app store for school items.',
    details: [
      'Book catalog, issue & return',
      'Fine calculation',
      'Store items students can buy',
      'Online payment & pickup',
      'Stock & order management',
    ],
  },
];

// Per-student pricing — rate drops as the school grows.
export const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for small schools getting started with digital management.',
    perStudent: 10,
    fromPrice: '₹15,000',
    studentLimit: 'Up to 500 students',
    popular: false,
    features: [
      'All core modules',
      'Web + mobile + admin apps',
      'Online fee payments (Razorpay)',
      'Attendance, exams, timetable',
      'Push & in-app notifications',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    description: 'Ideal for growing schools that need the complete feature set.',
    perStudent: 13,
    fromPrice: '₹20,000',
    studentLimit: '500 – 1,000 students',
    popular: true,
    features: [
      'Everything in Starter, plus:',
      'Transport & library',
      'Store & events with payments',
      'Reports & analytics',
      'Parent & student portals',
      'Priority support',
    ],
  },
  {
    name: 'Scale',
    description: 'For large institutions and school chains needing full power.',
    perStudent: 20,
    fromPrice: 'Custom',
    studentLimit: '1,000+ students',
    popular: false,
    features: [
      'Everything in Growth, plus:',
      'Multi-branch management',
      'Custom branding & white label',
      'Dedicated account manager',
      'Onboarding, migration & training',
      'SLA & phone support',
    ],
  },
];

export const addons = [
  { name: 'SMS Pack', price: '₹1,500', type: '10,000 SMS', description: 'Bulk SMS credits for notifications and alerts.' },
  { name: 'Custom Branding', price: '₹2,999', type: 'One-time', description: 'Your logo, colors, and domain for the platform.' },
  { name: 'Dedicated Support', price: '₹4,999/mo', type: 'Monthly', description: 'Priority support with a dedicated account manager.' },
  { name: 'Onboarding & Setup', price: '₹9,999', type: 'One-time', description: 'Complete setup, data migration, and staff training.' },
];

export const howItWorks = [
  { icon: UserPlus, step: '01', title: 'Sign Up & Choose Plan', description: 'Create your account in minutes. Pick a plan by student count. Start free — no credit card needed.' },
  { icon: Settings, step: '02', title: 'Configure Your School', description: 'Set up classes, sections, subjects and fee structures. Import students via CSV. We help with onboarding.' },
  { icon: Rocket, step: '03', title: 'Go Live & Grow', description: 'Your school is digital. Teachers, students and parents get their portals and apps on day one.' },
];

export const stats = [
  { value: '16+', label: 'Integrated Modules' },
  { value: '3', label: 'Apps — Web, Mobile, Admin' },
  { value: '99.9%', label: 'Uptime Guaranteed' },
  { value: '24/7', label: 'Support Available' },
];

export const testimonials = [
  {
    name: 'Dr. Rajesh Kumar', role: 'Principal', school: 'Delhi Public School, Noida', rating: 5,
    content: 'MyClasses completely transformed how we manage our school. The fee automation alone saved us 20 hours a week, and the parent portal keeps families informed.',
  },
  {
    name: "Mrs. Priya Sharma", role: 'Director', school: "St. Mary's Convent, Jaipur", rating: 5,
    content: 'We evaluated five systems before choosing MyClasses. The ease of use and CBSE pattern support made it a clear winner. Our teachers adapted within a week.',
  },
  {
    name: 'Mr. Arun Patel', role: 'Administrator', school: 'Greenfield International, Pune', rating: 5,
    content: 'The transport module and automated attendance notifications reduced absenteeism by 30%. Best investment we made for our school.',
  },
];

export const faqs = [
  { question: 'Is there a free trial available?', answer: 'Yes. We offer a free trial so you can evaluate the full platform with your own school data before committing. No credit card required to start.' },
  { question: 'How long does setup take?', answer: 'Most schools are up and running within 2-3 days. Our team helps with data migration, configuration and staff training. Larger setups may take up to a week.' },
  { question: 'How does per-student pricing work?', answer: 'You pay a small monthly fee per student (from ₹10). The rate drops as your school grows, and the final price depends on the modules you use. Tell us your student count for an exact quote.' },
  { question: 'Can we switch plans later?', answer: 'Absolutely. Upgrade or downgrade anytime. Upgrades are prorated; downgrades take effect at the next billing cycle.' },
  { question: 'Is our data secure?', answer: 'We use strong encryption for all data, host on reliable cloud infrastructure with daily backups, and follow Indian data-protection practices.' },
  { question: 'What boards and exam patterns do you support?', answer: 'CBSE, ICSE and all major State Board patterns. Report cards can be customized to your board format, and we support custom grading systems.' },
  { question: 'Do you support multiple branches?', answer: 'Yes. The Scale plan supports multi-branch management with a unified dashboard, while each branch keeps its own configuration.' },
  { question: 'Is training provided for our staff?', answer: 'Yes. We provide online training for all plans, plus a knowledge base and video tutorials. The Scale plan includes dedicated onboarding sessions.' },
];

export const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];
