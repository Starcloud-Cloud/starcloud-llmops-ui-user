import { Modal, Button, Table, Input, Progress, Tabs, Checkbox, InputNumber, Tag } from 'antd';
import { useEffect, useMemo, useState, useRef } from 'react';
import { customMaterialGenerate } from 'api/template/fetch';
import { materialGenerate } from 'api/redBook/batchIndex';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import ChatMarkdown from 'ui-component/Markdown';
import _ from 'lodash-es';
const LeftModalAdd = ({
    zoomOpen,
    setZoomOpen,
    tableLoading,
    columns,
    tableData,
    MokeList,
    setTitle,
    setEditOpen,
    changeTableValue,
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
    changeTableValue: (data: any) => void;
    setPage: (data: any) => void;
    setcustom?: (data: any) => void;
    downTableData: (data: any) => void;
    defaultVariableData?: any;
}) => {
    const { TextArea } = Input;
    const [open, setOpen] = useState(false);
    const [selTableList, setSelTableList] = useState<any[]>([]);
    const handleDels = () => {
        const newList = selTableList?.map((item) => JSON.stringify(item));
        const newData = tableData?.filter((item) => {
            return !newList.includes(JSON.stringify(item));
        });
        setSelTableList([]);
        changeTableValue(newData);
    };
    const checkedFieldList = useMemo(() => {
        return columns
            ?.slice(1, columns?.length - 1)
            ?.filter((item) => item.type !== 'image')
            ?.map((item) => item?.dataIndex);
    }, [columns]);
    const checkedList = useMemo(() => {
        return columns?.slice(1, columns?.length - 1)?.filter((item) => item.type !== 'image');
    }, [columns]);
    //AI 字段补齐
    const [selOpen, setSelOpen] = useState(false);
    const [selList, setSelList] = useState<any[]>([]);
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            setSelList(selectedRows);
        }
    };
    const [fieldCompletionData, setFieldCompletionData] = useState({
        fieldList: MokeList,
        checkedFieldList,
        requirement: ''
    });
    const handleMaterial = async (num: number) => {
        const result = await materialGenerate({
            materialList: num === 1 ? selList : tableData,
            ...fieldCompletionData
        });
    };
    //loading 弹窗
    const [materialExecutionOpen, setMaterialExecutionOpen] = useState(false);
    // AI 批量生成
    const [exeLoading, setExeLoading] = useState(false);
    const [requirementStatusOpen, setrequirementStatusOpen] = useState(false);
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
            <div className="flex gap-2 justify-between my-[20px]">
                <Button disabled={selTableList.length === 0} type="primary" onClick={handleDels}>
                    批量删除({selTableList.length})
                </Button>
                <div className="flex gap-2">
                    <Button type="primary" onClick={() => setOpen(true)}>
                        AI 素材生成
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
                rowSelection={{
                    type: 'checkbox',
                    fixed: true,
                    columnWidth: 50,
                    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                        setSelTableList(selectedRows);
                    }
                }}
                columns={columns}
                dataSource={tableData}
            />
            <Modal maskClosable={false} width={'60%'} open={open} footer={null} onCancel={() => setOpen(false)}>
                <Tabs
                    items={[
                        {
                            key: '1',
                            label: 'AI 批量生成',
                            children: (
                                <div>
                                    <div className="text-xs text-black/50">
                                        <span className="font-bold text-[#faad14]">Tips：</span>
                                        告诉AI你想生成的素材描述，越详细越好。AI会自动生成多条素材内容。
                                    </div>
                                    <div className="text-[16px] font-bold my-4">1.选择需要 AI 补齐的字段</div>
                                    <Checkbox.Group
                                        onChange={(e) => {
                                            setVariableData({
                                                ...variableData,
                                                checkedFieldList: e
                                            });
                                        }}
                                        value={variableData.checkedFieldList}
                                    >
                                        {checkedList?.map((item) => (
                                            <Checkbox disabled={item.required} value={item.dataIndex}>
                                                {item.title}
                                                {item.required ? '*' : ''}
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                    <div className="text-[16px] font-bold my-4">2.告诉 AI 如何生成这些字段内容</div>
                                    <TextArea
                                        value={variableData.requirement}
                                        status={!variableData.requirement && requirementStatusOpen ? 'error' : ''}
                                        onChange={(e) => {
                                            setrequirementStatusOpen(true);
                                            setVariableData({
                                                ...variableData,
                                                requirement: e.target.value
                                            });
                                        }}
                                        rows={10}
                                    />
                                    {!variableData.requirement && requirementStatusOpen && (
                                        <span className="text-xs text-[#ff4d4f] ml-[4px]">优化字段内容必填</span>
                                    )}
                                    <div className="text-[16px] font-bold my-4">3.如何处理素材</div>
                                    <div className="flex gap-2 items-center text-xs">
                                        <div>生成多少条素材</div>
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
                                            max={10}
                                        />
                                    </div>
                                    <div className="flex justify-center gap-6 mt-6">
                                        <Button
                                            onClick={() => {
                                                if (!variableData.requirement) {
                                                    setrequirementStatusOpen(true);
                                                    return false;
                                                }
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
                                                if (!variableData.requirement) {
                                                    setrequirementStatusOpen(true);
                                                    return false;
                                                }
                                                setExeLoading(true);
                                                getTextStream();
                                            }}
                                        >
                                            AI 生成素材
                                        </Button>
                                    </div>
                                </div>
                            )
                        },
                        {
                            key: '0',
                            disabled: true,
                            label: 'AI 字段补齐',
                            children: (
                                <div>
                                    <div className="text-xs text-black/50">
                                        <span className="font-bold text-[#faad14]">Tips：</span>
                                        <p>先选择已选素材上想要补齐内容的字段，然后告诉AI你想生成的素材描述，越详细越好。</p>
                                        <p>AI会自动生成已选素材的空缺字段的内容。</p>
                                    </div>
                                    <div className="text-[16px] font-bold my-4">1.选择需要 AI 补齐的字段</div>
                                    <Checkbox.Group
                                        onChange={(e) =>
                                            setFieldCompletionData({
                                                ...fieldCompletionData,
                                                checkedFieldList: e
                                            })
                                        }
                                        value={fieldCompletionData.checkedFieldList}
                                    >
                                        {checkedList?.map((item) => (
                                            <Checkbox value={item.dataIndex}>{item.title}</Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                    <Button type="primary" size="small" onClick={() => setSelOpen(true)}>
                                        选择素材
                                    </Button>
                                    <div className="text-[16px] font-bold my-4">2.告诉 AI 如何生成这些字段内容</div>
                                    <TextArea
                                        value={fieldCompletionData.requirement}
                                        onChange={(e) => setFieldCompletionData({ ...fieldCompletionData, requirement: e.target.value })}
                                        rows={10}
                                    />
                                    <div className="text-[16px] font-bold my-4">3.如何处理素材</div>
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            disabled={selList?.length === 0}
                                            onClick={() => handleMaterial(1)}
                                            size="small"
                                            type="primary"
                                        >
                                            处理选中的素材({selList?.length})
                                        </Button>
                                        <Button
                                            disabled={tableData?.length === 0}
                                            onClick={() => handleMaterial(2)}
                                            size="small"
                                            type="primary"
                                        >
                                            处理全部素材({tableData?.length})
                                        </Button>
                                    </div>
                                    <div className="flex justify-center gap-6 mt-6">
                                        <Button type="primary">保存配置</Button>
                                    </div>
                                </div>
                            )
                        }
                    ]}
                    defaultActiveKey="1"
                ></Tabs>
            </Modal>
            {/* 素材导入 */}
            {preview && (
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
            )}
            {/* 选择素材 */}
            {selOpen && (
                <Modal
                    title="选择素材"
                    width={800}
                    open={selOpen}
                    onCancel={() => {
                        setSelList([]);
                        setSelOpen(false);
                    }}
                    footer={false}
                >
                    <div className="flex justify-end">
                        <Button onClick={() => setSelOpen(false)} type="primary" size="small">
                            确认选择({selList?.length})
                        </Button>
                    </div>
                    <Table
                        scroll={{ y: 500 }}
                        rowKey={(record, index) => {
                            return record[Object.keys(record)[1]] + index;
                        }}
                        pagination={{
                            showSizeChanger: true,
                            onChange: (page) => {
                                setPage(page);
                            }
                        }}
                        loading={tableLoading}
                        size="small"
                        virtual
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                            fixed: true,
                            columnWidth: 50
                        }}
                        columns={columns}
                        dataSource={tableData}
                    />
                </Modal>
            )}
            {/* 素材执行 loading */}
            {materialExecutionOpen && (
                <Modal open={materialExecutionOpen} onCancel={() => setMaterialExecutionOpen(false)} footer={false}>
                    <div className="flex justify-center flex-col items-center gap-4">
                        <div className="font-bold">AI 处理中，请勿刷新页面···</div>
                        <Progress percent={60} type="circle" />
                    </div>
                    <div className="flex gap-2 justify-center mt-4 text-xs">
                        <div>
                            <Tag>全部：12</Tag>
                        </div>
                        <div>
                            <Tag color="processing">待执行：11</Tag>
                        </div>
                        <div>
                            <Tag color="success">执行完成：34</Tag>
                        </div>
                        <div>
                            <Tag color="error">执行失败：1</Tag>
                        </div>
                    </div>
                </Modal>
            )}
        </Modal>
    );
};
export default LeftModalAdd;
