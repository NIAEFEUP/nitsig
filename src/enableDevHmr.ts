import RefreshRuntime from "react-refresh";

declare global {
    interface Window {
        $RefreshReg$: () => void;
        $RefreshSig$: () => (type: unknown) => unknown;
        __vite_plugin_react_preamble_installed__: boolean;
    }
}

if (import.meta.hot) {
    RefreshRuntime.injectIntoGlobalHook(window);
    window.$RefreshReg$ = () => undefined;
    window.$RefreshSig$ = () => (type: unknown) => type;
    window.__vite_plugin_react_preamble_installed__ = true;
}
