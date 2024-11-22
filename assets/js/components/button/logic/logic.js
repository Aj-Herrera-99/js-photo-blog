import { domConfig, anim } from "../../../modules/bundle.js";

import { handleCardFocus, wrapperHandleCardRemove } from "../../card.js";

const $addBtn = document.getElementById(domConfig.addBtnId);
const $removeBtn = document.getElementById(domConfig.removeBtnId);
const $escRemoveBtn = document.getElementById(domConfig.escRemoveBtnId);
const $notesWrapper = document.querySelector(domConfig.notesWrapperClass);
const $header = document.querySelector(domConfig.headerTag);

export function removeMode(openMode) {
    if (openMode) {
        $removeBtn.innerText = "Clicca sulla polaroid da rimuovere";
        $removeBtn.disabled = true;
        $addBtn.classList.add(domConfig.dNone);
        $escRemoveBtn.classList.remove(domConfig.dNone);
        $removeBtn.classList.add(domConfig.disabled);
        anim.cardTiltShake($notesWrapper.children, openMode);
        anim.hideElement($header, openMode);

        $notesWrapper.removeEventListener("click", handleCardFocus);
        $notesWrapper.addEventListener("click", wrapperHandleCardRemove);
    } else {
        $removeBtn.innerText = "Rimuovi una polaroid!";
        $removeBtn.disabled = false;
        $addBtn.classList.remove(domConfig.dNone);
        $escRemoveBtn.classList.add(domConfig.dNone);
        $removeBtn.classList.remove(domConfig.disabled);
        anim.cardTiltShake($notesWrapper.children, openMode);
        anim.hideElement($header, openMode);

        $notesWrapper.addEventListener("click", handleCardFocus);
        $notesWrapper.removeEventListener("click", wrapperHandleCardRemove);
    }
}
