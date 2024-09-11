import LayoutContent from "./LayoutContent"

const Layout = () => (
  <section className="flex flex-col gap-y-2">
    <label
      htmlFor="user-control-interface"
      className="text-sm font-bold dark:text-accentOneDark text-accentOne"
    >
      Layout
    </label>
    <div id="user-control-interface">
      <LayoutContent />
    </div>
  </section>
)

export default Layout
