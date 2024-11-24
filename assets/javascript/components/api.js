import * as dom from "../config/domElements.js";
import { _MAX_OBJECTS } from "../config/globals.js";

export async function getData(completeUrl, params, saving) {
    try {
        const res = await axios.get(completeUrl, { params });
        if (res.data.length > _MAX_OBJECTS) {
            throw new Error(
                `Cannot request more than ${_MAX_OBJECTS} objects in the page`
            );
        }
        const data = await res.data;
        data.forEach((data) => saving.push(data));
        console.log(saving);
        // loader animation
        document.body.classList.remove(dom.layover);
        document.querySelector(dom.loaderClass).classList.remove(dom.active);
        return data;
    } catch (e) {
        console.error(e);
        // loader animation
        document.body.classList.remove(dom.layover);
        document.querySelector(dom.loaderClass).classList.remove(dom.active);
        // return an empty array
        return [];
    }
}
