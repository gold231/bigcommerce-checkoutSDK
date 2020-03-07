/**
 *
 * Extract a pseudo element's content, useful for responsive testing.
 * @param {HTMLElement} element The pseudo element's parent to obtain the content from
 * @param {string} pseudoElement ::after or ::before
 *
 */

function getContentFromCSS(element, pseudoElement = ':after') {
  if (element) {
    const content = window.getComputedStyle(element, pseudoElement).content;
    return content.replace(/['"]+/g, '');
  }
}

export {
  getContentFromCSS,
};
