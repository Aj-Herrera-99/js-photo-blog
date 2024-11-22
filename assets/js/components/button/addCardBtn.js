import {
    domConfig,
    api,
    tempBuilder,
    globals,
    utils,
} from "../../modules/bundle.js";

export function addCardBtn(dataSaved) {
    const $addBtn = document.getElementById(domConfig.addBtnId);
    const $notesWrapper = document.querySelector(domConfig.notesWrapperClass);
    console.log(dataSaved);
    $addBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        let myData = await api.getData(globals.url + globals.resource, {
            id: utils.getRndInteger(1, 100).toString(),
        });
        dataSaved = [...dataSaved, ...myData];
        console.log(dataSaved);
        tempBuilder.buildTemplateFrom(myData, $notesWrapper);
        if ($notesWrapper.childElementCount) {
            $notesWrapper.lastElementChild.scrollIntoView();
        }
    });
}
