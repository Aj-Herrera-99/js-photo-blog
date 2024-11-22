// card wrapper click event delegation from note
import { domConfig, anim } from "../modules/bundle.js";
import { addCardBtn } from "./button/addCardBtn.js";
import { notesDataSaved } from "../app/main.js";

export function focusCard() {
    console.log("focusCard");
    const card = document.querySelector(domConfig.noteClass);
    // sul click sulla card
    card.parentElement.addEventListener("click", handleCardFocus);
}
export function addCard() {
    console.log("addCard");
    // tramite bottone
    addCardBtn(notesDataSaved);
}
export function removeCard() {
    console.log("removeCard");
    const card = document.querySelector(domConfig.noteClass);
    // sul click sulla card
    // parte solo se removeMode On (rimuovere focus handler)
    card.parentElement.addEventListener("click", wrapperHandleCardRemove);
}

export function wrapperHandleCardRemove(e) {
    handleCardRemove(e, notesDataSaved);
}

export function handleCardFocus(e) {
    e.stopImmediatePropagation();
    // il target cerca l elemento .note piu vicino ( se ce )
    let card = e.target.closest(domConfig.noteClass);
    console.log(card);
    if (!card) return;
    if (!this.contains(card)) return;
    card.scrollIntoView();
    const popupModalBtn = document.getElementById(domConfig.popupModalBtnId);
    console.log(popupModalBtn);
    // invoco funzione che gestisce la finestra modale prendendo come target card
    // se il ritorno è true (apro modale), aggiungo ascoltatori
    if (triggerModalWindow(card, popupModalBtn)) {
        popupModalBtn.addEventListener("click", handleEscapeModal);
        window.addEventListener("keyup", handleEscapeModal);
    }
    // se il ritorno è false (chiudo modale), rimuovo ascoltatori
    else {
        popupModalBtn.removeEventListener("click", handleEscapeModal);
        window.removeEventListener("keyup", handleEscapeModal);
    }
}

function handleCardRemove(e, dataSaved) {
    e.stopImmediatePropagation();
    console.log("test");
    const target = e.target.closest(domConfig.noteClass);
    if (target) {
        const indexElRemove = dataSaved.findIndex(
            (el) =>
                el.albumId == target.getAttribute("albumid") &&
                el.id == target.id
        );
        if (indexElRemove !== -1) {
            dataSaved.splice(indexElRemove, 1);
        }
        console.log(dataSaved);
        target.remove();
    }
}

function handleEscapeModal(e) {
    const popupModalBtn = document.getElementById(domConfig.popupModalBtnId);
    if (e.currentTarget === popupModalBtn || e.key === "Escape") {
        const modalNote = document.querySelector(`.${domConfig.modal}`);
        if (!modalNote) return;
        if (!document.contains(modalNote)) return;
        if (!triggerModalWindow(modalNote, popupModalBtn)) {
            popupModalBtn.removeEventListener("click", handleEscapeModal);
            window.removeEventListener("keyup", handleEscapeModal);
        }
    }
}

const triggerModalWindow = (() => {
    console.log("triggerModalWindow");
    let isModal = false; //initial value
    //closure
    return (target, popup) => {
        console.log("closure");
        // se non ho la modale aperta allora aprila
        if (!isModal) {
            isModal = true;
            anim.popup(popup, isModal);
            anim.cardOverlay(target, isModal);
            return isModal;
        }
        // se ho una modale aperta allora chiudila
        else {
            isModal = false;
            console.log("Modal off");
            anim.popup(popup, isModal);
            anim.cardOverlay(target, isModal);
            return isModal;
        }
    };
})();


