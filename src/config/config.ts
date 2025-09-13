export default () => ({
    app: {
        port: process.env.PORT,
        binance_api: process.env.BINANCE_BTC_API,
        service_commission_rate: process.env.SERVICE_COMMISSION_RATE,
        update_freq_ms: process.env.UPDATE_FREQUENCY_MS
    },
    cache: {
        redis_password: process.env.REDIS_PASSWORD,
        redis_host: process.env.REDIS_HOST || 'localhost',
        redis_port: parseInt(process.env.REDIS_PORT || '6379', 10),
    }
})
