# 🚀 Naafe - Arabic Service Marketplace

**Naafe** is an Arabic service marketplace platform that connects service seekers with professional providers in Egypt. Built with React, TypeScript, and shadcn/ui.

## 📚 Documentation

- **[AI Development Guide](./naafe-docs/AI_DEVELOPMENT_GUIDE.md)** - How to work with Cursor AI
- **[Project Documentation](./naafe-docs/)** - Complete project specifications
- **[Theme System](./naafe-docs/THEME_SYSTEM.md)** - shadcn/ui theme with vibrant colors
- **[Technical Architecture](./naafe-docs/TECHNICAL_ARCHITECTURE.md)** - Complete tech stack
- **[Business Logic](./naafe-docs/BUSINESS_LOGIC.md)** - Platform rules and flows
- **[Development Roadmap](./naafe-docs/DEVELOPMENT_ROADMAP.md)** - Implementation phases

## 🎯 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Initial Setup
```bash
# Clone the repository
git clone [repository-url]
cd naafe

# Run the initialization script
# For Linux/Mac/Git Bash:
chmod +x naafe-docs/scripts/init-project.sh
./naafe-docs/scripts/init-project.sh

# For Windows PowerShell:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# .\naafe-docs\scripts\init-project.ps1

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🎨 Design System

### Colors
- **Primary**: Teal (180 84% 32%) - Trust, reliability
- **Secondary**: Orange (25 95% 53%) - Energy, warmth  
- **Accent**: Purple (262 83% 58%) - Creativity, premium

### Typography
- **Arabic**: Cairo font for Arabic text
- **Technical**: JetBrains Mono for code and technical content

### Accessibility
- WCAG 2.2 AA compliance
- Large touch targets (44px minimum)
- High contrast ratios
- Screen reader support

## 🇪🇬 Egypt-Specific Features

- **Arabic Language Support**: Full RTL interface
- **Local Payment Methods**: COD, Vodafone Cash, Meeza, Fawry
- **WhatsApp Integration**: Familiar communication method
- **Voice Notes Support**: Alternative to typing
- **Large Button Interface**: Elderly-friendly design
- **Location Privacy**: Governorate/city selection (not shared publicly)

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **shadcn/ui** component library
- **Tailwind CSS** with custom theme
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **Socket.IO** for real-time features

### Backend (Reference)
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Stripe** for payments (test mode)
- **ImgBB** for file storage

## 📋 Development Phases

### Phase 1: Core Foundation (2-3 weeks)
- [ ] Project setup and configuration
- [ ] Authentication system
- [ ] Core UI components
- [ ] Database and backend setup

### Phase 2: User Management (2-3 weeks)
- [ ] User registration and roles
- [ ] Provider application system
- [ ] Provider verification

### Phase 3: Service Requests (3-4 weeks)
- [ ] Progressive request forms
- [ ] Request management
- [ ] Smart matching system

### Phase 4: Offers & Negotiation (3-4 weeks)
- [ ] Offer management
- [ ] Negotiation system
- [ ] Communication system

### Phase 5: Payment System (2-3 weeks)
- [ ] Stripe integration
- [ ] Manual payment tracking
- [ ] Payment management

### Phase 6: Review & Feedback (2-3 weeks)
- [ ] Review system
- [ ] Feedback collection

### Phase 7: Admin Dashboard (3-4 weeks)
- [ ] Multi-role admin system
- [ ] User management
- [ ] Platform management

### Phase 8: Real-time Features (2-3 weeks)
- [ ] Real-time notifications
- [ ] Live activity monitoring

### Phase 9: Advanced Features (3-4 weeks)
- [ ] Enhanced user experience
- [ ] Accessibility & localization
- [ ] Performance optimization

### Phase 10: Testing & Deployment (2-3 weeks)
- [ ] Testing suite
- [ ] Production deployment

## 🤖 AI Development Guidelines

### Before Starting
1. Review the `naafe-docs/` directory
2. Confirm current development phase
3. Understand Egypt-specific requirements
4. Verify shadcn/ui component usage

### Quality Checks
- Run `npm run type-check` before committing
- Verify all components use shadcn/ui
- Check theme color usage
- Confirm Egypt-specific features
- Validate against current development phase

### Common Commands for Cursor AI
```bash
# Context preservation
"Review the naafe-docs/ directory and confirm you understand the project requirements"

# Feature implementation
"Implement [FEATURE] following the requirements from naafe-docs/ and current development phase"

# Quality verification
"Verify this implementation uses only shadcn/ui components and follows the theme system"
```

## 🚨 Critical Constraints

- **ONLY shadcn/ui components** - No other UI libraries
- **Stripe test mode only** - No production payment integration
- **Egypt-specific adaptations** - Arabic support, local payment methods
- **WCAG 2.2 AA compliance** - All components must be accessible
- **Mobile-first responsive design** - Elderly-friendly with large buttons

## 📞 Support

- **Documentation**: Check `naafe-docs/` directory
- **AI Development**: Reference `naafe-docs/AI_DEVELOPMENT_GUIDE.md`
- **Theme System**: See `naafe-docs/THEME_SYSTEM.md`
- **Development Phases**: Follow `naafe-docs/DEVELOPMENT_ROADMAP.md`

## 🎯 Success Metrics

### User Experience
- Signup completion rate > 90%
- Request posting time < 2 minutes
- Provider response time < 1 hour
- User satisfaction > 4.5/5

### Platform Quality
- Provider verification rate > 95%
- Service completion rate > 90%
- Dispute rate < 5%
- User retention > 70%

---

**🎯 Remember: Always reference the naafe-docs/ directory for any decisions or implementations!**
