"use strict";
// important ids classes tags
const noteClass = ".note";
const noteImageClass = ".note-image";
const figcaptionTag = "figcaption";
// DOM elements selection
const $notes = document.querySelectorAll(noteClass);
const $noteImages = document.querySelectorAll(noteImageClass);
const $figcaptions = document.querySelectorAll(figcaptionTag);

// http request with axios
// URI
const url = "https://jsonplaceholder.typicode.com/";
const resource = "photos";
const params = {
    _limit: $noteImages.length,
};
// axios api
axios
    .get(url + resource, { params})
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
$noteImages.forEach((note) => note.addEventListener("click", handleNoteClick));

//* EVENT HANDLERS
function handleNoteClick(){
    console.log(this);
}