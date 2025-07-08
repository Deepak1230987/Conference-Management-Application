/**
 * Generates a custom user ID in the format "ICTACEM123"
 * The ID consists of the constant prefix "ICTACEM" followed by three numbers
 * @returns {string} A custom ID
 */
export const generateCustomUserId = () => {
    // Fixed prefix as requested
    const prefix = 'ICTACEM2025P';

    // Generate a random 3-digit number (000-999)
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    // Combine for final ID (e.g., ICTACEM123)
    return prefix + randomNum;
};

/**
 * Checks if a generated ID already exists in the database
 * @param {Model} model - The mongoose model to check against
 * @param {string} id - The ID to check
 * @returns {Promise<boolean>} True if ID exists, false otherwise
 */
export const isIdUnique = async (model, id) => {
    const existingUser = await model.findOne({ customUserId: id });
    return !existingUser;
};

/**
 * Generates a unique custom user ID that doesn't exist in the database
 * @param {Model} model - The mongoose model to check against
 * @returns {Promise<string>} A unique custom ID
 */
export const generateUniqueCustomUserId = async (model) => {
    let id = generateCustomUserId();
    let isUnique = await isIdUnique(model, id);

    // Keep generating until we find a unique ID
    while (!isUnique) {
        id = generateCustomUserId();
        isUnique = await isIdUnique(model, id);
    }

    return id;
};