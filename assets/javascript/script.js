"use strict";
// important ids classes tags
const noteClass = ".note";
const noteImageClass = ".note-image";
const figcaptionTag = "figcaption";
// css classes
const layover = "layover";
const overflowHidden = "overflow-hidden";
// DOM elements selection
const $notes = document.querySelectorAll(noteClass);
const $noteImages = document.querySelectorAll(noteImageClass);
const $figcaptions = document.querySelectorAll(figcaptionTag);
const $notesWrapper = document.querySelector(".notes-wrapper");
// other variables
let isModal = false;
let escTimeout;

// http request with axios
// URI
const url = "https://jsonplaceholder.typicode.com/";
const resource = "photos";
const params = {
    _limit: 10,
};

// axios api
axios
    .get(url + resource, { params })
    .then((res) => res.data)
    .then((data) => {
        let template = "";
        for (let i = 0; i < data.length; i++) {
            template += `<figure class="note d-flex flex-wrap">
                    <div class="pin"><img src="./assets/img/pin.svg" alt="pin"></div>
                    <img class="note-image" src="${data[i].url}" alt="img">
                    <figcaption class="d-flex items-center">${data[i].title}</figcaption>
                </figure>   `;
        }
        $notesWrapper.innerHTML = template;
    })
    .catch((err) => {
        console.error(err);
    });

//* EVENT LISTENERS
$notes.forEach((note) => note.addEventListener("click", handleNoteClick));

// escape key
window.addEventListener("keyup", (e) => {
    if (e.key === "Escape" && isModal) {
        document.body.classList.remove(layover);
        document.body.classList.remove(overflowHidden);
        document.querySelector(".modal").classList.remove("modal");
        isModal = false;
    }
});

//* EVENT HANDLERS
function handleNoteClick(e) {
    console.log(this.closest(".note"));
    if (!isModal) {
        document.body.classList.add(layover);
        document.body.classList.add(overflowHidden);
        this.closest(noteClass).classList.add("modal");
        // found on internet
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        isModal = true;
    } else {
        document.body.classList.remove(layover);
        document.body.classList.remove(overflowHidden);
        this.closest(noteClass).classList.remove("modal");
        isModal = false;
    }
}
