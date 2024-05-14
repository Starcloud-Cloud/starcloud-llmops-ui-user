import { Modal, Button, Table, Radio, Input, Switch, Tabs, Checkbox, InputNumber } from 'antd';
import { useEffect, useMemo, useState, useRef } from 'react';
import { customMaterialGenerate } from 'api/template/fetch';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import ChatMarkdown from 'ui-component/Markdown';
const LeftModalAdd = ({
    zoomOpen,
    setZoomOpen,
    tableLoading,
    columns,
    tableData,
    MokeList,
    setTitle,
    setEditOpen,
    setPage,
    defaultVariableData,
    setcustom,
    downTableData
}: {
    zoomOpen: boolean;
    setZoomOpen: (data: boolean) => void;
    tableLoading: boolean;
    columns: any[];
    MokeList: any[];
    tableData: any[];
    setTitle: (data: string) => void;
    setEditOpen: (data: boolean) => void;
    setPage: (data: any) => void;
    setcustom?: (data: any) => void;
    downTableData: (data: any) => void;
    defaultVariableData?: any;
}) => {
    const { TextArea } = Input;
    const [open, setOpen] = useState(false);
    const checkedFieldList = useMemo(() => {
        return columns
            ?.slice(1, columns?.length - 1)
            ?.filter((item) => item.type !== 'image')
            ?.map((item) => item?.dataIndex);
    }, [columns]);
    // AI 字段生成1
    const [exeLoading, setExeLoading] = useState(false);
    const [variableData, setVariableData] = useState<any>({
        fieldList: MokeList,
        checkedFieldList,
        requirement: undefined,
        generateCount: 1
    });
    const [downLoading, setDownLoading] = useState(false);
    //素材预览
    const [preview, setPreView] = useState(false);
    const materialRef = useRef('');
    const [materialValue, setMaterialValue] = useState('');
    const getTextStream = async () => {
        try {
            const result: any = await customMaterialGenerate(variableData);
            const reader = result.getReader();
            const textDecoder = new TextDecoder();
            let outerJoins: any;
            setDownLoading(true);
            setTimeout(() => {
                setPreView(true);
                setExeLoading(false);
            }, 1000);
            while (1) {
                let joins = outerJoins;
                const { done, value } = await reader.read();
                if (done) {
                    setDownLoading(false);
                    break;
                }
                let str = textDecoder.decode(value);
                const lines = str.split('\n');
                lines.forEach((message, i: number) => {
                    if (i === 0 && joins) {
                        message = joins + message;
                        joins = undefined;
                    }
                    if (i === lines.length - 1) {
                        if (message && message.indexOf('}') === -1) {
                            joins = message;
                            return;
                        }
                    }
                    let bufferObj;
                    if (message?.startsWith('data:')) {
                        bufferObj = message.substring(5) && JSON.parse(message.substring(5));
                    }
                    if (bufferObj?.code === 200 && bufferObj.type !== 'ads-msg') {
                        materialRef.current = materialRef.current + bufferObj.content;
                        materialRef.current = materialRef.current;
                        setMaterialValue(materialRef.current);
                    } else if (bufferObj?.code === 200 && bufferObj.type === 'ads-msg') {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: bufferObj.content,
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                },
                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                close: false
                            })
                        );
                    } else if (bufferObj && bufferObj.code !== 200 && bufferObj.code !== 300900000) {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: '请求错误',
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                },
                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                close: false
                            })
                        );
                    }
                });
                outerJoins = joins;
            }
        } catch (err) {
            setExeLoading(false);
            setDownLoading(false);
        }
    };
    useEffect(() => {
        if (!preview) {
            materialRef.current = '';
            setMaterialValue(materialRef.current);
        }
    }, [preview]);
    useEffect(() => {
        if (!open) {
            setVariableData({
                fieldList: MokeList,
                checkedFieldList,
                requirement: undefined,
                generateCount: 1
            });
        } else {
            if (defaultVariableData) {
                setVariableData(defaultVariableData);
            }
        }
    }, [open]);
    return (
        <Modal maskClosable={false} width={'70%'} open={zoomOpen} footer={null} onCancel={() => setZoomOpen(false)}>
            <div className="flex gap-2 justify-end my-[20px]">
                <Button type="primary" onClick={() => setOpen(true)}>
                    AI 字段生成
                </Button>
                <Button
                    type="primary"
                    onClick={() => {
                        setTitle('新增');
                        setEditOpen(true);
                    }}
                >
                    新增
                </Button>
            </div>
            <Table
                scroll={{ y: 500 }}
                rowKey={(record, index) => {
                    return record[Object.keys(record)[1]] + index;
                }}
                pagination={{
                    onChange: (page) => {
                        setPage(page);
                    }
                }}
                loading={tableLoading}
                size="small"
                virtual
                columns={columns}
                dataSource={tableData}
            />
            <Modal maskClosable={false} width={'60%'} open={open} footer={null} onCancel={() => setOpen(false)}>
                <Tabs
                    items={[
                        {
                            key: '0',
                            disabled: true,
                            label: 'AI 字段补齐',
                            children: (
                                <div>
                                    <div className="text-[16px] font-bold mb-4">1.选择需要 AI 补齐的字段</div>
                                    <Radio.Group defaultValue="c" buttonStyle="solid">
                                        {columns?.map((item) => (
                                            <Radio.Button key={item.title} value={item.title}>
                                                {item.title}
                                            </Radio.Button>
                                        ))}
                                    </Radio.Group>
                                    <div className="text-[16px] font-bold my-4">2.告诉 AI 如何生成这些字段内容</div>
                                    <TextArea />
                                    <div className="text-[16px] font-bold my-4">3.如何处理素材</div>
                                    <div className="flex gap-2 items-center text-xs text-black/50">
                                        <Switch />
                                        <span>字段为空时生成</span>
                                    </div>
                                    <div className="flex justify-center gap-6 mt-6">
                                        <Button type="primary">处理一条素材</Button>
                                        <Button type="primary">处理全部素材</Button>
                                    </div>
                                </div>
                            )
                        },
                        {
                            key: '1',
                            label: 'AI 批量生成',
                            children: (
                                <div>
                                    <div className="text-[16px] font-bold mb-4">1.选择需要 AI 补齐的字段</div>
                                    <Checkbox.Group value={variableData.checkedFieldList}>
                                        {columns?.slice(1, columns?.length - 1)?.map((item) => (
                                            <Checkbox disabled={true} value={item.dataIndex}>
                                                {item.title}
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                    <div className="text-[16px] font-bold my-4">2.告诉 AI 如何生成这些字段内容</div>
                                    <TextArea
                                        value={variableData.requirement}
                                        onChange={(e) => {
                                            setVariableData({
                                                ...variableData,
                                                requirement: e.target.value
                                            });
                                        }}
                                        rows={10}
                                    />
                                    <div className="text-[16px] font-bold my-4">3.如何处理素材</div>
                                    <div className="flex gap-2 items-center text-xs">
                                        <div>生成多少条素材</div>
                                        <InputNumber
                                            value={variableData.generateCount}
                                            onChange={(value) =>
                                                setVariableData({
                                                    ...variableData,
                                                    generateCount: value
                                                })
                                            }
                                            className="w-[200px]"
                                            min={1}
                                            max={10}
                                        />
                                    </div>
                                    <div className="flex justify-center gap-6 mt-6">
                                        <Button
                                            onClick={() => {
                                                setcustom && setcustom(JSON.stringify(variableData));
                                            }}
                                            type="primary"
                                        >
                                            保存配置
                                        </Button>
                                        <Button
                                            type="primary"
                                            loading={exeLoading}
                                            onClick={() => {
                                                setExeLoading(true);
                                                getTextStream();
                                            }}
                                        >
                                            AI 生成素材
                                        </Button>
                                    </div>
                                </div>
                            )
                        }
                    ]}
                    defaultActiveKey="1"
                ></Tabs>
            </Modal>
            <Modal width={800} title="素材预览" open={preview} onCancel={() => setPreView(false)} footer={false}>
                <div className="min-h-[300px] max-h-[80vh] overflow-y-auto">
                    <ChatMarkdown textContent={materialValue} />
                </div>
                <div className="flex justify-center mt-4">
                    <Button
                        disabled={downLoading}
                        type="primary"
                        onClick={() => {
                            try {
                                const data = JSON.parse(materialValue);
                                if (data && data.length > 0) {
                                    setOpen(false);
                                    setPreView(false);
                                    downTableData(data);
                                }
                            } catch (err) {
                                downTableData([]);
                            }
                        }}
                    >
                        导入素材
                    </Button>
                </div>
            </Modal>
        </Modal>
    );
};
export default LeftModalAdd;
