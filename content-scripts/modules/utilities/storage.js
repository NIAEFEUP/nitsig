/*--
- Docs: https://developer.chrome.com/docs/extensions/reference/storage/
- Use storage.local to allow user to store customizations
--*/

/*
- Get storage with storage.local
- k => "[key]" (String)
*/
export const getStorage = async (k) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const promise = new Promise((resolve, _reject) => {
        const storageKey = Array.isArray(k) ? k : [k];
        chrome?.storage?.local.get(storageKey, (data) => {
            return resolve(Array.isArray(k) ? data : data[k]);
        });
    });
    return promise;
};

/*--
- Set storage with storage.local
- kv => {key: value} (Single key value pair)
--*/
export const setStorage = async (kv) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const promise = new Promise((resolve, _reject) => {
        chrome?.storage?.local.set(kv, () => {
            return resolve(kv);
        });
    });
    return promise;
};
