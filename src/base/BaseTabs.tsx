import React from 'react'
// 3rd party libs
import { TabList, Tab, SelectTabEvent, SelectTabData } from '@fluentui/react-components';
import { useRecoilState } from 'recoil';
// states and cofigs
import { selectedContextState } from 'features/auth/state';

const GitBasedTabs = ({ tabs }: any) => {
    const [selectedValue, setSelectedValue] = useRecoilState(selectedContextState);

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value as string);
    };

    return (
        <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
            {tabs && tabs.map((tab: any) => (
                <Tab value={tab}>{tab}</Tab>
            ))}
        </TabList>
    );
}

export default GitBasedTabs