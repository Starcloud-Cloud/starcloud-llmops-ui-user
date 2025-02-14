import { Button, Tabs, Popover, Switch, Dropdown, Form, Input, Select } from 'antd';
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
    materialStatus?: string;
}
const CreateTab = ({
    materialStatus,
    schemaList,
    mode,
    setModel,
    imageStyleData,
    setImageStyleData,
    focuActive,
    setFocuActive,
    digui,
    appData
}: Tabs) => {
    const handleAdd = (data?: any) => {
        let newData = _.cloneDeep(imageStyleData);
        if (!newData) {
            newData = [];
        }
        const styleuid = uuidv4()?.split('-')?.join('');
        const fristuid = uuidv4()?.split('-')?.join('');
        newData.push({
            name: `风格 ${digui()}`,
            index: digui(),
            saleConfig: data?.saleConfig || null,
            system: data?.system || true,
            enable: data?.enable || true,
            isCopy: data?.isCopy || true,
            isUseAllMaterial: data?.isUseAllMaterial || true,
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
                    uuid: fristuid,
                    isCopy: false,
                    isUseAllMaterial: false,
                    variableList: []
                }
            ],
            totalImageCount: data?.totalImageCount || 0
        });
        setImageStyleData(newData);
        setCheckStyle(styleuid);
        if (!data) {
            setSelModal(fristuid);
        }
    };
    const [checkStyle, setCheckStyle] = useState('');
    const [selModal, setSelModal] = useState('');
    useEffect(() => {
        setCheckStyle(imageStyleData[0]?.uuid);
    }, []);
    const [form] = Form.useForm();
    return (
        <div className="min-h-[800px] ">
            <div className="flex items-end mb-[20px]">
                <Button onClick={() => handleAdd()} type="primary" icon={<PlusOutlined />}>
                    增加模版
                </Button>
                <div
                    onClick={() => {
                        window.open(process.env.REACT_APP_POSTER_URL);
                    }}
                    className="ml-[10px] font-[600] cursor-pointer text-[12px] text-[#673ab7] border-b border-solid border-[#673ab7]"
                >
                    设计自己的图片模版
                </div>
            </div>
            <div>
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
                                        <InfoCircleOutlined className="text-[#ff4d4f] ml-[5px]" />
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
                                            {/* <div className="flex gap-2 items-center"> */}
                                            {/* <span className="text-xs">字段为空时默认不生成图片</span>
                                                <Switch
                                                    checked={item?.noExecuteIfEmpty}
                                                    onChange={(data) => {
                                                        const newData = _.cloneDeep(imageStyleData);
                                                        newData[i].noExecuteIfEmpty = data;
                                                        setImageStyleData(newData);
                                                    }}
                                                /> */}
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
                                            {/* </div> */}
                                            <Popover
                                                placement="top"
                                                trigger={['click']}
                                                title="售卖配置"
                                                content={
                                                    <Form form={form}>
                                                        <Form.Item label="开启售卖" name="openSale">
                                                            <Switch />
                                                        </Form.Item>
                                                        <Form.Item label="演示笔记 ID" name="demoId">
                                                            <Input.TextArea />
                                                        </Form.Item>
                                                    </Form>
                                                }
                                                onOpenChange={(data) => {
                                                    if (data) {
                                                        form.setFieldsValue(item?.saleConfig || {});
                                                    } else {
                                                        const newData = _.cloneDeep(imageStyleData);
                                                        newData[i].saleConfig = form.getFieldsValue();
                                                        form.resetFields();
                                                        setImageStyleData(newData);
                                                    }
                                                }}
                                            >
                                                <div className="cursor-pointer text-[#673ab7] text-xs flex items-center gap-1">
                                                    <svg
                                                        viewBox="0 0 1024 1024"
                                                        version="1.1"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        p-id="5195"
                                                        width="15"
                                                        height="15"
                                                    >
                                                        <path
                                                            d="M832.02048 1024H192.02048a140.98432 140.98432 0 0 1-140.82048-140.77952V243.22048A140.98432 140.98432 0 0 1 192.02048 102.4h148.23424v76.8H192.02048a64.06144 64.06144 0 0 0-63.97952 64.02048v640a64.06144 64.06144 0 0 0 64.02048 64.02048h639.95904a64.06144 64.06144 0 0 0 64.02048-63.97952V243.22048a64.06144 64.06144 0 0 0-63.97952-63.97952h-140.04224V102.4h139.96032a140.98432 140.98432 0 0 1 140.82048 140.82048v640A140.98432 140.98432 0 0 1 832.02048 1024z"
                                                            fill="#673ab7"
                                                            p-id="5196"
                                                        ></path>
                                                        <path
                                                            d="M576.02048 281.6h-128a140.82048 140.82048 0 0 1 0-281.6h128a140.82048 140.82048 0 0 1 0 281.6z m-128-204.8a64.02048 64.02048 0 0 0 0 128h128a64.02048 64.02048 0 0 0 0-128z"
                                                            fill="#673ab7"
                                                            p-id="5197"
                                                        ></path>
                                                        <path
                                                            d="M472.84224 492.78976a38.2976 38.2976 0 0 1-27.15648-11.22304L368.88576 404.76672a38.42048 38.42048 0 1 1 54.31296-54.31296l76.8 76.8a38.42048 38.42048 0 0 1-27.15648 65.536z"
                                                            fill="#673ab7"
                                                            p-id="5198"
                                                        ></path>
                                                        <path
                                                            d="M551.19872 492.78976a38.42048 38.42048 0 0 1-27.15648-65.536l76.8-76.8a38.42048 38.42048 0 1 1 54.31296 54.31296l-76.8 76.8a38.2976 38.2976 0 0 1-27.15648 11.22304z"
                                                            fill="#673ab7"
                                                            p-id="5199"
                                                        ></path>
                                                        <path
                                                            d="M678.42048 531.16928H345.62048a38.42048 38.42048 0 0 1 0-76.8h332.8a38.42048 38.42048 0 0 1 0 76.8z"
                                                            fill="#673ab7"
                                                            p-id="5200"
                                                        ></path>
                                                        <path
                                                            d="M678.42048 684.76928H345.62048a38.42048 38.42048 0 0 1 0-76.8h332.8a38.42048 38.42048 0 0 1 0 76.8z"
                                                            fill="#673ab7"
                                                            p-id="5201"
                                                        ></path>
                                                        <path
                                                            d="M512 838.36928a38.42048 38.42048 0 0 1-38.37952-38.37952v-281.6a38.42048 38.42048 0 0 1 76.8 0v281.6a38.42048 38.42048 0 0 1-38.42048 38.37952z"
                                                            fill="#673ab7"
                                                            p-id="5202"
                                                        ></path>
                                                    </svg>
                                                    售卖配置
                                                </div>
                                            </Popover>
                                            <Dropdown
                                                placement="bottom"
                                                trigger={['click']}
                                                menu={{
                                                    onClick: (e) => {
                                                        if (e.key === '1') {
                                                            handleAdd(item);
                                                        } else if (e.key === '2') {
                                                            const newData = _.cloneDeep(imageStyleData);
                                                            let lastIndex = '';
                                                            imageStyleData.forEach((item: any) => {
                                                                if (item?.uuid === newData[i]?.uuid) {
                                                                    lastIndex = newData[i - 1]?.uuid;
                                                                }
                                                            });
                                                            console.log(imageStyleData, lastIndex || imageStyleData[0]?.uuid);

                                                            setCheckStyle(lastIndex || imageStyleData[i + 1]?.uuid);
                                                            newData.splice(i, 1);
                                                            setImageStyleData(newData);
                                                        }
                                                    },
                                                    items: [
                                                        {
                                                            key: '1',
                                                            label: '复制',
                                                            icon: <CopyOutlined />
                                                        },
                                                        {
                                                            key: '2',
                                                            icon: <DeleteOutlined />,
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
                                        materialStatus={materialStatus}
                                        imageStyleData={item?.templateList}
                                        typeList={[]}
                                        appData={appData}
                                        selModal={selModal}
                                        setSelModal={setSelModal}
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
        JSON.stringify(prevProps?.appData) === JSON.stringify(nextProps?.appData) &&
        JSON.stringify(prevProps?.mode) === JSON.stringify(nextProps?.mode) &&
        JSON.stringify(prevProps?.imageStyleData) === JSON.stringify(nextProps?.imageStyleData) &&
        JSON.stringify(prevProps?.focuActive) === JSON.stringify(nextProps?.focuActive) &&
        JSON.stringify(prevProps?.materialStatus) === JSON.stringify(nextProps?.materialStatus)
    );
};
export default memo(CreateTab, arePropsEqual);
