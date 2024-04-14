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

const CollumnTypes = ['System', 'AdvanedField'];
// TODO: cell wtih image
const renderCell = (object: any): string => {
    const entry = Object.values(object || {})
    console.log(entry[0])
    return 'No Data' as string;
};
const BaseTable = ({ columns = [], items = [], currentContext, loader, onValueChange, }: {
    onValueChange: (key: any, locale: any, value: any) => void;
    currentContext: any,
    columns: Array<{ columnKey: string; label: string; columnType: any; }>, items: any, loader: boolean
}) => {

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
                {items.map((item: any) => (
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableCell key={item}>
                                {column.columnType === 'System' && (
                                    // todo more dynamic
                                    <View key={column.columnKey}>
                                        <img className='image-sizer' src={require('assets/demoPhone.png')} />
                                        <Text > {item[index]}</Text>
                                    </View>)
                                }
                                {column.columnType === 'AdvanedField' && (
                                    <View>
                                        <InputAutoGrow setText={text => onValueChange(item[0], Object.keys(item[index])[0], text)} text={Object.values(item[index])[0]} />
                                    </View>
                                )}
                                {/* {item[column.columnKey]} */}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table > : <></>
    )
}

export default BaseTable