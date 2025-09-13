# Bitcoin Price Microservice

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bitcoin/price` | Get current Bitcoin price with commission applied |
| GET | `/api` | Swagger API documentation |

## Prerequisites

- Docker and Docker Compose installed
- Or Node.js 20+ and Redis (for local development)

## Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/utojikulov/bitcoin-price-microservice.git
   cd bitcoin-price-microservice
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables** (edit `.env` file):
   ```env
   # Application
   PORT=3000
   BINANCE_BTC_API=https://api.binance.com/api/v3/ticker/bookTicker?symbol=BTCUSDT
   SERVICE_COMMISSION_RATE=0.0005
   UPDATE_FREQUENCY_MS=5000

   # Redis
   REDIS_HOST=redis
   REDIS_PORT=6379
   REDIS_PASSWORD=superpupersecretpassword
   ```

4. **Start the services**
   ```bash
   docker-compose up
   ```

5. **Access the application**
   - Swagger Documentation: http://localhost:3000/api
   - Get Bitcoin Price: http://localhost:3000/bitcoin/price (the prices are **logged** every N seconds)
