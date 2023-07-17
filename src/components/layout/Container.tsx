import React, { PropsWithChildren } from "react";

const Container = ({ children }: PropsWithChildren) => (
    <div className="relative flex w-[350px] max-w-full flex-col p-1 font-sans font-normal text-black dark:text-white">
        {children}
    </div>
);

export default Container;
