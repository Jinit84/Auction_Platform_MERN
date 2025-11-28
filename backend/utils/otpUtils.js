// Generate a random 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// For development: Log OTP to console instead of sending email
export const sendOTP = async (email, otp) => {
  try {
    console.log('======================');
    console.log('DEVELOPMENT MODE: OTP LOG');
    console.log('======================');
    console.log(`Email: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log('======================');
    console.log('In production, this would be sent via email');
    console.log('======================\n');
    
    return true;
  } catch (error) {
    console.error('Error in OTP generation:', error);
    throw new Error('Failed to generate OTP');
  }
};

// Verify OTP
export const verifyOTP = (user, otp) => {
  if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
    return false;
  }
  
  const now = new Date();
  const isExpired = now > user.otp.expiresAt;
  const isMatch = user.otp.code === otp;
  
  return !isExpired && isMatch;
};
