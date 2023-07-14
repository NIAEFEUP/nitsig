import authenticatedLink from "./authenticatedLink";
import iconBanners from "./icons/banner";
import iconBgImages from "./icons/bgimage";
import iconFA from "./icons/fa";
import iconImages from "./icons/image";
import overrideFunctions from "./overrideFunctions";
import reverseDate from "./reverseDate";

export type Module = (mutation: MutationRecord) => unknown;

const modules = [
    authenticatedLink,
    iconBanners,
    iconBgImages,
    iconFA,
    iconImages,
    overrideFunctions,
    reverseDate,
] as const satisfies readonly Module[];

export default modules;
