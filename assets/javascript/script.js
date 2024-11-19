"use strict";
// important ids classes
const noteImageClass = "note-image";
const figcaptionTag = "figcaption";
// DOM elements selection
const noteImages = document.querySelectorAll("." + noteImageClass);
const figcaption = document.querySelectorAll(figcaptionTag);

// http request with axios
// URI
const url = "https://jsonplaceholder.typicode.com/";
const resource = "photos";
const params = {
    _limit: noteImages.length,
};
// axios api
axios
    .get(url + resource, { params, responseType: 'json' })
    .then((res) => res.data)
    .then((data) => {
        console.log(data);
        for (let i = 0; i < noteImages.length; i++) {
            noteImages[i].src = data[i].url;
            figcaption[i].innerHTML = data[i].title;
        }
    })
    .catch((err) => {
        console.error(err);
    });
