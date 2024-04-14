import { atom } from "recoil";

// DEMO globals
const isAuthState = atom({
    key: '@authState',
    default: false,
})
const selectedContextState = atom({
    key: '@selectedContext',
    default: null,
})
export {
    isAuthState,
    selectedContextState
}