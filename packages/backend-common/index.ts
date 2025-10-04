import "dotenv/config";

export const config = {
    jwtSecret: process.env.JWT_SECRET || 'anshtyagi'
};