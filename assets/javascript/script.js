"use strict";
// important ids classes tags
const noteClass = ".note";
const noteImageClass = ".note-image";
const figcaptionTag = "figcaption";
// css classes
const layover = "layover";
// DOM elements selection
const $notes = document.querySelectorAll(noteClass);
const $noteImages = document.querySelectorAll(noteImageClass);
const $figcaptions = document.querySelectorAll(figcaptionTag);
// other variables
let isModal = false;

// http request with axios
// URI
const url = "https://jsonplaceholder.typicode.com/";
const resource = "photos";
const params = {
    _limit: $noteImages.length,
};
// axios api
axios
    .get(url + resource, { params })
    .then((res) => res.data)
    .then((data) => {
        for (let i = 0; i < data.length; i++) {
            $noteImages[i].src = data[i].url;
            $figcaptions[i].innerHTML = data[i].title;
        }
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
        document.querySelector(".modal").classList.remove("modal");
        isModal = false;
    }
});

//* EVENT HANDLERS
function handleNoteClick(e) {
    console.log(this.closest(".note"));
    if (!isModal) {
        document.body.classList.add(layover);
        this.closest(noteClass).classList.add("modal");
        isModal = true;
    } else {
        document.body.classList.remove(layover);
        this.closest(noteClass).classList.remove("modal");
        isModal = false;
    }
}
