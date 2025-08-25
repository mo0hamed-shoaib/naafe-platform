# Naafe Project Initialization Script (PowerShell)
# This script sets up the project structure and dependencies

Write-Host "🚀 Initializing Naafe Project..." -ForegroundColor Green

# Create project structure
Write-Host "📁 Creating project structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "src/components/ui"
New-Item -ItemType Directory -Force -Path "src/components/forms"
New-Item -ItemType Directory -Force -Path "src/components/layout"
New-Item -ItemType Directory -Force -Path "src/components/features"
New-Item -ItemType Directory -Force -Path "src/pages"
New-Item -ItemType Directory -Force -Path "src/hooks"
New-Item -ItemType Directory -Force -Path "src/utils"
New-Item -ItemType Directory -Force -Path "src/services"
New-Item -ItemType Directory -Force -Path "src/types"
New-Item -ItemType Directory -Force -Path "src/contexts"
New-Item -ItemType Directory -Force -Path "src/styles"
New-Item -ItemType Directory -Force -Path "public/images"
New-Item -ItemType Directory -Force -Path "public/icons"
New-Item -ItemType Directory -Force -Path "public/locales"
New-Item -ItemType Directory -Force -Path "docs"

# Initialize package.json if it doesn't exist
if (-not (Test-Path "package.json")) {
    Write-Host "📦 Creating package.json..." -ForegroundColor Yellow
    npm init -y
}

# Install core dependencies
Write-Host "📦 Installing core dependencies..." -ForegroundColor Yellow
npm install react react-dom react-router-dom
npm install -D @types/react @types/react-dom typescript
npm install -D vite @vitejs/plugin-react

# Install shadcn/ui and Tailwind CSS
Write-Host "🎨 Installing shadcn/ui and Tailwind CSS..." -ForegroundColor Yellow
npm install tailwindcss postcss autoprefixer
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install @radix-ui/react-slot
npm install -D @types/node

# Install additional dependencies for Egypt-specific features
Write-Host "🇪🇬 Installing Egypt-specific dependencies..." -ForegroundColor Yellow
npm install react-i18next i18next
npm install @stripe/stripe-js
npm install socket.io-client
npm install react-hook-form @hookform/resolvers zod
npm install date-fns

# Install development tools
Write-Host "🛠️ Installing development tools..." -ForegroundColor Yellow
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D @types/node

# Create TypeScript config
Write-Host "⚙️ Creating TypeScript configuration..." -ForegroundColor Yellow
$tsconfig = @"
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/services/*": ["./src/services/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
"@
$tsconfig | Out-File -FilePath "tsconfig.json" -Encoding UTF8

# Create Vite config
Write-Host "⚙️ Creating Vite configuration..." -ForegroundColor Yellow
$viteConfig = @"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true
  }
})
"@
$viteConfig | Out-File -FilePath "vite.config.ts" -Encoding UTF8

# Create Tailwind config
Write-Host "🎨 Creating Tailwind CSS configuration..." -ForegroundColor Yellow
$tailwindConfig = @"
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
        'mono-technical': ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
"@
$tailwindConfig | Out-File -FilePath "tailwind.config.js" -Encoding UTF8

# Create PostCSS config
Write-Host "⚙️ Creating PostCSS configuration..." -ForegroundColor Yellow
$postcssConfig = @"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"@
$postcssConfig | Out-File -FilePath "postcss.config.js" -Encoding UTF8

# Create environment variables template
Write-Host "🔧 Creating environment variables template..." -ForegroundColor Yellow
$envExample = @"
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
VITE_IMGBB_API_KEY=your_imgbb_api_key

# Backend Environment Variables (for reference)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/naafe
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
IMGBB_API_KEY=your_imgbb_api_key
WHATSAPP_API_KEY=your_whatsapp_api_key
GMAIL_USER=your_gmail_user
GMAIL_PASS=your_gmail_pass
NODE_ENV=development
"@
$envExample | Out-File -FilePath ".env.example" -Encoding UTF8

# Create basic CSS file with theme variables
Write-Host "🎨 Creating CSS file with theme variables..." -ForegroundColor Yellow
$globalsCSS = @"
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 15%;
    --card: 0 0% 98%;
    --card-foreground: 0 0% 15%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 15%;
    --primary: 180 84% 32%;
    --primary-foreground: 0 0% 98%;
    --secondary: 25 95% 53%;
    --secondary-foreground: 0 0% 15%;
    --muted: 0 0% 96%;
    --muted-foreground: 0 0% 45%;
    --accent: 262 83% 58%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 90%;
    --input: 0 0% 96%;
    --ring: 180 84% 32%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 0 0% 8%;
    --foreground: 0 0% 95%;
    --card: 0 0% 12%;
    --card-foreground: 0 0% 95%;
    --popover: 0 0% 10%;
    --popover-foreground: 0 0% 95%;
    --primary: 180 84% 45%;
    --primary-foreground: 0 0% 15%;
    --secondary: 25 95% 60%;
    --secondary-foreground: 0 0% 15%;
    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 65%;
    --accent: 262 83% 65%;
    --accent-foreground: 0 0% 15%;
    --destructive: 0 84% 65%;
    --destructive-foreground: 0 0% 15%;
    --border: 0 0% 20%;
    --input: 0 0% 15%;
    --ring: 180 84% 45%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* Custom utility classes for Egypt-specific features */
.font-cairo {
  font-family: 'Cairo', sans-serif;
}

.font-mono-technical {
  font-family: 'JetBrains Mono', monospace;
}

/* RTL support for Arabic */
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

/* Large touch targets for elderly users */
.touch-target {
  @apply min-h-[44px] min-w-[44px];
}

/* Voice notes styling */
.voice-note {
  @apply bg-primary/10 border border-primary/20 rounded-lg p-4;
}
"@
$globalsCSS | Out-File -FilePath "src/styles/globals.css" -Encoding UTF8

# Create basic App component
Write-Host "📱 Creating basic App component..." -ForegroundColor Yellow
$appTSX = @"
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/globals.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-cairo">
        <Routes>
          <Route path="/" element={
            <div className="container mx-auto p-4">
              <h1 className="text-4xl font-bold text-primary mb-4">
                مرحباً بكم في Naafe
              </h1>
              <p className="text-lg text-foreground">
                منصة الخدمات العربية في مصر
              </p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
"@
$appTSX | Out-File -FilePath "src/App.tsx" -Encoding UTF8

# Create main entry point
Write-Host "🚀 Creating main entry point..." -ForegroundColor Yellow
$mainTSX = @"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
"@
$mainTSX | Out-File -FilePath "src/main.tsx" -Encoding UTF8

# Create index.html
Write-Host "📄 Creating index.html..." -ForegroundColor Yellow
$indexHTML = @"
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Naafe - منصة الخدمات العربية</title>
    <meta name="description" content="منصة الخدمات العربية في مصر - ربط طالبي الخدمات مع المقدمين المحترفين" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
"@
$indexHTML | Out-File -FilePath "index.html" -Encoding UTF8

# Create package.json scripts
Write-Host "📦 Adding scripts to package.json..." -ForegroundColor Yellow
npm pkg set scripts.dev="vite"
npm pkg set scripts.build="tsc && vite build"
npm pkg set scripts.preview="vite preview"
npm pkg set scripts.lint="eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
npm pkg set scripts.type-check="tsc --noEmit"

# Install tailwindcss-animate
npm install tailwindcss-animate

Write-Host "✅ Naafe project initialized successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy .env.example to .env and fill in your API keys" -ForegroundColor White
Write-Host "2. Run 'npm run dev' to start development server" -ForegroundColor White
Write-Host "3. Follow the development phases in naafe-docs/DEVELOPMENT_ROADMAP.md" -ForegroundColor White
Write-Host "4. Reference naafe-docs/ for all project requirements" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "- naafe-docs/AI_DEVELOPMENT_GUIDE.md - How to work with Cursor AI" -ForegroundColor White
Write-Host "- naafe-docs/ - Complete project documentation" -ForegroundColor White
Write-Host "- naafe-docs/.cursorrules - Cursor AI configuration" -ForegroundColor White
