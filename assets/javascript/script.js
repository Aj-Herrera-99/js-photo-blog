"use strict";
// =============================================================================
// ******************* INITIAL SETTINGS ******************************
// =============================================================================
// constant
const _URL = "https://jsonplaceholder.typicode.com/";
const _RESOURCE = "photos";
const _KEY = "_limit";
const _VALUE = "10";
// important ids, classes, tags selections
const escapeId = "escape";
const notesWrapperClass = ".notes-wrapper";
const noteClass = ".note";
const noteImageClass = ".note-image";
const loaderClass = ".loader";
const pinClass = ".pin";
const figcaptionTag = "figcaption";
// css classes
const layover = "layover";
const modal = "modal";
const active = "active";
const hoverOn = "hover-on";
const hideParent = "hide-parent";
const dNone = "d-none";
// =============================================================================
// ******************* STARTING POINT ******************************
// =============================================================================
// DOM elements selection $prefix
const $noteImages = document.querySelectorAll(noteImageClass);
const $notesWrapper = document.querySelector(notesWrapperClass);
const $figcaptions = document.querySelectorAll(figcaptionTag);
const $escape = document.getElementById(escapeId);
// other variables
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
const params = {};
params[_KEY] = _VALUE;
// simulazione loader ( sicuramente da cambiare ) => dopo un tot prendo i dati della chiamata
setTimeout(() => {
    document.body.classList.remove(layover);
    document.querySelector(loaderClass).classList.remove(active);
}, 500);

// dati presi da una chiamata ajax
const myData = await getData(url + resource, params);
// costruisco template a partire dai dati ricevuti e li inserisco in un contenitore
buildTemplateFrom(myData, $notesWrapper);

// =============================================================================
// ********************  EVENT LISTENERS  ************************************
// =============================================================================
// notes click event
$notesWrapper
    .querySelectorAll(noteClass)
    .forEach((note) => note.addEventListener("click", handleNoteClick));

// window listener
window.addEventListener("keyup", (e) => {
    if (e.key === "Escape" && isModal) {
        isModal = triggerModalWindow(
            document.querySelector(`.${modal}`),
            isModal
        );
    }
});
// escape button click event
$escape.addEventListener("click", () => {
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

// =============================================================================
//! ********************  FUNCTIONS  ************************************
// =============================================================================
async function getData(completeUrl, params) {
    try {
        const res = await axios.get(completeUrl, { params });
        return res.data;
    } catch (e) {
        console.error(e);
    }
}

function buildTemplateFrom(data, wrapperElement) {
    let template = "";
    for (let i = 0; i < data.length; i++) {
        template += `<figure class="note d-flex flex-wrap">
                    <div class="pin"><img src="./assets/img/pin.svg" alt="pin"></div>
                    <img class="note-image" src="${data[i].url}" alt="img">
                    <figcaption class="d-flex items-center text-capitalize">${data[i].title}</figcaption>
                </figure>   `;
    }
    wrapperElement.innerHTML = template;
}

function triggerModalWindow(target, modalState) {
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
            $escape.classList.add(active);
            // dopo tot ms, il message scompare
            escTimeout = setTimeout(() => {
                $escape.classList.remove(active);
            }, 2000);
        }
        // se ho una modale aperta, rimuovo forzatamente il timeout che rimuove il message dopo tot ms
        else {
            clearTimeout(escTimeout);
            // rimuovo (usando una classe) il message a tempo zero
            $escape.classList.remove(active);
        }
    }
}
