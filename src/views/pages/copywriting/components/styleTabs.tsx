import { Tabs } from 'antd';
import { useState, useRef } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import EditStyle from '../../batchSmallRedBooks/components/EditStyle';
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
    const [activeKey, setActiveKey] = useState('0');
    const newTabIndex = useRef(1);
    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };
    const add = () => {
        const newPanes = _.cloneDeep(imageStyleData);
        newPanes.push({ id: '', name: `图片 ${newTabIndex.current++}`, key: newTabIndex.current.toString(), variables: [] });
        setDetailData(newPanes);
        setActiveKey((newPanes.length - 1).toString());
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
        setDetailData(newPanes);
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
                className="mt-[20px]"
                type="editable-card"
                onChange={onChange}
                activeKey={activeKey}
                onEdit={onEdit}
                items={imageStyleData.map((item: any, i: number) => {
                    return {
                        label: (
                            <div>
                                {item.name}
                                {!item.id && <InfoCircleOutlined className="text-[#ff4d4f] ml-[5px]" rev={undefined} />}
                            </div>
                        ),
                        key: i.toString(),
                        closable: i === 0 ? false : true,
                        children: (
                            <EditStyle
                                imageStyleData={item}
                                setData={(data: any) => {
                                    const newData = _.cloneDeep(imageStyleData);
                                    newData[i] = data;
                                    setDetailData(newData);
                                }}
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
