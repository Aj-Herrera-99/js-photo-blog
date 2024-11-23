import * as dom from "../config/domElements.js";
import { _MAX_OBJECTS } from "../config/globals.js";

export const triggerModalWindow = (() => {
    console.log("funzione esterna");
    let isModal = false;
    const popupModalBtn = document.getElementById(dom.popupModalBtnId);
    return (target) => {
        console.log("closure");
        // seleziono pin e figcaption della note target
        const targetPin = target.querySelector(dom.pinClass);
        const targetFigcaption = target.querySelector(dom.figcaptionTag);
        // se non ho la modale aperta allora aprila
        if (!isModal) {
            isModal = true;
            popupAnim(popupModalBtn, isModal);
            // aggiungo le classi in funzione della finestra modale
            document.body.classList.add(dom.layover);
            target.classList.add(dom.modal);
            // in modale, faccio scomparire il pin e figcaption
            // e la cornice (il parent)
            target.classList.add(dom.hideParent);
            targetPin.classList.add(dom.dNone);
            targetFigcaption.classList.add(dom.dNone);
            return isModal;
        }
        // se ho una modale aperta allora chiudila
        else {
            isModal = false;
            console.log("Modal off");
            popupAnim(popupModalBtn, isModal);
            // rimuovo le classi in funzione della finestra modale
            document.body.classList.remove(dom.layover);
            target.classList.remove(dom.modal);
            // se non ho la modale, faccio riapparire pin e figcaption e la cornice
            target.classList.remove(dom.hideParent);
            targetPin.classList.remove(dom.dNone);
            targetFigcaption.classList.remove(dom.dNone);
            return isModal;
        }
    };
})();

const popupAnim = (() => {
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

export async function getData(completeUrl, params, saving) {
    try {
        const res = await axios.get(completeUrl, { params });
        if (res.data.length > _MAX_OBJECTS) {
            throw new Error(
                `Cannot request more than ${_MAX_OBJECTS} objects in the page`
            );
        }
        const data = await res.data;
        data.forEach((data) => saving.push(data));
        console.log(saving);
        // loader animation
        document.body.classList.remove(dom.layover);
        document.querySelector(dom.loaderClass).classList.remove(dom.active);
        return data;
    } catch (e) {
        console.error(e);
        // loader animation
        document.body.classList.remove(dom.layover);
        document.querySelector(dom.loaderClass).classList.remove(dom.active);
        // return an empty array
        return [];
    }
}
