export default () => ({
    app: {
        port: process.env.PORT,
        binance_api: process.env.BINANCE_API,
        service_commission_rate: process.env.SERVICE_COMMISSION_RATE,
        update_freq_ms: process.env.UPDATE_FREQUENCY_MS
    }
})
