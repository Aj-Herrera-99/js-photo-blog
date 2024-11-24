import * as dom from "../config/domElements.js";
import { _RESOURCE, _URL, _PARAMS, dataSaved } from "../config/globals.js";
import { getData } from "../components/api.js";
import { card, focusNote, removeNote } from "../components/card.js";
import { addNewNote, remModeAnim } from "../components/button.js";
import { popupAnim } from "../utilities/utilities.js";

// modalita remove, default false
let remMode = false;
// modalita finestra, default false
let modalMode = false;

// Immediately Invoked Function Expressions (IIFE) to execute async await
// Caricamento elementi starter della pagina
(async function () {
    // dati presi da una chiamata ajax
    let myData = await getData(_URL + _RESOURCE, _PARAMS, dataSaved);
    let template = await myData.map((data) =>
        card({ ...data }, dom.$notesWrapper)
    );
    dom.$notesWrapper.insertAdjacentHTML("beforeend", template.join(""));
})();

// Event delegation a main riguardo il click
dom.$main.addEventListener("click", function (e) {
    // se target è la note fai questo
    if (e.target.closest(dom.noteClass)) {
        console.log("note");
        let note = e.target.closest(dom.noteClass);
        // fai focus sulla card se non e attivo remMode
        if (!remMode) {
            modalModeAnim(note);
        } else {
            // se remMode è attivo, rimuovi card
            removeNote(note);
        }
    }
    // se target è add btn fai questo
    if (e.target.id === dom.addBtnId) {
        console.log("add btn");
        // aggiungi note
        addNewNote();
    }
    // se target è remove btn fai questo
    if (e.target.id === dom.removeBtnId) {
        console.log("remove btn");
        // attiva remMode
        remMode = !remMode;
        remModeAnim(remMode);
    }
    // se target è escRemove btn fai questo
    if (e.target.id === dom.escRemoveBtnId) {
        console.log("escRemove btn");
        // disattiva remMode
        remMode = !remMode;
        remModeAnim(remMode);
    }
    return;
});

// popup modal click event
dom.$popupModalBtn.addEventListener("click", function (e) {
    console.log("popupModal btn");
    modalModeAnim(document.querySelector("." + dom.modal));
});

// window keyup event (only for ESC)
window.addEventListener("keyup", function (e) {
    if (e.key === "Escape" && modalMode) {
        console.log("Escape key");
        modalModeAnim(document.querySelector("." + dom.modal));
    }
});

function modalModeAnim(targetFocused) {
    modalMode = !modalMode;
    focusNote(targetFocused);
    popupAnim(dom.$popupModalBtn, modalMode);
}
