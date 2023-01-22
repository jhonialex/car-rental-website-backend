declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string,
            JWT_SECRET: string,
            JWT_REFRESH_SECRET: string,
            ORIGIN: string,
            MONGO_URI: string,
            CLOUDFLARE_URL: string,
            CLOUDFLARE_TOKEN: string,
        }
    }
}

export { }