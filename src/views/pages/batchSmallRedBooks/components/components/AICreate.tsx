import { Checkbox, Popover, Tabs, Button, InputNumber, Input, TabsProps, Drawer, List } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useState } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { createMaterialInfoPageByMarketUid } from 'api/redBook/batchIndex';
import dayjs from 'dayjs';

const AiCreate = ({
    variableData,
    setVariableData,
    checkedList,
    saveConfig,
    aimaterialCreate
}: {
    variableData: any;
    setVariableData: (data: any) => void;
    checkedList: any[];
    saveConfig: (data: string) => void;
    aimaterialCreate: () => void;
}) => {
    const { TextArea } = Input;
    const [requirementStatusOpen, setrequirementStatusOpen] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);

    const [dataSource, setdataSource] = useState<any[]>([]);
    const getHistoryData = async () => {
        const result = await createMaterialInfoPageByMarketUid({
            pageNo: 1,
            pageSize: 10
        });
        setdataSource(result.list);
        console.log(result);
    };
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '示例1',
            children: (
                <div className="text-xs max-w-[600px] leading-5">
                    <span>
                        帮我生成一些唐诗，包括：古诗名称，作者，一句诗句 <br />
                    </span>
                    <span>标题：古诗名</span>
                    <br />
                    <span>语句：一句诗句</span>
                    <br />
                </div>
            )
        },
        {
            key: '2',
            label: '示例2',
            children: (
                <div className="text-xs max-w-[600px] leading-5">
                    <span>
                        作为小红书养生博主，结合主题“这6种食物千万别二次加热“，生成6种食物信息
                        <br />
                    </span>
                    <span>返回的字段要求：</span> <br />
                    <span>标题：食物名称，不超过6个汉字</span> <br />
                    <span>节内容：一句话说明为什么不能二次加热的原因，不少于过20个汉字</span> <br />
                    <span>节内容2：为什么不能二次加热的详细原因，不少于100个汉字</span>
                    <br />
                </div>
            )
        }
    ];
    return (
        <div>
            <div className="text-xs text-black/50">告诉AI你想生成的素材描述，越详细越好。AI会自动生成多条素材内容。</div>
            <div className="text-[16px] font-bold my-4">1.选择需要 AI 补齐的字段</div>
            <Checkbox.Group
                onChange={(e) => {
                    if (variableData.checkedFieldList.length > e.length) {
                        setVariableData({
                            ...variableData,
                            checkedFieldList: e
                        });
                    } else {
                        if (e.length > 6) {
                            if (checkedList?.find((item) => item.dataIndex === e[e.length - 1])?.required) {
                                setVariableData({
                                    ...variableData,
                                    checkedFieldList: e
                                });
                            } else {
                                dispatch(
                                    openSnackbar({
                                        open: true,
                                        message: '最多只能选择6个字段',
                                        variant: 'alert',
                                        alert: {
                                            color: 'error'
                                        },
                                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                        close: false
                                    })
                                );
                            }
                        } else {
                            setVariableData({
                                ...variableData,
                                checkedFieldList: e
                            });
                        }
                    }
                }}
                value={variableData.checkedFieldList}
            >
                {checkedList?.map((item) => (
                    <Checkbox key={item.dataIndex} disabled={item.required} value={item.dataIndex}>
                        {item.title}
                        {item.required ? '*' : ''}
                    </Checkbox>
                ))}
            </Checkbox.Group>
            <div className="text-[16px] font-bold mt-4 flex items-center">
                <span>2.告诉 AI 如何生成这些字段内容</span>
                <Popover
                    content={
                        <div className="max-w-[230px] sm:max-w-[600px]">
                            <div>
                                <Tabs size="small" defaultActiveKey="1" items={items} />
                            </div>
                        </div>
                    }
                    placement="bottomLeft"
                    arrow={false}
                    trigger="hover"
                >
                    <HelpOutlineIcon className="text-base ml-1 cursor-pointer" />
                </Popover>
            </div>
            <div className="relative pt-8">
                <TextArea
                    className="flex-1"
                    key={variableData.requirement}
                    defaultValue={variableData.requirement}
                    status={!variableData.requirement && requirementStatusOpen ? 'error' : ''}
                    onBlur={(e) => {
                        if (e.target.value !== variableData.requirement) {
                            setrequirementStatusOpen(true);
                            setVariableData({
                                ...variableData,
                                requirement: e.target.value
                            });
                        }
                    }}
                    rows={10}
                />
                {/* <div className=" absolute top-1 right-1 flex gap-1 items-end">
                    <div className="text-xs text-black/50">查看历史数据</div>
                    <Button
                        className="group"
                        onClick={async () => {
                            getHistoryData();
                            setHistoryOpen(true);
                        }}
                        size="small"
                        icon={<ClockCircleOutlined className="text-[#673ab7] group-hover:text-[#d9d9d9]" />}
                        shape="circle"
                    />
                </div> */}
            </div>
            {!variableData.requirement && requirementStatusOpen && (
                <span className="text-xs text-[#ff4d4f] ml-[4px]">优化字段内容必填</span>
            )}
            <div className="text-[16px] font-bold my-4">3.如何生成素材</div>
            <div className="flex gap-2 items-center text-xs mb-4">
                <div>一组生成多少条</div>
                <InputNumber
                    value={variableData.generateCount}
                    onChange={(value) => {
                        if (value) {
                            setVariableData({
                                ...variableData,
                                generateCount: value
                            });
                        }
                    }}
                    className="w-[200px]"
                    min={1}
                    max={12}
                />
            </div>
            <div className="flex gap-2 items-center text-xs">
                <div>共生成几组素材</div>
                <InputNumber
                    value={variableData.groupNum}
                    onChange={(value) => {
                        if (value) {
                            setVariableData({
                                ...variableData,
                                groupNum: value
                            });
                        }
                    }}
                    className="w-[200px]"
                    min={1}
                    max={20}
                />
            </div>
            <div className="flex justify-center gap-6 mt-6">
                <Button
                    onClick={() => {
                        if (variableData.checkedFieldList?.length === 0) {
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: 'AI 补齐字段最少选一个',
                                    variant: 'alert',
                                    alert: {
                                        color: 'error'
                                    },
                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                    close: false
                                })
                            );
                            return false;
                        }
                        if (!variableData.requirement) {
                            setrequirementStatusOpen(true);
                            return false;
                        }
                        saveConfig('generate_material_batch');
                    }}
                    type="primary"
                >
                    保存配置
                </Button>
                <Button
                    type="primary"
                    onClick={() => {
                        if (variableData.checkedFieldList?.length === 0) {
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: 'AI 补齐字段最少选一个',
                                    variant: 'alert',
                                    alert: {
                                        color: 'error'
                                    },
                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                    close: false
                                })
                            );
                            return false;
                        }
                        if (!variableData.requirement) {
                            setrequirementStatusOpen(true);
                            return false;
                        }
                        aimaterialCreate();
                    }}
                >
                    AI 生成素材
                </Button>
            </div>
            <Drawer
                title="历史数据"
                placement="right"
                closable={false}
                onClose={() => {
                    setHistoryOpen(false);
                }}
                open={historyOpen}
                getContainer={false}
            >
                <List
                    className="flex-1"
                    itemLayout="horizontal"
                    dataSource={dataSource}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <div
                                        onClick={() => {
                                            setVariableData({
                                                ...variableData,
                                                requirement: item.requestContent
                                            });
                                            setHistoryOpen(false);
                                        }}
                                        className="line-clamp-3 text-xs text-black/50 cursor-pointer"
                                    >
                                        <span className="text-black mr-2">{dayjs(item?.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                                        {item?.requestContent}
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Drawer>
        </div>
    );
};
export default AiCreate;
