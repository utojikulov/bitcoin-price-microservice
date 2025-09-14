# Crypto Price Microservice

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/crypto/price` | Get current Crypto price with commission applied |
| GET | `/api` | Swagger API documentation |

## Prerequisites

- Docker and Docker Compose installed

## Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/utojikulov/crypto-price-microservice.git

   cd crypto-price-microservice
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables** (edit `.env` file):
   ```env
   # Application
   PORT=3000
   UPDATE_FREQUENCY_MS=5000
   SERVICE_COMMISSION_RATE=0.0005
   TARGET_ASSET_BINANCE_SYMBOL=ETHUSDT

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
   - Get Bitcoin Price: http://localhost:3000/crypto/price (the prices are **logged** every **UPDATE_FREQUENCY_MS** seconds)
   - You can get the price changes of any kind of crypto and the commission you wanna apply to it, by just changing the **TARGET_ASSET_BINANCE_SYMBOL** and **SERVICE_COMMISSION_RATE** in your .env file.
