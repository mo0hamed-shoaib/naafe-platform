# 🎯 Naafe Platform - v0 Project Specification

## **Project Overview**
**Naafe** is an Arabic service marketplace platform connecting service seekers with professional providers in Egypt. Built for simplicity, trust, and accessibility.

## **Core Mission**
- Connect service seekers with verified providers
- Simplify complex service requests into step-by-step processes
- Build trust through verification, reviews, and secure payments
- Design for elderly and non-technical users

## **Target Users**
- **Service Seekers**: Homeowners needing home services (25-65+ age range)
- **Service Providers**: Skilled workers (plumbers, electricians, cleaners, etc.)
- **Platform Admins**: Multi-role admin system for platform management

## **Key Features**

### **Core Platform Features**
- Multi-role system (Seeker, Provider, Admin)
- Progressive service request forms with dynamic questions
- Provider verification system (Egypt-specific)
- Smart matching algorithm (location, skills, rating)
- Multi-provider negotiation system
- Secure payments (Stripe + manual tracking)
- Real-time chat and notifications
- Review and rating system
- Comprehensive admin dashboard

### **Egypt-Specific Adaptations**
- Full Arabic RTL interface with English support
- Local payment methods (COD, Vodafone Cash, Meeza, Fawry)
- Voice notes support for non-technical users
- Large button interface for elderly users
- Location privacy (governorate/city selection, not shared publicly)
- Bilingual support (Arabic/English) throughout the platform

## **Design System**

### **Color Palette**
- **Primary**: Deep Teal (trust, reliability)
- **Secondary**: Vibrant Orange (energy, warmth)
- **Accent**: Rich Purple (creativity, premium)
- **Success**: Green (completion, positive outcomes)
- **Warning**: Amber (attention, caution)
- **Destructive**: Red (urgency, errors)

### **Typography**
- **Arabic**: Cairo font family
- **English**: Inter font family
- **Technical**: JetBrains Mono for code/technical text
- **Accessibility**: WCAG 2.2 AA compliance
- Apply `-webkit-font-smoothing: antialiased` for better legibility
- Apply `text-rendering: optimizeLegibility` for better legibility
- Font subsetting based on Arabic/English content
- Font weight should not change on hover/selected states (prevent layout shift)
- Font weights below 400 should not be used
- Medium headings: font weight 500-600
- Use CSS clamp() for fluid typography scaling
- Apply `font-variant-numeric: tabular-nums` for tables/timers
- Prevent iOS text resizing with `-webkit-text-size-adjust: 100%`

### **UI Components**
- Use shadcn/ui components exclusively
- Large touch targets (44px minimum)
- Mobile-first responsive design
- Elderly-friendly interface
- RTL support for Arabic, LTR for English
- Language switching capability

### **Interface Best Practices**
- Clicking input labels should focus the input field
- All inputs wrapped with `<form>` for Enter key submission
- Appropriate input types (password, email, etc.)
- Disable spellcheck and autocomplete when appropriate
- Use HTML form validation with `required` attributes
- Input prefix/suffix decorations absolutely positioned with padding
- Toggles should take effect immediately (no confirmation)
- Disable buttons after submission to prevent duplicate requests
- Disable `user-select` for interactive element content
- Disable `pointer-events` on decorative elements (glows, gradients)
- No dead areas between interactive elements in lists

## **User Journey Flows**

### **Seeker Journey**
1. Sign up (default: seeker role)
2. Browse categories or post request
3. Fill progressive form (category → subcategory → description → images)
4. Set location (private, governorate/city)
5. Set urgency level
6. Receive provider recommendations
7. Browse providers or wait for responses
8. Select provider → book appointment
9. Multi-provider negotiation → select best offer
10. Service completion → payment → review

### **Provider Journey**
1. Sign up as seeker (default)
2. Click "Become a Professional"
3. Fill application form (basic info, skills, experience, portfolio)
4. Verification process (ID, portfolio review, practical test, references)
5. Admin approval → provider dashboard
6. Browse requests → make offers
7. Negotiate terms → accept jobs
8. Complete services → get paid
9. Receive reviews → build reputation

### **Admin Journey**
1. Login to admin dashboard
2. Real-time monitoring (platform activity, requests, negotiations)
3. User management (applications, reports, suspensions)
4. Issue resolution (disputes, conflicts, evidence review)
5. Content management (categories, policies, quality)
6. Analytics and reporting

## **Database Schema**

### **User Model**
```typescript
interface User {
  id: string;
  email: string;
  password: string;
  name: { first: string; last: string };
  phone: string;
  avatarUrl?: string;
  role: 'seeker' | 'provider' | 'admin';
  isVerified: boolean;
  verificationStatus: 'none' | 'basic' | 'skill' | 'approved';
  
  // Provider-specific
  providerProfile?: {
    skills: Array<{
      category: string;
      subcategory: string;
      verified: boolean;
      yearsOfExperience: number;
    }>;
    verificationDocuments: string[];
    rating: number;
    completedJobs: number;
    totalEarnings: number;
    availability: {
      workingDays: string[];
      startTime: string;
      endTime: string;
    };
    portfolio: Array<{
      title: string;
      description: string;
      images: string[];
      category: string;
    }>;
  };
  
  // Seeker-specific
  seekerProfile?: {
    totalJobsPosted: number;
    rating: number;
    preferredCategories: string[];
    location: {
      governorate: string;
      city: string;
    };
  };
  
  // Admin-specific
  adminProfile?: {
    role: 'super_admin' | 'support_admin' | 'verification_admin' | 'content_admin';
    permissions: string[];
    assignedRegions: string[];
  };
}
```

### **ServiceRequest Model**
```typescript
interface ServiceRequest {
  id: string;
  seekerId: string;
  category: string;
  subcategory: string;
  title: string;
  description: string;
  urgency: 'ASAP' | 'This week' | 'Flexible';
  
  // Private location
  location: {
    governorate: string;
    city: string;
  };
  
  images: string[];
  answers: string[]; // Dynamic questions
  status: 'active' | 'in_progress' | 'completed' | 'cancelled';
  
  // Matching and offers
  recommendedProviders: string[];
  offers: string[];
  selectedProvider?: string;
  selectedOffer?: string;
  
  createdAt: Date;
  expiresAt: Date;
  completedAt?: Date;
}
```

### **Offer Model**
```typescript
interface Offer {
  id: string;
  requestId: string;
  providerId: string;
  
  price: number;
  timeline: {
    startDate: Date;
    duration: string;
    estimatedHours: number;
  };
  scopeOfWork: string;
  materialsIncluded: string[];
  warranty: string;
  
  paymentSchedule: {
    deposit: number;
    milestone: number;
    final: number;
  };
  
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
}
```

### **Payment Model**
```typescript
interface Payment {
  id: string;
  requestId: string;
  seekerId: string;
  providerId: string;
  
  amount: number;
  platformFee: number;
  providerAmount: number;
  
  paymentMethod: 'stripe' | 'cod' | 'bank_transfer' | 'cash' | 'vodafone_cash' | 'meeza' | 'fawry';
  paymentGateway: string;
  
  transactionId?: string;
  paymentDate?: Date;
  verificationDate?: Date;
  verifiedBy?: string;
  
  status: 'pending' | 'agreed' | 'completed' | 'disputed' | 'refunded';
  createdAt: Date;
}
```

## **Business Logic**

### **Provider Verification**
- Basic: ID, phone, email (no job field required)
- Skill: Portfolio review, experience, references
- Practical: Video call or in-person demonstration
- Admin review: 24-48 hours

### **Payment System**
- Stripe integration (test mode) + manual tracking (COD, bank transfer, cash)
- Platform fee: 5-10% of service value
- Flow: Agreement → Payment → Service → Release

### **Review System**
- Categories: Overall, Quality, Communication, Timeliness, Value
- Provider rating: Average of last 50 reviews, minimum 3.0
- 24-hour window after service completion

### **Dispute Resolution**
- Categories: Quality, Payment, Behavior, Safety, Timeline
- Process: Evidence submission → Admin investigation → Fair decision

## **Technical Requirements**

### **Frontend (Next.js)**
- Next.js 15+ with App Router
- TypeScript strict mode
- shadcn/ui components exclusively
- Tailwind CSS with custom theme
- React Hook Form + Zod validation
- TanStack Query v5 for server state
- Socket.IO for real-time features
- React Server Components (RSC) for better performance

### **Backend (API Routes)**
- Next.js App Router API routes
- Supabase for database and authentication
- File upload with ImgBB or Supabase Storage
- Stripe integration (test mode)
- Edge Runtime for better performance

### **Key Pages & Components**

#### **Authentication**
- Login page with Arabic RTL
- Registration page (default seeker)
- "Become a Professional" flow
- Password reset
- Profile management

#### **Service Requests**
- Progressive request form
- Category/subcategory selection
- Dynamic questions based on category
- Image upload with instructions
- Location selection (private)
- Urgency level selection
- Request listing and filtering
- Request details page

#### **Provider Management**
- Provider application form
- Skill selection interface
- Portfolio upload system
- Verification status tracking
- Provider search and browsing
- Provider profile pages

#### **Offers & Negotiation**
- Offer creation interface
- Offer listing and comparison
- Real-time negotiation
- Counter-offer system
- Offer acceptance/rejection

#### **Payments**
- Payment method selection
- Stripe payment form
- Manual payment tracking
- Payment history
- Payment confirmation

#### **Admin Dashboard**
- Multi-role admin interface
- User management
- Verification requests
- Dispute resolution
- Platform analytics
- Content moderation

## **Accessibility & UX**

### **WCAG 2.2 AA Compliance**
- High contrast ratios
- Keyboard navigation
- Screen reader support
- Focus indicators
- Skip links
- Disabled buttons should not have tooltips (not accessible)
- Use box shadow for focus rings, not outline (respects border radius)
- Focusable elements navigable with ↑ ↓ arrows
- Focusable elements deletable with ⌘ Backspace
- Dropdown menus trigger on `mousedown`, not `click` for immediate opening
- SVG favicon with system theme support (`prefers-color-scheme`)
- Icon-only elements must have explicit `aria-label`
- Tooltips triggered by hover should not contain interactive content
- Images always rendered with `<img>` for screen readers
- HTML illustrations must have explicit `aria-label`
- Gradient text should unset gradient on `::selection` state

### **Mobile-First Design**
- Large touch targets (44px minimum)
- Responsive typography
- Touch-friendly interfaces
- Fast loading times
- Hover states not visible on touch press (`@media (hover: hover)`)
- Input font size minimum 16px to prevent iOS zoom
- No auto-focus on touch devices (prevents keyboard covering screen)
- Apply `muted` and `playsinline` to video tags for iOS autoplay
- Disable `touch-action` for custom pan/zoom components
- Disable iOS tap highlight with `-webkit-tap-highlight-color: rgba(0,0,0,0)`

### **Egypt-Specific UX**
- Bilingual interface (Arabic RTL / English LTR)
- Language switching with persistent preference
- Familiar payment methods
- Voice notes support
- Elderly-friendly design
- Location privacy

## **Success Metrics**
- Signup completion rate > 90%
- Request posting time < 2 minutes
- Provider response time < 1 hour
- User satisfaction > 4.5/5

## **Development Phases**

### **Phase 1: Core Foundation**
- Project setup with Next.js
- Authentication system
- Basic UI components
- Database setup

### **Phase 2: User Management**
- User registration and roles
- Provider application system
- Provider verification

### **Phase 3: Service Requests**
- Progressive request forms
- Request management
- Smart matching system

### **Phase 4: Offers & Negotiation**
- Offer management
- Negotiation system
- Communication system

### **Phase 5: Payment System**
- Stripe integration
- Manual payment tracking
- Payment management

## **Environment Variables**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Payments
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# File Upload
IMGBB_API_KEY=
```

## **Key Implementation Notes**

### **For v0 Development**
- Use Next.js 15+ App Router structure with React Server Components
- Implement shadcn/ui components for all UI elements
- Focus on bilingual support (Arabic RTL / English LTR) from the start
- Build mobile-first responsive design
- Implement proper TypeScript types with strict mode
- Use React Hook Form + Zod for form validation
- Implement proper error handling and loading states
- Focus on accessibility and elderly-friendly design
- Use the specified color palette and typography
- Implement Egypt-specific features (local payments, voice notes, etc.)
- Use Supabase for database and authentication
- Implement language switching with persistent user preference
- Use Edge Runtime for better performance
- Implement proper SEO with Next.js metadata API

### **Performance & Animation Guidelines**
- Animation duration maximum 200ms for immediate feel
- Proportional animation values (scale from ~0.8, not 0→1)
- Avoid extraneous animations for frequent actions
- Pause looping animations when not visible
- Use `scroll-behavior: smooth` for in-page navigation
- Optimistically update data locally, rollback on server error
- Server-side authentication redirects (avoid janky URL changes)
- Style document selection with `::selection`
- Display feedback relative to trigger (inline checkmarks, highlighted inputs)
- Empty states should prompt to create new items with templates
- Use `loading="lazy"` for images below the fold
- Implement proper error boundaries for graceful failure handling

### **Priority Features**
1. Authentication system with role-based access
2. Progressive service request forms
3. Provider application and verification
4. Basic matching and offer system
5. Payment integration (Stripe test mode)
6. Admin dashboard for platform management
7. Real-time chat and notifications
8. Review and rating system

This specification provides all necessary context for v0 to build a comprehensive, Egypt-specific service marketplace platform with proper Arabic support, accessibility, and local market adaptations.
