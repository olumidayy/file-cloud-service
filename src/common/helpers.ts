function randomNumberWithinRange(min, max) {
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

export default function generateOTP() {
  return randomNumberWithinRange(100000, 999999);
}
