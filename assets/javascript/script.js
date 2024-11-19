"use strict";
// important ids classes tags
const notesWrapperClass = ".notes-wrapper";
const noteClass = ".note";
const noteImageClass = ".note-image";
const figcaptionTag = "figcaption";
const escapeId = "escape";
// css classes
const layover = "layover";
const overflowHidden = "overflow-hidden";
// DOM elements selection
const $noteImages = document.querySelectorAll(noteImageClass);
const $figcaptions = document.querySelectorAll(figcaptionTag);
const $escape = document.getElementById(escapeId);
const $notesWrapper = document.querySelector(notesWrapperClass);
// other variables
let isModal = false;
let escTimeout;
const NOTES_COUNT = 19;
// http request with axios, for generating notes
// URI
const url = "https://jsonplaceholder.typicode.com/";
const resource = "photos";
const params = {
    _limit: NOTES_COUNT,
};
axios
    .get(url + resource, { params })
    .then((res) => res.data)
    .then((data) => {
        generatesNotes($notesWrapper, data, data.length);
    })
    .catch((err) => {
        console.error(err);
    });

// =============================================================================
// ********************  EVENT LISTENERS  ************************************ 
// =============================================================================
// note event listener in axios generatesNotes()
// escape key
window.addEventListener("keyup", (e) => {
    if (e.key === "Escape" && isModal) {
        triggerEscapeBtn();
        isModal = triggerModalWindow(document.querySelector(".modal"), isModal);
    }
});

// =============================================================================
// ********************  EVENT HANDLERS  ************************************ 
// =============================================================================
function handleNoteClick(e) {
    console.log(this);
    isModal = triggerModalWindow(this, isModal);
}

// =============================================================================
//! ********************  FUNCTIONS  ************************************ 
// =============================================================================
function generatesNotes(parentElement, data, dataLen) {
    let template = "";
    for (let i = 0; i < dataLen; i++) {
        template += `<figure class="note d-flex flex-wrap">
                    <div class="pin"><img src="./assets/img/pin.svg" alt="pin"></div>
                    <img class="note-image" src="${data[i].url}" alt="img">
                    <figcaption class="d-flex items-center text-capitalize">${data[i].title}</figcaption>
                </figure>   `;
    }
    parentElement.innerHTML = template;
    const notes = document.querySelectorAll(noteClass);
    //* note event listener
    notes.forEach((note) => note.addEventListener("click", handleNoteClick));
}

function triggerModalWindow(target, modalState) {
    triggerEscapeBtn();
    if (!modalState) {
        document.body.classList.add(layover);
        document.body.classList.add(overflowHidden);
        target.classList.add("modal");
        return true;
    } else {
        document.body.classList.remove(layover);
        document.body.classList.remove(overflowHidden);
        target.classList.remove("modal");
        return false;
    }
}

function triggerEscapeBtn() {
    if ($escape.className.indexOf("active") !== 1) {
        // escape button
        $escape.classList.add("active");
        // dopo transitionTime ms, il button escape scompare
        escTimeout = setTimeout(() => {
            $escape.classList.remove("active");
        }, 2000);
    } else {
        // escape button
        clearTimeout(escTimeout);
        $escape.classList.remove("active");
    }
}
