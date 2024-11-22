import { domConfig } from "../modules/bundle.js";

const $addBtn = document.getElementById(domConfig.addBtnId);
const $removeBtn = document.getElementById(domConfig.removeBtnId);
const $escRemoveBtn = document.getElementById(domConfig.escRemoveBtnId);

export function removeMode(openMode) {
    if (openMode) {
        $removeBtn.innerText = "Clicca sulla polaroid da rimuovere";
        $removeBtn.disabled = true;
        $addBtn.classList.add(domConfig.dNone);
        $escRemoveBtn.classList.remove(domConfig.dNone);
        $removeBtn.classList.add(domConfig.disabled);
    } else {
        $removeBtn.innerText = "Rimuovi una polaroid!";
        $removeBtn.disabled = false;
        $addBtn.classList.remove(domConfig.dNone);
        $escRemoveBtn.classList.add(domConfig.dNone);
        $removeBtn.classList.remove(domConfig.disabled);
    }
}
