import type { Module } from "..";

export const selectorModule =
    <
        T extends HTMLElement = HTMLElement,
        S extends string | string[] = string | string[],
    >(
        selector: S,
        module: (
            element: T,
            selector: S extends string[] ? S[number] : S,
        ) => unknown,
    ): Module =>
    (mutation) => {
        (mutation.addedNodes ?? [mutation.target]).forEach((node) => {
            (selector instanceof Array ? selector : [selector]).forEach((s) => {
                if (!(node instanceof HTMLElement)) return;

                if (node.matches(s)) module(node as T, s);
                node.querySelectorAll<T>(s).forEach((e) => module(e, s));
            });
        });
    };
