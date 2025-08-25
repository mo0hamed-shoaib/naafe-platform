# 💼 Naafe Business Logic & Rules

## **🎯 Core Business Principles**

### **User Experience Philosophy**
- **Simplicity First**: Everything must be intuitive for non-tech users
- **Privacy & Safety**: Never share location publicly, protect user data
- **Logical Flow**: Every action must have a clear, practical purpose
- **Fast Service**: Minimize steps, maximize efficiency
- **Trust Building**: Verification, reviews, escrow for safety
- **Age-Friendly**: Consider elderly users (large buttons, clear text)

### **Egypt-Specific Adaptations**
- **No formal certifications**: Focus on practical experience and portfolio
- **ID verification only**: Don't require job field in ID
- **Portfolio-based assessment**: Photos/videos of previous work
- **Reference checks**: Previous client testimonials
- **Practical demonstration**: Video call or in-person skill test
- **Traditional learning paths**: Apprenticeship, family business, self-taught

---

## **👥 User Roles & Permissions**

### **Service Seeker (Default Role)**
**Capabilities:**
- Create and manage service requests
- Browse and select providers
- Negotiate with multiple providers
- Make payments and leave reviews
- Manage profile and preferences

**Restrictions:**
- Cannot apply for provider verification
- Cannot access provider-specific features
- Cannot view other users' private information

### **Service Provider (Verified Role)**
**Capabilities:**
- Browse and respond to service requests
- Create and manage offers
- Negotiate with seekers
- Manage availability and portfolio
- Receive payments and build reputation

**Requirements:**
- Must complete verification process
- Must maintain minimum rating (3.0+)
- Must respond to requests within 24 hours
- Must complete jobs within agreed timeline

### **Platform Administrator**
**Roles:**
- **Super Admin**: Full platform access and configuration
- **Support Admin**: User support and dispute resolution
- **Verification Admin**: Provider verification and background checks
- **Content Admin**: Content moderation and category management

**Capabilities:**
- Manage all users and content
- Resolve disputes and conflicts
- Monitor platform activity
- Generate reports and analytics
- Configure platform settings

---

## **🔄 Service Request Flow**

### **Request Creation Process**
```
1. Category Selection
   - Choose main service category
   - Select specific subcategory
   - View category description and requirements

2. Request Details
   - Write detailed description of needed service
   - Upload relevant photos (optional but recommended)
   - Answer category-specific questions
   - Set urgency level (ASAP, This week, Flexible)

3. Location & Privacy
   - Select governorate and city (private, not shared publicly)
   - Location used only for provider matching
   - No public location display on request cards

4. Submission & Matching
   - Submit request with validation
   - Instant provider recommendations (top 3)
   - Request visible to all matching providers
   - Estimated response time displayed
```

### **Provider Matching Algorithm**
**Factors Considered:**
- **Location**: Providers in same governorate/city
- **Skills**: Providers with matching category/subcategory
- **Rating**: Higher-rated providers prioritized
- **Availability**: Providers available within request timeline
- **Response Rate**: Providers with good response history
- **Completion Rate**: Providers with high job completion rate

**Matching Score Calculation:**
```
Score = (Location Weight × 0.3) + 
        (Skills Weight × 0.25) + 
        (Rating Weight × 0.2) + 
        (Availability Weight × 0.15) + 
        (Response Rate Weight × 0.1)
```

---

## **💰 Payment & Pricing System**

### **Payment Methods**
**Primary (Stripe Integration):**
- Credit/Debit cards (Visa, Mastercard, American Express)
- Automatic processing and verification
- Secure payment gateway with fraud protection

**Manual Tracking (No Fees):**
- Cash on Delivery (COD)
- Bank Transfer
- Cash Payment
- Digital wallet screenshots (Vodafone Cash, Meeza, Fawry)

### **Platform Fee Structure**
**Service Fee:**
- **5-10%** of service value (based on category)
- Deducted automatically from provider earnings
- Transparent fee display before payment

**Payment Processing:**
- **Stripe**: 2.9% + 30¢ per transaction
- **Manual Methods**: No additional fees
- **Platform covers**: Manual verification costs

### **Payment Flow**
```
1. Agreement Phase
   - Seeker and provider agree on terms
   - Platform calculates total cost and fees
   - Payment method selected

2. Payment Processing
   - Stripe: Automatic processing
   - Manual: Admin verification required
   - Payment confirmation sent to both parties

3. Service Completion
   - Provider completes work
   - Seeker confirms completion
   - Payment released to provider
   - Platform fee deducted
```

---

## **⭐ Review & Rating System**

### **Review Process**
**After Service Completion:**
- Seeker receives review request (24 hours)
- Provider receives review request (24 hours)
- Both parties can rate and review each other
- Reviews are public and permanent

**Review Categories:**
- **Overall Rating**: 1-5 stars
- **Quality**: Work quality and craftsmanship
- **Communication**: Responsiveness and clarity
- **Timeliness**: Punctuality and deadline adherence
- **Value**: Price-to-quality ratio

### **Rating Calculation**
**Provider Rating:**
```
Overall Rating = (Quality + Communication + Timeliness + Value) / 4
Display Rating = Average of last 50 reviews
Minimum Rating = 3.0 for active provider status
```

**Seeker Rating:**
```
Overall Rating = Average of provider reviews
Used for provider matching preferences
Affects provider response priority
```

---

## **🛡️ Verification & Trust System**

### **Provider Verification Levels**

#### **Basic Verification**
- **ID Card**: Name, photo, address verification
- **Phone Number**: SMS verification
- **Email**: Email verification
- **No job field requirement** in ID

#### **Skill Verification**
- **Portfolio Review**: Photos/videos of previous work
- **Experience Description**: Years, learning method, expertise
- **Reference Checks**: Previous client testimonials
- **Practical Assessment**: Video call or in-person demonstration

#### **Category-Specific Verification**
- **Tool Verification**: Photos of professional tools
- **Safety Knowledge**: Basic safety questions
- **Work Quality**: Before/after photo samples
- **Client Testimonials**: Verified client feedback

### **Verification Process**
```
1. Application Submission
   - Complete application form
   - Upload required documents
   - Submit portfolio samples

2. Admin Review
   - Document verification (24-48 hours)
   - Portfolio assessment (24-48 hours)
   - Reference verification (24-48 hours)

3. Approval/Rejection
   - Approved: Provider status activated
   - Rejected: Detailed feedback provided
   - Appeal process available
```

---

## **⚖️ Dispute Resolution System**

### **Dispute Categories**
- **Quality Issues**: Poor work quality or incomplete work
- **Payment Disputes**: Payment method or amount conflicts
- **Behavior Issues**: Unprofessional conduct or communication
- **Safety Concerns**: Unsafe practices or conditions
- **Timeline Violations**: Delays or missed deadlines

### **Resolution Process**
```
1. Dispute Filing
   - User files dispute with evidence
   - Photos, videos, chat logs required
   - Detailed description of issue

2. Admin Investigation
   - Review all evidence and communications
   - Contact involved parties if needed
   - Check user history and patterns

3. Decision & Action
   - Fair decision based on evidence
   - Appropriate compensation or penalty
   - Appeal process for both parties
```

### **Compensation Rules**
**Quality Issues:**
- Partial refund based on work completed
- Provider gets partial payment
- Platform covers quality guarantee

**Payment Disputes:**
- Full refund to seeker
- Provider penalty based on severity
- Platform mediates fair resolution

**Timeline Violations:**
- Provider penalty (20-50% of earnings)
- Seeker compensation for inconvenience
- Platform finds replacement if needed

---

## **🚫 Cancellation & Penalty System**

### **Cancellation Timeline & Penalties**

#### **Before Provider Arrival (0-2 hours before)**
```
Seeker Cancellation:
- ✅ Full refund to seeker
- ✅ No penalty to seeker
- ✅ Provider gets 10% compensation (platform covers)
- ✅ Platform finds replacement provider automatically

Provider Cancellation:
- ❌ 20% penalty from provider's future earnings
- ✅ Seeker gets full refund
- ✅ Platform finds replacement provider within 1 hour
- ✅ Provider gets warning (3 warnings = suspension)
```

#### **After Provider Arrival (0-30 minutes)**
```
Seeker Cancellation:
- ❌ 15% cancellation fee (seeker pays)
- ✅ Provider gets 25% compensation
- ✅ Platform finds replacement provider

Provider Cancellation:
- ❌ 30% penalty from provider's future earnings
- ✅ Seeker gets full refund + 10% compensation
- ✅ Platform finds replacement provider within 30 minutes
- ✅ Provider gets immediate suspension (7 days)
```

#### **After Work Started (30+ minutes)**
```
Seeker Cancellation:
- ❌ 50% cancellation fee (seeker pays)
- ✅ Provider gets 50% compensation
- ✅ Platform mediates for partial completion

Provider Cancellation:
- ❌ 50% penalty from provider's future earnings
- ✅ Seeker gets full refund + 20% compensation
- ✅ Platform finds emergency replacement
- ✅ Provider gets immediate suspension (30 days)
```

### **Emergency Cancellations**
**Valid Emergency Reasons (No Penalty):**
- Medical emergency (with proof)
- Family emergency (with proof)
- Natural disaster
- Government restrictions

**Process:**
- Submit emergency proof within 24 hours
- Platform verifies within 48 hours
- No penalties if verified
- Full refund to seeker
- Platform finds replacement

---

## **📊 Quality Assurance & Metrics**

### **Platform Quality Metrics**
- **Provider Verification Rate**: > 95%
- **Service Completion Rate**: > 90%
- **User Satisfaction**: > 4.5/5
- **Response Time**: < 1 hour average
- **Dispute Rate**: < 5%
- **User Retention**: > 70%

### **Provider Performance Standards**
- **Minimum Rating**: 3.0/5.0
- **Response Time**: < 24 hours
- **Completion Rate**: > 85%
- **Cancellation Rate**: < 10%
- **Review Response**: > 80%

### **Seeker Behavior Standards**
- **Request Clarity**: Detailed descriptions required
- **Response Time**: < 48 hours to provider messages
- **Payment Compliance**: On-time payment required
- **Review Participation**: > 60% review submission rate

---

## **🔔 Notification & Communication System**

### **Notification Types**
**User Notifications:**
- New request alerts (providers)
- Offer received (seekers)
- Payment confirmations
- Cancellation alerts
- Review reminders
- Verification status updates

**System Notifications:**
- Platform updates
- Policy changes
- Maintenance alerts
- Security notifications
- Feature announcements

**Admin Notifications:**
- High-priority disputes
- System alerts
- User reports
- Verification requests
- Financial alerts

### **Communication Channels**
**In-App:**
- Real-time notifications
- Chat system
- Status updates
- Alert center

**External:**
- Email notifications
- WhatsApp messages
- SMS alerts (future)
- Push notifications

---

## **📈 Analytics & Reporting**

### **Platform Analytics**
**User Metrics:**
- User registration and activation rates
- Request posting and completion rates
- Provider application and approval rates
- User retention and engagement

**Financial Metrics:**
- Total transaction volume
- Platform fee revenue
- Payment method distribution
- Refund and dispute rates

**Quality Metrics:**
- Average ratings and reviews
- Response times and completion rates
- Dispute resolution times
- User satisfaction scores

### **Business Intelligence**
**Market Insights:**
- Popular service categories
- Seasonal demand patterns
- Pricing trends and analysis
- Geographic service distribution

**Operational Insights:**
- Peak usage times
- System performance metrics
- Support ticket analysis
- Platform optimization opportunities

---

This business logic provides the foundation for all platform operations, ensuring fair, transparent, and efficient service delivery while maintaining high quality standards and user satisfaction.
