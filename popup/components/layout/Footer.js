import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="flex items-center justify-center w-full gap-2 px-2 pt-4 pb-8">
      {/* <button
      <button
        onClick={() => window.close()}
        type="button"
        className="inline-flex items-center px-4 py-2 text-[15px] font-bold text-white border border-transparent rounded-full shadow-sm bg-accentThree hover:bg-accentFive focus:outline-none w-fi duration-200"
      >
        Fechar
      </button>
      */}
      <Link href="feedback">
        <button
          className="inline-flex items-center px-4 py-2 text-[15px] font-bold text-white border border-transparent rounded-full shadow-sm bg-accentThree hover:bg-accentFive focus:outline-none w-fit duration-200"
          type="button"
        >
          Dar Feedback
        </button>
      </Link>
    </footer>
  )
}

export default Footer
