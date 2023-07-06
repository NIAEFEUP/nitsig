export const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));

export const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

export const lcmAll = (...numbers: number[]) => numbers.reduce(lcm);
