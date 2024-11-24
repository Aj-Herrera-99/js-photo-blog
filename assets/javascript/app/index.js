import * as dom from "../config/domElements.js";
import { _RESOURCE, _URL, _PARAMS, dataSaved } from "../config/globals.js";
import { getData } from "../components/api.js";
import { card, focusNote, removeNote } from "../components/card.js";
import { addNewNote, remModeAnim } from "../components/button.js";

let remMode = false;

// Immediately Invoked Function Expressions (IIFE) to execute async await
(async function () {
    // dati presi da una chiamata ajax
    let myData = await getData(_URL + _RESOURCE, _PARAMS, dataSaved);
    let template = await myData.map((data) =>
        card({ ...data }, dom.$notesWrapper)
    );
    dom.$notesWrapper.insertAdjacentHTML("beforeend", template.join(""));
})();

dom.$main.addEventListener("click", function (e) {
    // se target è la note fai questo
    if (e.target.closest(dom.noteClass)) {
        console.log("note");
        let note = e.target.closest(dom.noteClass);
        // fai focus sulla card se non e attivo remMode
        if (!remMode) {
            focusNote(note);
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
        remMode = true;
        remModeAnim(remMode);
    }
    // se target è escRemove btn fai questo
    if (e.target.id === dom.escRemoveBtnId) {
        console.log("escRemove btn");
        // disattiva remMode
        remMode = false;
        remModeAnim(remMode);
    }
    return;
});
