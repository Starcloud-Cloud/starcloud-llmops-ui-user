import { Modal, Button, Table, Input, Progress, Tabs, Checkbox, InputNumber, Tag } from 'antd';
import { useEffect, useMemo, useState, useRef } from 'react';
import { materialGenerate, customMaterialGenerate } from 'api/redBook/batchIndex';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash-es';

const AiCreate = ({
    title,
    columns,
    MokeList,
    tableData,
    defaultVariableData,
    defaultField,
    setPage,
    setcustom,
    setField,
    downTableData,
    setSelectedRowKeys,
    setFieldCompletionData,
    fieldCompletionData,
    setVariableData,
    variableData
}: {
    title: string;
    columns: any[];
    MokeList: any[];
    tableData: any[];
    setPage: (data: any) => void;
    setcustom?: (data: any) => void;
    setField?: (data: any) => void;
    downTableData: (data: any) => void;
    setSelectedRowKeys: (data: any) => void;
    defaultVariableData?: any;
    defaultField?: any;
    setFieldCompletionData: (data: any) => void;
    fieldCompletionData: any;
    setVariableData: (data: any) => void;
    variableData: any;
}) => {
    useEffect(() => {
        if (MokeList?.length > 0) {
        }
    }, [MokeList]);
    const { TextArea } = Input;
    const [open, setOpen] = useState(false);
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

    function chunkArray(myArray: any[], chunk_size: any) {
        var index = 0;
        var arrayLength = myArray.length;
        var tempArray = [];

        for (index = 0; index < arrayLength; index += chunk_size) {
            let myChunk = myArray.slice(index, index + chunk_size);
            tempArray.push(myChunk);
        }
        return tempArray;
    }
    //处理过的素材数据
    const totalCountRef = useRef(0);
    const [totalCount, setTotalCount] = useState(0);
    const executionCountRef = useRef(0);
    const [executionCount, setExecutionCount] = useState(0);
    const successCountRef = useRef(0);
    const [successCount, setSuccessCount] = useState(0);
    const errorCountRef = useRef(0);
    const [errorCount, setErrorCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState<any>('');
    const [cancelExeLoading, setcancelExeLoading] = useState(false);
    const materialPre = useMemo(() => {
        return ((successCountRef.current / totalCountRef.current) * 100) | 0;
    }, [successCount, totalCount]);
    const aref = useRef(false);
    const handleMaterial = async (num: number) => {
        uuidListsRef.current = [];
        setUuidLists(uuidListsRef.current);
        setErrorMessage('');
        aref.current = false;
        setMaterialExecutionOpen(true);
        //记录原有数据下标
        const indexList: any[] = [];
        tableData?.map((item, index) => {
            if (selList?.find((el) => el.uuid === item.uuid)) {
                indexList.push(index);
            }
        });
        totalCountRef.current = num === 1 ? selList.length : tableData.length;
        setTotalCount(totalCountRef.current);
        let index = 0;
        const chunks = chunkArray(num === 1 ? selList : tableData, 3);
        while (index < chunks.length && !aref.current) {
            const resArr: any[] = [];
            const uuidList: any[] = [];
            const currentBatch = chunks.slice(index, index + 3);
            executionCountRef.current = currentBatch?.flat()?.length;
            setExecutionCount(executionCountRef.current);
            try {
                await Promise.all(
                    currentBatch.map(async (group, i) => {
                        const res = await materialGenerate({
                            materialList: group,
                            fieldList: MokeList,
                            ...fieldCompletionData
                        });
                        if (res?.length === group?.length) {
                            resArr[index + i] = res;
                        } else if (res?.length !== group?.length && res.length === 1) {
                            resArr[index + i] = [...res, {}, {}];
                        }

                        executionCountRef.current = executionCountRef.current - group?.length;
                        successCountRef.current += group?.length;
                        setExecutionCount(executionCountRef.current);
                        setSuccessCount(successCountRef.current);
                    })
                );
                let newList = _.cloneDeep(tableData);
                if (num === 1) {
                    for (let i = 0; i < chunks.flat().length; i++) {
                        const obj: any = {};
                        resArr.flat()[i] &&
                            Object.keys(resArr.flat()[i]).map((item) => {
                                obj[item] = resArr.flat()[i][item];
                            });
                        uuidList.push(newList[indexList[i]]?.uuid);
                        newList[indexList[i]] = {
                            ...newList[indexList[i]],
                            ...obj
                        };
                    }
                } else {
                    newList = newList?.map((item, index) => {
                        uuidList.push(item?.uuid);
                        return {
                            ...item,
                            ...resArr.flat()[index]
                        };
                    });
                }
                const newL = _.cloneDeep(uuidListsRef.current);
                newL?.push(...uuidList);
                uuidListsRef.current = newL;
                setUuidLists(uuidListsRef.current);
                downTableData(newList);
            } catch (error: any) {
                console.log(error);
                setErrorMessage(error.msg);
                executionCountRef.current = 0;
                setExecutionCount(executionCountRef.current);
                errorCountRef.current += currentBatch?.flat()?.length;
                if (errorCountRef.current >= 9) {
                    aref.current = true;
                    setErrorMessage('服务器繁忙，请稍后再试');
                }
                setErrorCount(errorCountRef.current);
            }
            index += 3;
        }
        executionCountRef.current = 0;
        setExecutionCount(executionCountRef.current);
        setcancelExeLoading(false);
        setSelList([]);
    };
    //loading 弹窗
    const [materialExecutionOpen, setMaterialExecutionOpen] = useState(false);
    // AI 批量生成
    const [requirementStatusOpen, setrequirementStatusOpen] = useState(false);

    //素材预览
    const getTextStream = async () => {
        uuidListsRef.current = [];
        setUuidLists(uuidListsRef.current);
        setErrorMessage('');
        aref.current = false;
        setMaterialExecutionOpen(true);
        const i = Array.from({ length: variableData.generateCount }, (_, index) => index);
        totalCountRef.current = i?.length;
        setTotalCount(totalCountRef.current);
        const chunks = chunkArray(i, 3);
        let index = 0;
        while (index < chunks?.length && !aref.current) {
            const resArr: any[] = [];
            const currentBatch = chunks.slice(index, index + 3);
            executionCountRef.current = currentBatch?.flat()?.length;
            setExecutionCount(executionCountRef.current);
            try {
                await Promise.all(
                    currentBatch.map(async (group, i) => {
                        const res = await customMaterialGenerate({ ...variableData, fieldList: MokeList, generateCount: group?.length });
                        if (res?.length === group?.length) {
                            resArr.push(...res?.map((item: any) => ({ ...item, uuid: uuidv4() })));
                        }
                        executionCountRef.current = executionCountRef.current - group?.length;
                        successCountRef.current += group?.length;
                        setExecutionCount(executionCountRef.current);
                        setSuccessCount(successCountRef.current);
                    })
                );
                let newList = _.cloneDeep(tableData);
                newList.unshift(...resArr);
                const newL = _.cloneDeep(uuidListsRef.current);
                newL?.push(...resArr?.map((item) => item.uuid));
                uuidListsRef.current = newL;
                setUuidLists(uuidListsRef.current);
                downTableData(newList);
            } catch (error: any) {
                console.log(error);
                setErrorMessage(error.msg);
                executionCountRef.current = 0;
                setExecutionCount(executionCountRef.current);
                errorCountRef.current += currentBatch?.flat()?.length;
                if (errorCountRef.current >= 9) {
                    aref.current = true;
                    setErrorMessage('服务器繁忙，请稍后再试');
                }
                setErrorCount(errorCountRef.current);
            }
            index += 3;
        }
        executionCountRef.current = 0;
        setExecutionCount(executionCountRef.current);
        setcancelExeLoading(false);
    };
    //监听生成的 uuid
    const uuidListsRef = useRef<any[]>([]);
    const [uuidLists, setUuidLists] = useState<any[]>([]);
    useEffect(() => {
        if (!materialExecutionOpen) {
            executionCountRef.current = 0;
            setExecutionCount(executionCountRef.current);
            errorCountRef.current = 0;
            setErrorCount(errorCountRef.current);
            successCountRef.current = 0;
            setSuccessCount(successCountRef.current);
        }
    }, [materialExecutionOpen]);

    return (
        <div>
            <Button size={title === 'AI 生成' ? 'small' : 'middle'} onClick={() => setOpen(true)} type="primary">
                {title}
            </Button>
            <Modal title="素材AI生成" maskClosable={false} width={'60%'} open={open} footer={null} onCancel={() => setOpen(false)}>
                <Tabs
                    items={[
                        {
                            key: '1',
                            label: '批量生成',
                            children: (
                                <div>
                                    <div className="text-xs text-black/50">
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
                                            max={100}
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
                                            onClick={() => {
                                                if (!variableData.requirement) {
                                                    setrequirementStatusOpen(true);
                                                    return false;
                                                }
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
                            label: '字段补齐',
                            children: (
                                <div>
                                    <div className="text-xs text-black/50">
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
                                            <Checkbox value={item.dataIndex}>
                                                {item.title}
                                                {item.required ? '*' : ''}
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                    <div className="text-[16px] font-bold my-4">2.告诉 AI 如何生成这些字段内容</div>
                                    <TextArea
                                        value={fieldCompletionData.requirement}
                                        status={!fieldCompletionData.requirement && requirementStatusOpen ? 'error' : ''}
                                        onChange={(e) => {
                                            setFieldCompletionData({ ...fieldCompletionData, requirement: e.target.value });
                                            setrequirementStatusOpen(true);
                                        }}
                                        rows={10}
                                    />
                                    {!fieldCompletionData.requirement && requirementStatusOpen && (
                                        <span className="text-xs text-[#ff4d4f] ml-[4px]">优化字段内容必填</span>
                                    )}
                                    <div className="text-[16px] font-bold my-4">3.如何处理素材</div>
                                    <Button className="mb-4" type="primary" size="small" onClick={() => setSelOpen(true)}>
                                        选择素材
                                    </Button>
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            className="h-[50px]"
                                            disabled={selList?.length === 0}
                                            onClick={() => {
                                                if (!fieldCompletionData.requirement) {
                                                    setrequirementStatusOpen(true);
                                                    return false;
                                                }
                                                if (fieldCompletionData.checkedFieldList?.length === 0) {
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
                                                handleMaterial(1);
                                            }}
                                            type="primary"
                                        >
                                            <div className="flex flex-col items-center">
                                                处理选中的素材
                                                <div>({selList?.length})</div>
                                            </div>
                                        </Button>
                                        <Button
                                            className="h-[50px]"
                                            disabled={tableData?.length === 0}
                                            onClick={() => {
                                                setrequirementStatusOpen(true);
                                                // if (!fieldCompletionData.requirement) {
                                                //     return false;
                                                // }
                                                if (fieldCompletionData.checkedFieldList?.length === 0) {
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
                                                handleMaterial(2);
                                            }}
                                            type="primary"
                                        >
                                            <div className="flex flex-col items-center">
                                                处理全部素材
                                                <div>({tableData?.length})</div>
                                            </div>
                                        </Button>
                                    </div>
                                    <div className="flex justify-center gap-6 mt-6">
                                        <Button
                                            onClick={() => {
                                                if (!fieldCompletionData.requirement) {
                                                    setrequirementStatusOpen(true);
                                                    return false;
                                                }
                                                if (fieldCompletionData.checkedFieldList?.length === 0) {
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
                                                setField && setField(JSON.stringify(fieldCompletionData));
                                            }}
                                            type="primary"
                                        >
                                            保存配置
                                        </Button>
                                    </div>
                                </div>
                            )
                        }
                    ]}
                    defaultActiveKey="1"
                ></Tabs>
            </Modal>
            {/* 选择素材 */}
            <Modal
                title="选择素材"
                width={'80%'}
                open={selOpen}
                onCancel={() => {
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
                        return record.uuid;
                    }}
                    pagination={{
                        showSizeChanger: true,
                        defaultPageSize: 20,
                        pageSizeOptions: [20, 50, 100, 300, 500],
                        onChange: (page) => {
                            setPage(page);
                        }
                    }}
                    size="small"
                    virtual
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                        fixed: true,
                        columnWidth: 50
                    }}
                    columns={columns?.slice(0, columns?.length - 1)}
                    dataSource={tableData}
                />
            </Modal>
            {/* 素材执行 loading */}
            {materialExecutionOpen && (
                <Modal open={materialExecutionOpen} onCancel={() => setMaterialExecutionOpen(false)} footer={false}>
                    <div className="flex justify-center flex-col items-center gap-4">
                        <div className="font-bold">AI 处理中，请勿刷新页面···</div>
                        <Progress percent={materialPre} type="circle" />
                    </div>
                    {errorMessage && (
                        <div className="my-4 text-[#ff4d4f] text-xs flex justify-center">
                            <span className="font-bold">错误信息：</span>
                            {errorMessage}
                        </div>
                    )}
                    <div className="flex gap-2 justify-center mt-4 text-xs">
                        <div>
                            <Tag>全部：{totalCount}</Tag>
                        </div>
                        <div>
                            <Tag color="processing">待执行：{totalCount - successCount - errorCount - executionCount}</Tag>
                        </div>
                        <div>
                            <Tag color="processing">执行中：{executionCount}</Tag>
                        </div>
                        <div>
                            <Tag color="success">执行完成：{successCount}</Tag>
                        </div>
                        <div>
                            <Tag color="error">执行失败：{errorCount}</Tag>
                        </div>
                    </div>
                    <div className="flex justify-center mt-4">
                        {executionCount === 0 && (
                            <Button
                                onClick={() => {
                                    setMaterialExecutionOpen(false);
                                    setOpen(false);
                                    setSelectedRowKeys(uuidLists);
                                }}
                                className="w-[100px]"
                                size="small"
                                type="primary"
                            >
                                确认
                            </Button>
                        )}
                        {executionCount > 0 && (
                            <Button
                                loading={cancelExeLoading}
                                size="small"
                                type="primary"
                                onClick={() => {
                                    setcancelExeLoading(true);
                                    aref.current = true;
                                }}
                            >
                                取消执行
                            </Button>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};
export default AiCreate;
