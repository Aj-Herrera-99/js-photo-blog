import * as dom from "../config/domElements.js"

export function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const popupAnim = (() => {
    let escTimeout;
    return (popup, makeVisible) => {
        if (makeVisible) {
            // popup message
            popup.classList.add(dom.active);
            // dopo tot ms, il message scompare
            escTimeout = setTimeout(() => {
                popup.classList.remove(dom.active);
            }, 2000);
        } else {
            // rimuovo (usando una classe) il message a tempo zero
            clearTimeout(escTimeout);
            popup.classList.remove(dom.active);
        }
    };
})();
