import Container from "../components/layout/Container"
import Header from "../components/layout/Header"
import Link from 'next/link'
import { useState } from "react"

const FeedBackPage = () => {

  const [bugReport, setBugReport] = useState(false)

  return (
    <Container>
      <Header />
      <main className="flex flex-col p-2 gap-y-4">
        <div className="flex justify-center gap-0">
          <button
            onClick={() => setBugReport(false)}
            className={"font-semibold px-4 py-2 rounded-l-3xl transition-colors duration-200 " +
              ( bugReport
                ? "bg-bgTwo dark:bg-bgTwoDark text-accentOne"
                : "bg-accentThree text-white " )
            }
          >
            Sugestão
          </button>
          <button
            onClick={() => setBugReport(true)}
            className={"font-semibold px-4 py-2 pr-6 rounded-r-3xl transition-colors duration-200 " + 
            (!bugReport
              ? "bg-bgTwo dark:bg-bgTwoDark text-accentOne"
              : "bg-accentThree text-white " )
          }
          >
            Bug
          </button>
        </div>
        <label className="flex flex-col gap-1 text-sm font-bold dark:text-accentOneDark text-accentOne">
          Título
          <input type="text" className="w-full px-4 py-3 text-[15px] font-semibold border border-transparent shadow-sm focus:outline-none dark:bg-bgTwoDark bg-bgTwo rounded-2xl" placeholder="Breve título" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold dark:text-accentOneDark text-accentOne">
          Descrição
          <textarea className="min-h-[8em] w-full px-4 py-3 text-[15px] font-semibold border border-transparent shadow-sm focus:outline-none dark:bg-bgTwoDark bg-bgTwo rounded-2xl" placeholder="Descrição" />
        </label>
      </main>
      <footer className="flex items-center justify-center w-full gap-2 px-2 pt-4 pb-8">
        <button
          onClick={() => history.back()}
          type="button"
          className="inline-flex items-center px-4 py-2 text-[15px] font-bold text-white border border-transparent rounded-full shadow-sm bg-accentThree hover:bg-accentFive focus:outline-none w-fit"
        >
          Cancelar
        </button>
        <Link href="feedback">
          <button
            className="inline-flex items-center px-4 py-2 text-[15px] font-bold text-white border border-transparent rounded-full shadow-sm bg-accentThree hover:bg-accentFive focus:outline-none w-fit"
            type="button"
          >
            Submeter
          </button>
        </Link>
      </footer>
    </Container>
  )
}

export default FeedBackPage
