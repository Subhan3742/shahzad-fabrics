# API Documentation

This project uses Prisma ORM with PostgreSQL for data management. All API endpoints use POST method with try-catch error handling.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Database**
   - Update the `DATABASE_URL` in `.env` file with your PostgreSQL credentials:
     ```
     DATABASE_URL="postgresql://user:password@localhost:5432/shahzadcollection?schema=public"
     ```

3. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

4. **Run Migrations**
   ```bash
   npm run db:migrate
   ```

5. **Push Schema to Database** (Alternative to migrations)
   ```bash
   npm run db:push
   ```

## API Endpoints

All endpoints use POST method and require JSON body.

### 1. Get Categories by Type
**Endpoint:** `POST /api/categories`

**Request Body:**
```json
{
  "type": "ladies" // or "gents"
}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Lawn",
    "description": "Premium quality lawn fabric",
    "image": "/premium-lawn-fabric-floral-pattern.jpg",
    "items": ["Floral Lawn", "Printed Lawn"]
  }
]
```

### 2. Get All Products
**Endpoint:** `POST /api/products`

**Request Body:**
```json
{
  "featured": true,  // optional: get only featured products
  "type": "ladies",  // optional: filter by type
  "limit": 10        // optional: limit results
}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Floral Printed Lawn",
    "price": "PKR 1,200/meter",
    "image": "/premium-lawn-fabric-floral-pattern.jpg",
    "description": "Beautiful floral printed lawn fabric",
    "category": "Lawn",
    "type": "ladies",
    "inStock": true,
    "specifications": {
      "material": "100% Cotton Lawn",
      "width": "54 inches",
      "care": "Machine washable"
    },
    "colors": ["Pink", "Blue"],
    "features": ["Breathable", "Soft Texture"]
  }
]
```

### 3. Get Product by ID
**Endpoint:** `POST /api/products/[productId]`

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "id": 1,
  "name": "Floral Printed Lawn",
  "price": "PKR 1,200/meter",
  "originalPrice": "PKR 1,500/meter",
  "image": "/premium-lawn-fabric-floral-pattern.jpg",
  "images": ["/image1.jpg", "/image2.jpg"],
  "description": "Beautiful floral printed lawn fabric",
  "fullDescription": "Detailed description...",
  "category": "Lawn",
  "type": "ladies",
  "inStock": true,
  "stockQuantity": 50,
  "specifications": {
    "material": "100% Cotton Lawn",
    "width": "54 inches",
    "weight": "Lightweight",
    "care": "Machine washable",
    "origin": "Pakistan"
  },
  "colors": ["Pink", "Blue", "Green"],
  "sizes": ["Small", "Medium", "Large"],
  "features": ["Breathable", "Soft Texture"],
  "rating": 4.5,
  "reviews": 24
}
```

### 4. Get Products by Category
**Endpoint:** `POST /api/products/category/[type]/[categoryId]`

**Request Body:**
```json
{}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Floral Printed Lawn",
    "price": "PKR 1,200/meter",
    "image": "/premium-lawn-fabric-floral-pattern.jpg",
    "description": "Beautiful floral printed lawn fabric",
    "inStock": true
  }
]
```

## Database Models

### Category Model
- `id`: Int (Primary Key)
- `name`: String
- `description`: String? (Optional)
- `image`: String? (Optional)
- `type`: String ("ladies" or "gents")
- `items`: String[] (Array of category items)
- `active`: Boolean (Soft delete flag, default: true)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Product Model
- `id`: Int (Primary Key)
- `name`: String
- `description`: String
- `fullDescription`: String? (Optional, Text)
- `price`: String
- `originalPrice`: String? (Optional)
- `image`: String
- `images`: String[] (Array of additional images)
- `categoryId`: Int (Foreign Key to Category)
- `type`: String ("ladies" or "gents")
- `inStock`: Boolean (default: true)
- `stockQuantity`: Int? (Optional)
- `material`: String? (Optional)
- `width`: String? (Optional)
- `weight`: String? (Optional)
- `care`: String? (Optional)
- `origin`: String? (Optional)
- `colors`: String[] (Array of available colors)
- `sizes`: String[] (Array of available sizes)
- `features`: String[] (Array of product features)
- `rating`: Float? (Optional)
- `reviews`: Int? (Optional)
- `featured`: Boolean (default: false)
- `active`: Boolean (Soft delete flag, default: true)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Soft Delete

Both Category and Product models use the `active` field for soft deletion:
- `active: true` - Record is active and will be returned in queries
- `active: false` - Record is soft-deleted and will be excluded from queries

All API endpoints automatically filter out inactive records (`active: false`).

## Error Handling

All API endpoints include try-catch blocks and return appropriate error responses:
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (database or server error)

Error response format:
```json
{
  "error": "Error message"
}
```

