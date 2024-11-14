const Section = ({ title, children }) => (
    <section className="flex flex-col gap-y-2">
        <label
            htmlFor="user-control-interface"
            className="text-sm font-bold dark:text-accentOneDark text-accentOne"
        >
            {title}
        </label>
        <div id="user-control-interface">
            <form className="flex flex-col items-center justify-between px-4 dark:bg-bgTwoDark bg-bgTwo rounded-2xl">
                <div className="w-full py-4">
                    <div className="flex flex-col gap-y-4">{children}</div>
                </div>
            </form>
        </div>
    </section>
);

export default Section;
