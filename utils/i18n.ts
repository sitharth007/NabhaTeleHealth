export type Language = 'en' | 'hi' | 'pa';

export interface Translations {
  en: Record<string, string>;
  hi: Record<string, string>;
  pa: Record<string, string>;
}

export const translations: Translations = {
  en: {
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.phone': 'Phone Number',
    'auth.otp': 'Enter OTP',
    'auth.sendOtp': 'Send OTP',
    'auth.verifyOtp': 'Verify OTP',
    'auth.name': 'Full Name',
    'auth.email': 'Email Address',
    'auth.role': 'Select Role',
    'auth.patient': 'Patient',
    'auth.doctor': 'Doctor',
    'auth.pharmacy': 'Pharmacy',
    
    // Navigation
    'nav.home': 'Home',
    'nav.appointments': 'Appointments',
    'nav.health': 'Health Records',
    'nav.chat': 'Chat',
    'nav.profile': 'Profile',
    'nav.medicines': 'Medicines',
    'nav.doctors': 'Doctors',
    
    // Home
    'home.welcome': 'Welcome to Nabha TeleHealth',
    'home.subtitle': 'Your health, our priority',
    'home.bookConsultation': 'Book Consultation',
    'home.emergencyCall': 'Emergency Call',
    'home.findMedicine': 'Find Medicine',
    'home.aiAssistant': 'AI Health Assistant',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Retry',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    
    // Appointments
    'appointments.book': 'Book Appointment',
    'appointments.upcoming': 'Upcoming Appointments',
    'appointments.past': 'Past Appointments',
    'appointments.selectDoctor': 'Select Doctor',
    'appointments.selectDate': 'Select Date',
    'appointments.selectTime': 'Select Time',
    'appointments.symptoms': 'Describe your symptoms',
    'appointments.joinCall': 'Join Video Call',
    'appointments.startCall': 'Start Consultation',
    
    // Health Records
    'health.records': 'Health Records',
    'health.diagnosis': 'Diagnosis',
    'health.prescription': 'Prescription',
    'health.symptoms': 'Symptoms',
    'health.treatment': 'Treatment',
    'health.notes': 'Notes',
    'health.download': 'Download Report',
    
    // Medicine
    'medicine.search': 'Search Medicine',
    'medicine.availability': 'Check Availability',
    'medicine.nearbyPharmacy': 'Nearby Pharmacies',
    'medicine.reserve': 'Reserve Medicine',
    'medicine.inStock': 'In Stock',
    'medicine.outOfStock': 'Out of Stock',
    'medicine.lowStock': 'Low Stock',
    
    // AI Assistant
    'ai.askQuestion': 'Ask your health question',
    'ai.symptomChecker': 'Symptom Checker',
    'ai.healthTips': 'Health Tips',
    'ai.firstAid': 'First Aid Guide',
  },
  hi: {
    // Auth
    'auth.login': 'लॉगिन',
    'auth.register': 'पंजीकरण',
    'auth.phone': 'फोन नंबर',
    'auth.otp': 'OTP दर्ज करें',
    'auth.sendOtp': 'OTP भेजें',
    'auth.verifyOtp': 'OTP सत्यापित करें',
    'auth.name': 'पूरा नाम',
    'auth.email': 'ईमेल पता',
    'auth.role': 'भूमिका चुनें',
    'auth.patient': 'मरीज़',
    'auth.doctor': 'डॉक्टर',
    'auth.pharmacy': 'फार्मेसी',
    
    // Navigation
    'nav.home': 'होम',
    'nav.appointments': 'अपॉइंटमेंट',
    'nav.health': 'स्वास्थ्य रिकॉर्ड',
    'nav.chat': 'चैट',
    'nav.profile': 'प्रोफाइल',
    'nav.medicines': 'दवाइयाँ',
    'nav.doctors': 'डॉक्टर',
    
    // Home
    'home.welcome': 'नाभा टेलीहेल्थ में आपका स्वागत है',
    'home.subtitle': 'आपका स्वास्थ्य, हमारी प्राथमिकता',
    'home.bookConsultation': 'परामर्श बुक करें',
    'home.emergencyCall': 'आपातकालीन कॉल',
    'home.findMedicine': 'दवा खोजें',
    'home.aiAssistant': 'AI स्वास्थ्य सहायक',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'कुछ गलत हुआ',
    'common.retry': 'पुनः प्रयास',
    'common.cancel': 'रद्द करें',
    'common.confirm': 'पुष्टि करें',
    'common.save': 'सेव करें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
  },
  pa: {
    // Auth
    'auth.login': 'ਲਾਗਿਨ',
    'auth.register': 'ਰਜਿਸਟਰ',
    'auth.phone': 'ਫੋਨ ਨੰਬਰ',
    'auth.otp': 'OTP ਦਾਖਲ ਕਰੋ',
    'auth.sendOtp': 'OTP ਭੇਜੋ',
    'auth.verifyOtp': 'OTP ਤਸਦੀਕ ਕਰੋ',
    'auth.name': 'ਪੂਰਾ ਨਾਮ',
    'auth.email': 'ਈਮੇਲ ਪਤਾ',
    'auth.role': 'ਭੂਮਿਕਾ ਚੁਣੋ',
    'auth.patient': 'ਮਰੀਜ਼',
    'auth.doctor': 'ਡਾਕਟਰ',
    'auth.pharmacy': 'ਫਾਰਮੇਸੀ',
    
    // Navigation
    'nav.home': 'ਘਰ',
    'nav.appointments': 'ਮੁਲਾਕਾਤਾਂ',
    'nav.health': 'ਸਿਹਤ ਰਿਕਾਰਡ',
    'nav.chat': 'ਚੈਟ',
    'nav.profile': 'ਪ੍ਰੋਫਾਈਲ',
    'nav.medicines': 'ਦਵਾਈਆਂ',
    'nav.doctors': 'ਡਾਕਟਰ',
    
    // Home
    'home.welcome': 'ਨਾਭਾ ਟੈਲੀਹੈਲਥ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ',
    'home.subtitle': 'ਤੁਹਾਡੀ ਸਿਹਤ, ਸਾਡੀ ਪ੍ਰਾਥਮਿਕਤਾ',
    'home.bookConsultation': 'ਸਲਾਹ ਬੁੱਕ ਕਰੋ',
    'home.emergencyCall': 'ਐਮਰਜੈਂਸੀ ਕਾਲ',
    'home.findMedicine': 'ਦਵਾਈ ਲੱਭੋ',
    'home.aiAssistant': 'AI ਸਿਹਤ ਸਹਾਇਕ',
    
    // Common
    'common.loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    'common.error': 'ਕੁਝ ਗਲਤ ਹੋਇਆ',
    'common.retry': 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼',
    'common.cancel': 'ਰੱਦ ਕਰੋ',
    'common.confirm': 'ਪੁਸ਼ਟੀ ਕਰੋ',
    'common.save': 'ਸੇਵ ਕਰੋ',
    'common.edit': 'ਸੰਪਾਦਿਤ ਕਰੋ',
    'common.delete': 'ਮਿਟਾਓ',
  },
};

export function getTranslation(key: string, language: Language): string {
  return translations[language][key] || translations.en[key] || key;
}