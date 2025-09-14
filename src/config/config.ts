export default () => ({
    app: {
        port: process.env.PORT,
        target_symbol: process.env.TARGET_ASSET_BINANCE_SYMBOL,
        service_commission_rate: process.env.SERVICE_COMMISSION_RATE,
        update_freq_ms: process.env.UPDATE_FREQUENCY_MS
    },
    cache: {
        redis_password: process.env.REDIS_PASSWORD,
        redis_host: process.env.REDIS_HOST || 'localhost',
        redis_port: parseInt(process.env.REDIS_PORT || '6379', 10),
    }
})

    // !!! Add support to dynamically change the settings in runtime, so the user doesn't have to restart for the new env to be applied

