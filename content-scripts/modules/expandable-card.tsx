import { Accordion } from "../components/Accordion";

/**
 * Initializes expandable cards by replacing existing elements with Accordion components.
 * @param contentSelectors - An array of CSS selectors for the content to include in the accordion header.
 */
export const makeSigarraExpandableCard = (contentSelectors: string[]): void => {
  const containers = document.querySelectorAll<HTMLElement>(".se-expandable-card");

  containers.forEach((container, index) => {
    const headerElements = contentSelectors
      .map((selector) => Array.from(container.querySelectorAll<HTMLElement>(selector)))
      .flat();

    const allChildren = Array.from(container.children) as HTMLElement[];
    const bodyElements = allChildren.filter(child => !headerElements.includes(child));

    const accordionId = `sigarra-accordion-${index}`;

    const accordion = Accordion(
      { 
        id: accordionId,
        header: headerElements,
        max_size: 9999
      },
      ...bodyElements
    );

    container.replaceWith(accordion as unknown as Node);
  });
};
