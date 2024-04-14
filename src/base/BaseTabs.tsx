import React from 'react'
import { TabList, Tab } from '@fluentui/react-components';
import { useRecoilState } from 'recoil';
import { selectedContextState } from 'features/auth/state';

const GitBasedTabs = ({ tabs }: any) => {
    // TODO: move to attom

    // const [selectedValue, setSelectedValue] = React.useState<any>('conditions');
    const [selectedValue, setSelectedValue] = useRecoilState(selectedContextState);
    
    const onTabSelect = (data: any) => {
        console.log(`The ${data.value} tab was selected`);
        setSelectedValue(data.value);
    };

    return (
        <TabList selectedValue={selectedValue} onSelect={onTabSelect}>
            {tabs && tabs.map((tab: any) => (
                <Tab value={tab}>{tab}</Tab>
            ))}
        </TabList>
    );
}

export default GitBasedTabs