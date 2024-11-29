// Utility function to create data for `injectAllChanges()`

type Changes = {
    [key: string]: chrome.storage.StorageChange;
};

export default function constructNewData(changes: Changes): {
    [key: string]: unknown;
} {
    // Creates an array of objects from changes
    // The value of each object is the new value
    const newValuesArray = Object.entries(changes).map(
        ([itemKey, itemValue]) => {
            return { [itemKey]: itemValue?.newValue };
        },
    );

    // Recreate a hash map to pass to `injectAllChanges()`
    const newChangesData = Object.fromEntries(
        newValuesArray.map((item) => {
            const itemKey = Object.keys(item)[0];
            const itemValue = Object.values(item)[0];
            return [itemKey, itemValue];
        }),
    );

    return newChangesData;
}
