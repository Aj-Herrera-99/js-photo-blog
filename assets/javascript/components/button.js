import * as dom from "../config/domElements.js";
import { card } from "./card.js";
import { getData } from "./operation.js";
import { handleFocus } from "./card.js";
import { getRndInteger as random } from "../utilities/utilities.js";
import { _RESOURCE, _URL, dataSaved } from "../config/globals.js";

export function button() {
    // add btn click event
    dom.$addBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
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
    });
    // remove btn click event
    dom.$removeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        this.innerText = "Clicca sulla polaroid da rimuovere";
        this.disabled = true;
        dom.$addBtn.classList.add(dom.dNone);
        dom.$escRemoveBtn.classList.remove(dom.dNone);
        this.classList.add(dom.disabled);
        dom.$header.classList.add(dom.dNone);
        dom.$main.style.marginTop = "0px";
        for (let note of dom.$notesWrapper.children) {
            note.classList.add("constant-tilt-shake");
        }
        dom.$notesWrapper.removeEventListener("click", handleFocus);
        dom.$main.addEventListener("click", handleRemove);
    });
    // escape remove btn click event
    dom.$escRemoveBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        dom.$removeBtn.innerText = "Rimuovi una polaroid!";
        dom.$removeBtn.disabled = false;
        dom.$addBtn.classList.remove(dom.dNone);
        this.classList.add(dom.dNone);
        dom.$removeBtn.classList.remove(dom.disabled);
        dom.$header.classList.remove(dom.dNone);
        dom.$main.style.removeProperty("margin-top");
        for (let note of dom.$notesWrapper.children) {
            note.classList.remove("constant-tilt-shake");
        }
        dom.$notesWrapper.addEventListener("click", handleFocus);
        dom.$main.removeEventListener("click", handleRemove);
    });
}

export function handleRemove(e) {
    const target = e.target.closest(dom.noteClass);
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
