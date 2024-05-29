import { Modal, Button, Table, Input, Progress, Tabs, Checkbox, InputNumber, Tag, TabsProps, Popover } from 'antd';
import { useEffect, useMemo, useState, useRef } from 'react';
import { materialGenerate, customMaterialGenerate } from 'api/redBook/batchIndex';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash-es';
import { ExclamationCircleFilled } from '@ant-design/icons';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
const { confirm } = Modal;

const AiCreate = ({
    title,
    setColOpen,
    materialType,
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
    setColOpen: (data: boolean) => void;
    materialType: any;
    columns: any[];
    MokeList: any[];
    tableData: any[];
    setPage: (data: any) => void;
    setcustom?: (data: any) => void;
    setField?: (data: any) => void;
    downTableData: (data: any, num: number) => void;
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
        return columns?.slice(1, columns?.length - 1)?.filter((item) => item.type !== 'image' && item.type !== 'document');
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
    const errorMessageRef = useRef<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<any[]>([]);
    const [cancelExeLoading, setcancelExeLoading] = useState(false);
    const materialPre = useMemo(() => {
        return ((successCountRef.current / totalCountRef.current) * 100) | 0;
    }, [successCount, totalCount]);
    const aref = useRef(false);
    const handleMaterial = async (num: number) => {
        materialzanListRef.current = [];
        setMaterialzanList(materialzanListRef.current);
        uuidListsRef.current = [];
        setUuidLists(uuidListsRef.current);
        aref.current = false;
        setMaterialExecutionOpen(true);
        //记录原有数据下标
        const indexList: any[] = [];
        let theStaging = _.cloneDeep(tableData);
        if (num === 1) {
            tableData?.map((item, index) => {
                if (selList?.find((el) => el.uuid === item.uuid)) {
                    indexList.push(index);
                }
            });
        } else {
            tableData?.map((item, index) => {
                indexList.push(index);
            });
        }
        totalCountRef.current = num === 1 ? selList.length : tableData.length;
        setTotalCount(totalCountRef.current);
        let index = 0;
        const chunks = chunkArray(num === 1 ? selList : tableData, 3);
        while (index < chunks.length && !aref.current) {
            const resArr: any[] = [];
            const uuidList: any[] = [];
            const currentBatch = chunks.slice(index, index + 3);
            // try {
            executionCountRef.current = currentBatch?.flat()?.length;
            setExecutionCount(executionCountRef.current);

            await Promise.all(
                currentBatch.map(async (group, i) => {
                    try {
                        const res = await materialGenerate({
                            materialList: group,
                            fieldList: MokeList,
                            ...fieldCompletionData
                        });
                        if (res?.length === group?.length) {
                            resArr[index + i] = res;
                        } else if (res?.length !== group?.length && res.length === 1) {
                            resArr[index + i] = [...res, {}, {}];
                        } else if (res?.length !== group?.length && res.length === 2) {
                            resArr[index + i] = [...res, {}];
                        }
                        executionCountRef.current = executionCountRef.current - group?.length;
                        successCountRef.current += group?.length;
                        setExecutionCount(executionCountRef.current);
                        setSuccessCount(successCountRef.current);
                    } catch (error: any) {
                        group?.map((item) => {
                            if (!resArr[index + i]) {
                                resArr[index + i] = [{}];
                            } else {
                                resArr[index + i].push({});
                            }
                        });
                        console.log(error);
                        const newList = _.cloneDeep(errorMessageRef.current);
                        newList.push(error.msg);
                        errorMessageRef.current = newList;
                        setErrorMessage(errorMessageRef.current);
                        executionCountRef.current -= group?.length;
                        setExecutionCount(executionCountRef.current);
                        errorCountRef.current += group?.length;
                        if (errorCountRef.current >= 9) {
                            aref.current = true;
                        }
                        setErrorCount(errorCountRef.current);
                    }
                })
            );
            let newList = _.cloneDeep(theStaging);
            const newArr = _.cloneDeep(materialzanListRef.current);
            for (let i = 0; i < currentBatch.flat().length; i++) {
                const obj: any = {};
                resArr.flat()[i] &&
                    Object.keys(resArr.flat()[i]).map((item) => {
                        obj[item] = resArr.flat()[i][item];
                    });
                newArr.push(obj);
                uuidList.push(newList[indexList[i + index * 3]]?.uuid);
                newList[indexList[i + index * 3]] = {
                    ...newList[indexList[i + index * 3]],
                    ...obj
                };
            }
            materialzanListRef.current = newArr;
            setMaterialzanList(materialzanListRef.current);
            const newL = _.cloneDeep(uuidListsRef.current);
            newL?.push(...uuidList);
            uuidListsRef.current = newL;
            setUuidLists(uuidListsRef.current);
            theStaging = _.cloneDeep(newList);
            materialFieldexeDataRef.current = theStaging;
            index += 3;
        }
        executionCountRef.current = 0;
        setExecutionCount(executionCountRef.current);
        setcancelExeLoading(false);
    };
    //loading 弹窗
    const [materialExecutionOpen, setMaterialExecutionOpen] = useState(false);
    // AI 批量生成
    const [requirementStatusOpen, setrequirementStatusOpen] = useState(false);

    //素材预览
    const getTextStream = async () => {
        materialzanListRef.current = [];
        setMaterialzanList(materialzanListRef.current);
        uuidListsRef.current = [];
        setUuidLists(uuidListsRef.current);
        aref.current = false;
        setMaterialExecutionOpen(true);
        const i = Array.from({ length: variableData.generateCount * variableData.groupNum }, (_, index) => index);
        totalCountRef.current = i?.length;
        setTotalCount(totalCountRef.current);
        const chunks = chunkArray(i, variableData.generateCount);
        let index = 0;
        // let theStaging = _.cloneDeep(tableData);
        while (index < chunks?.length && !aref.current) {
            const resArr: any[] = [];
            const currentBatch = chunks.slice(index, index + 3);
            executionCountRef.current = currentBatch?.flat()?.length;
            setExecutionCount(executionCountRef.current);
            await Promise.all(
                currentBatch.map(async (group, i) => {
                    try {
                        const res = await customMaterialGenerate({ ...variableData, fieldList: MokeList, generateCount: group?.length });
                        const timers = new Date();
                        resArr.push(...res?.map((item: any) => ({ ...item, uuid: uuidv4(), type: materialType, group: timers })));
                        executionCountRef.current = executionCountRef.current - group?.length;
                        successCountRef.current += group?.length;
                        setExecutionCount(executionCountRef.current);
                        setSuccessCount(successCountRef.current);
                    } catch (error: any) {
                        console.log(error);
                        const newList = _.cloneDeep(errorMessageRef.current);
                        newList.push(error.msg);
                        errorMessageRef.current = newList;
                        setErrorMessage(errorMessageRef.current);
                        executionCountRef.current -= group?.length;
                        setExecutionCount(executionCountRef.current);
                        errorCountRef.current += group?.length;
                        if (errorCountRef.current >= 9) {
                            aref.current = true;
                        }
                        setErrorCount(errorCountRef.current);
                    }
                })
            );
            // let newList = _.cloneDeep(theStaging);
            const newMaterialzan = _.cloneDeep(materialzanListRef.current);
            newMaterialzan.push(...resArr);
            materialzanListRef.current = newMaterialzan;
            setMaterialzanList(materialzanListRef.current);
            // newList.unshift(...resArr);
            // theStaging = _.cloneDeep(newList);
            const newL = _.cloneDeep(uuidListsRef.current);
            newL?.push(...resArr?.map((item) => item.uuid));
            uuidListsRef.current = newL;
            setUuidLists(uuidListsRef.current);

            // downTableData(theStaging);

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
            errorMessageRef.current = [];
            setErrorMessage(errorMessageRef.current);
            executionCountRef.current = 0;
            setExecutionCount(executionCountRef.current);
            errorCountRef.current = 0;
            setErrorCount(errorCountRef.current);
            successCountRef.current = 0;
            setSuccessCount(successCountRef.current);
        }
    }, [materialExecutionOpen]);

    //AI 素材生成
    const aimaterialCreate = () => {
        setSelectValue('batch');
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
        getTextStream();
    };
    //处理素材
    const editMaterial = (num: number) => {
        setSelectValue('field');
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
        batchNum.current = num;
        handleMaterial(num);
    };
    //新增插入表格
    const [selectValue, setSelectValue] = useState('');
    const batchNum = useRef(-1);
    const materialFieldexeDataRef = useRef<any>(null);
    const materialzanListRef = useRef<any[]>([]);
    const [materialzanList, setMaterialzanList] = useState<any[]>([]);
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
            <Button
                size={title === 'AI 生成' ? 'small' : 'middle'}
                onClick={() => {
                    if (columns?.filter((item) => item.title !== '序号' && item.title !== '操作')?.length === 0) {
                        confirm({
                            title: '提示',
                            content: '还未配置素材字段',
                            icon: <ExclamationCircleFilled rev={undefined} />,
                            okText: '去配置',
                            cancelText: '再想想',
                            onOk() {
                                setColOpen(true);
                            }
                        });
                    } else {
                        setOpen(true);
                    }
                }}
                type="primary"
            >
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
                                            <Checkbox disabled={item.required} value={item.dataIndex}>
                                                {item.title}
                                                {item.required ? '*' : ''}
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                    <div className="text-[16px] font-bold my-4 flex items-center">
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
                                    <div className="flex gap-2 items-center text-xs mt-4">
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
                                                setcustom && setcustom(JSON.stringify(variableData));
                                            }}
                                            type="primary"
                                        >
                                            保存配置
                                        </Button>
                                        <Button type="primary" onClick={aimaterialCreate}>
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
                                        onChange={(e) => {
                                            if (fieldCompletionData.checkedFieldList.length > e.length) {
                                                setFieldCompletionData({
                                                    ...fieldCompletionData,
                                                    checkedFieldList: e
                                                });
                                            } else {
                                                if (e.length > 6) {
                                                    if (checkedList?.find((item) => item.dataIndex === e[e.length - 1])?.required) {
                                                        setFieldCompletionData({
                                                            ...fieldCompletionData,
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
                                                    setFieldCompletionData({
                                                        ...fieldCompletionData,
                                                        checkedFieldList: e
                                                    });
                                                }
                                            }
                                        }}
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
                                            onClick={() => editMaterial(1)}
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
                                                editMaterial(2);
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
                <Modal width={'80%'} open={materialExecutionOpen} onCancel={() => setMaterialExecutionOpen(false)} footer={false}>
                    <div className="flex justify-center ">
                        <Progress percent={materialPre} type="circle" />
                    </div>
                    {executionCount !== 0 && <div className="font-bold text-center mt-4">AI 处理中，请勿刷新页面···</div>}
                    <div className="my-4">
                        {errorMessage?.length > 0 &&
                            errorMessage?.map((item, i) => (
                                <div className="mb-2 text-[#ff4d4f] text-xs flex justify-center">
                                    <span className="font-bold">错误信息 {i + 1}：</span>
                                    {item}
                                </div>
                            ))}
                    </div>
                    {totalCount === successCount + errorCount && successCount !== 0 && (
                        <div className="my-4 text-xs flex justify-center">
                            <span className="font-bold">已经生成完成，点击确认导入素材</span>
                        </div>
                    )}
                    <div className="flex gap-2 justify-center my-4 text-xs">
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
                    <Table
                        columns={
                            selectValue === 'field'
                                ? columns?.filter((item: any) => fieldCompletionData.checkedFieldList?.includes(item.dataIndex))
                                : columns?.filter((item: any) => variableData.checkedFieldList?.includes(item.dataIndex))
                        }
                        dataSource={materialzanList}
                    />
                    <div className="flex justify-center gap-2 mt-4">
                        {executionCount === 0 && (
                            <>
                                <Button
                                    className="w-[100px]"
                                    size="small"
                                    onClick={() => {
                                        errorCountRef.current = 0;
                                        successCountRef.current = 0;
                                        executionCountRef.current = 0;
                                        setErrorCount(errorCountRef.current);
                                        setSuccessCount(successCountRef.current);
                                        setExecutionCount(executionCountRef.current);
                                        if (selectValue === 'batch') {
                                            aimaterialCreate();
                                        } else {
                                            editMaterial(batchNum.current);
                                        }
                                    }}
                                >
                                    重试
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (selectValue === 'batch') {
                                            downTableData(materialzanList, 1);
                                            setMaterialExecutionOpen(false);
                                            setOpen(false);
                                            setSelectedRowKeys(uuidLists);
                                        } else {
                                            setSelList([]);
                                            downTableData(materialFieldexeDataRef.current, 2);
                                            setMaterialExecutionOpen(false);
                                            setOpen(false);
                                            setSelectedRowKeys(uuidLists);
                                        }
                                    }}
                                    className="w-[100px]"
                                    size="small"
                                    type="primary"
                                >
                                    确认
                                </Button>
                            </>
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
