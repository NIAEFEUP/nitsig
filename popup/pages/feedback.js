import Container from "../components/layout/Container"
import Header from "../components/layout/Header"
import { useState } from "react"
import { Toaster, toast } from "react-hot-toast"

const FORMS_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSdvLEl7FzXEtcq-ZeD1Lrm_1S-CTmCBc3-_AwXmWAw1LU3Z9A/formResponse"

const FeedBackPage = () => {

  const [bugReport, setBugReport] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const submitFeedback = async () => {
    if (title.length === 0 || description.length === 0) {
      return toast.error("Preencha todos os campos")
    }

    const url = new URL(FORMS_LINK);
    url.searchParams.append("entry.685094821", bugReport ? "Bug" : "Sugestão")
    url.searchParams.append("entry.1903295036", title)
    url.searchParams.append("entry.1357581566", description)
    fetch(url)

    toast.success("Enviado com sucesso!")
    setTitle("")
    setDescription("")
  }

  return (
    <Container>
      <Header />
      <main className="flex flex-col p-2 gap-y-4">
        <div className="flex justify-center gap-0">
          <button
            onClick={() => setBugReport(false)}
            className={"font-semibold px-4 py-2 rounded-l-3xl transition-colors duration-200 " +
              (bugReport
                ? "bg-bgTwo dark:bg-bgTwoDark text-accentOne dark:text-accentOneDark dark:text-opacity-60"
                : "bg-accentThree text-white ")
            }
          >
            Sugestão
          </button>
          <button
            onClick={() => setBugReport(true)}
            className={"font-semibold px-4 py-2 pr-6 rounded-r-3xl transition-colors duration-200 " +
              (!bugReport
                ? "bg-bgTwo dark:bg-bgTwoDark text-accentOne dark:text-accentOneDark dark:text-opacity-60"
                : "bg-accentThree text-white ")
            }
          >
            Bug
          </button>
        </div>
        <label className="flex flex-col gap-1 text-sm font-bold dark:text-accentOneDark text-accentOne">
          Título
          <input type="text" className="w-full px-4 py-3 text-[15px] font-semibold border border-transparent shadow-sm focus:outline-none dark:bg-bgTwoDark bg-bgTwo rounded-2xl dark:placeholder-accentOneDark dark:placeholder-opacity-60" placeholder="Breve título"
            value={title} onChange={e => setTitle(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold dark:text-accentOneDark text-accentOne">
          Descrição
          <textarea className="min-h-[8em] w-full px-4 py-3 text-[15px] font-semibold border border-transparent shadow-sm focus:outline-none dark:bg-bgTwoDark bg-bgTwo rounded-2xl dark:placeholder-accentOneDark dark:placeholder-opacity-60" placeholder="Descrição"
            value={description} onChange={e => setDescription(e.target.value)}
          />
        </label>
      </main>
      <footer className="flex items-center justify-center w-full gap-2 px-2 pt-4 pb-8">
        <button
          onClick={() => history.back()}
          type="button"
          className="inline-flex items-center px-4 py-2 text-[15px] font-bold text-white border border-transparent rounded-full shadow-sm bg-gray-700 hover:bg-opacity-90 duration-200 focus:outline-none w-fit"
        >
          Cancelar
        </button>
        <button
          className="inline-flex items-center px-4 py-2 text-[15px] font-bold text-white border border-transparent rounded-full shadow-sm bg-accentThree hover:bg-accentFive duration-200 focus:outline-none w-fit"
          type="button" onClick={submitFeedback}
        >
          Submeter
        </button>
      </footer>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
    </Container>
  )
}

export default FeedBackPage
