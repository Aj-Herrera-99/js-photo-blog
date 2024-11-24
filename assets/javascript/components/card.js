import * as dom from "../config/domElements.js";
import { dataSaved } from "../config/globals.js";

export function card({ albumId, id, title, url }) {
    return `<figure class="note d-flex flex-wrap" id="${id}" albumid="${albumId}">
                    <div class="pin"><img src="./assets/img/pin.svg" alt="pin"></div>
                    <img class="note-image" src="${url}" alt="img">
                    <figcaption class="d-flex items-center text-capitalize">${title}</figcaption>
                </figure>   `;
}

export function focusNote(target) {
    // invoco funzione che gestisce la finestra modale prendendo
    // come target note
    // se il ritorno è true (apro modale), aggiungo ascoltatori
    if (triggerModalWindow(target)) {
        dom.$popupModalBtn.addEventListener("click", handleEscapeModal);
        window.addEventListener("keyup", handleEscapeModal);
    }
    // se il ritorno è false (chiudo modale), rimuovo ascoltatori
    else {
        dom.$popupModalBtn.removeEventListener("click", handleEscapeModal);
        window.removeEventListener("keyup", handleEscapeModal);
    }
}

export function removeNote(target) {
    const indexElRemove = dataSaved.findIndex(
        (el) =>
            el.albumId == target.getAttribute("albumid") && el.id == target.id
    );
    if (indexElRemove !== -1) {
        dataSaved.splice(indexElRemove, 1);
    }
    console.log(dataSaved);
    target.remove();
}

function handleEscapeModal(e) {
    if (e.currentTarget === dom.$popupModalBtn || e.key === "Escape") {
        console.log("test");
        const modalNote = document.querySelector(`.${dom.modal}`);
        if (!modalNote) return;
        if (!document.contains(modalNote)) return;
        if (!triggerModalWindow(modalNote)) {
            dom.$popupModalBtn.removeEventListener("click", handleEscapeModal);
            window.removeEventListener("keyup", handleEscapeModal);
        }
    }
}

const triggerModalWindow = (() => {
    // console.log("funzione esterna");
    let isModal = false;
    return (target) => {
        // console.log("closure");
        // seleziono pin e figcaption della note target
        const targetPin = target.querySelector(dom.pinClass);
        const targetFigcaption = target.querySelector(dom.figcaptionTag);
        // se non ho la modale aperta allora aprila
        if (!isModal) {
            isModal = true;
            popupAnim(dom.$popupModalBtn, isModal);
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
            // console.log("Modal off");
            popupAnim(dom.$popupModalBtn, isModal);
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
