import React from "react";
import ReactDOM from "react-dom/client";

export default (Component: React.ElementType) => {
    ReactDOM.createRoot(document.body).render(
        <React.StrictMode>
            <Component />
        </React.StrictMode>,
    );
};
