import { Button, Tabs, Popover, Switch, Dropdown } from 'antd';
import { TextField, IconButton } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { PlusOutlined, InfoCircleOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import _ from 'lodash-es';
import StyleTabs from '../styleTabs';
import { v4 as uuidv4 } from 'uuid';
import { memo, useEffect, useState } from 'react';
interface Tabs {
    schemaList?: any[];
    mode?: string;
    setModel?: (data: any) => void;
    imageStyleData: any;
    setImageStyleData: (data: any) => void;
    focuActive: any[];
    setFocuActive: (data: any) => void;
    digui: () => number;
    appData: any;
}
const CreateTab = ({ schemaList, mode, setModel, imageStyleData, setImageStyleData, focuActive, setFocuActive, digui, appData }: Tabs) => {
    const handleAdd = (data?: any) => {
        let newData = _.cloneDeep(imageStyleData);
        if (!newData) {
            newData = [];
        }
        const styleuid = uuidv4()?.split('-')?.join('');
        newData.push({
            name: `风格 ${digui()}`,
            index: digui(),
            system: data?.system || true,
            enable: data?.enable || true,
            uuid: styleuid,

            templateList: data?.templateList?.map((item: any) => ({
                ...item,
                uuid: uuidv4()?.split('-')?.join(''),
                variableList: item?.variableList?.map((el: any) => ({
                    ...el,
                    uuid: uuidv4()?.split('-')?.join('')
                }))
            })) || [
                {
                    key: '1',
                    name: '首图',
                    model: '',
                    isMultimodalTitle: false,
                    uuid: uuidv4()?.split('-')?.join(''),
                    variableList: []
                }
            ],
            totalImageCount: data?.totalImageCount || 0
        });
        setImageStyleData(newData);
        setCheckStyle(styleuid);
    };
    const [checkStyle, setCheckStyle] = useState('');
    useEffect(() => {
        setCheckStyle(imageStyleData[0]?.uuid);
    }, []);
    return (
        <div className="min-h-[800px] ">
            <div className="flex items-end mb-[20px]">
                <Button onClick={handleAdd} type="primary" icon={<PlusOutlined rev={undefined} />}>
                    增加风格
                </Button>
                <div
                    onClick={() => {
                        window.open('http://cn-test.poster-ui.hotsalestar.com/#/');
                    }}
                    className="ml-[10px] font-[600] cursor-pointer text-[12px] text-[#673ab7] border-b border-solid border-[#673ab7]"
                >
                    设计自己的海报风格
                </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
                <Tabs
                    tabPosition="left"
                    activeKey={checkStyle}
                    onChange={(e) => setCheckStyle(e)}
                    items={imageStyleData?.map((item: any, i: number) => {
                        return {
                            label: (
                                <div>
                                    {item.name}
                                    {item?.templateList?.some((item: any) => !item.code) && (
                                        <InfoCircleOutlined className="text-[#ff4d4f] ml-[5px]" rev={undefined} />
                                    )}
                                </div>
                            ),
                            key: item.uuid,
                            children: (
                                <div>
                                    <div className="bg-[#edf0f2]/80 rounded py-[12px] px-[16px] flex justify-between items-center">
                                        {!focuActive[i] ? (
                                            <div
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    const newData = _.cloneDeep(focuActive);
                                                    newData[i] = true;
                                                    setFocuActive(newData);
                                                }}
                                            >
                                                {item.name}
                                            </div>
                                        ) : (
                                            <TextField
                                                autoFocus
                                                defaultValue={item.name}
                                                onBlur={(e) => {
                                                    const newList = _.cloneDeep(focuActive);
                                                    newList[i] = false;
                                                    setFocuActive(newList);
                                                    if (e.target.value && e.target.value.trim()) {
                                                        const newData = _.cloneDeep(imageStyleData);
                                                        newData[i].name = e.target.value;
                                                        setImageStyleData(newData);
                                                    }
                                                }}
                                                color="secondary"
                                                variant="standard"
                                            />
                                        )}
                                        <div className="flex gap-2 items-center">
                                            <div className="flex gap-2 items-center">
                                                <span className="text-xs">字段为空时默认不生成图片</span>
                                                <Switch
                                                    checked={item?.noExecuteIfEmpty}
                                                    onChange={(data) => {
                                                        const newData = _.cloneDeep(imageStyleData);
                                                        newData[i].noExecuteIfEmpty = data;
                                                        setImageStyleData(newData);
                                                    }}
                                                />
                                                {/* <span className="text-xs">是否设为系统</span>
                                            <Switch
                                                checked={item?.system}
                                                onChange={(data) => {
                                                    const newData = _.cloneDeep(imageStyleData);
                                                    newData[i].system = data;
                                                    setImageStyleData(newData);
                                                }}
                                            />
                                            <span className="text-xs">是否生效</span>
                                            <Switch
                                                checked={item?.enable}
                                                onChange={(data) => {
                                                    const newData = _.cloneDeep(imageStyleData);
                                                    newData[i].enable = data;
                                                    setImageStyleData(newData);
                                                }}
                                            /> */}
                                            </div>

                                            <Dropdown
                                                placement="bottom"
                                                trigger={['click']}
                                                menu={{
                                                    onClick: (e) => {
                                                        if (e.key === '1') {
                                                            handleAdd(item);
                                                        } else if (e.key === '2') {
                                                            const newData = _.cloneDeep(imageStyleData);
                                                            newData.splice(i, 1);
                                                            setImageStyleData(newData);
                                                        }
                                                    },
                                                    items: [
                                                        {
                                                            key: '1',
                                                            label: '复制',
                                                            icon: <CopyOutlined rev={undefined} />
                                                        },
                                                        {
                                                            key: '2',
                                                            icon: <DeleteOutlined rev={undefined} />,
                                                            label: '删除'
                                                        }
                                                    ]
                                                }}
                                            >
                                                <IconButton size="small">
                                                    <MoreVert />
                                                </IconButton>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <StyleTabs
                                        schemaList={schemaList}
                                        imageStyleData={item?.templateList}
                                        typeList={[]}
                                        appData={appData}
                                        setDetailData={(data: any) => {
                                            const newData = _.cloneDeep(imageStyleData);
                                            newData[i].templateList = data;
                                            setImageStyleData(newData);
                                        }}
                                    />
                                </div>
                            )
                        };
                    })}
                />
            </div>
        </div>
    );
};
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        JSON.stringify(prevProps?.mode) === JSON.stringify(nextProps?.mode) &&
        JSON.stringify(prevProps?.imageStyleData) === JSON.stringify(nextProps?.imageStyleData) &&
        JSON.stringify(prevProps?.focuActive) === JSON.stringify(nextProps?.focuActive)
    );
};
export default memo(CreateTab, arePropsEqual);
