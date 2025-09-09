const loadEnv = () => { 
    const JWT_KEY = process.env.JWT_KEY;

    if (!JWT_KEY) {
        throw new Error("JWT_KEY not passed in .env");
    }

    return {
        JWT_KEY
    }
}

export default loadEnv();