import { domConfig } from "../bundle.js";

export function pageLoader() {
    // loader animation
    document.body.classList.remove(domConfig.layover);
    document
        .querySelector(domConfig.loaderClass)
        .classList.remove(domConfig.active);
}

export const popup = (() => {
    let escTimeout;
    return (popup, makeVisible) => {
        if (makeVisible) {
            // popup message
            popup.classList.add(domConfig.active);
            // dopo tot ms, il message scompare
            escTimeout = setTimeout(() => {
                popup.classList.remove(domConfig.active);
            }, 2000);
        } else {
            // rimuovo (usando una classe) il message a tempo zero
            clearTimeout(escTimeout);
            popup.classList.remove(domConfig.active);
        }
    };
})();

export function cardOverlay(target, makeOverlay) {
    // seleziono pin e figcaption della note target
    const targetPin = target.querySelector(domConfig.pinClass);
    const targetFigcaption = target.querySelector(domConfig.figcaptionTag);
    if (makeOverlay) {
        document.body.classList.add(domConfig.layover);
        target.classList.add(domConfig.modal);
        // in modale, faccio scomparire il pin e figcaption
        // e la cornice (il parent)
        target.classList.add(domConfig.hideParent);
        targetPin.classList.add(domConfig.dNone);
        targetFigcaption.classList.add(domConfig.dNone);
    } else {
        document.body.classList.remove(domConfig.layover);
        target.classList.remove(domConfig.modal);
        // in modale, faccio scomparire il pin e figcaption
        // e la cornice (il parent)
        target.classList.remove(domConfig.hideParent);
        targetPin.classList.remove(domConfig.dNone);
        targetFigcaption.classList.remove(domConfig.dNone);
    }
}

export function cardTiltShake(cards, makeShake) {
    if (
        cards.constructor.name === "HTMLCollection" ||
        cards.constructor.name === "NodeList"
    ) {
        for (const card of cards) {
            card.classList.toggle(domConfig.constTiltShake);
        }
    }
    else if(cards.constructor.name.includes("HTML")){
        cards.classList.toggle(domConfig.constTiltShake);
    } else {
        console.error("Data is not an HTML element");
    }
}
