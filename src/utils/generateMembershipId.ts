export const generateMembershipId = (sequence: number): string => {
  // Format: OMK-2026-000001
  const year = new Date().getFullYear();
  const paddedSequence = sequence.toString().padStart(6, '0');
  return `OMK-${year}-${paddedSequence}`;
};

export const generateApplicationNumber = (): string => {
  // Format: APP-XXXXX
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `APP-${randomChars}`;
};
