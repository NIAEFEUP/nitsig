import { expandir_colapsar } from "./expand-collapse";

declare global {
    interface Window {
        expandir_colapsar: typeof expandir_colapsar;
    }
}

window.expandir_colapsar = expandir_colapsar;
