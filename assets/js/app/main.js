// import { getRndInteger as random } from "./utilities.js";
import { globals, domConfig, utils, api, anim, cardBtn, tempBuilder } from "../modules/bundle.js";

// DOM elements selection $prefix
const $header = document.querySelector(domConfig.headerTag);
const $main = document.querySelector(domConfig.mainTag);
const $notesWrapper = document.querySelector(domConfig.notesWrapperClass);
const $addBtn = document.getElementById(domConfig.addBtnId);
const $removeBtn = document.getElementById(domConfig.removeBtnId);
const $escRemoveBtn = document.getElementById(domConfig.escRemoveBtnId);
// other variables
let notesDataSaved = [];
const url = globals.url;
const resource = globals.resource;
const params = {
    [globals.key]:
        isNaN(globals.value) || globals.value < 0 ? 0 : globals.value,
};
// Immediately Invoked Function Expressions (IIFE) to execute async await
(async function () {
    anim.pageLoader();
    // dati presi da una chiamata ajax
    let myData = await api.getData(url + resource, params);
    notesDataSaved = [...notesDataSaved, ...myData];
    console.log(notesDataSaved);
    // costruisco template a partire dai dati ricevuti e li inserisco in un contenitore
    tempBuilder.buildTemplateFrom(myData, $notesWrapper);
})();
// =============================================================================
// ********************  EVENT LISTENERS  ************************************
// =============================================================================
// card wrapper click event delegation from note
$notesWrapper.addEventListener("click", handleNoteClick);
// add btn click event
$addBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    let myData = await api.getData(url + resource, {
        id: utils.getRndInteger(1, 100).toString(),
    });
    notesDataSaved = [...notesDataSaved, ...myData];
    tempBuilder.buildTemplateFrom(myData, $notesWrapper);
    if ($notesWrapper.childElementCount) {
        $notesWrapper.lastElementChild.scrollIntoView();
    }
});
// remove btn click event
$removeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    cardBtn.removeMode(true);
    anim.cardTiltShake($notesWrapper.children);
    anim.hideElement($header, true);
    $notesWrapper.removeEventListener("click", handleNoteClick);
    $main.addEventListener("click", handleRemoveNote);
});
// escape remove btn click event
$escRemoveBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    cardBtn.removeMode(false);
    anim.cardTiltShake($notesWrapper.children);
    anim.hideElement($header, false);
    $notesWrapper.addEventListener("click", handleNoteClick);
    $main.removeEventListener("click", handleRemoveNote);
});

// =============================================================================
// ********************  EVENT HANDLERS  ************************************
// =============================================================================
function handleNoteClick(e) {
    // il target cerca l elemento .note piu vicino ( se ce )
    let note = e.target.closest(domConfig.noteClass);
    if (!note) return;
    if (!this.contains(note)) return;
    note.scrollIntoView();
    // escape modal btn click event
    const popupModalBtn = document.getElementById(domConfig.popupModalBtnId);
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
    const popupModalBtn = document.getElementById(domConfig.popupModalBtnId);
    if (e.currentTarget === popupModalBtn || e.key === "Escape") {
        console.log("test");
        const modalNote = document.querySelector(`.${domConfig.modal}`);
        if (!modalNote) return;
        if (!document.contains(modalNote)) return;
        if (!triggerModalWindow(modalNote)) {
            popupModalBtn.removeEventListener("click", handleEscapeModal);
            window.removeEventListener("keyup", handleEscapeModal);
        }
    }
}

function handleRemoveNote(e) {
    const target = e.target.closest(domConfig.noteClass);
    if (target) {
        const indexElRemove = notesDataSaved.findIndex(
            (el) =>
                el.albumId == target.getAttribute("albumid") &&
                el.id == target.id
        );
        if (indexElRemove !== -1) {
            notesDataSaved.splice(indexElRemove, 1);
        }
        console.log(notesDataSaved);
        target.remove();
    }
}

const triggerModalWindow = (() => {
    console.log("funzione esterna");
    let isModal = false;
    const popupModalBtn = document.getElementById(domConfig.popupModalBtnId);
    return (target) => {
        console.log("closure");
        // se non ho la modale aperta allora aprila
        if (!isModal) {
            isModal = true;
            anim.popup(popupModalBtn, isModal);
            anim.cardOverlay(target, isModal);
            return isModal;
        }
        // se ho una modale aperta allora chiudila
        else {
            isModal = false;
            console.log("Modal off");
            anim.popup(popupModalBtn, isModal);
            anim.cardOverlay(target, isModal);
            return isModal;
        }
    };
})();

