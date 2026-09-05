export type Language = "en" | "hi";

export interface Translations {
  // App Header & Badges
  appTitle: string;
  appSubtitle: string;
  systemOnline: string;
  navBisStandards: string;
  navStandardsSearch: string;
  navCompliance: string;
  navCertification: string;

  // Theme
  themeLight: string;
  themeDark: string;
  themeToggle: string;

  // Sidebar
  sidebarTitle: string;
  sidebarSubtitle: string;
  newConversation: string;
  menuStandardsSearch: string;
  menuComplianceChecker: string;
  menuExportReports: string;
  recentConversations: string;
  recentOverview: string;
  recentCement: string;
  recentSafety: string;
  settings: string;
  assistantName: string;
  onlineStatus: string;

  // Chat Window - Welcome & Quick Actions
  welcomeTitle: string;
  welcomeDescription: string;
  actionFindTitle: string;
  actionFindDesc: string;
  actionFindPrompt: string;
  actionComplianceTitle: string;
  actionComplianceDesc: string;
  actionCompliancePrompt: string;
  actionExplainTitle: string;
  actionExplainDesc: string;
  actionExplainPrompt: string;

  // Chat Window - Messages & UI
  userRole: string;
  assistantRole: string;
  retrievedSources: string;
  thinking: string;
  inputPlaceholder: string;
  askButton: string;
  disclaimer: string;

  // Error & Fallback messages
  noResultsFound: string;
  serverConnectionError: string;
  relevantStandardFound: string;
  bisStandardFallback: string;
  indianStandardFallback: string;
  matchScore: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // App Header & Badges
    appTitle: "BIS Standards AI Assistant",
    appSubtitle: "Intelligent assistance for Indian Standards",
    systemOnline: "System Online",
    navBisStandards: "BIS Standards",
    navStandardsSearch: "Standards Search",
    navCompliance: "Compliance",
    navCertification: "Certification",

    // Theme
    themeLight: "Light",
    themeDark: "Dark",
    themeToggle: "Toggle Theme",

    // Sidebar
    sidebarTitle: "BIS Assistant",
    sidebarSubtitle: "Standards Intelligence",
    newConversation: "New Conversation",
    menuStandardsSearch: "Standards Search",
    menuComplianceChecker: "Compliance Checker",
    menuExportReports: "Export Reports",
    recentConversations: "Recent Conversations",
    recentOverview: "BIS standards overview",
    recentCement: "Cement quality requirements",
    recentSafety: "Safety standards query",
    settings: "Settings",
    assistantName: "BIS AI Assistant",
    onlineStatus: "Online",

    // Chat Window - Welcome & Quick Actions
    welcomeTitle: "How can BIS Assistant help you?",
    welcomeDescription:
      "Search Indian Standards, understand requirements, and get standards-based answers in one place.",
    actionFindTitle: "Find a Standard",
    actionFindDesc: "Search for relevant BIS standards.",
    actionFindPrompt: "Help me find the relevant BIS standard for my product.",
    actionComplianceTitle: "Check Compliance",
    actionComplianceDesc: "Understand applicable requirements.",
    actionCompliancePrompt:
      "What BIS requirements should I check for product compliance?",
    actionExplainTitle: "Explain a Standard",
    actionExplainDesc: "Get complex standards explained simply.",
    actionExplainPrompt: "Explain the relevant BIS standard in simple terms.",

    // Chat Window - Messages & UI
    userRole: "You",
    assistantRole: "BIS Assistant",
    retrievedSources: "Retrieved Sources",
    thinking: "Thinking...",
    inputPlaceholder:
      "Ask about BIS standards, certification, or compliance...",
    askButton: "Ask BIS",
    disclaimer:
      "BIS Assistant provides AI-generated assistance. Verify critical requirements against official BIS documentation.",

    // Error & Fallback messages
    noResultsFound:
      "No matching BIS standards found for your query. Please rephrase or check standard codes.",
    serverConnectionError:
      "Could not connect to the backend server. Please make sure Uvicorn backend is running on http://localhost:8000.",
    relevantStandardFound: "Relevant Standard Found:",
    bisStandardFallback: "BIS Standard",
    indianStandardFallback: "Indian Standard",
    matchScore: "Match Score:",
  },
  hi: {
    // App Header & Badges
    appTitle: "बीआईएस मानक एआई सहायक",
    appSubtitle: "भारतीय मानकों के लिए बुद्धिमान सहायता",
    systemOnline: "सिस्टम ऑनलाइन",
    navBisStandards: "बीआईएस मानक",
    navStandardsSearch: "मानक खोज",
    navCompliance: "अनुपालन",
    navCertification: "प्रमाणीकरण",

    // Theme
    themeLight: "लाइट",
    themeDark: "डार्क",
    themeToggle: "थीम बदलें",

    // Sidebar
    sidebarTitle: "बीआईएस सहायक",
    sidebarSubtitle: "मानक बुद्धिमत्ता",
    newConversation: "नई बातचीत",
    menuStandardsSearch: "मानक खोज",
    menuComplianceChecker: "अनुपालन परीक्षक",
    menuExportReports: "रिपोर्ट निर्यात करें",
    recentConversations: "हाल की बातचीत",
    recentOverview: "बीआईएस मानक अवलोकन",
    recentCement: "सीमेंट गुणवत्ता आवश्यकताएं",
    recentSafety: "सुरक्षा मानक प्रश्न",
    settings: "सेटिंग्स",
    assistantName: "बीआईएस एआई सहायक",
    onlineStatus: "ऑनलाइन",

    // Chat Window - Welcome & Quick Actions
    welcomeTitle: "बीआईएस सहायक आपकी कैसे मदद कर सकता है?",
    welcomeDescription:
      "भारतीय मानक खोजें, आवश्यकताओं को समझें और एक ही स्थान पर मानकों पर आधारित उत्तर प्राप्त करें।",
    actionFindTitle: "मानक खोजें",
    actionFindDesc: "प्रासंगिक बीआईएस मानक खोजें।",
    actionFindPrompt:
      "मेरे उत्पाद के लिए प्रासंगिक बीआईएस मानक खोजने में मदद करें।",
    actionComplianceTitle: "अनुपालन जांचें",
    actionComplianceDesc: "लागू आवश्यकताओं को समझें।",
    actionCompliancePrompt:
      "उत्पाद अनुपालन के लिए मुझे कौन सी बीआईएस आवश्यकताएं जांचनी चाहिए?",
    actionExplainTitle: "मानक समझें",
    actionExplainDesc: "जटिल मानकों की सरल व्याख्या प्राप्त करें।",
    actionExplainPrompt: "प्रासंगिक बीआईएस मानक को सरल शब्दों में समझाएं।",

    // Chat Window - Messages & UI
    userRole: "आप",
    assistantRole: "बीआईएस सहायक",
    retrievedSources: "प्राप्त स्रोत",
    thinking: "सोच रहा है...",
    inputPlaceholder:
      "बीआईएस मानक, प्रमाणीकरण या अनुपालन के बारे में पूछें...",
    askButton: "बीआईएस से पूछें",
    disclaimer:
      "बीआईएस सहायक एआई-जनरेटेड सहायता प्रदान करता है। आधिकारिक बीआईएस दस्तावेजों से महत्वपूर्ण आवश्यकताओं की पुष्टि करें।",

    // Error & Fallback messages
    noResultsFound:
      "आपके प्रश्न के लिए कोई प्रासंगिक बीआईएस मानक नहीं मिला। कृपया दोबारा लिखें या मानक कोड जांचें।",
    serverConnectionError:
      "बैकएंड सर्वर से कनेक्ट नहीं हो सका। कृपया सुनिश्चित करें कि यूविकॉर्न बैकएंड http://localhost:8000 पर चल रहा है।",
    relevantStandardFound: "प्रासंगिक मानक मिला:",
    bisStandardFallback: "बीआईएस मानक",
    indianStandardFallback: "भारतीय मानक",
    matchScore: "मिलान स्कोर:",
  },
};
