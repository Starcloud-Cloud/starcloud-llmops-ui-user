import { Modal, Button, Table, Progress, Tag } from 'antd';
import { useEffect, useMemo, useState, useRef, memo } from 'react';
import { materialGenerate, customMaterialGenerate, pluginsXhsOcr } from 'api/redBook/batchIndex';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash-es';
import './aiCreate.css';
import AICreates from './components/AICreate';
import FieldCompletion from './components/fieldCompletion';
import RedBookAnalysis from './components/redBookAnalysis';
import ImgOcr from './components/imgOcr';
import TextExtraction from './components/textExtraction';

// @Deprecated
const AiCreate = ({
    plugValue,
    materialType,
    columns,
    MokeList,
    tableData,
    setPage,
    setcustom,
    setField,
    downTableData,
    setSelectedRowKeys,
    setFieldCompletionData,
    fieldCompletionData,
    setVariableData,
    variableData,
    setPlugOpen
}: {
    plugValue: string | null;
    materialType: any;
    columns: any[];
    MokeList: any[];
    tableData: any[];
    setPage: (data: any) => void;
    setcustom?: (data: any) => void;
    setField?: (data: any) => void;
    downTableData: (data: any, num: number) => void;
    setSelectedRowKeys: (data: any) => void;
    fieldCompletionData: any;
    setFieldCompletionData: (data: any) => void;
    variableData: any;
    setVariableData: (data: any) => void;
    setPlugOpen: (data: boolean) => void;
}) => {
    const checkedList = useMemo(() => {
        return columns?.slice(1, columns?.length - 1)?.filter((item) => item.type !== 'image' && item.type !== 'document');
    }, [columns]);
    const imgCheckedList = useMemo(() => {
        return columns?.slice(1, columns?.length - 1)?.filter((item) => item.type === 'image');
    }, [columns]);
    const allColumns = useMemo(() => {
        return columns?.slice(1, columns?.length - 1);
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
    const retryNumRef = useRef(0);
    const retryListRef = useRef<any[]>([]);
    const xhsListRef = useRef<any[]>([]);
    const materialPre = useMemo(() => {
        return ((successCountRef.current / totalCountRef.current) * 100) | 0;
    }, [successCount, totalCount]);
    const aref = useRef(false);
    const handleMaterial = async (num: number, retry?: boolean) => {
        if (!retry) {
            materialzanListRef.current = [];
            setMaterialzanList(materialzanListRef.current);
            uuidListsRef.current = [];
            setUuidLists(uuidListsRef.current);
        }
        aref.current = false;
        setMaterialExecutionOpen(true);
        //记录原有数据下标
        const indexList: any[] = [];
        let theStaging = _.cloneDeep(tableData);
        if (retry) {
            tableData?.map((item, index) => {
                if (retryListRef.current?.find((el) => el.uuid === item.uuid)) {
                    indexList.push(index);
                }
            });
        } else if (num === 1) {
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
        if (!retry) {
            totalCountRef.current = num === 1 ? selList.length : tableData.length;
            setTotalCount(totalCountRef.current);
        }
        let index = 0;
        const chunks = chunkArray(retry ? retryListRef.current : num === 1 ? selList : tableData, 3);
        retryListRef.current = [];
        while (index < chunks.length && !aref.current) {
            const resArr: any[] = [];
            const newResArr: any[] = [];
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
                        if (!aref.current) {
                            newResArr.push(
                                ...group.map((dt, t) => ({
                                    ...dt,
                                    ...(res[t] ? res[t] : {})
                                }))
                            );
                            // if (res?.length === group?.length) {
                            //     resArr[index + i] = res;
                            // } else if (res?.length !== group?.length && res.length === 1) {
                            //     resArr[index + i] = [...res, {}, {}];
                            // } else if (res?.length !== group?.length && res.length === 2) {
                            //     resArr[index + i] = [...res, {}];
                            // } else {
                            //     resArr[index + i] = res;
                            // }
                            executionCountRef.current = executionCountRef.current - group?.length;
                            successCountRef.current += group?.length;
                            setExecutionCount(executionCountRef.current);
                            setSuccessCount(successCountRef.current);
                        }
                    } catch (error: any) {
                        const newRetry = _.cloneDeep(retryListRef.current);
                        newRetry.push(...group);
                        retryListRef.current = newRetry;
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
            if (!aref.current) {
                const newArr = _.cloneDeep(materialzanListRef.current);
                console.log(newArr, currentBatch, resArr);
                // for (let i = 0; i < currentBatch.flat().length; i++) {
                //     const obj: any = {};
                //     resArr.flat()[i] &&
                //         Object.keys(resArr.flat()[i]).map((item) => {
                //             obj[item] = resArr.flat()[i][item];
                //         });
                //     newArr.push(obj);
                //     uuidList.push(newList[indexList[i + index * 3]]?.uuid);
                //     newList[indexList[i + index * 3]] = {
                //         ...newList[indexList[i + index * 3]],
                //         ...obj
                //     };
                // }
                const updatedMaterialzanList = [...materialzanListRef.current, ...newResArr];
                materialzanListRef.current = updatedMaterialzanList;
                setMaterialzanList(materialzanListRef.current);
                uuidListsRef.current = materialzanListRef.current?.map((item) => item.uuid);
                setUuidLists(uuidListsRef.current);
                materialFieldexeDataRef.current = theStaging?.map((item) => {
                    const arrinclude = materialzanListRef.current.find((el) => el.uuid === item.uuid);
                    if (arrinclude) {
                        return arrinclude;
                    } else {
                        return item;
                    }
                });
                index += 3;
            }
        }
        executionCountRef.current = 0;
        setExecutionCount(executionCountRef.current);
    };
    //loading 弹窗
    const [materialExecutionOpen, setMaterialExecutionOpen] = useState(false);

    //素材预览
    const getTextStream = async (retry?: boolean) => {
        if (!retry) {
            materialzanListRef.current = [];
            setMaterialzanList(materialzanListRef.current);
            uuidListsRef.current = [];
            setUuidLists(uuidListsRef.current);
        }
        aref.current = false;
        setMaterialExecutionOpen(true);
        let chunks;
        if (!retry) {
            const i = Array.from({ length: variableData.generateCount * variableData.groupNum }, (_, index) => index);
            totalCountRef.current = i?.length;
            setTotalCount(totalCountRef.current);
            chunks = chunkArray(i, variableData.generateCount);
        } else {
            chunks = chunkArray(
                Array.from({ length: retryNumRef.current }, (_, index) => index),
                variableData.generateCount
            );
        }
        retryNumRef.current = 0;
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
                        if (!aref.current) {
                            const timers = new Date().getTime();
                            const newMaterialzan = _.cloneDeep(materialzanListRef.current);
                            const newRes = res?.map((item: any) => ({ ...item, uuid: uuidv4(), type: materialType, group: timers }));
                            newMaterialzan.push(...newRes);
                            resArr.push(...newRes);
                            materialzanListRef.current = newMaterialzan;
                            setMaterialzanList(materialzanListRef.current);
                            executionCountRef.current = executionCountRef.current - group?.length;
                            successCountRef.current += group?.length;
                            setExecutionCount(executionCountRef.current);
                            setSuccessCount(successCountRef.current);
                        }
                    } catch (error: any) {
                        console.log(error);
                        const newList = _.cloneDeep(errorMessageRef.current);
                        newList.push(error.msg);
                        let newretryNum = _.cloneDeep(retryNumRef.current);
                        newretryNum += 1;
                        retryNumRef.current = newretryNum;
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
            // newList.unshift(...resArr);
            // theStaging = _.cloneDeep(newList);
            if (!aref.current) {
                const newL = _.cloneDeep(uuidListsRef.current);
                newL?.push(...resArr?.map((item) => item.uuid));
                uuidListsRef.current = newL;
                setUuidLists(uuidListsRef.current);
            }

            // downTableData(theStaging);
            index += 3;
        }
        executionCountRef.current = 0;
        setExecutionCount(executionCountRef.current);
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
    const aimaterialCreate = (retry?: boolean) => {
        setSelectValue('batch');
        getTextStream(retry);
    };
    //处理素材
    const editMaterial = (num: number, retry?: boolean) => {
        setSelectValue('field');
        batchNum.current = num;
        handleMaterial(num, retry);
    };
    //小红书分析
    const xhsAnalysis = async (retry?: boolean) => {
        setSelectValue('xhs');
        if (!retry) {
            materialzanListRef.current = [];
            setMaterialzanList(materialzanListRef.current);
            uuidListsRef.current = [];
            setUuidLists(uuidListsRef.current);
        }
        aref.current = false;
        setMaterialExecutionOpen(true);
        console.log(redBookData.requirement);

        let requirementData = redBookData.requirement?.split(/[,\n\r，]+/).filter(Boolean);
        console.log(requirementData);

        let chunks;
        if (!retry) {
            totalCountRef.current = requirementData?.length;
            setTotalCount(totalCountRef.current);
            chunks = chunkArray(requirementData, 1);
        } else {
            chunks = chunkArray(xhsListRef.current, 1);
        }
        xhsListRef.current = [];
        let index = 0;
        while (index < chunks?.length && !aref.current) {
            const resArr: any[] = [];
            const currentBatch = chunks.slice(index, index + 3);
            executionCountRef.current = currentBatch?.flat()?.length;
            setExecutionCount(executionCountRef.current);
            await Promise.all(
                currentBatch.map(async (group, i) => {
                    try {
                        const res = await pluginsXhsOcr({ xhsNoteUrl: String(group) });
                        if (!aref.current) {
                            const newMaterialzan = _.cloneDeep(materialzanListRef.current);
                            const newCheckbox: any[] = _.cloneDeep(redBookData.fieldList);
                            const selectData = _.cloneDeep(redBookData.bindFieldData);
                            const obj: any = {};
                            newCheckbox.forEach((dt) => {
                                obj[selectData[dt]] = res[dt]?.url || res[dt];
                            });
                            obj.uuid = uuidv4();
                            console.log(obj);
                            newMaterialzan.push(obj);
                            resArr.push(obj);
                            materialzanListRef.current = newMaterialzan;
                            setMaterialzanList(materialzanListRef.current);
                            executionCountRef.current = executionCountRef.current - group?.length;
                            successCountRef.current += group?.length;
                            setExecutionCount(executionCountRef.current);
                            setSuccessCount(successCountRef.current);
                        }
                    } catch (error: any) {
                        console.log(error);
                        const newList = _.cloneDeep(errorMessageRef.current);
                        newList.push(error.msg);
                        xhsListRef.current.push(group);
                        errorMessageRef.current = newList;
                        setErrorMessage(errorMessageRef.current);
                        executionCountRef.current -= group?.length;
                        setExecutionCount(executionCountRef.current);
                        errorCountRef.current += group?.length;
                        if (errorCountRef.current >= 3) {
                            aref.current = true;
                        }
                        setErrorCount(errorCountRef.current);
                    }
                })
            );
            if (!aref.current) {
                const newL = _.cloneDeep(uuidListsRef.current);
                newL?.push(...resArr?.map((item) => item.uuid));
                uuidListsRef.current = newL;
                setUuidLists(uuidListsRef.current);
            }
            index += 3;
        }
        executionCountRef.current = 0;
        setExecutionCount(executionCountRef.current);
    };

    //新增插入表格
    const [selectValue, setSelectValue] = useState('');
    const batchNum = useRef(-1);
    const materialFieldexeDataRef = useRef<any>(null);
    const materialzanListRef = useRef<any[]>([]);
    const [materialzanList, setMaterialzanList] = useState<any[]>([]);

    //小红书数据
    const [redBookData, setRedBookData] = useState<any>({
        requirement: '',
        fieldList: [],
        bindFieldData: {}
    });
    // OCR 提取数据
    const [ocrData, setOcrData] = useState({
        requirement: '',
        title: true,
        content: true,
        titleField: 1,
        contentField: 1
    });

    const xhsCloumns = useMemo(() => {
        const arr = redBookData?.fieldList?.map((item: any) => redBookData?.bindFieldData[item])?.filter((item: any) => item);
        return columns?.filter((item) => arr?.includes(item.dataIndex));
    }, [redBookData?.fieldList, redBookData]);
    return (
        <div>
            {/* {plugValue === 'extraction' ? (
                //文本智能提取
                <TextExtraction />
            ) : plugValue === 'imageOcr' ? (
                //OCR 提取
                <ImgOcr
                    imgCheckedList={imgCheckedList}
                    ocrData={ocrData}
                    setOcrData={setOcrData}
                    selList={selList}
                    tableDataLength={tableData?.length || 0}
                    setSelOpen={setSelOpen}
                />
            ) : plugValue === 'xhsOcr' ? (
                //小红书分析
                <RedBookAnalysis columns={allColumns} redBookData={redBookData} setRedBookData={setRedBookData} xhsAnalysis={xhsAnalysis} />
            ) : plugValue === 'generate_material_one' ? (
                // 素材字段补齐
                <FieldCompletion
                    fieldCompletionData={fieldCompletionData}
                    setFieldCompletionData={setFieldCompletionData}
                    checkedList={checkedList}
                    selList={selList}
                    tableData={tableData}
                    setSelOpen={setSelOpen}
                    editMaterial={editMaterial}
                    setField={setField}
                />
            ) : plugValue === 'generate_material_batch' ? (
                // 素材生成
                <div className="relative">
                    <AICreates
                        variableData={variableData}
                        setVariableData={setVariableData}
                        checkedList={checkedList}
                        setcustom={setcustom}
                        aimaterialCreate={aimaterialCreate}
                    />
                </div>
            ) : null} */}
            {/* 选择素材 */}
            <Modal
                className="relative"
                title="选择素材"
                width={'80%'}
                open={selOpen}
                onCancel={() => {
                    setSelOpen(false);
                }}
                footer={false}
            >
                <div className="max-h-[60vh] overflow-y-auto">
                    <div className="flex justify-end mr-4 absolute right-[30px] top-[16px]">
                        <Button onClick={() => setSelOpen(false)} type="primary" size="small">
                            确认选择({selList?.length})
                        </Button>
                    </div>
                    <Table
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
                </div>
            </Modal>
            {/* 素材执行 loading */}
            {/* {materialExecutionOpen && ( */}
            <Modal width={'80%'} open={materialExecutionOpen} onCancel={() => setMaterialExecutionOpen(false)} footer={false}>
                <div className="flex justify-center ">
                    <Progress percent={materialPre} type="circle" />
                </div>
                {executionCount !== 0 && (
                    <div className="flex justify-center">
                        <div className="font-bold mt-4 loader"></div>
                    </div>
                )}
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
                    columns={[
                        { title: '序号', width: 70, render: (_, row, index) => <span>{index + 1}</span> },
                        ...(selectValue === 'field'
                            ? columns?.filter((item: any) => fieldCompletionData.checkedFieldList?.includes(item.dataIndex))
                            : selectValue === 'batch'
                            ? columns?.filter((item: any) => variableData.checkedFieldList?.includes(item.dataIndex))
                            : selectValue === 'xhs'
                            ? xhsCloumns
                            : [])
                    ]}
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
                                    errorMessageRef.current = [];
                                    setErrorCount(errorCountRef.current);
                                    setSuccessCount(successCountRef.current);
                                    setExecutionCount(executionCountRef.current);
                                    setErrorMessage(errorMessageRef.current);
                                    if (selectValue === 'batch') {
                                        aimaterialCreate();
                                    } else {
                                        editMaterial(batchNum.current);
                                    }
                                }}
                            >
                                重新执行
                            </Button>
                            {errorMessage?.length > 0 && (
                                <Button
                                    className="w-[100px]"
                                    size="small"
                                    onClick={() => {
                                        errorCountRef.current = 0;
                                        executionCountRef.current = 0;
                                        errorMessageRef.current = [];
                                        setErrorCount(errorCountRef.current);
                                        setExecutionCount(executionCountRef.current);
                                        setErrorMessage(errorMessageRef.current);
                                        if (selectValue === 'batch') {
                                            aimaterialCreate(true);
                                        } else {
                                            editMaterial(batchNum.current, true);
                                        }
                                    }}
                                >
                                    失败重试
                                </Button>
                            )}
                            <Button
                                onClick={() => {
                                    if (selectValue === 'batch') {
                                        downTableData(materialzanListRef.current, 1);
                                        setMaterialExecutionOpen(false);
                                        setPlugOpen(false);
                                        setSelectedRowKeys(uuidListsRef.current);
                                    } else if (selectValue === 'field') {
                                        setSelList([]);
                                        downTableData(materialFieldexeDataRef.current, 2);
                                        setMaterialExecutionOpen(false);
                                        setPlugOpen(false);
                                        setSelectedRowKeys(uuidLists);
                                    } else if (selectValue === 'xhs') {
                                        downTableData(materialzanListRef.current, 1);
                                        setMaterialExecutionOpen(false);
                                        setPlugOpen(false);
                                        setSelectedRowKeys(uuidListsRef.current);
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
                            size="small"
                            type="primary"
                            onClick={() => {
                                executionCountRef.current = 0;
                                setExecutionCount(executionCountRef.current);
                                aref.current = true;
                            }}
                        >
                            取消执行
                        </Button>
                    )}
                </div>
            </Modal>
            {/* )} */}
        </div>
    );
};
const memoAiCreate = (pre: any, next: any) => {
    return (
        JSON.stringify(pre.materialType) === JSON.stringify(JSON.stringify(next.materialType)) &&
        JSON.stringify(pre.columns) === JSON.stringify(JSON.stringify(next.columns)) &&
        JSON.stringify(pre.MokeList) === JSON.stringify(JSON.stringify(next.MokeList)) &&
        JSON.stringify(pre.tableData) === JSON.stringify(JSON.stringify(next.tableData)) &&
        JSON.stringify(pre.fieldCompletionData) === JSON.stringify(JSON.stringify(next.fieldCompletionData)) &&
        JSON.stringify(pre.variableData) === JSON.stringify(JSON.stringify(next.variableData))
    );
};
export default memo(AiCreate, memoAiCreate);
