/**
 * Validation Utilities for MERN Backend
 * Provides robust, production-safe validation for common data types
 */

// ═══════════════════════════════════════════════════════════════
// STRING VALIDATION
// ═══════════════════════════════════════════════════════════════

/**
 * Validates and trims a required string field
 * @param {*} value - The value to validate
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {object} { valid: boolean, value: string|null, error: string|null }
 */
exports.validateRequiredString = (value, fieldName = 'Field') => {
  if (value === undefined || value === null) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} is required and cannot be null or undefined`
    };
  }

  if (typeof value !== 'string') {
    return {
      valid: false,
      value: null,
      error: `${fieldName} must be a string, received: ${typeof value}`
    };
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} cannot be empty`
    };
  }

  return {
    valid: true,
    value: trimmed,
    error: null
  };
};

/**
 * Validates an optional string field
 * @param {*} value - The value to validate
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {object} { valid: boolean, value: string|null, error: string|null }
 */
exports.validateOptionalString = (value, fieldName = 'Field') => {
  if (value === undefined || value === null || value === '') {
    return {
      valid: true,
      value: null,
      error: null
    };
  }

  if (typeof value !== 'string') {
    return {
      valid: false,
      value: null,
      error: `${fieldName} must be a string, received: ${typeof value}`
    };
  }

  const trimmed = value.trim();
  return {
    valid: true,
    value: trimmed.length > 0 ? trimmed : null,
    error: null
  };
};

// ═══════════════════════════════════════════════════════════════
// NUMERIC VALIDATION (CRITICAL FOR PRICE FIELDS)
// ═══════════════════════════════════════════════════════════════

/**
 * Validates and converts a required numeric field with strict type checking
 * @param {*} value - The value to validate (number or string representation)
 * @param {string} fieldName - Name of the field (for error messages)
 * @param {object} options - { min, max, allowZero, allowNegative }
 * @returns {object} { valid: boolean, value: number|null, error: string|null }
 */
exports.validateRequiredNumber = (
  value,
  fieldName = 'Number',
  options = {}
) => {
  const {
    min = null,
    max = null,
    allowZero = false,
    allowNegative = false
  } = options;

  // Check if field exists
  if (value === undefined || value === null) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} is required and cannot be null or undefined`
    };
  }

  // Convert to number based on type
  let numValue = null;

  if (typeof value === 'number') {
    numValue = value;
  } else if (typeof value === 'string') {
    numValue = parseFloat(value);
  } else {
    return {
      valid: false,
      value: null,
      error: `${fieldName} must be a number, received: ${typeof value}`
    };
  }

  // Check if conversion resulted in NaN
  if (isNaN(numValue)) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} must be a valid number. Received: "${value}"`
    };
  }

  // Validate range
  if (!allowZero && numValue === 0) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} cannot be zero`
    };
  }

  if (!allowNegative && numValue < 0) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} cannot be negative`
    };
  }

  if (min !== null && numValue < min) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} must be at least ${min}`
    };
  }

  if (max !== null && numValue > max) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} cannot exceed ${max}`
    };
  }

  return {
    valid: true,
    value: numValue,
    error: null
  };
};

/**
 * Validates and converts an optional numeric field
 * @param {*} value - The value to validate (number or string representation)
 * @param {string} fieldName - Name of the field (for error messages)
 * @param {object} options - { min, max, allowZero, allowNegative }
 * @returns {object} { valid: boolean, value: number|null, error: string|null }
 */
exports.validateOptionalNumber = (
  value,
  fieldName = 'Number',
  options = {}
) => {
  const {
    min = null,
    max = null,
    allowZero = true,
    allowNegative = false
  } = options;

  // If not provided, it's valid as null
  if (value === undefined || value === null || value === '') {
    return {
      valid: true,
      value: null,
      error: null
    };
  }

  // Convert to number based on type
  let numValue = null;

  if (typeof value === 'number') {
    numValue = value;
  } else if (typeof value === 'string') {
    numValue = parseFloat(value);
  } else {
    return {
      valid: false,
      value: null,
      error: `${fieldName} must be a number, received: ${typeof value}`
    };
  }

  // Check if conversion resulted in NaN
  if (isNaN(numValue)) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} must be a valid number. Received: "${value}"`
    };
  }

  // Validate constraints
  if (!allowZero && numValue === 0) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} cannot be zero`
    };
  }

  if (!allowNegative && numValue < 0) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} cannot be negative`
    };
  }

  if (min !== null && numValue < min) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} must be at least ${min}`
    };
  }

  if (max !== null && numValue > max) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} cannot exceed ${max}`
    };
  }

  return {
    valid: true,
    value: numValue,
    error: null
  };
};

// ═══════════════════════════════════════════════════════════════
// ENUM/CHOICE VALIDATION
// ═══════════════════════════════════════════════════════════════

/**
 * Validates a required enum field
 * @param {*} value - The value to validate
 * @param {array} allowedValues - Array of allowed values
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {object} { valid: boolean, value: any, error: string|null }
 */
exports.validateRequiredEnum = (value, allowedValues, fieldName = 'Field') => {
  if (value === undefined || value === null) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} is required`
    };
  }

  if (!allowedValues.includes(value)) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} must be one of: ${allowedValues.join(', ')}`
    };
  }

  return {
    valid: true,
    value,
    error: null
  };
};

/**
 * Validates an optional enum field with default fallback
 * @param {*} value - The value to validate
 * @param {array} allowedValues - Array of allowed values
 * @param {*} defaultValue - Default value if not provided
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {object} { valid: boolean, value: any, error: string|null }
 */
exports.validateOptionalEnum = (
  value,
  allowedValues,
  defaultValue = null,
  fieldName = 'Field'
) => {
  if (value === undefined || value === null) {
    return {
      valid: true,
      value: defaultValue,
      error: null
    };
  }

  if (!allowedValues.includes(value)) {
    return {
      valid: false,
      value: null,
      error: `${fieldName} must be one of: ${allowedValues.join(', ')}`
    };
  }

  return {
    valid: true,
    value,
    error: null
  };
};

// ═══════════════════════════════════════════════════════════════
// BATCH VALIDATION HELPER
// ═══════════════════════════════════════════════════════════════

/**
 * Validates multiple fields and returns first error encountered
 * @param {object} validations - Array of { validator, fieldName } objects
 * @returns {object} { isValid: boolean, error: string|null, fieldName: string|null }
 */
exports.validateBatch = (validations) => {
  for (const validation of validations) {
    const result = validation.validator();
    if (!result.valid) {
      return {
        isValid: false,
        error: result.error,
        fieldName: validation.fieldName
      };
    }
  }

  return {
    isValid: true,
    error: null,
    fieldName: null
  };
};
