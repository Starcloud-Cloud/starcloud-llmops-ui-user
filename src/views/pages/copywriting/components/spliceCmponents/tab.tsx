import { Button, Tabs, Popover, Switch } from 'antd';
import { TextField, IconButton } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { PlusOutlined, InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import _ from 'lodash-es';
import StyleTabs from '../styleTabs';
import { memo } from 'react';
interface Tabs {
    schemaList?: any[];
    mode: string;
    setModel: (data: any) => void;
    imageStyleData: any;
    setImageStyleData: (data: any) => void;
    focuActive: any[];
    setFocuActive: (data: any) => void;
    digui: () => number;
}
const CreateTab = ({ schemaList, mode, setModel, imageStyleData, setImageStyleData, focuActive, setFocuActive, digui }: Tabs) => {
    return (
        <div className="h-[800px] overflow-y-auto overflow-x-hidden">
            <div className="flex items-center gap-4 min-h-[32px]">
                <span>海报生成模式</span>
                <Switch
                    checked={mode === 'SEQUENCE' ? true : false}
                    onChange={(e) => {
                        let newData = _.cloneDeep(mode);
                        if (e) {
                            newData = 'SEQUENCE';
                        } else {
                            newData = 'RANDOM';
                        }
                        setModel(newData);
                    }}
                />
                <span className="text-[#673ab7]">{mode === 'SEQUENCE' ? '顺序生成' : '随机生成'}</span>
            </div>
            <div className="flex items-end mb-[20px]">
                <Button
                    onClick={() => {
                        let newData = _.cloneDeep(imageStyleData);
                        if (!newData) {
                            newData = [];
                        }
                        newData.push({
                            name: `风格 ${digui()}`,
                            key: digui().toString(),
                            id: digui().toString(),
                            templateList: [
                                {
                                    key: '1',
                                    name: '首图',
                                    model: '',
                                    titleGenerateMode: 'DEFAULT',
                                    mode: 'SEQUENCE',
                                    variableList: []
                                }
                            ]
                        });
                        setImageStyleData(newData);
                    }}
                    type="primary"
                    icon={<PlusOutlined rev={undefined} />}
                >
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
            <Tabs
                tabPosition="left"
                items={imageStyleData?.map((item: any, i: number) => {
                    return {
                        label: (
                            <div>
                                {item.name}
                                {item?.templateList?.some((item: any) => !item.id) && (
                                    <InfoCircleOutlined className="text-[#ff4d4f] ml-[5px]" rev={undefined} />
                                )}
                            </div>
                        ),
                        key: item.id,
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
                                    <div>
                                        <Popover
                                            zIndex={9999}
                                            content={
                                                <Button
                                                    onClick={(e: any) => {
                                                        const newData = _.cloneDeep(imageStyleData);
                                                        newData.splice(i, 1);
                                                        setImageStyleData(newData);
                                                        e.stopPropagation();
                                                    }}
                                                    danger
                                                    icon={<DeleteOutlined rev={undefined} />}
                                                >
                                                    删除
                                                </Button>
                                            }
                                            trigger="click"
                                        >
                                            <IconButton size="small" onClick={(e: any) => e.stopPropagation()}>
                                                <MoreVert />
                                            </IconButton>
                                        </Popover>
                                    </div>
                                </div>
                                <StyleTabs
                                    schemaList={schemaList}
                                    imageStyleData={item?.templateList}
                                    typeList={[]}
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
