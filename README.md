# NusaKala Backend

A comprehensive backend API for the NusaKala platform - a digital platform connecting tourists with Indonesia's rich cultural heritage through AI technology and interactive experiences.

## 🎯 Project Overview

NusaKala is a digital platform that bridges tourists with Indonesia's cultural wealth through AI technology and interactive experiences. The platform aims to preserve and promote Indonesian culture while providing an engaging educational experience for domestic and international tourists.

### Vision & Mission
- **Vision**: To become the leading platform for exploring and preserving Indonesian culture
- **Mission**: Connecting people through culture, language, and shared experiences in the spirit of "Bhinneka Tunggal Ika" (Unity in Diversity)

### Target Users
- **Tourists** - Visitors wanting to explore Indonesian culture
- **Event Organizers** - Cultural event and festival organizers
- **Cultural Creators** - Artists, craftsmen, and cultural preservers

## 🏗️ Architecture

### Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL with pg driver
- **Authentication**: JWT with bcrypt for password hashing
- **AI Integration**: Google Generative AI, TensorFlow.js
- **File Upload**: Multer for multipart/form-data
- **Logging**: Winston for structured logging
- **CORS**: Cross-origin resource sharing enabled
- **Environment**: dotenv for configuration management

### Project Structure
```
nusakala-backend/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.js
│   │   ├── event.controller.js
│   │   ├── event-validation.controller.js
│   │   ├── predict.controller.js
│   │   ├── perspective.controller.js
│   │   └── ai.controller.js
│   ├── services/             # Business logic layer
│   │   ├── auth.service.js
│   │   ├── event.service.js
│   │   ├── event-validation.service.js
│   │   ├── predict.service.js
│   │   ├── perspective.service.js
│   │   └── ai.service.js
│   ├── routes/               # API route definitions
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── event.routes.js
│   │   ├── event-validation.routes.js
│   │   ├── predict.routes.js
│   │   ├── perspective.routes.js
│   │   └── ai.routes.js
│   ├── middlewares/          # Custom middleware
│   └── utils/                # Utility functions
│       ├── logger.js
│       ├── validation.js
│       └── event-validation-prompt.js
├── config/
│   └── database.js           # Database configuration
├── public/
│   └── model/               # Static model files
├── scripts/                 # Utility scripts
│   ├── seed.js
│   ├── test-db-connection.js
│   └── test-event-validation.js
├── logs/                    # Application logs
├── server.js                # Server entry point
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NusaKala-BE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/nusakala_db
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   
   # AI Services (Optional)
   GOOGLE_API_KEY=your_google_api_key
   
   # Logging
   LOG_LEVEL=info
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb nusakala_db
   
   # Run database scripts (if available)
   npm run db:setup
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3001`

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "tourist|event_organizer|cultural_creator"
}
```

#### POST `/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

### Event Management

#### GET `/events`
Get all events with optional filtering.

**Query Parameters:**
- `page` (number): Page number for pagination
- `limit` (number): Items per page
- `category` (string): Filter by event category
- `location` (string): Filter by location

#### POST `/events`
Create a new event (requires authentication).

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "location": "string",
  "date": "ISO-8601 date string",
  "price": "number",
  "capacity": "number"
}
```

#### GET `/events/:id`
Get event details by ID.

#### PUT `/events/:id`
Update event (requires authentication and ownership).

#### DELETE `/events/:id`
Delete event (requires authentication and ownership).

### AI Services

#### POST `/ai/translate`
Translate text using AI.

**Request Body:**
```json
{
  "text": "string",
  "sourceLanguage": "string",
  "targetLanguage": "string"
}
```

#### POST `/predict`
Make predictions using AI models.

**Request Body:**
```json
{
  "input": "string",
  "model": "string"
}
```

### Event Validation

#### POST `/event-validation/validate`
Validate event content using AI.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "category": "string"
}
```

### Perspective Analysis

#### POST `/perspective/analyze`
Analyze content perspective and sentiment.

**Request Body:**
```json
{
  "content": "string"
}
```

## 🔧 Development

### Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run database connection test
node scripts/test-db-connection.js

# Run event validation test
node scripts/test-event-validation.js

# Seed database with sample data
node scripts/seed.js
```

### Code Structure Guidelines

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and data processing
- **Routes**: Define API endpoints and middleware
- **Utils**: Shared utility functions and helpers
- **Config**: Configuration files for different environments

### Logging

The application uses Winston for structured logging. Logs are written to:
- Console (development)
- `logs/app.log` file

Log levels: `error`, `warn`, `info`, `debug`

### Error Handling

The application implements centralized error handling with:
- Consistent error response format
- Proper HTTP status codes
- Detailed logging for debugging
- User-friendly error messages

## 🗄️ Database

### Connection
The application uses PostgreSQL with the `pg` driver. Database connection is managed through the `config/database.js` module.

### Key Features
- Connection pooling
- Automatic reconnection
- Query parameterization for security
- Transaction support

## 🔒 Security

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Token expiration and refresh mechanism
- Role-based access control

### Data Protection
- Input validation and sanitization
- SQL injection prevention through parameterized queries
- CORS configuration for cross-origin requests
- Rate limiting (to be implemented)

### Environment Variables
- Sensitive configuration stored in environment variables
- No hardcoded secrets in source code
- Separate configurations for development and production

## 🧪 Testing

### Manual Testing Scripts
- `scripts/test-db-connection.js`: Test database connectivity
- `scripts/test-event-validation.js`: Test AI event validation
- `scripts/seed.js`: Populate database with sample data

### API Testing
Use tools like Postman, Insomnia, or curl to test API endpoints.

## 📦 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
CORS_ORIGIN=your_frontend_domain
```

### Deployment Checklist
- [ ] Set production environment variables
- [ ] Configure database for production
- [ ] Set up logging for production
- [ ] Configure CORS for production domains
- [ ] Set up monitoring and error tracking
- [ ] Configure SSL/TLS certificates
- [ ] Set up backup and recovery procedures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure proper error handling
- Write clean, maintainable code

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation and API reference

## 🔄 Version History

- **v1.0.0**: Initial release with core features
  - Authentication system
  - Event management
  - AI integration
  - Basic CRUD operations

---

**NusaKala** - Connecting people through Indonesian culture and technology. 