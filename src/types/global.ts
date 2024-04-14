export {};
declare global {
    const __HOST__: string;
    namespace ReactNavigation {
        interface RootParamList {
            Auth: undefined;
            Profile: { userId: string };
            Translate: undefined;
            main: undefined;
        }
    }
}

