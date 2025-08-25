# 🤖 AI Development Guide for Naafe Project

## **🎯 Project Context & Constraints**

### **📚 Documentation Structure**
- **Main Docs**: `naafe-docs/` directory contains all project documentation
- **Theme System**: `naafe-docs/THEME_SYSTEM.md` - shadcn/ui theme with vibrant colors
- **Technical Architecture**: `naafe-docs/TECHNICAL_ARCHITECTURE.md` - Complete tech stack
- **Business Logic**: `naafe-docs/BUSINESS_LOGIC.md` - Platform rules and flows
- **Development Roadmap**: `naafe-docs/DEVELOPMENT_ROADMAP.md` - Implementation phases
- **Project Overview**: `naafe-docs/PROJECT_OVERVIEW.md` - Strategic context

### **🚫 Critical Constraints**
- **ONLY shadcn/ui components** - No other UI libraries allowed
- **Stripe test mode only** - No production payment integration
- **Egypt-specific adaptations** - Arabic support, local payment methods
- **WCAG 2.2 AA compliance** - All components must be accessible
- **Mobile-first responsive design** - Elderly-friendly with large buttons

### **🎨 Design System**
- **Primary**: Teal (trust, reliability)
- **Secondary**: Orange (energy, warmth)
- **Accent**: Purple (creativity, premium)
- **Typography**: Cairo font for Arabic, JetBrains Mono for technical text
- **Spacing**: Consistent padding, large touch targets for mobile

---

## **📝 AI Prompting Strategy**

### **🔄 Context Preservation Commands**

#### **Before Each Session:**
```
"Review the naafe-docs/ directory and confirm you understand:
1. The project is an Arabic service marketplace for Egypt
2. Only shadcn/ui components are allowed
3. Stripe test mode for payments
4. Egypt-specific features (Arabic, local payments, elderly-friendly)
5. Current development phase from DEVELOPMENT_ROADMAP.md"
```

#### **For Each Feature:**
```
"Before implementing [FEATURE], confirm:
1. Which development phase this belongs to
2. The specific requirements from BUSINESS_LOGIC.md
3. The technical specifications from TECHNICAL_ARCHITECTURE.md
4. The design requirements from THEME_SYSTEM.md"
```

### **🚫 Anti-Hallucination Commands**

#### **Before Code Generation:**
```
"DO NOT:
- Use any UI library other than shadcn/ui
- Implement production payment methods
- Skip accessibility features
- Ignore Egypt-specific requirements
- Create components without proper TypeScript types
- Use hardcoded values instead of theme variables"
```

#### **After Code Generation:**
```
"Verify this implementation:
1. Uses only shadcn/ui components
2. Follows the theme system colors
3. Includes proper accessibility attributes
4. Handles Egypt-specific requirements
5. Matches the current development phase"
```

---

## **📋 Development Workflow**

### **🎯 Phase-Based Development**

#### **Phase 1: Core Foundation**
```
"Start Phase 1 from DEVELOPMENT_ROADMAP.md:
1. Set up React + TypeScript with Vite
2. Install and configure shadcn/ui
3. Apply the theme system from THEME_SYSTEM.md
4. Create authentication system per TECHNICAL_ARCHITECTURE.md
5. Follow Egypt-specific requirements from BUSINESS_LOGIC.md"
```

#### **Phase 2: User Management**
```
"Implement Phase 2 features:
1. User registration with role-based interfaces
2. Provider application system with Egypt-specific verification
3. Profile management with Arabic support
4. Follow the database schema from TECHNICAL_ARCHITECTURE.md"
```

### **🔍 Quality Assurance Commands**

#### **Before Committing:**
```
"Run a comprehensive check:
1. TypeScript compilation (npx tsc --noEmit)
2. Verify all components use shadcn/ui
3. Check accessibility compliance
4. Confirm Egypt-specific features are implemented
5. Validate against the current development phase"
```

#### **For Complex Features:**
```
"Break down [COMPLEX_FEATURE] into:
1. Database schema changes (if needed)
2. API endpoint implementation
3. Frontend component structure
4. State management approach
5. Accessibility considerations
6. Egypt-specific adaptations"
```

---

## **🚨 Common AI Issues & Solutions**

### **🔄 Context Loss Prevention**
- **Always reference specific files**: "According to naafe-docs/TECHNICAL_ARCHITECTURE.md..."
- **Use exact quotes**: "The theme system specifies: [exact color values]"
- **Reference line numbers**: "As defined in BUSINESS_LOGIC.md line 123..."

### **🎭 Hallucination Prevention**
- **Ask for confirmation**: "Confirm you're using the exact shadcn/ui Button component"
- **Request file references**: "Show me the exact import statement you're using"
- **Validate against docs**: "Does this match the database schema in TECHNICAL_ARCHITECTURE.md?"

### **🎯 Scope Creep Prevention**
- **Stick to phases**: "This feature belongs to Phase X, not current Phase Y"
- **Reference roadmap**: "According to DEVELOPMENT_ROADMAP.md, this should be implemented in Phase Z"
- **Focus on MVP**: "This is beyond the current phase scope, focus on core requirements"

---

## **📞 Communication Protocol**

### **🎯 Effective Prompts**

#### **For New Features:**
```
"I need to implement [FEATURE_NAME] for the Naafe project. 
Please:
1. Reference the specific requirements from naafe-docs/
2. Confirm the development phase this belongs to
3. Show me the exact shadcn/ui components to use
4. Include Egypt-specific adaptations
5. Ensure WCAG 2.2 AA compliance"
```

#### **For Bug Fixes:**
```
"There's an issue with [COMPONENT_NAME] in the Naafe project.
Please:
1. Review the current implementation
2. Check against the theme system requirements
3. Verify accessibility compliance
4. Ensure Egypt-specific features are preserved
5. Provide a fix that maintains project constraints"
```

#### **For Code Reviews:**
```
"Review this code for the Naafe project:
1. Does it follow the theme system from THEME_SYSTEM.md?
2. Are all components from shadcn/ui?
3. Does it handle Egypt-specific requirements?
4. Is it accessible per WCAG 2.2 AA?
5. Does it match the current development phase?"
```

---

## **🎯 Success Metrics**

### **✅ Quality Indicators**
- All components use shadcn/ui
- Theme colors match THEME_SYSTEM.md exactly
- Egypt-specific features are implemented
- Accessibility attributes are present
- TypeScript compilation passes
- Code follows the current development phase

### **❌ Red Flags**
- Using non-shadcn/ui components
- Hardcoded colors instead of theme variables
- Missing Arabic support
- No accessibility considerations
- Features from future phases
- Production payment integration

---

## **📚 Quick Reference**

### **🎨 Theme Colors (from THEME_SYSTEM.md)**
```css
--primary: 180 84% 32%;          /* Deep Teal */
--secondary: 25 95% 53%;         /* Vibrant Orange */
--accent: 262 83% 58%;           /* Rich Purple */
```

### **🇪🇬 Egypt-Specific Features**
- Arabic language support (RTL)
- Local payment methods (COD, Vodafone Cash, Meeza, Fawry)
- WhatsApp integration
- Voice notes support
- Large button interface
- Elderly-friendly design

### **🔧 Technical Stack**
- React 18 + TypeScript
- shadcn/ui components only
- Tailwind CSS with custom theme
- Node.js + Express.js backend
- MongoDB with Mongoose
- Stripe test mode for payments

---

**🎯 Remember: Always reference the naafe-docs/ directory for any decisions or implementations!**
