import { View, Text } from 'react-native'
import React, { useCallback } from 'react'
import { Button } from '@fluentui/react-components'
import { useNavigation } from '@react-navigation/native'

const ProfileScreen = () => {
    const navigation = useNavigation();
    const navigateTo = useCallback(() => {
        navigation.navigate("Translate")
    }, [])
    return (
        <View>
            <Button onClick={navigateTo}>
                Translations
            </Button>
            <Text>Welcome back</Text>
        </View>
    )
}

export default ProfileScreen