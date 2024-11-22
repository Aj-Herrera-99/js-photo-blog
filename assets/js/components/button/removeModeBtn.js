import { domConfig } from "../../modules/bundle.js";
import { removeMode } from "./logic/logic.js";


export function removeModeBtn() {
    const $removeBtn = document.getElementById(domConfig.removeBtnId);
    // remove btn click event
    $removeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        removeMode(true);
    });
}
