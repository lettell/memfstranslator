import { atom } from "recoil";

const searchResultsState = atom<Array<any>>({
    key: 'searchResultsState',
    default: [],
});

export {
    searchResultsState
}