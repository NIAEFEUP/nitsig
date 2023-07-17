import teacher from "./teacher";
import schedule from "./schedule";
import account from "./account";

type Page = {
    path: RegExp;
    fun: () => unknown;
};

const pages: readonly Page[] = [
    {
        path: /func_geral\.formview/i,
        fun: teacher,
    },
    {
        path: /hor_geral\.\w+_view/i,
        fun: schedule,
    },
    {
        path: /gpag_ccorrente_geral\.conta_corrente_view/i,
        fun: account,
    },
] as const;

export default pages;
