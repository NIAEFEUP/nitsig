import type { Module } from "..";

export const onceModule = (f: () => unknown): Module => {
    let done = false;

    return () => {
        if (done) return;
        done = true;
        return f();
    };
};
