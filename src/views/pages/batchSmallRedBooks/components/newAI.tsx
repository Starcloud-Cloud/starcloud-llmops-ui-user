import { Modal, Button, Table, Progress, Tag, Image } from 'antd';
import { useEffect, useMemo, useState, useRef, memo } from 'react';
import { materialGenerate, customMaterialGenerate, pluginsXhsOcr, extraction, imageOcr, plugChat, plugList } from 'api/redBook/batchIndex';
import { templateUpdate } from 'api/redBook/material';
import _ from 'lodash-es';
import './aiCreate.css';
import AICreates from './components/AICreate';
import FieldCompletion from './components/fieldCompletion';
import RedBookAnalysis from './components/redBookAnalysis';
import ImgOcr from './components/imgOcr';
import TextExtraction from './components/textExtraction';
import PlugModal from './components/plugModal';
import Sensitive_words from './components/sensitive_words';
import ResultLoading from './components/resultLoading';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { EditType } from 'views/materialLibrary/detail';
import '../../../materialLibrary/index.scss';
const AiCreate = ({
    plugTitle,
    libraryId,
    bizType,
    bizUid,
    pluginConfig,
    plugValue,
    columns,
    tableData,
    downTableData,
    setSelectedRowKeys,
    setPlugOpen,
    getTitleList
}: {
    plugTitle: string;
    libraryId: string;
    bizType: string;
    bizUid: string;
    pluginConfig: string | null;
    plugValue: string | null;
    columns: any[];
    tableData: any[];
    downTableData: (data: any, num: number) => void;
    setSelectedRowKeys: (data: any) => void;
    setPlugOpen: (data: boolean) => void;
    getTitleList: () => void;
}) => {
    const checkedList = useMemo(() => {
        return columns?.slice(1, columns?.length - 1)?.filter((item) => item.type !== 5 && item.type !== 6 && !item.isDefault);
    }, [columns]);
    const imgCheckedList = useMemo(() => {
        return columns?.filter((item) => item.type === 5);
    }, [columns]);
    const allColumns = useMemo(() => {
        return columns?.slice(1, columns?.length - 1);
    }, [columns]);
    //AI 字段补齐
    const [selOpen, setSelOpen] = useState(false);
    const [selList, setSelList] = useState<any[]>([]);
    const [selKeyList, setSelKeyList] = useState<any[]>([]);
    const rowSelection = {
        selectedRowKeys: selKeyList,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            setSelKeyList(selectedRowKeys);
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

    const preeNum = useRef(0);
    const [prenum, setPrenum] = useState(0);
    const materialPre = useMemo(() => {
        return ((((successCountRef.current + errorCountRef.current) / totalCountRef.current) * 100) | 0) + preeNum.current;
    }, [successCount, totalCount, prenum]);
    const aref = useRef(false);
    //loading 弹窗
    const [materialExecutionOpen, setMaterialExecutionOpen] = useState(false);
    const timeLoading = useRef<any>(null);
    const grupPre = useRef(0);
    useEffect(() => {
        if (materialExecutionOpen) {
            const newNum = grupPre.current || executionCountRef.current || 1;
            console.log(newNum, totalCountRef.current);

            const newSuccessNum = ((newNum / totalCountRef.current) * 100) | 0;
            timeLoading.current = setInterval(() => {
                console.log(newNum, preeNum.current, newSuccessNum);

                if (preeNum.current < newSuccessNum - 1) {
                    preeNum.current += 1;
                    setPrenum(preeNum.current);
                } else {
                    clearInterval(timeLoading.current);
                }
            }, 200);
        } else {
            clearInterval(timeLoading.current);
        }
    }, [materialExecutionOpen, executionCount]);
    useEffect(() => {
        if (successCount || errorCount) {
            preeNum.current = 0;
            setPrenum(preeNum.current);
            clearInterval(timeLoading.current);
            console.log(11111, preeNum.current);
        }
        return () => {
            clearInterval(timeLoading.current);
        };
    }, [successCount, errorCount]);

    //素材生成
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
        while (index < chunks?.length && !aref.current) {
            const resArr: any[] = [];
            const currentBatch = chunks.slice(index, index + 3);
            executionCountRef.current = currentBatch?.flat()?.length;
            grupPre.current = (executionCountRef.current / 3) | 0 || 1;
            setExecutionCount(executionCountRef.current);
            await Promise.all(
                currentBatch.map(async (group, i) => {
                    try {
                        const res = await customMaterialGenerate({ ...variableData, bizType, bizUid, generateCount: group?.length });
                        if (!aref.current) {
                            const timers = new Date().getTime();
                            const newMaterialzan = _.cloneDeep(materialzanListRef.current);
                            const newRes = res?.map((item: any) => ({ ...item, group: timers }));
                            newMaterialzan.push(...newRes);
                            resArr.push(...newRes);
                            materialzanListRef.current = newMaterialzan;
                            setMaterialzanList(materialzanListRef.current);
                            executionCountRef.current = executionCountRef.current - group?.length;
                            successCountRef.current += group?.length;
                            setSuccessCount(successCountRef.current);
                            setTimeout(() => setExecutionCount(executionCountRef.current), 1);
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
                        setTimeout(() => setExecutionCount(executionCountRef.current), 1);
                        errorCountRef.current += group?.length;
                        if (errorCountRef.current >= 9) {
                            aref.current = true;
                        }
                        setErrorCount(errorCountRef.current);
                    }
                })
            );
            index += 3;
        }
        executionCountRef.current = 0;
        setExecutionCount(executionCountRef.current);
    };
    //字段补齐
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
        if (retry) {
            tableData?.map((item, index) => {
                if (retryListRef.current?.find((el) => el.id === item.id)) {
                    indexList.push(index);
                }
            });
        } else if (num === 1) {
            tableData?.map((item, index) => {
                if (selList?.find((el) => el.id === item.id)) {
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
            const currentBatch = chunks.slice(index, index + 3);
            // try {
            executionCountRef.current = currentBatch?.flat()?.length;
            grupPre.current = (executionCountRef.current / 3) | 0 || 1;
            setExecutionCount(executionCountRef.current);

            await Promise.all(
                currentBatch.map(async (group, i) => {
                    try {
                        const res = await materialGenerate({
                            materialList: group,
                            bizType,
                            bizUid,
                            ...fieldCompletionData
                        });
                        if (!aref.current) {
                            newResArr.push(
                                ...group.map((dt, t) => ({
                                    ...dt,
                                    ...(res[t] ? res[t] : {})
                                }))
                            );
                            executionCountRef.current = executionCountRef.current - group?.length;
                            successCountRef.current += group?.length;
                            setSuccessCount(successCountRef.current);
                            setTimeout(() => setExecutionCount(executionCountRef.current), 1);
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
                        setTimeout(() => setExecutionCount(executionCountRef.current), 1);
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
                const updatedMaterialzanList = [...materialzanListRef.current, ...newResArr];
                materialzanListRef.current = updatedMaterialzanList;
                setMaterialzanList(materialzanListRef.current);
                uuidListsRef.current = materialzanListRef.current?.map((item) => item.id);
                setUuidLists(uuidListsRef.current);
                index += 3;
            }
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
        let requirementData = redBookData.requirement?.split(/[,\n\r，]+/).filter(Boolean);
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
            grupPre.current = (executionCountRef.current / 3) | 0 || 1;
            console.log(executionCountRef.current, grupPre.current);

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
                                obj[selectData[dt] + '_extend'] = res[dt]?.data;
                                obj[selectData[dt] + '_tags'] = res[dt]?.tag;
                                obj[selectData[dt] + '_description'] = res[dt]?.content;
                            });
                            newMaterialzan.push(obj);
                            resArr.push(obj);
                            materialzanListRef.current = newMaterialzan;
                            setMaterialzanList(materialzanListRef.current);
                            successCountRef.current += group?.length;
                            setSuccessCount(successCountRef.current);
                            executionCountRef.current = executionCountRef.current - group?.length;
                            setTimeout(() => setExecutionCount(executionCountRef.current), 1);
                        }
                    } catch (error: any) {
                        console.log(error);
                        const newList = _.cloneDeep(errorMessageRef.current);
                        newList.push(error.msg);
                        xhsListRef.current.push(group);
                        errorMessageRef.current = newList;
                        setErrorMessage(errorMessageRef.current);
                        executionCountRef.current -= group?.length;
                        setTimeout(() => setExecutionCount(executionCountRef.current), 1);
                        errorCountRef.current += group?.length;
                        if (errorCountRef.current >= 3) {
                            aref.current = true;
                        }
                        setErrorCount(errorCountRef.current);
                    }
                })
            );
            index += 3;
        }
        executionCountRef.current = 0;
        setExecutionCount(executionCountRef.current);
    };
    //文本智能提取
    const handleTextData = async (num: number, retry?: boolean) => {
        textNum.current = num;
        setSelectValue('text');
        if (!retry) {
            materialzanListRef.current = [];
            setMaterialzanList(materialzanListRef.current);
            uuidListsRef.current = [];
            setUuidLists(uuidListsRef.current);
        }
        const newList = _.cloneDeep(textData.requirementList);
        const define: any = {};
        newList?.map((item: any, index: number) => {
            define[textCloumns.find((el) => el.dataIndex === item.value).title] = item.title;
        });
        aref.current = false;
        setMaterialExecutionOpen(true);
        //记录原有数据下标
        const indexList: any[] = [];
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
        const chunks = chunkArray(retry ? retryListRef.current : num === 1 ? selList : tableData, 1);
        retryListRef.current = [];
        while (index < chunks.length && !aref.current) {
            const resArr: any[] = [];
            const newResArr: any[] = [];
            const currentBatch = chunks.slice(index, index + 3);
            executionCountRef.current = currentBatch?.flat()?.length;
            grupPre.current = (executionCountRef.current / 3) | 0 || 1;
            setExecutionCount(executionCountRef.current);
            console.log(currentBatch);

            await Promise.all(
                currentBatch.map(async (group, i) => {
                    console.log(group);

                    try {
                        const res = await extraction({
                            define,
                            parseText: group[0][textData.checkedFieldList]
                        });

                        if (!aref.current) {
                            const newCheckbox: any[] = _.cloneDeep(textData.requirementList);
                            const obj: any = {};
                            newCheckbox.forEach((dt, i) => {
                                obj[dt.value] = res[textCloumns.find((el) => el.dataIndex === dt.value).title];
                            });
                            console.log(obj);

                            newResArr.push(
                                ...group.map((dt, t) => ({
                                    ...dt,
                                    ...obj
                                }))
                            );
                            successCountRef.current += group?.length;
                            setSuccessCount(successCountRef.current);
                            executionCountRef.current = executionCountRef.current - group?.length;
                            setTimeout(() => setExecutionCount(executionCountRef.current), 1);
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
                        setTimeout(() => setExecutionCount(executionCountRef.current), 1);
                        errorCountRef.current += group?.length;
                        if (errorCountRef.current >= 3) {
                            aref.current = true;
                        }
                        setErrorCount(errorCountRef.current);
                    }
                })
            );
            if (!aref.current) {
                const updatedMaterialzanList = [...materialzanListRef.current, ...newResArr];
                console.log(updatedMaterialzanList);

                materialzanListRef.current = updatedMaterialzanList;
                console.log(materialzanListRef.current);

                setMaterialzanList(materialzanListRef.current);
                uuidListsRef.current = materialzanListRef.current?.map((item) => item.uuid);
                setUuidLists(uuidListsRef.current);
                index += 3;
            }
        }
        executionCountRef.current = 0;
        setExecutionCount(executionCountRef.current);
    };

    const handleOCR = async (num = 1, retry = false) => {
        ocrNum.current = num;
        if (!retry) {
            materialzanListRef.current = [];
            setMaterialzanList(materialzanListRef.current);
            uuidListsRef.current = [];
            setUuidLists(uuidListsRef.current);
        } else {
            setErrorCount(0);
            errorCountRef.current = 0;
            errorMessageRef.current = [];
        }

        let materialList: any = [];
        if (!retry) {
            if (num === 1) {
                materialList = selList;
            } else {
                materialList = tableData;
            }
        } else {
            materialList = retryListRef.current;
        }

        setSelectValue('ocr');

        setMaterialExecutionOpen(true);
        setTotalCount(num === 1 ? selList.length : tableData.length);
        totalCountRef.current = materialList.length;

        const idList = materialList.map((item: any) => item.id);
        uuidListsRef.current = idList;
        setUuidLists(idList);

        setExecutionCount(materialList.length);
        grupPre.current = (executionCountRef.current / 3) | 0 || 1;
        executionCountRef.current = materialList.length;

        materialList.map(async (item: any) => {
            retryListRef.current = [];
            let obj: any = {};
            // 选择图片字段
            const imageUrlList = ocrData.checkedFieldList.map((v: string) => item[v]).filter((url: string) => url);
            try {
                const data = await imageOcr({ imageUrls: imageUrlList, cleansing: ocrData.cleansing });
                Object.keys(item).forEach((v: any) => {
                    data.list.forEach((v1: any) => {
                        if (item[v] === v1.url) {
                            (obj = item),
                                (obj.id = item.id),
                                (obj[v] = item[v]),
                                (obj[v + '_tag'] = v1.ocrGeneralDTO.tag),
                                (obj[v + '_description'] = v1.ocrGeneralDTO.content),
                                (obj[v + '_extend'] = v1.ocrGeneralDTO.data);
                        }
                    });
                });

                const copyMaterialzanList = _.cloneDeep(materialzanListRef.current);
                copyMaterialzanList.push(obj);

                materialzanListRef.current = copyMaterialzanList;
                setMaterialzanList(copyMaterialzanList);
                const copySuccessCount = successCountRef.current;
                setSuccessCount(copySuccessCount + 1);
                successCountRef.current = copySuccessCount + 1;

                const exeCount = executionCountRef.current;
                setTimeout(() => setExecutionCount(exeCount - 1), 1);
                executionCountRef.current = exeCount - 1;
            } catch (error: any) {
                const exeCount = executionCountRef.current;
                setTimeout(() => setExecutionCount(exeCount - 1), 1);
                executionCountRef.current = exeCount - 1;

                const copyErrorCountRef = errorCountRef.current;
                setErrorCount(copyErrorCountRef + 1);
                errorCountRef.current = copyErrorCountRef + 1;

                const copyRetryList = retryListRef.current;
                copyRetryList.push(item);
                retryListRef.current = copyRetryList;

                const newList = _.cloneDeep(errorMessageRef.current);
                newList.push(error.msg);
                errorMessageRef.current = newList;
                setErrorMessage(errorMessageRef.current);
            }
        });
    };
    //微信公共号
    const timer = useRef<any>();
    const urlsRef = useRef('');
    const handleWchat = async (url: any, retry = false) => {
        setSelectValue('wchat');
        if (url) {
            urlsRef.current = url;
        }
        const urls = url || urlsRef.current;
        totalCountRef.current = 1;
        setTotalCount(totalCountRef.current);
        executionCountRef.current = 1;
        grupPre.current = 0;
        setExecutionCount(executionCountRef.current);
        errorCountRef.current = 0;
        setErrorCount(errorCountRef.current);
        successCountRef.current = 0;
        setSuccessCount(successCountRef.current);
        setMaterialExecutionOpen(true);
        try {
            const result = await plugChat({ urls });
            timer.current = setInterval(async () => {
                const res = await plugList({
                    conversation_id: result.conversation_id,
                    chat_id: result.id
                });
                if (res.complete) {
                    clearInterval(timer.current);
                    successCountRef.current = 1;
                    setSuccessCount(successCountRef.current);
                    executionCountRef.current = 0;
                    setExecutionCount(executionCountRef.current);
                    materialzanListRef.current = res.materialList;
                    setMaterialzanList(materialzanListRef.current);
                }
            }, 2000);
        } catch (error) {
            errorCountRef.current = 1;
            setErrorCount(errorCountRef.current);
            executionCountRef.current = 0;
            setExecutionCount(executionCountRef.current);
        }
    };
    //敏感词过滤
    const handleWords = (retry = false) => {};
    //组件销毁时清除定时器
    useEffect(() => {
        return () => {
            clearInterval(timer.current);
        };
    }, []);
    //新增插入表格
    const [selectValue, setSelectValue] = useState('');
    const batchNum = useRef(-1);
    const ocrNum = useRef(0);
    const textNum = useRef(-1);
    const materialzanListRef = useRef<any[]>([]);
    const [materialzanList, setMaterialzanList] = useState<any[]>([]);
    //小红书数据
    const [redBookData, setRedBookData] = useState<any>({
        requirement: '',
        fieldList: [],
        bindFieldData: {}
    });
    // OCR 提取数据
    const [ocrData, setOcrData] = useState<any>({
        requirement: '',
        title: true,
        content: true,
        titleField: 1,
        contentField: 1,
        checkedFieldList: []
    });
    //素材生成
    const [variableData, setVariableData] = useState<any>({
        checkedFieldList: [],
        requirement: undefined,
        groupNum: 1,
        generateCount: 1
    });
    //字段补齐
    const [fieldCompletionData, setFieldCompletionData] = useState<any>({
        checkedFieldList: [],
        requirement: ''
    });
    //文本智能提取数据
    const [textData, setTextData] = useState<any>({
        checkedFieldList: '',
        requirementList: []
    });

    const imageExe = (list: any[]) => {
        return list?.map((item: any) => {
            if (item.type === EditType.Image) {
                return {
                    ...item,
                    render: (_: any, row: any) =>
                        row[item.dataIndex] ? (
                            <Image
                                preview={{ src: row[item.dataIndex] }}
                                width={82}
                                height={82}
                                src={row[item.dataIndex] + '?x-oss-process=image/resize,w_100/quality,q_80'}
                            />
                        ) : null
                };
            } else {
                return {
                    ...item,
                    render: (_: any, row: any) =>
                        row[item.dataIndex] !== null && typeof row[item.dataIndex] === 'object' ? (
                            <span className="text-[#ff4d4f]">字段结果类型错误，只支持返回字符串类型</span>
                        ) : (
                            row[item.dataIndex]
                        ),
                    sorter: false
                };
            }
        });
    };
    const textCloumns = useMemo(() => {
        const arr = textData?.requirementList?.map((item: any) => item.value);
        return imageExe(columns?.filter((item) => arr?.includes(item.dataIndex)));
    }, [textData.requirementList]);
    //保存配置
    const saveConfig = async (data: string) => {
        let newValue: any = {};
        if (pluginConfig) {
            newValue = JSON.parse(pluginConfig);
        }
        if (plugValue === 'generate_material_batch') {
            newValue.variableData = variableData;
        } else if (plugValue === 'generate_material_one') {
            newValue.fieldCompletionData = fieldCompletionData;
        } else if (plugValue === 'xhsOcr') {
            newValue.redBookData = redBookData;
        }
        await templateUpdate({
            id: libraryId,
            pluginConfig: JSON.stringify(newValue)
        });
        getTitleList();
        dispatch(
            openSnackbar({
                open: true,
                message: '保存成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                close: false
            })
        );
    };
    useEffect(() => {
        if (pluginConfig) {
            const values = JSON.parse(pluginConfig);
            if (plugValue === 'generate_material_batch' && values.variableData) {
                setVariableData(values.variableData);
            } else if (plugValue === 'generate_material_one' && values.fieldCompletionData) {
                setFieldCompletionData(values.fieldCompletionData);
            } else if (plugValue === 'xhsOcr' && values.redBookData) {
                setRedBookData(values.redBookData);
            }
        } else {
            setVariableData({
                ...variableData,
                checkedFieldList: columns
                    ?.filter((item) => item.required && item.type !== 5 && item.type !== 6)
                    ?.map((item) => item.dataIndex)
            });
        }
    }, [pluginConfig, plugValue]);
    const xhsCloumns = useMemo(() => {
        const arr = redBookData?.fieldList?.map((item: any) => redBookData?.bindFieldData[item])?.filter((item: any) => item);
        return imageExe(columns?.filter((item) => arr?.includes(item.dataIndex)));
    }, [redBookData?.fieldList, redBookData]);

    return (
        <div>
            {plugValue === 'extraction' ? (
                //文本智能提取
                <TextExtraction
                    textData={textData}
                    setTextData={setTextData}
                    checkedList={checkedList}
                    selListLength={selList?.length || 0}
                    tableDataLength={tableData?.length || 0}
                    setSelOpen={setSelOpen}
                    handleTextData={handleTextData}
                />
            ) : plugValue === 'imageOcr' ? (
                //OCR 提取
                <ImgOcr
                    imgCheckedList={imgCheckedList}
                    ocrData={ocrData}
                    setOcrData={setOcrData}
                    selList={selList}
                    tableDataLength={tableData?.length || 0}
                    setSelOpen={setSelOpen}
                    handleOCR={handleOCR}
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
                    saveConfig={saveConfig}
                />
            ) : plugValue === 'generate_material_batch' ? (
                // 素材生成
                <div className="relative">
                    <AICreates
                        variableData={variableData}
                        setVariableData={setVariableData}
                        checkedList={checkedList}
                        saveConfig={saveConfig}
                        aimaterialCreate={aimaterialCreate}
                    />
                </div>
            ) : plugValue === 'wchat' ? (
                <PlugModal handleWchat={handleWchat} />
            ) : plugValue === 'sensitive_words' ? (
                <Sensitive_words handleWords={handleWords} />
            ) : null}
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
                    <div className="material-index">
                        <Table
                            rowKey={(record, index) => {
                                return record.id;
                            }}
                            pagination={false}
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
                </div>
            </Modal>
            {/* 素材执行 loading */}
            {materialExecutionOpen && (
                <ResultLoading
                    name={plugTitle}
                    materialExecutionOpen={materialExecutionOpen}
                    setMaterialExecutionOpen={setMaterialExecutionOpen}
                    materialPre={materialPre}
                    executionCount={executionCount}
                    totalCount={totalCount}
                    successCount={successCount}
                    errorCount={errorCount}
                    materialzanList={materialzanList}
                    errorMessage={errorMessage}
                    columns={[
                        { title: '序号', width: 70, render: (_: any, row: any, index: number) => <span>{index + 1}</span> },
                        ...(selectValue === 'field'
                            ? imageExe(columns?.filter((item: any) => fieldCompletionData.checkedFieldList?.includes(item.dataIndex)))
                            : selectValue === 'batch'
                            ? imageExe(columns?.filter((item: any) => variableData.checkedFieldList?.includes(item.dataIndex)))
                            : selectValue === 'xhs'
                            ? xhsCloumns
                            : selectValue === 'text'
                            ? textCloumns
                            : selectValue === 'ocr'
                            ? imageExe(columns?.filter((item: any) => ocrData.checkedFieldList?.includes(item.dataIndex)))
                            : selectValue === 'wchat'
                            ? imageExe(columns.slice(0, columns?.length - 2))
                            : [])
                    ]}
                    resetExe={() => {
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
                        } else if (selectValue === 'ocr') {
                            handleOCR(ocrNum.current);
                        } else if (selectValue === 'field') {
                            editMaterial(batchNum.current);
                        } else if (selectValue === 'xhs') {
                            xhsAnalysis();
                        } else if (selectValue === 'text') {
                            handleTextData(textNum.current);
                        } else if (selectValue === 'wchat') {
                            handleWchat(undefined, true);
                        } else if (selectValue === 'sensitive_words') {
                            handleWords(true);
                        }
                    }}
                    reTryExe={() => {
                        errorCountRef.current = 0;
                        executionCountRef.current = 0;
                        errorMessageRef.current = [];
                        setErrorCount(errorCountRef.current);
                        setExecutionCount(executionCountRef.current);
                        setErrorMessage(errorMessageRef.current);
                        if (selectValue === 'batch') {
                            aimaterialCreate(true);
                        } else if (selectValue === 'field') {
                            editMaterial(batchNum.current, true);
                        } else if (selectValue === 'ocr') {
                            handleOCR(ocrNum.current, true);
                        } else if (selectValue === 'xhs') {
                            xhsAnalysis(true);
                        } else if (selectValue === 'text') {
                            handleTextData(textNum.current, true);
                        } else if (selectValue === 'wchat') {
                            handleWchat(undefined, true);
                        } else if (selectValue === 'sensitive_words') {
                            handleWords(true);
                        }
                    }}
                    handleSave={() => {
                        if (selectValue === 'batch') {
                            downTableData(materialzanListRef.current, 1);
                            setMaterialExecutionOpen(false);
                            setPlugOpen(false);
                            setSelectedRowKeys(uuidListsRef.current);
                        } else if (selectValue === 'field') {
                            setSelList([]);
                            setSelKeyList([]);
                            downTableData(materialzanListRef.current, 2);
                            setMaterialExecutionOpen(false);
                            setPlugOpen(false);
                            setSelectedRowKeys(uuidLists);
                        } else if (selectValue === 'xhs') {
                            downTableData(materialzanListRef.current, 1);
                            setMaterialExecutionOpen(false);
                            setPlugOpen(false);
                            setSelectedRowKeys(uuidListsRef.current);
                        } else if (selectValue === 'text') {
                            setSelList([]);
                            setSelKeyList([]);
                            downTableData(materialzanListRef.current, 2);
                            setMaterialExecutionOpen(false);
                            setPlugOpen(false);
                            setSelectedRowKeys(uuidLists);
                        } else if (selectValue === 'ocr') {
                            setSelList([]);
                            setSelKeyList([]);
                            downTableData(materialzanListRef.current, 2);
                            setMaterialExecutionOpen(false);
                            setPlugOpen(false);
                            setSelectedRowKeys(uuidLists);
                        } else if (selectValue === 'wchat') {
                            downTableData(materialzanListRef.current, 1);
                            setMaterialExecutionOpen(false);
                            setPlugOpen(false);
                        }
                    }}
                    handleCancel={() => {
                        clearInterval(timer.current);
                        executionCountRef.current = 0;
                        setExecutionCount(executionCountRef.current);
                        aref.current = true;
                    }}
                />
            )}
        </div>
    );
};
const memoAiCreate = (pre: any, next: any) => {
    return (
        _.isEqual(pre.libraryId, next.libraryId) &&
        _.isEqual(pre.bizType, next.bizType) &&
        _.isEqual(pre.bizUid, next.bizUid) &&
        _.isEqual(pre.pluginConfig, next.pluginConfig) &&
        _.isEqual(pre.plugValue, next.plugValue) &&
        _.isEqual(pre.columns, next.columns) &&
        _.isEqual(pre.tableData, next.tableData)
    );
};
export default memo(AiCreate, memoAiCreate);
