# Naafe - Service Marketplace Platform

<div align="center">
  <h3>Connecting Service Seekers with Trusted Providers</h3>
  <p>A modern, full-stack service marketplace platform with chat-first negotiation, secure escrow payments, and comprehensive service management.</p>
</div>

## 🎯 Overview

Naafe is a comprehensive service marketplace platform that revolutionizes how people find and book services. Built with a chat-first approach, it enables safe, transparent interactions between service seekers and providers through real-time negotiation, secure escrow payments, and comprehensive service management.

### Key Features

- **🔍 Smart Service Discovery** - Advanced search and filtering for service categories and providers
- **💬 Chat-First Negotiation** - Real-time messaging with built-in negotiation tools
- **🔒 Secure Escrow System** - Safe payment processing with automatic fund release
- **⭐ Trust & Safety** - Comprehensive rating system and provider verification
- **📱 Modern UI/UX** - Responsive design with intuitive user experience
- **🤖 AI Integration** - Intelligent matching and automated assistance

## 🏗️ Architecture

This is a full-stack monorepo containing:

```
naafe-platform/
├── backend/          # Node.js/Express API server
├── frontend/         # React/TypeScript web application
├── uploads/          # Shared file storage
└── categories.json   # Service categories configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **MongoDB** (local or cloud instance)
- **Stripe Account** (for payments)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd naafe-platform
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file with required variables
cp .env.example .env
# Edit .env with your configuration

npm run dev
```

**Required Environment Variables:**
```env
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 💼 Business Flow

### Chat-First Service Booking

1. **Service Request** - Seekers post detailed job requests
2. **Provider Response** - Providers make offers with initial terms
3. **Real-time Negotiation** - Both parties negotiate through integrated chat
4. **Agreement Confirmation** - Terms are confirmed by both parties
5. **Secure Payment** - Payment goes to escrow for protection
6. **Service Delivery** - Provider completes the service
7. **Fund Release** - Payment is released upon completion

### Offer Status Flow

```
PENDING → NEGOTIATING → AGREEMENT_REACHED → ACCEPTED → IN_PROGRESS → COMPLETED
                                                                   ↘ CANCELLED
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.IO** - Real-time communication
- **Stripe** - Payment processing

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **DaisyUI** - Component library
- **React Router** - Client-side routing
- **Vite** - Build tool

## 📁 Project Structure

### Backend (`/backend`)
```
├── controllers/     # API route handlers
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── middlewares/    # Authentication & validation
├── config/         # Configuration files
└── tests/          # Test suites
```

### Frontend (`/frontend`)
```
├── src/
│   ├── components/ # Reusable UI components
│   ├── pages/      # Page components
│   ├── hooks/      # Custom React hooks
│   ├── services/   # API integration
│   ├── types/      # TypeScript definitions
│   └── utils/      # Utility functions
├── public/         # Static assets
└── docs/           # Documentation
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon
npm test            # Run test suite
npm run lint        # Code linting
```

### Frontend Development
```bash
cd frontend
npm run dev         # Start development server
npm run build       # Production build
npm run preview     # Preview production build
npm run lint        # Code linting
```

## 📚 Documentation

### Detailed Documentation
- **[Backend API Documentation](./backend/README.md)** - Complete backend setup and API reference
- **[Frontend Documentation](./frontend/README.md)** - Frontend architecture and components
- **[API Routes Documentation](./backend/OFFER_ROUTES_DOCUMENTATION.md)** - Detailed API endpoints
- **[Chat System Documentation](./backend/CHAT_SYSTEM_README.md)** - Real-time messaging system
- **[AI Integration Guide](./backend/AI_INTEGRATION_README.md)** - AI features and setup

### Key Features Documentation
- **Authentication & Authorization** - User management and security
- **Payment Processing** - Stripe integration and escrow system
- **Real-time Chat** - Socket.IO implementation
- **Service Categories** - Dynamic category management
- **Provider Verification** - Trust and safety features

## 🚀 Deployment

### Backend Deployment
- **Railway** (recommended) - See `railway.json` configuration
- **Heroku** - Standard Node.js deployment
- **DigitalOcean** - VPS deployment
- **AWS/GCP** - Cloud platform deployment

### Frontend Deployment
- **Vercel** (recommended) - Zero-config deployment
- **Netlify** - Static site hosting
- **GitHub Pages** - Free hosting option

## 🔒 Security Features

- **JWT Authentication** - Secure user sessions
- **Input Validation** - Comprehensive data validation
- **Rate Limiting** - API protection
- **CORS Configuration** - Cross-origin security
- **File Upload Security** - Safe file handling
- **Payment Security** - PCI-compliant payment processing

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                    # Run all tests
npm run test:auth          # Authentication tests
npm run test:offers        # Offer system tests
npm run test:payments      # Payment tests
```

### Frontend Tests
```bash
cd frontend
npm test                   # Run component tests
npm run test:coverage      # Coverage report
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation** - Check the detailed docs in each directory
- **Issues** - Create an issue for bugs or feature requests
- **Discussions** - Use GitHub Discussions for questions

### Common Issues
- **Database Connection** - Ensure MongoDB is running and accessible
- **Payment Setup** - Verify Stripe keys and webhook configuration
- **CORS Issues** - Check frontend URL configuration in backend

## 🎨 Design System

### Brand Colors
- **Deep Teal** (`#2D5D4F`) - Primary brand color
- **Warm Cream** (`#F5E6D3`) - Background color  
- **Bright Orange** (`#F5A623`) - Accent color
- **Light Cream** (`#FDF8F0`) - Secondary background

### Typography
- **Plus Jakarta Sans** - Primary font family
- **Responsive scaling** - Mobile-first approach

---

<div align="center">
  <p><strong>Built with ❤️ for connecting people through services</strong></p>
  <p>React • TypeScript • Node.js • MongoDB • Stripe</p>
</div>
