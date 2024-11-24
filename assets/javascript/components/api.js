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
        return data;
    } catch (e) {
        console.error(e);
        // return an empty array
        return [];
    }
}
