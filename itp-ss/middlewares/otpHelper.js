import crypto from 'crypto';

// Generate a random OTP (6 digits)
export const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};
