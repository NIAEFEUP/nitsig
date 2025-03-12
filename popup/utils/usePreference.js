import { useEffect, useState } from "react/cjs/react.production.min";
import { getStorage, setStorage } from "./chromeStorage";

export const usePreference = (preference) => {
    const [value, setValue] = useState(false);
    const [fftime, setFFTime] = useState(true); // Use to prevent change default value on first time

    // Get default value from storage
    useEffect(async () => {
        const defaultValue = await getStorage(preference) ?? "off";
        setValue(defaultValue === "on");
        setFFTime(false);
    }, []);

    // Change storage value on change
    useEffect(() => {
        if (fftime) return;

        setStorage({
            [preference]: value ? "on" : "off",
        });
    }, [value]);

    return [value, setValue];
}