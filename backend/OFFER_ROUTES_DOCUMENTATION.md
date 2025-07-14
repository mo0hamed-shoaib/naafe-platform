# Offer Routes Documentation

This document provides comprehensive documentation for the refactored offer routes in the Naafe' platform.

## Base URL
All offer routes are prefixed with `/api/offer`

## Authentication
All routes require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Route Overview

| Method | Path | Description | Access |
|--------|------|-------------|--------|
| POST | `/api/offer/requests/:jobRequestId` | Create an offer for a job request | Providers only |
| GET | `/api/offer/requests/:jobRequestId` | Get all offers for a job request | Any authenticated user |
| GET | `/api/offer` | Get own offers | Providers only |
| GET | `/api/offer/:offerId` | Get specific offer by ID | Offer owner, job request owner, or admin |
| PATCH | `/api/offer/:offerId` | Update an offer | Offer owner only |
| DELETE | `/api/offer/:offerId` | Delete/withdraw an offer | Offer owner only |
| POST | `/api/offer/:offerId/accept` | Accept an offer | Job request owner only |
| POST | `/api/offer/:offerId/reject` | Reject an offer | Job request owner only |

---

## Detailed Route Documentation

### 1. Create Offer

**Route:** `POST /api/offer/requests/:jobRequestId`

**Description:** Create a new offer for a specific job request

**Access:** Providers only

**Parameters:**
- `jobRequestId` (string, required): ID of the job request

**Request Body:**
```json
{
  "price": {
    "amount": 2500,
    "currency": "EGP"
  },
  "message": "I can complete this job efficiently and on time",
  "estimatedTimeDays": 3
}
```

**Validation Rules:**
- `price.amount`: Must be a positive number
- `price.currency`: Must be one of: EGP, USD, EUR
- `message`: Optional, max 1000 characters
- `estimatedTimeDays`: Optional, minimum 1 day

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "offer_id",
    "jobRequest": "job_request_id",
    "provider": {
      "_id": "provider_id",
      "name": {
        "first": "John",
        "last": "Provider"
      },
      "email": "provider@example.com",
      "phone": "01012345678"
    },
    "price": {
      "amount": 2500,
      "currency": "EGP"
    },
    "message": "I can complete this job efficiently and on time",
    "estimatedTimeDays": 3,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Offer created successfully"
}
```

**Error Cases:**
- Job request not found
- Job request is not open
- Provider already made an offer on this job
- Price outside budget range
- Invalid validation data

---

### 2. Get Offers by Job Request

**Route:** `GET /api/offer/requests/:jobRequestId`

**Description:** Get all offers for a specific job request

**Access:** Any authenticated user

**Parameters:**
- `jobRequestId` (string, required): ID of the job request

**Query Parameters:**
- `status` (optional): Filter by offer status (pending, accepted, rejected, withdrawn)

**Response:**
```json
{
  "success": true,
  "data": {
    "offers": [
      {
        "_id": "offer_id",
        "provider": {
          "_id": "provider_id",
          "name": {
            "first": "John",
            "last": "Provider"
          },
          "email": "provider@example.com",
          "phone": "01012345678",
          "rating": 4.5,
          "reviewCount": 10
        },
        "price": {
          "amount": 2500,
          "currency": "EGP"
        },
        "message": "I can complete this job efficiently and on time",
        "estimatedTimeDays": 3,
        "status": "pending",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalCount": 1
  },
  "message": "Offers retrieved successfully"
}
```

---

### 3. Get Own Offers

**Route:** `GET /api/offer`

**Description:** Get all offers created by the authenticated provider

**Access:** Providers only

**Query Parameters:**
- `status` (optional): Filter by offer status
- `jobRequest` (optional): Filter by job request ID

**Response:**
```json
{
  "success": true,
  "data": {
    "offers": [
      {
        "_id": "offer_id",
        "jobRequest": {
          "_id": "job_request_id",
          "title": "Web Development Project",
          "description": "Need a website built",
          "budget": {
            "min": 1000,
            "max": 5000
          },
          "deadline": "2024-01-15T00:00:00.000Z",
          "status": "open"
        },
        "price": {
          "amount": 2500,
          "currency": "EGP"
        },
        "message": "I can complete this job efficiently and on time",
        "estimatedTimeDays": 3,
        "status": "pending",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalCount": 1
  },
  "message": "Offers retrieved successfully"
}
```

---

### 4. Get Offer by ID

**Route:** `GET /api/offer/:offerId`

**Description:** Get a specific offer by ID

**Access:** Offer owner, job request owner, or admin

**Parameters:**
- `offerId` (string, required): ID of the offer

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "offer_id",
    "jobRequest": {
      "_id": "job_request_id",
      "title": "Web Development Project",
      "description": "Need a website built",
      "budget": {
        "min": 1000,
        "max": 5000
      },
      "deadline": "2024-01-15T00:00:00.000Z",
      "status": "open",
      "seeker": "seeker_id"
    },
    "provider": {
      "_id": "provider_id",
      "name": {
        "first": "John",
        "last": "Provider"
      },
      "email": "provider@example.com",
      "phone": "01012345678",
      "rating": 4.5,
      "reviewCount": 10
    },
    "price": {
      "amount": 2500,
      "currency": "EGP"
    },
    "message": "I can complete this job efficiently and on time",
    "estimatedTimeDays": 3,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Offer retrieved successfully"
}
```

**Error Cases:**
- Offer not found
- Access denied (not offer owner, job request owner, or admin)

---

### 5. Update Offer

**Route:** `PATCH /api/offer/:offerId`

**Description:** Update an existing offer (only pending offers can be updated)

**Access:** Offer owner only

**Parameters:**
- `offerId` (string, required): ID of the offer to update

**Request Body:**
```json
{
  "price": {
    "amount": 3000,
    "currency": "EGP"
  },
  "message": "Updated offer message with better terms",
  "estimatedTimeDays": 2
}
```

**Validation Rules:**
- All fields are optional
- `price.amount`: Must be a positive number
- `price.currency`: Must be one of: EGP, USD, EUR
- `message`: Max 1000 characters
- `estimatedTimeDays`: Minimum 1 day

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "offer_id",
    "price": {
      "amount": 3000,
      "currency": "EGP"
    },
    "message": "Updated offer message with better terms",
    "estimatedTimeDays": 2,
    "status": "pending",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Offer updated successfully"
}
```

**Error Cases:**
- Offer not found
- Access denied (not offer owner)
- Can only update pending offers
- Price outside budget range
- Invalid validation data

---

### 6. Delete Offer

**Route:** `DELETE /api/offer/:offerId`

**Description:** Delete/withdraw an offer (only pending offers can be deleted)

**Access:** Offer owner only

**Parameters:**
- `offerId` (string, required): ID of the offer to delete

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "Offer deleted successfully"
  },
  "message": "Offer deleted successfully"
}
```

**Error Cases:**
- Offer not found
- Access denied (not offer owner)
- Can only delete pending offers

---

### 7. Accept Offer

**Route:** `POST /api/offer/:offerId/accept`

**Description:** Accept an offer (job request owner only)

**Access:** Job request owner only

**Parameters:**
- `offerId` (string, required): ID of the offer to accept

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "offer_id",
    "status": "accepted",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Offer accepted successfully"
}
```

**Notes:**
- This will also update the job request status to 'assigned'
- All other pending offers for this job will be rejected

**Error Cases:**
- Offer not found
- Access denied (not job request owner)
- Can only accept pending offers

---

### 8. Reject Offer

**Route:** `POST /api/offer/:offerId/reject`

**Description:** Reject an offer (job request owner only)

**Access:** Job request owner only

**Parameters:**
- `offerId` (string, required): ID of the offer to reject

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "offer_id",
    "status": "rejected",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Offer rejected successfully"
}
```

**Error Cases:**
- Offer not found
- Access denied (not job request owner)
- Can only reject pending offers

---

## Validation Error Response Format

When validation fails, the API returns:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "price.amount",
        "message": "Price amount must be a positive number",
        "value": -100
      }
    ]
  }
}
```

## Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `CONFLICT` | Resource already exists | 409 |

## Testing

Use the provided test script to verify all endpoints:

```bash
node test-offer-refactored.js
```

This will test all the refactored offer routes with proper validation and error handling. 