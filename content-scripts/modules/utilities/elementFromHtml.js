export const elementFromHtml =
    (html) => document.createRange().createContextualFragment(html);
