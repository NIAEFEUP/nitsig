export const keys = <T extends object>(obj: T) =>
    Object.keys(obj) as (keyof T)[];
