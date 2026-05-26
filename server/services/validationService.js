/**
 * Product Validation Service
 * Centralized validation logic for product operations
 */

const { CATEGORIES, STOCK_STATUS } = require('../models/Product');

class ValidationService {
  /**
   * Validate and sanitize string field
   */
  static validateString(value, fieldName, options = {}) {
    const { required = true, minLength = 0, maxLength = 2000, trim = true } = options;

    if (value === undefined || value === null) {
      if (required) {
        return { valid: false, error: `${fieldName} is required` };
      }
      return { valid: true, value: null };
    }

    if (typeof value !== 'string') {
      return { valid: false, error: `${fieldName} must be a string` };
    }

    const trimmedValue = trim ? value.trim() : value;

    if (required && !trimmedValue) {
      return { valid: false, error: `${fieldName} cannot be empty` };
    }

    if (trimmedValue.length < minLength) {
      return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
    }

    if (trimmedValue.length > maxLength) {
      return { valid: false, error: `${fieldName} cannot exceed ${maxLength} characters` };
    }

    return { valid: true, value: trimmedValue };
  }

  /**
   * Validate and convert to number
   */
  static validateNumber(value, fieldName, options = {}) {
    const { required = true, min = null, max = null, positive = false } = options;

    if (value === undefined || value === null) {
      if (required) {
        return { valid: false, error: `${fieldName} is required` };
      }
      return { valid: true, value: null };
    }

    let numValue;

    if (typeof value === 'number') {
      numValue = value;
    } else if (typeof value === 'string') {
      numValue = parseFloat(value);
    } else {
      return { valid: false, error: `${fieldName} must be a number or numeric string` };
    }

    if (isNaN(numValue)) {
      return { valid: false, error: `${fieldName} must be a valid number (received: "${value}")` };
    }

    if (positive && numValue <= 0) {
      return { valid: false, error: `${fieldName} must be greater than 0` };
    }

    if (min !== null && numValue < min) {
      return { valid: false, error: `${fieldName} cannot be less than ${min}` };
    }

    if (max !== null && numValue > max) {
      return { valid: false, error: `${fieldName} cannot exceed ${max}` };
    }

    return { valid: true, value: numValue };
  }

  /**
   * Validate category
   */
  static validateCategory(value, required = true) {
    if (!value) {
      if (required) {
        return {
          valid: false,
          error: `Category is required. Must be one of: ${Object.values(CATEGORIES).join(', ')}`
        };
      }
      return { valid: true, value: null };
    }

    const validCategories = Object.values(CATEGORIES);
    if (!validCategories.includes(value)) {
      return {
        valid: false,
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      };
    }

    return { valid: true, value };
  }

  /**
   * Validate stock status
   */
  static validateStockStatus(value, required = false) {
    if (!value) {
      if (required) {
        return {
          valid: false,
          error: `Stock status is required. Must be one of: ${Object.values(STOCK_STATUS).join(', ')}`
        };
      }
      return { valid: true, value: STOCK_STATUS.IN_STOCK };
    }

    const validStatuses = Object.values(STOCK_STATUS);
    if (!validStatuses.includes(value)) {
      return {
        valid: false,
        error: `Invalid stock status. Must be one of: ${validStatuses.join(', ')}`
      };
    }

    return { valid: true, value };
  }

  /**
   * Validate image URL
   */
  static validateImage(value) {
    if (!value) {
      return { valid: false, error: 'Image URL is required' };
    }

    if (typeof value !== 'string') {
      return { valid: false, error: 'Image must be a string' };
    }

    const trimmedValue = value.trim();

    // Check if it's a valid URL or data URI
    const urlRegex = /^https?:\/\/.+/;
    const dataUriRegex = /^data:image/;

    if (!urlRegex.test(trimmedValue) && !dataUriRegex.test(trimmedValue)) {
      return { valid: false, error: 'Image must be a valid URL or data URI' };
    }

    return { valid: true, value: trimmedValue };
  }

  /**
   * Validate Meesho link
   */
  static validateMeeshoLink(value) {
    if (!value) {
      return { valid: false, error: 'Meesho link is required' };
    }

    if (typeof value !== 'string') {
      return { valid: false, error: 'Meesho link must be a string' };
    }

    const trimmedValue = value.trim();
    const meeshoRegex = /^https?:\/\/(www\.)?meesho\.com/;

    if (!meeshoRegex.test(trimmedValue)) {
      return { valid: false, error: 'Meesho link must be a valid Meesho product URL' };
    }

    return { valid: true, value: trimmedValue };
  }

  /**
   * Validate product price (critical field)
   */
  static validatePrice(value) {
    const priceValidation = this.validateNumber(value, 'Price', {
      required: true,
      min: 0.01,
      positive: true
    });

    if (!priceValidation.valid) {
      return priceValidation;
    }

    // Round to 2 decimal places
    const roundedPrice = Math.round(priceValidation.value * 100) / 100;
    return { valid: true, value: roundedPrice };
  }

  /**
   * Validate optional pricing fields
   */
  static validateOptionalPrice(value, fieldName) {
    if (value === undefined || value === null || value === '') {
      return { valid: true, value: null };
    }

    const priceValidation = this.validateNumber(value, fieldName, {
      required: false,
      min: 0
    });

    if (!priceValidation.valid) {
      return priceValidation;
    }

    if (priceValidation.value !== null) {
      return { valid: true, value: Math.round(priceValidation.value * 100) / 100 };
    }

    return { valid: true, value: null };
  }

  /**
   * Validate complete product data for creation
   */
  static validateCreateProduct(data) {
    const errors = [];
    const validatedData = {};

    // Title
    const titleVal = this.validateString(data.title, 'Title', {
      required: true,
      minLength: 3,
      maxLength: 200
    });
    if (!titleVal.valid) errors.push(titleVal.error);
    else validatedData.title = titleVal.value;

    // Description
    const descVal = this.validateString(data.description, 'Description', {
      required: true,
      minLength: 10,
      maxLength: 2000
    });
    if (!descVal.valid) errors.push(descVal.error);
    else validatedData.description = descVal.value;

    // Image
    const imgVal = this.validateImage(data.image);
    if (!imgVal.valid) errors.push(imgVal.error);
    else validatedData.image = imgVal.value;

    // Category
    const catVal = this.validateCategory(data.category, true);
    if (!catVal.valid) errors.push(catVal.error);
    else validatedData.category = catVal.value;

    // Meesho Link
    const linkVal = this.validateMeeshoLink(data.meeshoLink);
    if (!linkVal.valid) errors.push(linkVal.error);
    else validatedData.meeshoLink = linkVal.value;

    // Price (critical)
    const priceVal = this.validatePrice(data.price);
    if (!priceVal.valid) errors.push(priceVal.error);
    else validatedData.price = priceVal.value;

    // Optional prices
    const origPriceVal = this.validateOptionalPrice(data.originalPrice, 'Original price');
    if (!origPriceVal.valid) errors.push(origPriceVal.error);
    else if (origPriceVal.value !== null) validatedData.originalPrice = origPriceVal.value;

    const discPriceVal = this.validateOptionalPrice(data.discountedPrice, 'Discounted price');
    if (!discPriceVal.valid) errors.push(discPriceVal.error);
    else if (discPriceVal.value !== null) {
      // Validate discounted price is less than selling price
      if (discPriceVal.value >= validatedData.price) {
        errors.push('Discounted price must be less than selling price');
      } else {
        validatedData.discountedPrice = discPriceVal.value;
      }
    }

    // Stock status
    const stockVal = this.validateStockStatus(data.stockStatus);
    if (!stockVal.valid) errors.push(stockVal.error);
    else validatedData.stockStatus = stockVal.value;

    return {
      valid: errors.length === 0,
      data: validatedData,
      errors
    };
  }

  /**
   * Validate partial product data for updates
   */
  static validateUpdateProduct(data) {
    const errors = [];
    const validatedData = {};

    if (data.title !== undefined) {
      const titleVal = this.validateString(data.title, 'Title', {
        required: true,
        minLength: 3,
        maxLength: 200
      });
      if (!titleVal.valid) errors.push(titleVal.error);
      else validatedData.title = titleVal.value;
    }

    if (data.description !== undefined) {
      const descVal = this.validateString(data.description, 'Description', {
        required: true,
        minLength: 10,
        maxLength: 2000
      });
      if (!descVal.valid) errors.push(descVal.error);
      else validatedData.description = descVal.value;
    }

    if (data.image !== undefined) {
      const imgVal = this.validateImage(data.image);
      if (!imgVal.valid) errors.push(imgVal.error);
      else validatedData.image = imgVal.value;
    }

    if (data.category !== undefined) {
      const catVal = this.validateCategory(data.category, true);
      if (!catVal.valid) errors.push(catVal.error);
      else validatedData.category = catVal.value;
    }

    if (data.meeshoLink !== undefined) {
      const linkVal = this.validateMeeshoLink(data.meeshoLink);
      if (!linkVal.valid) errors.push(linkVal.error);
      else validatedData.meeshoLink = linkVal.value;
    }

    if (data.price !== undefined) {
      const priceVal = this.validatePrice(data.price);
      if (!priceVal.valid) errors.push(priceVal.error);
      else validatedData.price = priceVal.value;
    }

    if (data.originalPrice !== undefined) {
      const origPriceVal = this.validateOptionalPrice(data.originalPrice, 'Original price');
      if (!origPriceVal.valid) errors.push(origPriceVal.error);
      else validatedData.originalPrice = origPriceVal.value;
    }

    if (data.discountedPrice !== undefined) {
      const discPriceVal = this.validateOptionalPrice(data.discountedPrice, 'Discounted price');
      if (!discPriceVal.valid) errors.push(discPriceVal.error);
      else {
        const priceForComparison = validatedData.price || data.currentPrice;
        if (discPriceVal.value !== null && priceForComparison && discPriceVal.value >= priceForComparison) {
          errors.push('Discounted price must be less than selling price');
        } else {
          validatedData.discountedPrice = discPriceVal.value;
        }
      }
    }

    if (data.stockStatus !== undefined) {
      const stockVal = this.validateStockStatus(data.stockStatus);
      if (!stockVal.valid) errors.push(stockVal.error);
      else validatedData.stockStatus = stockVal.value;
    }

    return {
      valid: errors.length === 0,
      data: validatedData,
      errors
    };
  }
}

module.exports = ValidationService;
