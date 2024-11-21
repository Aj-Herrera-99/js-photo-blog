import random from "./utilities.js";
// =============================================================================
// ******************* INITIAL SETTINGS ******************************
// =============================================================================
// constant
const _URL = "https://jsonplaceholder.typicode.com/";
const _RESOURCE = "photos";
const _KEY = "_limit";
const _VALUE = "6";
// important ids, classes, tags selections
const escapeBtnId = "escape-btn";
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
// ******************* STARTING POINT ******************************
// =============================================================================
// DOM elements selection $prefix
const $header = document.querySelector(headerTag);
const $main = document.querySelector(mainTag);
const $notesWrapper = document.querySelector(notesWrapperClass);
const $escapeBtn = document.getElementById(escapeBtnId);
const $addBtn = document.getElementById(addBtnId);
const $removeBtn = document.getElementById(removeBtnId);
const $escRemoveBtn = document.getElementById(escRemoveBtnId);
// other variables
const notesDataSaved = [];
let trashMode = false;
// for modal window and escape info message
let isModal = false;
let escTimeout;
// media query list on toggling all hover effects
const toggleHover = window.matchMedia("(max-width: 992px)");
// run mediaQueryList listener function in run time
handleMediaChange(toggleHover);
// http request with axios, for generating notes
const url = _URL;
const resource = _RESOURCE;
const params = {
    [_KEY]: _VALUE,
};
// simulazione loader ( sicuramente da cambiare ) => dopo un tot prendo i dati della chiamata
setTimeout(() => {
    document.body.classList.remove(layover);
    document.querySelector(loaderClass).classList.remove(active);
}, 500);
// =============================================================================
// ********************  EVENT LISTENERS  ************************************
// =============================================================================
// Immediately Invoked Function Expressions (IIFE) to execute async await
(async function () {
    // dati presi da una chiamata ajax
    let myData = await getData(url + resource, params, notesDataSaved);
    // costruisco template a partire dai dati ricevuti e li inserisco in un contenitore
    buildTemplateFrom(myData, $notesWrapper);
    // notes click event
    $notesWrapper
        .querySelectorAll(noteClass)
        .forEach((note) => note.addEventListener("click", handleNoteClick));
})();

// window keyup event
window.addEventListener("keyup", (e) => {
    if (e.key === "Escape" && isModal) {
        isModal = triggerModalWindow(
            document.querySelector(`.${modal}`),
            isModal
        );
    }
});
// add btn click event
$addBtn.addEventListener("click", async () => {
    let myData = await getData(
        url + resource,
        {
            id: random(0, 100).toString(),
        },
        notesDataSaved
    );
    buildTemplateFrom(myData, $notesWrapper);
    $notesWrapper.lastElementChild.addEventListener("click", handleNoteClick);
    $notesWrapper.lastElementChild.scrollIntoView();
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
    trashMode = true;
    for (let note of $notesWrapper.children) {
        note.classList.add("constant-tilt-shake");
    }
    window.addEventListener("click", handleRemoveNote);
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
    for (let note of $notesWrapper.children) {
        note.classList.remove("constant-tilt-shake");
    }
    trashMode = false;
    window.removeEventListener("click", handleRemoveNote);
});
// escape btn click event
$escapeBtn.addEventListener("click", () => {
    isModal = triggerModalWindow(document.querySelector(`.${modal}`), isModal);
});
// media query list change event
toggleHover.addEventListener("change", function () {
    handleMediaChange(this);
});

// =============================================================================
// ********************  EVENT HANDLERS  ************************************
// =============================================================================
function handleNoteClick(e) {
    isModal = triggerModalWindow(this, isModal);
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
        target.remove();
    }
}

// =============================================================================
//! ********************  FUNCTIONS  ************************************
// =============================================================================
async function getData(completeUrl, params, saving) {
    try {
        const res = await axios.get(completeUrl, { params });
        const data = await res.data;
        data.forEach((data) => saving.push(data));
        console.log(saving);
        return data;
    } catch (e) {
        console.error(e);
    }
}

function buildTemplateFrom(data, wrapperElement) {
    let template = "";
    for (let i = 0; i < data.length; i++) {
        template += `<figure class="note d-flex flex-wrap" id="${data[i].id}" albumid="${data[i].albumId}">
                    <div class="pin"><img src="./assets/img/pin.svg" alt="pin"></div>
                    <img class="note-image" src="${data[i].url}" alt="img">
                    <figcaption class="d-flex items-center text-capitalize">${data[i].title}</figcaption>
                </figure>   `;
    }
    wrapperElement.insertAdjacentHTML("beforeend", template);
}

function triggerModalWindow(target, modalState) {
    if (trashMode) {
        return false;
    }
    // chiamo la funzione che gestisce l'escape btn
    triggerEscapeBtn(modalState);
    // seleziono pin e figcaption della note target
    const targetPin = target.querySelector(pinClass);
    const targetFigcaption = target.querySelector(figcaptionTag);
    // se non ho la modale aperta allora aprila
    if (!modalState) {
        // aggiungo le classi in funzione della finestra modale
        document.body.classList.add(layover);
        target.classList.add(modal);
        target.classList.add(hideParent);
        // in modale, faccio scomparire il pin e figcaption
        targetPin.classList.add(dNone);
        targetFigcaption.classList.add(dNone);
        // ritorno true alla variabile isModal (vedere invocazione)
        return true;
    }
    // se ho una modale aperta allora chiudila
    else {
        // rimuovo le classi in funzione della finestra modale
        document.body.classList.remove(layover);
        target.classList.remove(modal);
        target.classList.remove(hideParent);
        // se non ho la modale, faccio apparire pin e figcaption
        targetPin.classList.remove(dNone);
        targetFigcaption.classList.remove(dNone);
        // ritorno false alla variabile isModal (vedere invocazione)
        return false;
    }
    // funzione interna usata solo dalla funzione esterna
    function triggerEscapeBtn(modalState) {
        // se non ho la modale aperta, compare l'escape message
        if (!modalState) {
            // escape message
            $escapeBtn.classList.add(active);
            // dopo tot ms, il message scompare
            escTimeout = setTimeout(() => {
                $escapeBtn.classList.remove(active);
            }, 2000);
        }
        // se ho una modale aperta, rimuovo forzatamente il timeout che rimuove il message dopo tot ms
        else {
            clearTimeout(escTimeout);
            // rimuovo (usando una classe) il message a tempo zero
            $escapeBtn.classList.remove(active);
        }
    }
}
