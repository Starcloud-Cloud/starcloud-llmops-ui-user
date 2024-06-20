import { Tabs } from 'antd';
import { useState, useRef } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import EditStyle from '../../batchSmallRedBooks/components/EditStyle';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash-es';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
const StyleTabs = ({
    schemaList,
    typeList,
    imageStyleData,
    setDetailData,
    appData,
    selModal,
    setSelModal,
    materialStatus,
    canEdit = false
}: {
    schemaList?: any[];
    typeList: any[];
    imageStyleData: any[];
    setDetailData: (data: any) => void;
    appData: any;
    selModal?: string;
    setSelModal?: any;
    materialStatus?: string;
    canEdit?: boolean;
}) => {
    const [activeKey, setActiveKey] = useState('0');
    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };
    const digui = () => {
        const newData = imageStyleData.map((i: any) => i.name.split(' ')[1]);
        if (!newData || newData?.every((i: any) => !i)) {
            return 1;
        }
        return (
            newData
                ?.map((item) => Number(item))
                ?.sort((a: any, b: any) => {
                    if (typeof a === 'number' && typeof b === 'number' && !isNaN(a) && !isNaN(b)) {
                        return b - a;
                    } else if (isNaN(a)) {
                        return 1; // 把NaN排到最后
                    } else if (isNaN(b)) {
                        return -1; // 同理，保证NaN在其他正常数值后
                    } else {
                        // 对非数值类型进行某种比较或直接返回0保持原顺序
                        return a > b ? 1 : a < b ? -1 : 0;
                    }
                })[0] *
                1 +
            1
        );
    };
    const add = (data?: any) => {
        const newPanes = _.cloneDeep(imageStyleData);
        const uuid = uuidv4()?.split('-')?.join('');
        newPanes.push({
            code: data?.code || '',
            name: `图片 ${digui()}`,
            key: digui().toString(),
            mode: 'SEQUENCE',
            uuid,
            isMultimodalTitle: false,
            example: data?.example || '',
            variableList:
                data?.variableList?.map((item: any) => ({
                    ...item,
                    uuid: uuidv4()?.split('-')?.join('')
                })) || []
        });
        if (!data) {
            setSelModal && setSelModal(uuid);
        }
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
                hideAdd={canEdit}
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
                                {!item.code && <InfoCircleOutlined className="text-[#ff4d4f] ml-[5px]" rev={undefined} />}
                            </div>
                        ),
                        key: i.toString(),
                        closable: canEdit ? false : i === 0 ? false : true,
                        children: (
                            <EditStyle
                                appData={appData}
                                materialStatus={materialStatus}
                                schemaList={schemaList}
                                imageStyleData={item}
                                canEdit={canEdit}
                                selModal={selModal}
                                setData={(data: any) => {
                                    const newData = _.cloneDeep(imageStyleData);
                                    newData[i] = data;
                                    setDetailData(newData);
                                }}
                                setCopyData={add}
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
