import Section1Content from './Section1Content'

const Section1 = () => (
  <section className="flex flex-col gap-y-2">
    <label
      htmlFor="user-control-interface"
      className="text-sm font-bold dark:text-twitterAccentOneDark text-twitterAccentOne"
    >
      Section 1
    </label>
    <div id="user-control-interface">
      <Section1Content />
    </div>
  </section>
)

export default Section1