import { View, Text, Alert, Pressable } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
// TOOL for swith translations 
const TestingToolbar: any = () => {
    const [lastLocale, setLastLocale] = useState<false | string>(false)
    const { t, i18n } = useTranslation()
    const showKeys = useCallback(() => {
        if (lastLocale) {
            i18n.changeLanguage(lastLocale)
            setLastLocale(false)

        } else {
            setLastLocale(i18n.language)
            i18n.changeLanguage('cimode')
        }
    }, [lastLocale])
    return (
        <View style={{display: 'none'}}>
            <div onClick={showKeys}>
                <Text>TestingToolbar</Text>

            </div>
        </View>
    )
}

export default TestingToolbar