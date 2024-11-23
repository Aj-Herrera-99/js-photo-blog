import * as dom from "../config/domElements.js";
import { _RESOURCE, _URL, _PARAMS, dataSaved } from "../config/globals.js";
import { getData } from "../components/operation.js";
import { card, handleFocus } from "../components/card.js";
import { button } from "../components/button.js";

// Immediately Invoked Function Expressions (IIFE) to execute async await
(async function () {
    // dati presi da una chiamata ajax
    let myData = await getData(_URL + _RESOURCE, _PARAMS, dataSaved);
    let template = await myData.map((data) =>
        card({ ...data }, dom.$notesWrapper)
    );
    dom.$notesWrapper.insertAdjacentHTML("beforeend", template.join(""));
    dom.$notesWrapper.addEventListener("click", handleFocus);
    button();
})();
