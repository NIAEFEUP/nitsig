const Footer = () => {
  return (
    <footer className="flex flex-col items-center w-full px-2 pt-4 pb-8">
      <button
        onClick={() => {
          window.close();
          chrome.tabs.reload(); // reloads only current tab
        }}
        type="button"
        className="inline-flex items-center px-4 py-2 text-[15px] font-bold text-white border border-transparent rounded-full shadow-sm bg-accentThree hover:bg-accentFive focus:outline-none w-fit"
      >
        Feito
      </button>
    </footer>
  )
}

export default Footer
