export const keys = <T extends object>(obj: T) =>
    Object.keys(obj) as (keyof T)[];

export const entries = <T extends object>(obj: T) =>
    Object.entries(obj) as [keyof T, T[keyof T]][];

export const map = <T extends object, U>(
    obj: T,
    fn: (value: T[keyof T], key: keyof T) => U,
) =>
    Object.fromEntries(keys(obj).map((key) => [key, fn(obj[key], key)])) as {
        [key in keyof T]: U;
    };
