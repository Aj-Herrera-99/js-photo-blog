import { noteTemplate } from "./template.js";

export function buildTemplateFrom(data, wrapperElement) {
    if (data) {
        let myTemplate = "";
        for (let i = 0; i < data.length; i++) {
            myTemplate += noteTemplate({ ...data[i] });
        }
        wrapperElement.insertAdjacentHTML("beforeend", myTemplate);
    } else {
        console.error("No data found");
    }
}
