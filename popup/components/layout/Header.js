const Header = () => (
    <header className="text-center">
        <div className="flex items-center justify-center">
            <img
                src="./logo-extended.png"
                alt="NitSig Logo"
                className="h-16 pt-2 dark:hidden"
            />
            <img
                src="./logo-extended-white.png"
                alt="NitSig Logo"
                className="hidden h-16 pt-2 dark:block"
            />
        </div>
        <p className="pt-1 pb-3 text-sm font-medium leading-5 dark:text-accentOneDark text-accentOne">
            Made by{" "}
            <a
                href="https://niaefeup.pt"
                target="_blank"
                rel="noreferrer"
                className="font-bold cursor-pointer text-red hover:underline"
            >
                niaefeup
            </a>
        </p>
    </header>
);

export default Header;
