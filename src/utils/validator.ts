// validator.ts

export function checkPhoneNumber(phoneNumber: string): boolean {
  const phoneNumberRegex = /^\+[1-9]\d{1,14}$/; // Matches a phone number in E.164 format
  return phoneNumberRegex.test(phoneNumber);
}

export function checkVerificationCode(verificationCode: string): boolean {
  return verificationCode.length === 6; // Assumes the verification code is a 6-digit string
}
