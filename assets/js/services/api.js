import { globals } from "../modules/bundle.js";

export async function getData(completeUrl, params) {
    try {
        const res = await axios.get(completeUrl, { params });
        if (res.data.length > globals.maxObjects) {
            throw new Error(
                `Cannot request more than ${globals.maxObjects} objects in the page`
            );
        }
        return await res.data;
    } catch (e) {
        console.error(e);
        // return an empty array
        return [];
    }
}
