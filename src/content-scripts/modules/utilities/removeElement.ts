// Utility function to remove DOM element
export default function removeElement(query) {
  const element = document.querySelector(query);
  element && element.remove();
}
