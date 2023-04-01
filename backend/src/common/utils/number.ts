export const generateOtp = (length: number = 4) => {
  const digits = '1234567890';
  let otp: string = '';

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  return otp;
};

// Función auxiliar para convertir grados a radianes
export const toRadians = (degrees: number) => {
  return (degrees * Math.PI) / 180;
};
