const Header = () => (
  <header className="text-center">
    <div className="flex items-center justify-center">
      <h1 className="text-xl font-extrabold">
        <span>Nitsig</span>
      </h1>
    </div>
    <p className="pt-3 pb-3 text-sm font-medium leading-5 dark:text-accentOneDark text-accentOne">
      Made by{" "}
      <a
        href="https://ni.fe.up.pt"
        target="_blank"
        rel="noreferrer"
        className="text-red hover:underline font-bold cursor-pointer"
      >
        niaefeup
      </a>
    </p>
  </header>
)

export default Header
