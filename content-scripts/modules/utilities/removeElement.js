// Utility function to remove DOM element
export default function removeElement(query) {
    const element = document.querySelector(query);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    element && element.remove();
}
