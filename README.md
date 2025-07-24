# NusaKala Backend

Backend API untuk platform warisan budaya Indonesia NusaKala.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd nusakala-be
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment**
```bash
# Copy environment file
cp env.development .env

# Edit .env sesuai kebutuhan
```

4. **Run development server**
```bash
npm run dev
```

5. **Build untuk production**
```bash
npm run build
npm start
```

## 📋 Available Scripts

- `npm run dev` - Start development server dengan hot reload
- `npm run build` - Build TypeScript ke JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (akan diimplementasikan)

## 🌐 API Endpoints

### Health Check
- `GET /health` - Status server

### API Routes
- `GET /api` - Welcome message dan info endpoints
- `GET /api/test` - Test endpoint untuk debugging

## 🏗️ Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── types/           # TypeScript types
├── validators/      # Request validation
├── socket/          # Socket.io handlers
├── jobs/            # Background tasks
├── tests/           # Test files
├── docs/            # Documentation
└── server.ts        # Entry point
```

## 🔧 Configuration

Environment variables yang diperlukan:

```env
NODE_ENV=development
PORT=3001
HOST=localhost
CORS_ORIGIN=http://localhost:3000
```

## 🧪 Testing

Server akan berjalan di `http://localhost:3001`

Test endpoints:
- Health check: `http://localhost:3001/health`
- API info: `http://localhost:3001/api`
- Test endpoint: `http://localhost:3001/api/test`

## 📝 Development

### Code Style
- TypeScript dengan strict mode
- ESLint untuk linting
- Prettier untuk formatting

### Architecture
- Express.js sebagai web framework
- Modular structure dengan separation of concerns
- TypeScript untuk type safety
- Environment-based configuration

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Pastikan semua environment variables sudah diset untuk production.

## 📄 License

MIT License 