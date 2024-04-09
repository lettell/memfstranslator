import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useRecoilValue } from 'recoil';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';


import { isAuthState } from 'features/auth/state';
import AuthScreen from 'features/auth/AuthScreen';
import ProfileScreen from 'features/auth/ProfileScreen';
import TranslateScreen from 'features/translate/TranslateScreen';
import { Text } from 'react-native';

const RootStack = createNativeStackNavigator();


const Root = () => {
    const isAuth = useRecoilValue(isAuthState)
    return (
        <FluentProvider theme={webLightTheme}>

            <NavigationContainer>
                <RootStack.Navigator initialRouteName={isAuth ? 'Profile' : 'Auth'}>
                    <RootStack.Group navigationKey={isAuth ? 'private' : 'login'}>
                        {isAuth ? <RootStack.Screen name='Profile' component={ProfileScreen} /> : <RootStack.Screen name='Auth' component={AuthScreen} />}
                    </RootStack.Group>
                    <RootStack.Group navigationKey={isAuth ? 'main' : 'public'}>
                        {isAuth ? <RootStack.Screen name="Translate" component={TranslateScreen} /> :
                            <RootStack.Screen name="nope" component={AuthScreen} />}


                    </RootStack.Group>
                </RootStack.Navigator>
            </NavigationContainer>
            <Text>{isAuth ? 'yes' : 'nope'}</Text>
        </FluentProvider>

    )
}

export default Root