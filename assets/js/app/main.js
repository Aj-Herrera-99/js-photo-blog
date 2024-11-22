// import { getRndInteger as random } from "./utilities.js";
import {
    globals,
    domConfig,
    api,
    anim,
    tempBuilder,
    addCard, removeCard, focusCard,
    removeModeBtn,
    escRemModeBtn,
} from "../modules/bundle.js";


export let notesDataSaved = [];

// DOM elements selection $prefix
const $notesWrapper = document.querySelector(domConfig.notesWrapperClass);
// other variables
const url = globals.url;
const resource = globals.resource;
const params = {
    [globals.key]:
        isNaN(globals.value) || globals.value < 0 ? 0 : globals.value,
};
// Immediately Invoked Function Expressions (IIFE) to execute async await
(async function () {
    anim.pageLoader();
    // dati presi da una chiamata ajax
    let myData = await api.getData(url + resource, params);
    notesDataSaved = [...notesDataSaved, ...myData];
    console.log(notesDataSaved);
    // costruisco template a partire dai dati ricevuti e li inserisco in un contenitore
    tempBuilder.buildTemplateFrom(myData, $notesWrapper);

    focusCard();
    addCard();
    removeCard();
    removeModeBtn();
    escRemModeBtn();

})();


