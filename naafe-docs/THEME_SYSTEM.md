# 🎨 Naafe Theme System - shadcn/ui Implementation

## **🎯 Design Philosophy**

### **Core Principles**
- **Vibrant & Professional**: Energetic colors that inspire trust and action
- **Accessibility First**: WCAG 2.2 AA compliance in all states
- **Egyptian Market**: Warm, welcoming colors that resonate with local users
- **Modern & Clean**: Contemporary design with excellent readability
- **Consistent**: Unified design language across all components

### **Color Psychology**
- **Primary (Teal)**: Trust, reliability, professionalism
- **Secondary (Orange)**: Energy, warmth, friendliness
- **Accent (Purple)**: Creativity, innovation, premium feel
- **Success (Green)**: Growth, completion, positive outcomes
- **Warning (Amber)**: Attention, caution, important notices
- **Destructive (Red)**: Urgency, errors, critical actions

---

## **🌈 Color Palette**

### **Light Mode Colors**
```css
/* Primary Colors */
--primary: 180 84% 32%;          /* Deep Teal */
--primary-foreground: 0 0% 98%;  /* Near White */

/* Secondary Colors */
--secondary: 25 95% 53%;         /* Vibrant Orange */
--secondary-foreground: 0 0% 15%; /* Near Black */

/* Accent Colors */
--accent: 262 83% 58%;           /* Rich Purple */
--accent-foreground: 0 0% 98%;   /* Near White */

/* Background Colors */
--background: 0 0% 100%;         /* Pure White */
--foreground: 0 0% 15%;          /* Near Black */
--card: 0 0% 98%;                /* Off White */
--card-foreground: 0 0% 15%;     /* Near Black */
--popover: 0 0% 100%;            /* Pure White */
--popover-foreground: 0 0% 15%;  /* Near Black */

/* Muted Colors */
--muted: 0 0% 96%;               /* Light Gray */
--muted-foreground: 0 0% 45%;    /* Medium Gray */
--border: 0 0% 90%;              /* Border Gray */
--input: 0 0% 96%;               /* Input Background */
--ring: 180 84% 32%;             /* Primary for Focus */

/* Semantic Colors */
--success: 142 76% 36%;          /* Success Green */
--success-foreground: 0 0% 98%;  /* White Text */
--warning: 38 92% 50%;           /* Warning Amber */
--warning-foreground: 0 0% 15%;  /* Dark Text */
--destructive: 0 84% 60%;        /* Destructive Red */
--destructive-foreground: 0 0% 98%; /* White Text */

/* Additional Colors */
--radius: 0.75rem;               /* Border Radius */
--chart-1: 180 84% 32%;          /* Chart Color 1 */
--chart-2: 25 95% 53%;           /* Chart Color 2 */
--chart-3: 262 83% 58%;          /* Chart Color 3 */
```

### **Dark Mode Colors**
```css
/* Primary Colors */
--primary: 180 84% 45%;          /* Lighter Teal for Dark Mode */
--primary-foreground: 0 0% 15%;  /* Dark Text */

/* Secondary Colors */
--secondary: 25 95% 60%;         /* Brighter Orange for Dark Mode */
--secondary-foreground: 0 0% 15%; /* Dark Text */

/* Accent Colors */
--accent: 262 83% 65%;           /* Brighter Purple for Dark Mode */
--accent-foreground: 0 0% 15%;   /* Dark Text */

/* Background Colors */
--background: 0 0% 8%;           /* Very Dark Gray */
--foreground: 0 0% 95%;          /* Near White */
--card: 0 0% 12%;                /* Dark Card */
--card-foreground: 0 0% 95%;     /* Near White */
--popover: 0 0% 10%;             /* Dark Popover */
--popover-foreground: 0 0% 95%;  /* Near White */

/* Muted Colors */
--muted: 0 0% 15%;               /* Dark Muted */
--muted-foreground: 0 0% 65%;    /* Light Muted Text */
--border: 0 0% 20%;              /* Dark Border */
--input: 0 0% 15%;               /* Dark Input */
--ring: 180 84% 45%;             /* Primary for Focus */

/* Semantic Colors */
--success: 142 76% 45%;          /* Brighter Success Green */
--success-foreground: 0 0% 15%;  /* Dark Text */
--warning: 38 92% 60%;           /* Brighter Warning Amber */
--warning-foreground: 0 0% 15%;  /* Dark Text */
--destructive: 0 84% 65%;        /* Brighter Destructive Red */
--destructive-foreground: 0 0% 15%; /* Dark Text */
```

---

## **🎨 Component Theme Variants**

### **Button Variants**
```typescript
// Primary Button - Main actions
<Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
  Get Started
</Button>

// Secondary Button - Supporting actions
<Button variant="secondary" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
  Learn More
</Button>

// Accent Button - Special actions
<Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
  Premium Features
</Button>

// Destructive Button - Dangerous actions
<Button variant="destructive" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
  Delete Account
</Button>
```

### **Card Variants**
```typescript
// Default Card
<Card className="bg-card border-border hover:border-primary/20 transition-colors">
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>

// Highlighted Card
<Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
  <CardContent className="p-6">
    {/* Featured Content */}
  </CardContent>
</Card>

// Success Card
<Card className="bg-success/5 border-success/20">
  <CardContent className="p-6">
    {/* Success Content */}
  </CardContent>
</Card>
```

### **Input Variants**
```typescript
// Default Input
<Input 
  className="border-border bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
  placeholder="Enter your email"
/>

// Success Input
<Input 
  className="border-success/30 bg-success/5 text-foreground focus:border-success focus:ring-success"
  placeholder="Valid email"
/>

// Error Input
<Input 
  className="border-destructive/30 bg-destructive/5 text-foreground focus:border-destructive focus:ring-destructive"
  placeholder="Invalid input"
/>
```

---

## **🎭 Interactive States**

### **Hover Effects**
```css
/* Button Hover */
.btn-hover {
  transition: all 0.2s ease;
}

.btn-hover:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--primary), 0.2);
}

/* Card Hover */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Link Hover */
.link-hover {
  transition: color 0.2s ease;
}

.link-hover:hover {
  color: hsl(var(--primary));
}
```

### **Focus States**
```css
/* Focus Ring */
.focus-ring {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
  border-radius: var(--radius);
}

/* Focus Visible */
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
  border-radius: var(--radius);
}
```

### **Active States**
```css
/* Button Active */
.btn-active:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(var(--primary), 0.3);
}

/* Card Active */
.card-active:active {
  transform: translateY(-1px);
}
```

---

## **📱 Responsive Design**

### **Breakpoints**
```css
/* Mobile First */
.sm: 640px   /* Small tablets */
.md: 768px   /* Tablets */
.lg: 1024px  /* Laptops */
.xl: 1280px  /* Desktops */
.2xl: 1536px /* Large screens */
```

### **Typography Scale**
```css
/* Mobile Typography */
.text-xs: 0.75rem    /* 12px */
.text-sm: 0.875rem   /* 14px */
.text-base: 1rem     /* 16px */
.text-lg: 1.125rem   /* 18px */
.text-xl: 1.25rem    /* 20px */
.text-2xl: 1.5rem    /* 24px */

/* Desktop Typography */
.lg:text-3xl: 1.875rem  /* 30px */
.lg:text-4xl: 2.25rem   /* 36px */
.lg:text-5xl: 3rem      /* 48px */
```

---

## **♿ Accessibility Features**

### **Color Contrast Ratios**
- **Primary Text**: 4.5:1 minimum (WCAG AA)
- **Large Text**: 3:1 minimum (WCAG AA)
- **UI Components**: 3:1 minimum (WCAG AA)
- **Focus Indicators**: 3:1 minimum (WCAG AA)

### **Focus Management**
```css
/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 8px 16px;
  border-radius: var(--radius);
  z-index: 1000;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 6px;
}

/* Focus Indicators */
.focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
  border-radius: var(--radius);
}
```

### **Screen Reader Support**
```typescript
// ARIA Labels
<Button aria-label="Close modal">
  <X className="w-4 h-4" />
</Button>

// Live Regions
<div aria-live="polite" aria-atomic="true">
  {notification}
</div>

// Descriptions
<Input 
  aria-describedby="email-error"
  aria-required="true"
/>
<div id="email-error" className="text-destructive">
  Please enter a valid email
</div>
```

---

## **🎨 Custom Component Themes**

### **Provider Cards**
```typescript
<Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20 hover:border-primary/40 transition-all duration-300">
  <CardHeader>
    <div className="flex items-center gap-3">
      <Avatar className="ring-2 ring-primary/20">
        <AvatarImage src={provider.avatar} />
        <AvatarFallback>{provider.initials}</AvatarFallback>
      </Avatar>
      <div>
        <CardTitle className="text-foreground">{provider.name}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {provider.specialization}
        </CardDescription>
      </div>
    </div>
  </CardHeader>
</Card>
```

### **Service Request Cards**
```typescript
<Card className="bg-gradient-to-br from-secondary/5 to-warning/5 border-secondary/20 hover:border-secondary/40 transition-all duration-300">
  <CardHeader>
    <div className="flex items-center justify-between">
      <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
        {request.category}
      </Badge>
      <Badge variant="outline" className="border-warning/30 text-warning-foreground">
        {request.urgency}
      </Badge>
    </div>
  </CardHeader>
</Card>
```

### **Success States**
```typescript
<Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
  <CardContent className="p-6">
    <div className="flex items-center gap-3">
      <CheckCircle className="w-6 h-6 text-success" />
      <div>
        <h3 className="font-semibold text-foreground">Success!</h3>
        <p className="text-muted-foreground">Your request has been submitted</p>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## **🔧 Implementation Guide**

### **1. Install shadcn/ui**
```bash
npx shadcn@latest init
```

### **2. Configure Tailwind CSS**
```javascript
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
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
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### **3. Add CSS Variables**
```css
/* globals.css */
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
```

### **4. Theme Provider Setup**
```typescript
// components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

---

## **✅ Theme Checklist**

### **Accessibility**
- [ ] All color combinations meet WCAG 2.2 AA standards
- [ ] Focus indicators are clearly visible
- [ ] High contrast mode support
- [ ] Screen reader compatibility
- [ ] Keyboard navigation support

### **Responsive Design**
- [ ] Mobile-first approach
- [ ] Consistent spacing across breakpoints
- [ ] Touch-friendly button sizes
- [ ] Readable typography at all sizes
- [ ] Proper viewport handling

### **Performance**
- [ ] CSS variables for dynamic theming
- [ ] Minimal CSS bundle size
- [ ] Efficient color transitions
- [ ] Optimized for dark mode switching
- [ ] Reduced motion support

### **Consistency**
- [ ] Unified design language
- [ ] Consistent component variants
- [ ] Standardized spacing system
- [ ] Cohesive color palette
- [ ] Matching typography scale

---

This theme system provides a professional, accessible, and visually appealing foundation for the Naafe platform while maintaining excellent usability across all devices and user preferences.
