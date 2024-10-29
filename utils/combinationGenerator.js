/**
 * Converts numbers array into item codes with appropriate prefixes
 * @param {number[]} numbers - Array of numbers representing item quantities
 * @returns {string[]} Array of item codes
 */
function convertToItemCodes(numbers) {
    const itemCodes = [];
    let currentPrefix = 'A';

    // For each number in the input array
    for (let i = 0; i < numbers.length; i++) {
        const count = numbers[i];
        // Generate 'count' number of items with the current prefix
        for (let j = 1; j <= count; j++) {
            itemCodes.push(`${currentPrefix}${j}`);
        }
        // Move to next prefix
        currentPrefix = String.fromCharCode(currentPrefix.charCodeAt(0) + 1);
    }

    return itemCodes;
}

/**
 * Generates all valid combinations of items where no two items share the same prefix
 * @param {number[]} numbers - Array of numbers representing item quantities
 * @param {number} length - Desired length of combinations
 * @returns {string[][]} Array of valid combinations
 */
export function generateCombinations(numbers, length) {
    const itemCodes = convertToItemCodes(numbers);
    const result = [];

    // Create an array to track current indices
    const stack = [];
    let currentIndex = 0;

    while (currentIndex >= 0) {
        // If we have a valid combination of desired length, add it to result
        if (stack.length === length) {
            result.push(stack.map(index => itemCodes[index]));
            currentIndex = stack.pop() + 1;
            continue;
        }

        // If we've exhausted all possibilities at current position
        if (currentIndex >= itemCodes.length) {
            if (stack.length === 0) break;
            currentIndex = stack.pop() + 1;
            continue;
        }

        // Check if current item's prefix is valid
        const currentPrefix = itemCodes[currentIndex][0];
        const isValidPrefix = !stack.some(index => itemCodes[index][0] === currentPrefix);

        if (isValidPrefix) {
            stack.push(currentIndex);
            currentIndex = currentIndex + 1;
        } else {
            currentIndex++;
        }
    }

    return { combinations: result, itemCodes };
}


