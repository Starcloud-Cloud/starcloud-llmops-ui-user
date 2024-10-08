import { Tabs, Button } from 'antd';
import { useState, useRef } from 'react';
import EditStyle from './EditStyle';
import { CloseCircleOutlined } from '@ant-design/icons';
import _ from 'lodash-es';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
const StyleTabs = ({
    typeList,
    imageStyleData,
    setDetailData
}: {
    typeList: any[];
    imageStyleData: any[];
    setDetailData: (data: any) => void;
}) => {
    const [consList, setConsList] = useState<any[]>([{ key: 'one' }]);
    const changeImages = (data: any) => {
        // const newData = _.cloneDeep(consList);
        // newData[tabsList.findIndex((item: any) => item.key === activeKey)][data.field] = data.value;
        // if (data.flag) {
        //     newData[tabsList.findIndex((item: any) => item.key === activeKey)].TITLE = undefined;
        //     newData[tabsList.findIndex((item: any) => item.key === activeKey)].SUB_TITLE = undefined;
        // }
        // setConsList(newData);
    };

    const [activeKey, setActiveKey] = useState('0');
    const newTabIndex = useRef(1);
    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };
    const add = () => {
        const newPanes = _.cloneDeep(imageStyleData);
        const newData = imageStyleData.map((item) => item.name.split(' ')[1]);
        if (newData.every((item) => !item)) {
            newPanes.push({ id: '', name: `图片 1`, model: '', key: newTabIndex.current, variableList: [] });
        } else {
            newPanes.push({
                id: '',
                name: `图片 ${newData?.sort((a, b) => b - a)[0] * 1 + 1}`,
                model: '',
                key: newTabIndex.current,
                variableList: []
            });
        }

        setDetailData(newPanes);
    };
    const remove = (targetKey: TargetKey) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        imageStyleData.forEach((item, i) => {
            if (i.toString() === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = imageStyleData.filter((item, i) => i.toString() !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = lastIndex.toString();
            } else {
                newActiveKey = '0';
            }
        }
        console.log(newActiveKey);
        console.log(newPanes);

        setDetailData(newPanes);
        // setConsList(newPanes);
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
                items={imageStyleData.map((item: any, i: number) => {
                    return {
                        label: (
                            <div className="flex items-center">
                                <span style={{ display: !item.id ? 'block' : 'none' }} className=" text-[#ff4d4f] text-[16px]">
                                    <CloseCircleOutlined />
                                </span>
                                {item.name}
                            </div>
                        ),
                        key: i.toString(),
                        closable: i === 0 ? false : true,
                        children: (
                            <EditStyle
                                imageStyleData={item}
                                setImageStyleDataList={(data: any) => {
                                    console.log(data);
                                    console.log(imageStyleData);
                                }}
                                setData={(data: any) => {
                                    const newData = _.cloneDeep(imageStyleData);
                                    newData[i] = data;
                                    setDetailData(newData);
                                }}
                                setCopyData={() => {}}
                                typeList={typeList}
                            />
                        )
                    };
                })}
            />
        </>
    );
};
export default StyleTabs;
