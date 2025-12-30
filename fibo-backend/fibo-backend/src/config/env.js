import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name) {
    const value = process.env[name]
    if(!value){
        throw new Error(`Environment variables ${name} is required but not set.`)

    }
    return value
}


export const config = {
    NODE_ENV:process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    FAL_KEY: requireEnv('FAL_KEY'),
    OPENAI_API_KEY: requireEnv('OPENAI_API_KEY'),
    OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    OPENAI_API_STYLE: process.env.OPENAI_API_STYLE || 'chat',
    WEATHER_LAT:28.6139,
    WEATHER_LON:77.2090 

    
}