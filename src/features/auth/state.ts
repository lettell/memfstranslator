import { atom } from "recoil";

const isAuthState = atom({
    key: '@authState',
    default: false,
})

export {
    isAuthState
}