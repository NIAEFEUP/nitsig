// Utility function to remove DOM element
export default function removeElement(query: string) {
    const element = document.querySelector(query);
    element && element.remove();
}
