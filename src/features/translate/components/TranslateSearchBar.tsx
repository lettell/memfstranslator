import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Field } from '@fluentui/react-components';
import { SearchBox } from '@fluentui/react-search-preview';
const TranslateSearchBar = (idx: any) => {
    const [value, setValue] = useState('')
    // const setSearchResul
    // TODO: set search results

    const search = useCallback((_event: any, data: any) => {
        if (idx?.idx?.search) {
            const resul = idx.idx.search(data.value.length ? data.value + '~1' : data.value, { editDistance: 1 })
            console.log(resul)
        }
        setValue(data.value)
    }, [value])

    return (
        <Field>
            <SearchBox value={value} onChange={search} />
        </Field>

    )
}

export default TranslateSearchBar

const styles = StyleSheet.create({})