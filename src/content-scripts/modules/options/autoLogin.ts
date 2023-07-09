import { rememberLogin } from "../login"

export default (value: boolean) => {
    if (value)
        rememberLogin()
}