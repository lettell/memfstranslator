import React from 'react'
import { TabList, Tab } from '@fluentui/react-components';

const GitBasedTabs = ({ tabs }: any) => {
    const [selectedValue, setSelectedValue] = React.useState<any>('conditions');

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