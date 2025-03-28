export const generateOtp = (length: number = 4): string => {
    return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
  };
  1