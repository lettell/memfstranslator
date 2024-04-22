import React, { useEffect, useMemo } from 'react'
// 3rd party libs
import { TabList, Tab, SelectTabEvent, SelectTabData } from '@fluentui/react-components';
import { useRecoilState, useRecoilValue } from 'recoil';
// states and cofigs
import { selectedContextState } from 'features/auth/state';
import { searchResultsState } from 'features/translate/states/searchState';
import { View } from 'react-native';

const GitBasedTabs = ({ tabs }: any) => {
    const [selectedValue, setSelectedValue] = useRecoilState(selectedContextState);
    const searchResults = useRecoilValue(searchResultsState)

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value as string);
    };
    const fileNames = useMemo(() => {
        return searchResults?.map((e: any) => e?.ref?.split('|')[0]).filter((e: string) => e) || []
    }, [searchResults])
    useEffect(() => {
        if (fileNames.length && !fileNames.includes(selectedValue)) {
            setSelectedValue(fileNames[0])
        }
    }, [fileNames])
    return (
        <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
            {tabs && tabs.map((tab: any) => (
                fileNames?.length ? (fileNames.includes(tab) ?
                    <Tab key={tab} value={tab}>{tab}</Tab> : <View key={tab}></View>) : <Tab key={tab}  value={tab}>{tab} </Tab>
            ))}
        </TabList>
    );
}

export default GitBasedTabs