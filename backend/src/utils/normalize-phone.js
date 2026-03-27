const normalizePhone = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const digits = value.replace(/[^\d+]/g, '');

  if (digits.startsWith('+')) {
    return digits;
  }

  if (digits.startsWith('234')) {
    return `+${digits}`;
  }

  if (digits.startsWith('0') && digits.length === 11) {
    return `+234${digits.slice(1)}`;
  }

  return digits;
};

module.exports = {
  normalizePhone,
};
