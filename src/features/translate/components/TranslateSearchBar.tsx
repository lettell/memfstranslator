import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Field } from '@fluentui/react-components';
import { SearchBox } from '@fluentui/react-search-preview';
import { useSetRecoilState } from 'recoil';
import { searchResultsState } from '../states/searchState';
const TranslateSearchBar = (idx: any) => {
    const [value, setValue] = useState('')
    const setResults = useSetRecoilState(searchResultsState)
    // const setSearchResul
    // TODO: set search results
    const handlePaste = useCallback(
        (event: any) => {
            event.clipboardData.items[0].getAsString((text: string) => {
                // do something
                setValue(text)
            })
        },
        [value],
    )

    const search = useCallback((_event: any, data: any) => {
        if (idx?.idx?.search) {
            const resul = idx.idx.search(data.value.length ? data.value  : data.value)
            setResults(resul)
        } else {
            setResults([])
        }
        setValue(data.value)
    }, [value])

    return (
        <Field>
            <SearchBox onPaste={handlePaste} value={value} onChange={search} />
        </Field>

    )
}

export default TranslateSearchBar

const styles = StyleSheet.create({})