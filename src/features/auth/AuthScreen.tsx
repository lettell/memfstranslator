import { View, Text } from 'react-native'
import React, { useCallback } from 'react'
import { Button } from '@fluentui/react-components'
import { useSetRecoilState } from 'recoil'
import { isAuthState } from './state'
// TODO: implement logic
const AuthScreen = () => {
    const setIsAuth = useSetRecoilState(isAuthState)
    const login = useCallback(() => {
        setIsAuth(true)
    }, [])
    return (
        <View>
            <Button onClick={login}>
                Login
            </Button>
        </View>
    )
}

export default AuthScreen