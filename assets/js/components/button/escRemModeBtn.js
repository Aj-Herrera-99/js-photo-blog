import { domConfig } from "../../modules/bundle.js";
import { removeMode } from "./logic/logic.js";

export function escRemModeBtn() {
    const $escRemoveBtn = document.getElementById(domConfig.escRemoveBtnId);
    // escape remove btn click event
    $escRemoveBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        removeMode(false);
    });
}
