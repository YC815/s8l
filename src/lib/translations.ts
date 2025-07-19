export const translations = {
  zh: {
    // Header
    title: "S8L 短網址",
    
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

    // Line Bot page translations
    lineBotTitle: "S8L Line Bot",
    lineBotSlogan: "簡單使用，貼上網址發送即可",
    lineBotDescription: "透過 Line Bot 快速縮短網址，無需開啟網頁，直接在聊天室中完成操作",
    scanQrToAdd: "掃描 QR Code 加入好友",
    orClickToAdd: "或點擊按鈕加入",
    addFriendDescription: "快速加入 S8L Line Bot，開始享受便利的縮網址服務",
    addLineBot: "打開 Line 加入好友",
    useLineApp: "使用 Line App 掃描此 QR Code",
    howToUse: "使用方式",
    step1AddFriend: "1. 加入好友",
    step1Description: "掃描 QR Code 或點擊加好友按鈕",
    step2PasteLongUrl: "2. 貼上長網址",
    step2Description: "將想要縮短的長網址貼到聊天室發送",
    step3GetShortUrl: "3. 獲得短網址",
    step3Description: "Bot 會立即回傳縮短後的網址，即時便利",
    goToS8lService: "前往 S8L 短網址服務"
  },
  en: {
    // Header
    title: "S8L URL Shortener",
    
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

    // Line Bot page translations
    lineBotTitle: "S8L Line Bot",
    lineBotSlogan: "Simple to use, just paste URL and send",
    lineBotDescription: "Quickly shorten URLs via Line Bot, no need to open web pages, complete operations directly in chat room",
    scanQrToAdd: "Scan QR Code to add friend",
    orClickToAdd: "Or click button to add",
    addFriendDescription: "Quickly add S8L Line Bot and start enjoying convenient URL shortening service",
    addLineBot: "Open Line to add friend",
    useLineApp: "Scan this QR Code with Line App",
    howToUse: "How to Use",
    step1AddFriend: "1. Add Friend",
    step1Description: "Scan QR Code or click add friend button",
    step2PasteLongUrl: "2. Paste Long URL",
    step2Description: "Paste the long URL you want to shorten into the chat room and send",
    step3GetShortUrl: "3. Get Short URL",
    step3Description: "Bot will immediately return the shortened URL, instant and convenient",
    goToS8lService: "Go to S8L URL Shortening Service"
  },
  ja: {
    // Header
    title: "S8L 短縮URL",
    
    // Navigation
    dashboard: "ダッシュボード",
    logout: "ログアウト",
    login: "ログイン",
    signup: "新規登録",
    
    // Login prompt
    loginPrompt: "ログインしてカスタムドメイン管理と短縮URLの記録を行う",
    
    // Tabs
    basicShortUrl: "基本短縮URL",
    customShortUrl: "カスタム短縮URL",
    
    // Form labels
    enterUrlLabel: "短縮したいURLを入力してください",
    titleLabel: "タイトル（任意）",
    titlePlaceholder: "カスタムタイトル、空白の場合は自動取得",
    customUrlLabel: "カスタム短縮URL",
    customPathPlaceholder: "カスタムパス",
    selectDomain: "ドメイン選択",
    
    // Buttons
    shortenUrl: "URL短縮",
    create: "作成",
    processing: "処理中",
    
    // Results
    resultsTitle: "短縮結果",
    originalUrl: "元のURL",
    shortUrl: "短縮URL",
    qrCode: "QRコード",
    qrCodeHint: "スキャンしてリンクを開く",
    
    // Errors
    invalidUrl: "有効なURL形式を入力してください",
    cannotShortenSelf: "このサービスのURLは短縮できません",
    unknownError: "不明なエラーが発生しました",
    errorOccurred: "エラーが発生しました",
    
    // Copy functionality
    copyShortUrl: "短縮URLをコピー",
    
    // Dashboard
    welcomeBack: "おかえりなさい",
    home: "ホーム",
    totalUrls: "総URL数",
    totalClicks: "総クリック数",
    customDomains: "カスタムドメイン数",
    customDomainManagement: "カスタムドメイン管理",
    noDomains: "カスタムドメインがまだありません。各ユーザーは最大2つのドメインを作成できます",
    createdAt: "作成日時",
    myUrls: "マイURL",
    loading: "読み込み中...",
    noUrlsFound: "条件に一致するURLが見つかりません",
    noUrlsCreated: "まだURLを作成していません",
    custom: "カスタム",
    clicks: "クリック",
    generateQr: "QRコード生成",
    delete: "削除",
    scanToOpen: "スキャンしてリンクを開く",
    previousPage: "前へ",
    nextPage: "次へ",
    pageInfo: "{current} / {total} ページ",
    searchPlaceholder: "URLタイトルまたは元のURLを検索...",
    newest: "最新",
    oldest: "最古",
    clickCount: "クリック数",
    confirmDelete: "このURLを削除してもよろしいですか？",
    confirmDeleteDomain: "このドメインを削除してもよろしいですか？このドメイン下のすべてのURLも削除されます。",
    
    // Date picker
    startDate: "開始日",
    endDate: "終了日",
    selectDate: "日付選択",
    cancel: "キャンセル",
    confirm: "確認",
    today: "今日",
    year: "年",
    month: "月",
    day: "日",
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"] as const,
    weekdays: ["日", "月", "火", "水", "木", "金", "土"] as const,

    // Line Bot page translations
    lineBotTitle: "S8L Line Bot",
    lineBotSlogan: "簡単使用、URLを貼って送信するだけ",
    lineBotDescription: "Line Botで簡単にURL短縮、ウェブページを開く必要なし、チャットルームで直接操作完了",
    scanQrToAdd: "QRコードをスキャンして友達追加",
    orClickToAdd: "またはボタンをクリックして追加",
    addFriendDescription: "S8L Line Botを友達追加して、便利なURL短縮サービスを開始",
    addLineBot: "Line Botを友達追加",
    useLineApp: "Line AppでこのQRコードをスキャン",
    howToUse: "使用方法",
    step1AddFriend: "1. 友達追加",
    step1Description: "QRコードをスキャンまたは友達追加ボタンをクリック",
    step2PasteLongUrl: "2. 長いURLを貼り付け",
    step2Description: "短縮したい長いURLをチャットルームに貼り付けて送信",
    step3GetShortUrl: "3. 短縮URLを取得",
    step3Description: "Botがすぐに短縮されたURLを返信、即座に便利",
    goToS8lService: "S8L短縮URLサービスへ"
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.zh;