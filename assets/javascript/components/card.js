import * as dom from "../config/domElements.js";
import { dataSaved } from "../config/globals.js";

export function card({ albumId, id, title, url }) {
    return `<figure class="note d-flex flex-wrap" id="${id}" albumid="${albumId}">
                    <div class="pin"><img src="./assets/img/pin.svg" alt="pin"></div>
                    <img class="note-image" src="${url}" alt="img">
                    <figcaption class="d-flex items-center text-capitalize">${title}</figcaption>
                </figure>   `;
}

export function focusNote(target) {
        document.body.classList.toggle(dom.layover);
        target.classList.toggle(dom.modal);
        target.classList.toggle(dom.hideParent);
        target.querySelector(dom.pinClass).classList.toggle(dom.dNone);
        target.querySelector(dom.figcaptionTag).classList.toggle(dom.dNone);

}

export function removeNote(target) {
    const indexElRemove = dataSaved.findIndex(
        (el) =>
            el.albumId == target.getAttribute("albumid") && el.id == target.id
    );
    if (indexElRemove !== -1) {
        dataSaved.splice(indexElRemove, 1);
    }
    console.log(dataSaved);
    target.remove();
}
