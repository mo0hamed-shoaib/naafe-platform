# 🏗️ Naafe Technical Architecture

## **🎯 Technology Stack**

### **Frontend**
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: React Context API + TanStack Query
- **Styling**: Tailwind CSS with custom Arabic RTL support
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Theme**: Custom theme system with light/dark mode support

### **Backend**
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **File Upload**: ImgBB API integration
- **Real-time**: Socket.IO for notifications and chat
- **Validation**: express-validator
- **Payment**: Stripe integration (test mode for MVP)

### **Infrastructure**
- **Hosting**: Vercel (frontend) / Railway (backend)
- **Database**: MongoDB Atlas
- **File Storage**: ImgBB cloud storage
- **Email**: Gmail SMTP
- **Notifications**: WhatsApp Business API
- **Monitoring**: Custom analytics and error tracking

---

## **🗄️ Database Schema**

### **User Model**
```javascript
{
  _id: ObjectId,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true }
  },
  phone: { type: String, required: true },
  avatarUrl: String,
  role: { type: String, default: 'seeker', enum: ['seeker', 'provider', 'admin'] },
  isVerified: { type: Boolean, default: false },
  verificationStatus: { type: String, default: 'none', enum: ['none', 'basic', 'skill', 'approved'] },
  
  // Provider-specific fields
  providerProfile: {
    skills: [{
      category: String,
      subcategory: String,
      verified: Boolean,
      yearsOfExperience: Number
    }],
    verificationDocuments: [String],
    rating: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    availability: {
      workingDays: [String],
      startTime: String,
      endTime: String
    },
    portfolio: [{
      title: String,
      description: String,
      images: [String],
      category: String
    }]
  },
  
  // Seeker-specific fields
  seekerProfile: {
    totalJobsPosted: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    preferredCategories: [String],
    location: {
      governorate: String,
      city: String
    }
  },
  
  // Admin-specific fields
  adminProfile: {
    role: { type: String, enum: ['super_admin', 'support_admin', 'verification_admin', 'content_admin'] },
    permissions: [String],
    assignedRegions: [String]
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: Date,
  isActive: { type: Boolean, default: true }
}
```

### **ServiceRequest Model**
```javascript
{
  _id: ObjectId,
  seekerId: { type: ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  urgency: { type: String, enum: ['ASAP', 'This week', 'Flexible'], required: true },
  
  // Private location (not shared publicly)
  location: {
    governorate: { type: String, required: true },
    city: { type: String, required: true }
  },
  
  images: [String], // ImgBB URLs
  answers: [String], // Dynamic questions based on category
  status: { type: String, enum: ['active', 'in_progress', 'completed', 'cancelled'], default: 'active' },
  
  // Matching and offers
  recommendedProviders: [ObjectId], // Provider IDs
  offers: [ObjectId], // Offer IDs
  selectedProvider: ObjectId,
  selectedOffer: ObjectId,
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  completedAt: Date
}
```

### **Offer Model**
```javascript
{
  _id: ObjectId,
  requestId: { type: ObjectId, ref: 'ServiceRequest', required: true },
  providerId: { type: ObjectId, ref: 'User', required: true },
  
  // Offer details
  price: { type: Number, required: true },
  timeline: {
    startDate: Date,
    duration: String,
    estimatedHours: Number
  },
  scopeOfWork: { type: String, required: true },
  materialsIncluded: [String],
  warranty: String,
  
  // Payment terms
  paymentSchedule: {
    deposit: { type: Number, default: 0 },
    milestone: { type: Number, default: 0 },
    final: { type: Number, required: true }
  },
  
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'expired'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  acceptedAt: Date
}
```

### **Payment Model**
```javascript
{
  _id: ObjectId,
  requestId: { type: ObjectId, ref: 'ServiceRequest', required: true },
  seekerId: { type: ObjectId, ref: 'User', required: true },
  providerId: { type: ObjectId, ref: 'User', required: true },
  
  // Payment details
  amount: { type: Number, required: true },
  platformFee: { type: Number, required: true },
  providerAmount: { type: Number, required: true },
  
  // Payment method
  paymentMethod: { 
    type: String, 
    enum: ['stripe', 'cod', 'bank_transfer', 'cash', 'vodafone_cash', 'meeza', 'fawry'],
    required: true 
  },
  paymentGateway: String, // 'stripe', 'manual', etc.
  
  // Transaction details
  transactionId: String, // Gateway transaction ID
  paymentDate: Date,
  verificationDate: Date, // For manual payments
  verifiedBy: ObjectId, // Admin who verified manual payment
  
  status: { 
    type: String, 
    enum: ['pending', 'agreed', 'completed', 'disputed', 'refunded'],
    default: 'pending'
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### **Review Model**
```javascript
{
  _id: ObjectId,
  requestId: { type: ObjectId, ref: 'ServiceRequest', required: true },
  seekerId: { type: ObjectId, ref: 'User', required: true },
  providerId: { type: ObjectId, ref: 'User', required: true },
  
  // Review details
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  photos: [String], // ImgBB URLs
  
  // Review categories
  categories: {
    quality: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    timeliness: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 }
  },
  
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

### **Category Model**
```javascript
{
  _id: ObjectId,
  name: { type: String, required: true },
  nameAr: { type: String, required: true }, // Arabic name
  description: String,
  descriptionAr: String, // Arabic description
  icon: String, // Icon identifier
  isActive: { type: Boolean, default: true },
  
  subcategories: [{
    name: { type: String, required: true },
    nameAr: { type: String, required: true },
    description: String,
    descriptionAr: String,
    icon: String,
    isActive: { type: Boolean, default: true },
    
    // Verification requirements
    verificationRequirements: {
      portfolioRequired: { type: Boolean, default: true },
      practicalTestRequired: { type: Boolean, default: false },
      referencesRequired: { type: Boolean, default: true },
      minimumExperience: { type: Number, default: 1 } // years
    },
    
    // Dynamic questions for requests
    questions: [{
      question: String,
      questionAr: String,
      type: { type: String, enum: ['text', 'number', 'select', 'checkbox'] },
      options: [String], // For select/checkbox types
      required: { type: Boolean, default: false }
    }]
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

---

## **🔌 API Architecture**

### **RESTful API Endpoints**

#### **Authentication & User Management**
```
POST   /api/auth/signup              # User registration (default: seeker)
POST   /api/auth/login               # User login
POST   /api/auth/logout              # User logout
POST   /api/auth/refresh             # Refresh JWT token
POST   /api/auth/forgot-password     # Password reset request
POST   /api/auth/reset-password      # Password reset
GET    /api/auth/me                  # Get current user
PUT    /api/auth/profile             # Update user profile
POST   /api/auth/avatar              # Upload avatar
```

#### **Provider Management**
```
POST   /api/providers/apply          # Provider application
GET    /api/providers/verification   # Verification status
PUT    /api/providers/profile        # Update provider profile
GET    /api/providers/:id/profile    # Get provider public profile
POST   /api/providers/portfolio      # Upload portfolio items
GET    /api/providers/search         # Search providers
```

#### **Service Requests**
```
POST   /api/requests                 # Create service request
GET    /api/requests                 # List requests (with filters)
GET    /api/requests/:id             # Get request details
PUT    /api/requests/:id             # Update request
DELETE /api/requests/:id             # Cancel request
GET    /api/requests/:id/recommendations # Get provider recommendations
POST   /api/requests/:id/offers      # Make offer on request
```

#### **Offers & Negotiation**
```
POST   /api/offers                   # Create offer
GET    /api/offers/request/:id       # Get offers for request
PUT    /api/offers/:id               # Update offer
DELETE /api/offers/:id               # Cancel offer
POST   /api/offers/:id/accept        # Accept offer
POST   /api/offers/:id/reject        # Reject offer
```

#### **Payments**
```
POST   /api/payments/process         # Process payment (Stripe)
POST   /api/payments/track           # Track manual payment
PUT    /api/payments/:id/complete    # Mark payment complete
PUT    /api/payments/:id/verify      # Verify manual payment (admin)
POST   /api/payments/:id/refund      # Process refund
GET    /api/payments/history         # Payment history
```

#### **Reviews & Feedback**
```
POST   /api/reviews                  # Create review
GET    /api/reviews/provider/:id     # Get provider reviews
PUT    /api/reviews/:id              # Update review
DELETE /api/reviews/:id              # Delete review
POST   /api/feedback                 # Submit feedback
POST   /api/feedback/whatsapp        # WhatsApp feedback webhook
```

#### **Admin System**
```
GET    /api/admin/dashboard          # Admin dashboard data
GET    /api/admin/users              # User management
PUT    /api/admin/users/:id/status   # Update user status
GET    /api/admin/verifications      # Verification requests
PUT    /api/admin/verifications/:id  # Approve/reject verification
GET    /api/admin/disputes           # Dispute management
PUT    /api/admin/disputes/:id       # Resolve dispute
GET    /api/admin/analytics          # Platform analytics
POST   /api/admin/notifications      # Send bulk notifications
```

#### **File Upload**
```
POST   /api/upload/image             # Upload image to ImgBB
POST   /api/upload/document          # Upload verification document
DELETE /api/upload/:id               # Delete uploaded file
```

### **Real-time Events (Socket.IO)**

#### **Server Events**
```javascript
// User events
'socket:user:connect'           // User connects to platform
'socket:user:disconnect'        // User disconnects

// Request events
'socket:request:new'            // New service request posted
'socket:request:updated'        // Request status updated
'socket:request:cancelled'      // Request cancelled

// Offer events
'socket:offer:received'         // Provider receives new offer
'socket:offer:updated'          // Offer status updated
'socket:offer:accepted'         // Offer accepted
'socket:offer:rejected'         // Offer rejected

// Payment events
'socket:payment:status'         // Payment status update
'socket:payment:completed'      // Payment completed
'socket:payment:failed'         // Payment failed

// Chat events
'socket:chat:message'           // New chat message
'socket:chat:typing'            // User typing indicator
'socket:chat:read'              // Message read receipt

// Notification events
'socket:notification:new'       // New notification
'socket:notification:read'      // Notification read

// Admin events
'socket:admin:alert'            // Admin system alert
'socket:admin:dispute'          // New dispute notification
```

#### **Client Events**
```javascript
// User events
'socket:user:status'            // Update user status
'socket:user:location'          // Update user location

// Request events
'socket:request:subscribe'      // Subscribe to request updates
'socket:request:unsubscribe'    // Unsubscribe from request updates

// Chat events
'socket:chat:join'              // Join chat room
'socket:chat:leave'             // Leave chat room
'socket:chat:message'           // Send chat message
'socket:chat:typing'            // Send typing indicator

// Notification events
'socket:notification:read'      // Mark notification as read
'socket:notification:preferences' // Update notification preferences
```

---

## **🔐 Security Architecture**

### **Authentication & Authorization**
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access**: Different permissions for seekers, providers, admins
- **Token Refresh**: Automatic token refresh mechanism
- **Session Management**: Secure session handling

### **Data Protection**
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries with Mongoose
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: CSRF tokens for state-changing operations

### **Privacy & Compliance**
- **Location Privacy**: Private location handling
- **Data Encryption**: Encrypted data transmission (HTTPS)
- **GDPR Compliance**: User data rights and deletion
- **Audit Logging**: Comprehensive activity logging

---

## **📱 Frontend Architecture**

### **Component Structure**
```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/               # Layout components
│   ├── auth/                 # Authentication components
│   ├── requests/             # Service request components
│   ├── providers/            # Provider components
│   ├── offers/               # Offer components
│   ├── payments/             # Payment components
│   ├── reviews/              # Review components
│   ├── admin/                # Admin components
│   └── common/               # Shared components
├── pages/                    # Page components
├── hooks/                    # Custom React hooks
├── contexts/                 # React contexts
├── services/                 # API services
├── types/                    # TypeScript definitions
├── utils/                    # Utility functions
└── styles/                   # Global styles
```

### **State Management**
- **React Context**: Global state (auth, theme, notifications)
- **TanStack Query**: Server state management
- **Local State**: Component-specific state
- **Form State**: React Hook Form for form management

### **Routing Structure**
```
/                           # Landing page
/auth/
  /login                    # Login page
  /register                 # Registration page
  /forgot-password          # Password reset
/dashboard/
  /seeker                   # Seeker dashboard
  /provider                 # Provider dashboard
  /admin                    # Admin dashboard
/requests/
  /create                   # Create request
  /:id                      # Request details
  /my-requests              # User's requests
/providers/
  /:id                      # Provider profile
  /search                   # Provider search
/offers/
  /:id                      # Offer details
  /my-offers                # User's offers
/payments/
  /history                  # Payment history
  /:id                      # Payment details
/reviews/
  /create                   # Create review
  /:id                      # Review details
/admin/
  /users                    # User management
  /verifications            # Verification management
  /disputes                 # Dispute management
  /analytics                # Analytics dashboard
```

---

## **🚀 Deployment Architecture**

### **Environment Configuration**
```bash
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_IMGBB_API_KEY=...
VITE_WHATSAPP_API_KEY=...

# Backend Environment Variables
PORT=5000
MONGODB_URI=mongodb://localhost:27017/naafe
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
IMGBB_API_KEY=...
WHATSAPP_API_KEY=...
GMAIL_USER=...
GMAIL_PASS=...
NODE_ENV=development
```

### **Production Deployment**
- **Frontend**: Vercel with automatic deployments
- **Backend**: Railway with MongoDB Atlas
- **Database**: MongoDB Atlas with automated backups
- **CDN**: Vercel Edge Network for static assets
- **Monitoring**: Custom error tracking and analytics

---

## **📊 Performance Optimization**

### **Frontend Optimization**
- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Dynamic imports for heavy components
- **Image Optimization**: Next.js Image component with ImgBB
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Service worker for offline support

### **Backend Optimization**
- **Database Indexing**: Optimized MongoDB indexes
- **Query Optimization**: Efficient Mongoose queries
- **Caching**: Redis for session and data caching
- **Rate Limiting**: API rate limiting for security
- **Compression**: Gzip compression for responses

---

This technical architecture provides a comprehensive foundation for building the Naafe platform with modern technologies, security best practices, and scalability in mind.
