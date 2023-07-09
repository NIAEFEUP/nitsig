import React, { PropsWithChildren } from "react";

const Container = ({ children }: PropsWithChildren) => (
    <div className="relative flex flex-col p-1 font-sans dark:text-white text-black font-normal max-w-full w-[350px]">
        {children}
    </div>
);

export default Container;
