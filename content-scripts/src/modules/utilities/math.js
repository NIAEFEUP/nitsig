/**
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export const gcd = (a, b) => (!b ? a : gcd(b, a % b));

/**
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export const lcm = (a, b) => (a * b) / gcd(a, b);   

/**
 * 
 * @param  {...number} numbers 
 * @returns {number}
 */
export const lcmAll = (...numbers) => numbers.reduce(lcm);
