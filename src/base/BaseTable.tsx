import { View, Text, Image } from 'react-native'
import React, { useMemo } from 'react'

import {
    TableBody,
    TableCell,
    TableRow,
    Table,
    TableHeader,
    TableHeaderCell,
} from "@fluentui/react-components";
import InputAutoGrow from '../ui/inputs/InputAutoGrow';
import { useRecoilValue } from 'recoil';
import { selectedContextState } from 'features/auth/state';
import { searchResultsState } from 'features/translate/states/searchState';

const CollumnTypes = ['System', 'AdvanedField'];
// TODO: cell wtih image
const renderCell = (object: any): string => {
    const entry = Object.values(object || {})
    console.log(entry[0])
    return 'No Data' as string;
};
const BaseTable = ({ columns = [], items = [], defaultLocale, currentContext, loader, onValueChange, }: {
    onValueChange: (key: any, locale: any, value: any) => void;
    currentContext: any,
    defaultLocale: string,
    columns: Array<{ columnKey: string; label: string; columnType: any; }>, items: any, loader: boolean
}) => {
    const searchResults = useRecoilValue(searchResultsState)
    const values = useMemo(() => {
        return searchResults.map(e => {
            if (e?.ref?.startsWith(currentContext)) {
                const resolved = e?.ref?.split('|') || null
                return resolved ? {
                    locale: resolved[1],
                    key: resolved[2]

                } : null
            } else {
                return null
            }
        }).filter(e => e)
    }, [searchResults])
    const selectedContext = useRecoilValue(selectedContextState);
    const isSelected = useMemo(() => selectedContext === currentContext, [selectedContext, currentContext])
    

    
    return (isSelected ?
        <Table arial-label="Default table" role="grid" style={{ width: 'max-content' }} sortable>
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableHeaderCell key={column.columnKey}>
                            {column.label}
                        </TableHeaderCell>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item: any) => values.length ? values.findIndex(e => e?.key === item[0]) > -1 ?
                    <TableRow key={item[0] + "row"}>
                        {columns.map((column, index) => (
                            <TableCell key={typeof item[index] === 'string' ? item[index] : Object.keys(item[index])[0]}>
                                {column.columnType === 'System' && (
                                    // todo more dynamic
                                    <View key={column.columnKey}>
                                        <img className='image-sizer' src={require('assets/demoPhone.png')} />
                                        <Text > {item[index]}</Text>
                                    </View>)
                                }
                                {column.columnType === 'AdvanedField' && (
                                    <View key={Object.keys(item[index])[0]}>
                                        <InputAutoGrow disabled={defaultLocale === column.columnKey} setText={text => onValueChange(item[0], Object.keys(item[index])[0], text)} text={Object.values(item[index])[0]} />
                                    </View>
                                )}
                                {/* {item[column.columnKey]} */}
                            </TableCell>
                        ))}
                    </TableRow>
                    : <TableRow key={item[0] + "row"}></TableRow> : <TableRow key={item[0] + "row"}>
                    {columns.map((column, index) => (
                        <TableCell key={typeof item[index] === 'string' ? item[index] : Object.keys(item[index])[0]}>
                            {column.columnType === 'System' && (
                                // todo more dynamic
                                <View key={column.columnKey}>
                                    <img className='image-sizer' src={require('assets/demoPhone.png')} />
                                    <Text > {item[index]}</Text>
                                </View>)
                            }
                            {column.columnType === 'AdvanedField' && (
                                <View>
                                    <InputAutoGrow disabled={defaultLocale === column.columnKey} setText={text => onValueChange(item[0], Object.keys(item[index])[0], text)} text={Object.values(item[index])[0]} />
                                </View>
                            )}
                            {/* {item[column.columnKey]} */}
                        </TableCell>
                    ))}
                </TableRow>)}
            </TableBody>
        </Table > : <></>
    )
}

export default BaseTable