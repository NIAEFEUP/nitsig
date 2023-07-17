import React from "react";

const Footer = () => {
    return (
        <footer className="flex w-full flex-col items-center px-2 pb-8 pt-4">
            <button
                onClick={() => window.close()}
                type="button"
                className="bg-accentThree hover:bg-accentFive inline-flex w-fit items-center rounded-full border border-transparent px-4 py-2 text-[15px] font-bold text-white shadow-sm focus:outline-none">
                Feito
            </button>
        </footer>
    );
};

export default Footer;
