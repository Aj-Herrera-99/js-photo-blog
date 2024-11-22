export function noteTemplate({albumid, id, title , url }) {
    return `<figure class="note d-flex flex-wrap" id="${id}" albumid="${albumid}">
                    <div class="pin"><img src="./assets/img/pin.svg" alt="pin"></div>
                    <img class="note-image" src="${url}" alt="img">
                    <figcaption class="d-flex items-center text-capitalize">${title}</figcaption>
                </figure>   `;
}
