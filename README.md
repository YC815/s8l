# S8L - 進階短網址服務

> 一個基於 Next.js 15 和 PostgreSQL 的現代化短網址服務，提供用戶認證、自訂域名、QR Code 生成、深色模式和中文界面。

![S8L Demo](https://via.placeholder.com/800x400/1c1917/ffffff?text=S8L+Short+URL+Service)

## ✨ 特色功能

### 核心功能
- 🔗 **雙模式短網址** - 基礎隨機短碼 + 自訂域名路徑
- 📱 **QR Code 自動生成** - 每個短網址都自動生成對應的 QR Code
- 📊 **點擊統計** - 追蹤短網址的使用次數
- 📄 **智能標題抓取** - 自動獲取目標網頁標題 (流式讀取，1秒超時)

### 用戶功能
- 👤 **完整用戶系統** - 註冊、登入、密碼重置、郵件驗證
- 🏷️ **自訂域名** - 創建如 `myname.s8l.xyz/mylink` 的個性化短網址
- 📋 **用戶儀表板** - 管理所有短網址，查看統計資料
- 🗂️ **網址管理** - 編輯、刪除已創建的短網址

### 系統特性
- 🌙 **深色/亮色模式** - 支持主題切換，記住用戶偏好
- 🚫 **防套娃機制** - 阻止縮短自己服務的網址
- 📱 **響應式設計** - 完美適配桌面和移動設備
- 🔒 **安全可靠** - 輸入驗證、重複檢測、錯誤處理
- 🇹🇼 **中文界面** - 完整的繁體中文用戶界面

## 🛠 技術棧

- **前端**: Next.js 15 (App Router), React 19, TypeScript
- **樣式**: Tailwind CSS v4, Lucide React Icons
- **後端**: Next.js API Routes, Prisma ORM
- **資料庫**: PostgreSQL
- **認證**: NextAuth.js 5.0, bcryptjs
- **功能**: QRCode.js, Zod 驗證, Nodemailer
- **部署**: Zeabur (推薦) / Vercel / 自託管

## 🚀 快速開始

### 1. 克隆專案

```bash
git clone https://github.com/your-username/s8l.git
cd s8l
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 環境變數設置

創建 `.env` 文件：

```bash
# 資料庫連接字符串
DATABASE_URL="postgresql://username:password@host:port/database"

# 你的短網址域名（用於生成完整的短網址）
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
```

### 4. 資料庫設置

```bash
# 推送資料庫 schema
npx prisma db push

# 生成 Prisma 客戶端
npx prisma generate
```

### 5. 啟動開發服務器

```bash
npm run dev
```

訪問 `http://localhost:3000` 查看應用。

## 📦 部署指南

### 方案一：使用 Zeabur 部署（推薦）

Zeabur 是一個現代化的部署平台，支持 Node.js 和 PostgreSQL。

#### 1. 準備 PostgreSQL 資料庫

**選項 A：使用 Zeabur PostgreSQL 服務**
1. 登入 [Zeabur](https://zeabur.com)
2. 創建新專案
3. 添加 PostgreSQL 服務
4. 記錄連接字符串

**選項 B：使用外部 PostgreSQL**
- [Supabase](https://supabase.com) - 免費 500MB
- [Neon](https://neon.tech) - 免費 3GB
- [PlanetScale](https://planetscale.com) - 免費 5GB

#### 2. 部署應用

1. 將代碼推送到 GitHub
2. 在 Zeabur 中連接 GitHub 倉庫
3. 設置環境變數：
   ```
   DATABASE_URL=your_postgresql_connection_string
   NEXT_PUBLIC_BASE_URL=https://your-assigned-domain.zeabur.app
   ```
4. 部署應用

#### 3. 綁定自定義域名

1. 在 Zeabur 專案設置中添加自定義域名
2. 在域名註冊商處設置 DNS 記錄：
   ```
   Type: CNAME
   Name: @ (或 www)
   Value: your-project.zeabur.app
   ```
3. 更新環境變數中的 `NEXT_PUBLIC_BASE_URL`

### 方案二：使用 Vercel 部署

#### 1. 準備資料庫

使用 Supabase、Neon 或其他 PostgreSQL 提供商。

#### 2. 部署到 Vercel

1. 安裝 Vercel CLI：
   ```bash
   npm i -g vercel
   ```

2. 部署：
   ```bash
   vercel
   ```

3. 設置環境變數：
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXT_PUBLIC_BASE_URL
   ```

#### 3. 自定義域名

1. 在 Vercel 儀表板中添加域名
2. 設置 DNS 記錄指向 Vercel

### 方案三：自託管部署

#### 1. 構建應用

```bash
npm run build
```

#### 2. 使用 PM2 運行

```bash
# 安裝 PM2
npm install -g pm2

# 啟動應用
pm2 start npm --name "s8l" -- start

# 設置開機自啟
pm2 startup
pm2 save
```

#### 3. Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## ⚙️ 配置說明

### 環境變數

| 變數名 | 描述 | 範例 | 必需 |
|--------|------|---------|------|
| `DATABASE_URL` | PostgreSQL 連接字符串 | `postgresql://user:pass@host:5432/db` | ✅ |
| `NEXT_PUBLIC_BASE_URL` | 短網址域名 | `https://s8l.xyz` | ✅ |
| `NEXTAUTH_SECRET` | NextAuth.js 密鑰 | `your-random-secret-key` | ✅ |
| `EMAIL_SERVER` | 郵件服務器 SMTP URL | `smtp://user:pass@smtp.example.com:587` | ❌ |
| `EMAIL_FROM` | 發件人地址 | `noreply@your-domain.com` | ❌ |

### 資料庫 Schema

```sql
-- Url 表
CREATE TABLE "Url" (
    "id" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- 創建索引以提高查詢性能
CREATE UNIQUE INDEX "Url_originalUrl_key" ON "Url"("originalUrl");
CREATE UNIQUE INDEX "Url_shortCode_key" ON "Url"("shortCode");
```

## 🔧 開發

### 項目結構

```
src/
├── app/
│   ├── api/
│   │   ├── shorten/route.ts     # 短網址生成 API
│   │   └── title/route.ts       # 標題獲取 API
│   ├── [shortCode]/page.tsx     # 短網址重定向頁面
│   ├── layout.tsx               # 根佈局
│   ├── page.tsx                 # 主頁面
│   └── not-found.tsx           # 404 頁面
├── lib/
│   ├── db.ts                   # Prisma 客戶端
│   └── url-shortener.ts        # 核心業務邏輯
└── prisma/
    └── schema.prisma           # 資料庫 Schema
```

### 可用命令

```bash
npm run dev          # 啟動開發服務器
npm run build        # 構建生產版本
npm run start        # 啟動生產服務器
npm run lint         # 運行 ESLint
npx prisma studio    # 打開資料庫瀏覽器
npx prisma generate  # 生成 Prisma 客戶端
npx prisma db push   # 推送 Schema 到資料庫
```

## 🔍 API 文檔

### POST /api/shorten

創建短網址

**請求體：**
```json
{
  "url": "https://example.com/very-long-url"
}
```

**響應：**
```json
{
  "shortCode": "abc123",
  "originalUrl": "https://example.com/very-long-url",
  "title": "Example Page",
  "shortUrl": "https://your-domain.com/abc123"
}
```

### GET /api/title

獲取網頁標題

**查詢參數：**
- `url`: 目標 URL

**響應：**
```json
{
  "title": "Page Title"
}
```

## 🛡️ 安全特性

- **輸入驗證**: 嚴格的 URL 格式檢查和 Zod 驗證
- **防套娃**: 阻止縮短自己服務的 URL
- **重複檢測**: 相同 URL 返回已存在的短代碼
- **身份驗證**: NextAuth.js 保護用戶功能
- **密碼加密**: bcryptjs 雜湊加密
- **路由保護**: 中間件保護私人頁面
- **錯誤處理**: 完善的錯誤處理和用戶提示
- **SQL 注入防護**: 使用 Prisma ORM 參數化查詢

## 🎨 自定義

### 修改短代碼長度

編輯 `src/lib/url-shortener.ts`：

```typescript
export function generateShortCode(length: number = 6): string {
  // 修改 length 參數
}
```

### 自定義主題

編輯 `src/app/globals.css` 中的 Tailwind 配置。

### 修改域名過濾

編輯 `src/app/api/shorten/route.ts` 中的域名檢查邏輯。

### 自訂域名前綴長度

編輯 `src/components/CustomDomainModal.tsx` 中的驗證邏輯：

```typescript
const schema = z.object({
  prefix: z.string().min(3).max(10).regex(/^[a-zA-Z0-9-_]+$/)
});
```

## 📝 授權

MIT License - 詳見 [LICENSE](LICENSE) 文件。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📞 支援

如有問題或建議，請：
1. 查看 [Issues](https://github.com/your-username/s8l/issues)
2. 創建新的 Issue
3. 發送 Email 到 your-email@example.com

## 🔄 更新日誌

### v2.0.0 (最新)
- ✨ 新增完整用戶認證系統
- 🏷️ 支援自訂域名功能
- 📊 添加點擊統計功能
- 📋 用戶儀表板和網址管理
- 🔧 優化標題獲取性能
- 💌 郵件驗證和密碼重置

### v1.0.0
- 🔗 基礎短網址生成
- 📱 QR Code 生成
- 🌙 深色模式支援
- 🇹🇼 中文界面

---

⭐ 如果這個專案對您有幫助，請給一個 Star！