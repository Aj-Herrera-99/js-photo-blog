// import { getRndInteger as random } from "./utilities.js";
import { globals, utils, api, anim } from "./bundle.js";
// =============================================================================
// ********************** INITIAL SETTING ***********************************
// =============================================================================
// important ids, classes, tags selections
const popupModalBtnId = "popup-modal-btn";
const addBtnId = "add-btn";
const removeBtnId = "remove-btn";
const escRemoveBtnId = "escape-remove-btn";
const notesWrapperClass = ".notes-wrapper";
const noteClass = ".note";
const loaderClass = ".loader";
const pinClass = ".pin";
const figcaptionTag = "figcaption";
const headerTag = "header";
const mainTag = "main";
// css classes
const layover = "layover";
const modal = "modal";
const active = "active";
const hoverOn = "hover-on";
const hideParent = "hide-parent";
const dNone = "d-none";
const disabled = "disabled";
// =============================================================================
// ********************** STARTING POINT ***********************************
// =============================================================================
// DOM elements selection $prefix
const $header = document.querySelector(headerTag);
const $main = document.querySelector(mainTag);
const $notesWrapper = document.querySelector(notesWrapperClass);
const notes = $notesWrapper.querySelectorAll(noteClass);
const $addBtn = document.getElementById(addBtnId);
const $removeBtn = document.getElementById(removeBtnId);
const $escRemoveBtn = document.getElementById(escRemoveBtnId);
// other variables
let notesDataSaved = [];
// media query list on toggling all hover effects
const toggleHover = window.matchMedia("(max-width: 1200px)");
// run mediaQueryList listener function in run time
handleMediaChange(toggleHover);
// http request with axios, for generating notes
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
    buildTemplateFrom(myData, $notesWrapper);
})();
// =============================================================================
// ********************  EVENT LISTENERS  ************************************
// =============================================================================
// card wrapper click event delegation from note
$notesWrapper.addEventListener("click", handleNoteClick);
// add btn click event
$addBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    let myData = await api.getData(
        url + resource,
        {
            id: utils.getRndInteger(1, 100).toString(),
        },
        notesDataSaved
    );
    notesDataSaved = [...notesDataSaved, ...myData];
    buildTemplateFrom(myData, $notesWrapper);
    if ($notesWrapper.childElementCount) {
        $notesWrapper.lastElementChild.scrollIntoView();
    }
});
// remove btn click event
$removeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    this.innerText = "Clicca sulla polaroid da rimuovere";
    this.disabled = true;
    $addBtn.classList.add(dNone);
    $escRemoveBtn.classList.remove(dNone);
    this.classList.add(disabled);
    $header.classList.add(dNone);
    $main.style.marginTop = "0px";

    anim.cardTiltShake($notesWrapper.children);

    $notesWrapper.removeEventListener("click", handleNoteClick);
    $main.addEventListener("click", handleRemoveNote);
});
// escape remove btn click event
$escRemoveBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    $removeBtn.innerText = "Rimuovi una polaroid!";
    $removeBtn.disabled = false;
    $addBtn.classList.remove(dNone);
    this.classList.add(dNone);
    $removeBtn.classList.remove(disabled);
    $header.classList.remove(dNone);
    $main.style.removeProperty("margin-top");
    
    anim.cardTiltShake($notesWrapper.children);

    $notesWrapper.addEventListener("click", handleNoteClick);
    $main.removeEventListener("click", handleRemoveNote);
});

// media query list change event
toggleHover.addEventListener("change", function () {
    handleMediaChange(this);
});

// =============================================================================
// ********************  EVENT HANDLERS  ************************************
// =============================================================================
function handleNoteClick(e) {
    // il target cerca l elemento .note piu vicino ( se ce )
    let note = e.target.closest(noteClass);
    if (!note) return;
    if (!this.contains(note)) return;
    note.scrollIntoView();
    // escape modal btn click event
    const popupModalBtn = document.getElementById(popupModalBtnId);
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
    const popupModalBtn = document.getElementById(popupModalBtnId);
    if (e.currentTarget === popupModalBtn || e.key === "Escape") {
        console.log("test");
        const modalNote = document.querySelector(`.${modal}`);
        if (!modalNote) return;
        if (!document.contains(modalNote)) return;
        if (!triggerModalWindow(modalNote)) {
            popupModalBtn.removeEventListener("click", handleEscapeModal);
            window.removeEventListener("keyup", handleEscapeModal);
        }
    }
}

function handleMediaChange(x) {
    // se max_width < 992px entra nel primo ramo => togli la classe
    // hoverOn a cui sono attaccati tutti gli hover della pagina
    // senno riaggiungi la classe al body
    console.log(x);
    x.matches
        ? document.body.classList.remove(hoverOn)
        : document.body.classList.add(hoverOn);
}

function handleRemoveNote(e) {
    const target = e.target.closest(noteClass);
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

// =============================================================================
//! ********************  IIFEs - CLOSURES - FUNCTIONS  ***********************
// =============================================================================
const triggerModalWindow = (() => {
    console.log("funzione esterna");
    let isModal = false;
    const popupModalBtn = document.getElementById(popupModalBtnId);
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

function buildTemplateFrom(data, wrapperElement) {
    if (data) {
        let template = "";
        for (let i = 0; i < data.length; i++) {
            template += `<figure class="note d-flex flex-wrap" id="${data[i].id}" albumid="${data[i].albumId}">
                    <div class="pin"><img src="./assets/img/pin.svg" alt="pin"></div>
                    <img class="note-image" src="${data[i].url}" alt="img">
                    <figcaption class="d-flex items-center text-capitalize">${data[i].title}</figcaption>
                </figure>   `;
        }
        wrapperElement.insertAdjacentHTML("beforeend", template);
    } else {
        console.error("No data found");
    }
}
