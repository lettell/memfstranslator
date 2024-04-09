export {};
declare global {
    namespace ReactNavigation {
        interface RootParamList {
            Auth: undefined;
            Profile: { userId: string };
            Translate: undefined;
            main: undefined;
        }
    }
}

