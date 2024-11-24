import * as dom from "../config/domElements.js";
import { card } from "./card.js";
import { getData } from "./api.js";
// import { handleFocus } from "./card.js";
import { getRndInteger as random } from "../utilities/utilities.js";
import { _RESOURCE, _URL, dataSaved } from "../config/globals.js";

export async function addNewNote() {
    let myData = await getData(
        _URL + _RESOURCE,
        {
            id: random(1, 100).toString(),
        },
        dataSaved
    );
    let template = await myData.map((data) =>
        card({ ...data }, dom.$notesWrapper)
    );
    dom.$notesWrapper.insertAdjacentHTML("beforeend", template.join(""));
    if (dom.$notesWrapper.childElementCount) {
        dom.$notesWrapper.lastElementChild.scrollIntoView();
    }
}

export function remModeAnim(makeRemMode) {
    if (makeRemMode) {
        // transizioni su remove btn
        dom.$removeBtn.innerText = "Clicca sulla polaroid da rimuovere";
        dom.$removeBtn.disabled = true;
        dom.$removeBtn.classList.add(dom.disabled);
        // transizioni su add btn
        dom.$addBtn.classList.add(dom.dNone);
        // transizioni su escRem btn
        dom.$escRemoveBtn.classList.remove(dom.dNone);
        // transizioni su header e main
        dom.$header.classList.add(dom.dNone);
        dom.$main.style.marginTop = "0px";
        for (let note of dom.$notesWrapper.children) {
            note.classList.add("constant-tilt-shake");
        }
    } else {
        // transizioni su escRem btn
        dom.$escRemoveBtn.classList.add(dom.dNone);
        // transizioni su remove btn
        dom.$removeBtn.innerText = "Rimuovi una polaroid!";
        dom.$removeBtn.disabled = false;
        dom.$removeBtn.classList.remove(dom.disabled);
        // transizioni su add btn
        dom.$addBtn.classList.remove(dom.dNone);
        // transizioni su header e main
        dom.$header.classList.remove(dom.dNone);
        dom.$main.style.removeProperty("margin-top");
        for (let note of dom.$notesWrapper.children) {
            note.classList.remove("constant-tilt-shake");
        }
    }
}
