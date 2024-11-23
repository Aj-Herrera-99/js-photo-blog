import * as dom from "../config/domElements.js";
import { triggerModalWindow } from "./operation.js";

export function card({ albumId, id, title, url }) {
    return `<figure class="note d-flex flex-wrap" id="${id}" albumid="${albumId}">
                    <div class="pin"><img src="./assets/img/pin.svg" alt="pin"></div>
                    <img class="note-image" src="${url}" alt="img">
                    <figcaption class="d-flex items-center text-capitalize">${title}</figcaption>
                </figure>   `;
}


export function handleFocus(e) {
    // il target cerca l elemento .note piu vicino ( se ce )
    let note = e.target.closest(dom.noteClass);
    if (!note) return;
    if (!this.contains(note)) return;
    note.scrollIntoView();
    // escape modal btn click event
    const popupModalBtn = document.getElementById(dom.popupModalBtnId);
    // invoco funzione che gestisce la finestra modale prendendo
    // come target note
    // se il ritorno è true (apro modale), aggiungo ascoltatori
    if (triggerModalWindow(note)) {
        popupModalBtn.addEventListener("click", handleEscapeModal);
        window.addEventListener("keyup", handleEscapeModal);
    }
    // se il ritorno è false (chiudo modale), rimuovo ascoltatori
    else {
        popupModalBtn.removeEventListener("click", handleEscapeModal);
        window.removeEventListener("keyup", handleEscapeModal);
    }
}

function handleEscapeModal(e) {
    console.log("test");
    const popupModalBtn = document.getElementById(dom.popupModalBtnId);
    if (e.currentTarget === popupModalBtn || e.key === "Escape") {
        console.log("test");
        const modalNote = document.querySelector(`.${dom.modal}`);
        if (!modalNote) return;
        if (!document.contains(modalNote)) return;
        if (!triggerModalWindow(modalNote)) {
            popupModalBtn.removeEventListener("click", handleEscapeModal);
            window.removeEventListener("keyup", handleEscapeModal);
        }
    }
}
