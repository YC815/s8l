export const translations = {
  zh: {
    // Header
    title: "S8L 短網址",
    subtitle: "極簡、快速、安全的網址縮短服務，支援 QR Code 生成",
    
    // Navigation
    dashboard: "Dashboard",
    logout: "登出",
    login: "登入",
    signup: "註冊",
    
    // Login prompt
    loginPrompt: "登入可以自訂域名管理以及紀錄短網址紀錄",
    
    // Tabs
    basicShortUrl: "基礎短網址",
    customShortUrl: "自訂義短網址",
    
    // Form labels
    enterUrlLabel: "請輸入要縮短的網址",
    titleLabel: "標題（選填）",
    titlePlaceholder: "自訂標題，留空則自動抓取",
    customUrlLabel: "自訂短網址",
    customPathPlaceholder: "自訂路徑",
    selectDomain: "選擇域名",
    
    // Buttons
    shortenUrl: "縮短網址",
    create: "建立",
    processing: "處理中",
    
    // Results
    resultsTitle: "縮短結果",
    originalUrl: "原始網址",
    shortUrl: "短網址",
    qrCode: "QR Code",
    qrCodeHint: "掃描開啟連結",
    
    // Errors
    invalidUrl: "請輸入有效的網址格式",
    cannotShortenSelf: "不能縮短本服務的網址",
    unknownError: "發生未知錯誤",
    errorOccurred: "發生錯誤",
    
    // Copy functionality
    copyShortUrl: "複製短網址",
    
    // Dashboard
    welcomeBack: "歡迎回來",
    home: "首頁",
    totalUrls: "總短網址數",
    totalClicks: "總點擊數",
    customDomains: "自訂域名數",
    customDomainManagement: "自訂域名管理",
    noDomains: "您還沒有自訂域名，每位用戶可創建最多 2 個域名",
    createdAt: "建立於",
    myUrls: "我的短網址",
    loading: "載入中...",
    noUrlsFound: "沒有找到符合條件的短網址",
    noUrlsCreated: "您還沒有建立任何短網址",
    custom: "自訂",
    clicks: "次點擊",
    generateQr: "生成 QR Code",
    delete: "刪除",
    scanToOpen: "掃描以開啟連結",
    previousPage: "上一頁",
    nextPage: "下一頁",
    pageInfo: "第 {current} 頁，共 {total} 頁",
    searchPlaceholder: "搜尋短網址標題或原始網址...",
    newest: "最新",
    oldest: "最舊",
    clickCount: "點擊數",
    confirmDelete: "確定要刪除此短網址嗎？",
    confirmDeleteDomain: "確定要刪除此域名嗎？這將同時刪除該域名下的所有短網址。",
    
    // Date picker
    startDate: "開始日期",
    endDate: "結束日期",
    selectDate: "選擇日期",
    cancel: "取消",
    confirm: "確認",
    today: "今天",
    year: "年",
    month: "月",
    day: "日",
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"] as const,
    weekdays: ["日", "一", "二", "三", "四", "五", "六"] as const,
  },
  en: {
    // Header
    title: "S8L URL Shortener",
    subtitle: "Simple, fast, and secure URL shortening service with QR Code generation",
    
    // Navigation
    dashboard: "Dashboard",
    logout: "Logout",
    login: "Login",
    signup: "Sign Up",
    
    // Login prompt
    loginPrompt: "Login to manage custom domains and track your shortened URLs",
    
    // Tabs
    basicShortUrl: "Basic Short URL",
    customShortUrl: "Custom Short URL",
    
    // Form labels
    enterUrlLabel: "Enter the URL you want to shorten",
    titleLabel: "Title (Optional)",
    titlePlaceholder: "Custom title, leave empty to auto-fetch",
    customUrlLabel: "Custom Short URL",
    customPathPlaceholder: "Custom path",
    selectDomain: "Select Domain",
    
    // Buttons
    shortenUrl: "Shorten URL",
    create: "Create",
    processing: "Processing",
    
    // Results
    resultsTitle: "Shortened Results",
    originalUrl: "Original URL",
    shortUrl: "Short URL",
    qrCode: "QR Code",
    qrCodeHint: "Scan to open link",
    
    // Errors
    invalidUrl: "Please enter a valid URL format",
    cannotShortenSelf: "Cannot shorten URLs from this service",
    unknownError: "An unknown error occurred",
    errorOccurred: "An error occurred",
    
    // Copy functionality
    copyShortUrl: "Copy short URL",
    
    // Dashboard
    welcomeBack: "Welcome back",
    home: "Home",
    totalUrls: "Total URLs",
    totalClicks: "Total Clicks",
    customDomains: "Custom Domains",
    customDomainManagement: "Custom Domain Management",
    noDomains: "You don't have any custom domains yet. Each user can create up to 2 domains",
    createdAt: "Created at",
    myUrls: "My URLs",
    loading: "Loading...",
    noUrlsFound: "No URLs found matching your criteria",
    noUrlsCreated: "You haven't created any URLs yet",
    custom: "Custom",
    clicks: "clicks",
    generateQr: "Generate QR Code",
    delete: "Delete",
    scanToOpen: "Scan to open link",
    previousPage: "Previous",
    nextPage: "Next",
    pageInfo: "Page {current} of {total}",
    searchPlaceholder: "Search URL title or original URL...",
    newest: "Newest",
    oldest: "Oldest",
    clickCount: "Click Count",
    confirmDelete: "Are you sure you want to delete this URL?",
    confirmDeleteDomain: "Are you sure you want to delete this domain? This will also delete all URLs under this domain.",
    
    // Date picker
    startDate: "Start Date",
    endDate: "End Date",
    selectDate: "Select Date",
    cancel: "Cancel",
    confirm: "Confirm",
    today: "Today",
    year: "Year",
    month: "Month",
    day: "Day",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const,
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const,
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.zh;