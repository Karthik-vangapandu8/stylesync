# StyleSync - Server Management UI

A modern, secure web interface for remote server management and monitoring.

## Features

- Real-time server metrics monitoring (CPU, Memory, Disk)
- Service management (start/stop/restart)
- Log viewing and analysis
- User authentication and authorization
- Configuration management
- Real-time updates via WebSocket

## Tech Stack

### Backend
- FastAPI (Python)
- SQLAlchemy
- WebSockets
- JWT Authentication
- psutil for system metrics

### Frontend
- React
- TypeScript
- Material-UI
- Redux Toolkit
- Chart.js for metrics visualization
- Socket.io-client

## Getting Started

1. Set up Python environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Start the development servers:

Backend:
```bash
uvicorn app.main:app --reload
```

Frontend:
```bash
cd frontend
npm start
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- Audit logging

## Project Structure

```
stylesync/
├── app/                    # Backend application
│   ├── api/               # API routes
│   ├── core/              # Core functionality
│   ├── db/                # Database models
│   ├── schemas/           # Pydantic models
│   └── services/          # Business logic
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── store/        # Redux store
│   │   └── utils/        # Utility functions
├── tests/                 # Test suite
└── requirements.txt       # Python dependencies
```
