import Section2Content from './Section2Content'

const Section1 = () => (
  <section className="flex flex-col gap-y-2">
    <label
      htmlFor="user-control-interface"
      className="text-sm font-bold dark:text-twitterAccentOneDark text-twitterAccentOne"
    >
      Section 2
    </label>
    <div id="user-control-interface">
      <Section2Content />
    </div>
  </section>
)

export default Section1