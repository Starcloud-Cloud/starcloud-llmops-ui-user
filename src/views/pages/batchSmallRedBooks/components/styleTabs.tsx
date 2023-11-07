import { Tabs, Button } from 'antd';
import { useState, useRef } from 'react';
import EditStyle from './EditStyle';
import _ from 'lodash-es';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
const StyleTabs = ({ typeList, imageStyleData }: { typeList: any[]; imageStyleData: any[] }) => {
    const [consList, setConsList] = useState<any[]>([{ key: 'one' }]);
    const changeImages = (data: any) => {
        const newData = _.cloneDeep(consList);
        newData[tabsList.findIndex((item: any) => item.key === activeKey)][data.field] = data.value;
        if (data.flag) {
            newData[tabsList.findIndex((item: any) => item.key === activeKey)].TITLE = undefined;
            newData[tabsList.findIndex((item: any) => item.key === activeKey)].SUB_TITLE = undefined;
        }
        setConsList(newData);
    };

    const [activeKey, setActiveKey] = useState('one');
    const [tabsList, setTabList] = useState<any[]>([
        {
            label: '首图',
            key: 'one'
        }
    ]);
    const newTabIndex = useRef(0);

    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };

    const add = () => {
        const newActiveKey = `newTab${newTabIndex.current++}`;
        const newPanes = [...tabsList];
        newPanes.push({ label: 'New Tab', key: newActiveKey });
        setTabList(newPanes);
        setActiveKey(newActiveKey);
        //增加consList
        const newConsList = _.cloneDeep(consList);
        newConsList.push({ key: newActiveKey });
        setConsList(newConsList);
    };

    const remove = (targetKey: TargetKey) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        tabsList.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = tabsList.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        setTabList(newPanes);
        setConsList(newPanes);
        setActiveKey(newActiveKey);
    };

    const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };
    return (
        <>
            <Tabs
                type="editable-card"
                onChange={onChange}
                activeKey={activeKey}
                onEdit={onEdit}
                items={tabsList.map((item, index) => {
                    return {
                        label: item.label,
                        key: item.key,
                        children: (
                            <EditStyle
                                imageStyleData={imageStyleData[index]}
                                // changeDetail={changeDetail}
                                typeList={typeList}
                            />
                        )
                    };
                })}
            />
            <Button
                onClick={() => {
                    console.log(consList);
                }}
            >
                aaa
            </Button>
        </>
    );
};
export default StyleTabs;
