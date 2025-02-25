import { Collapse, Spin, Tag, Popover, Button, Popconfirm, Modal, Checkbox, QRCode, Input, Tooltip, Steps, Image } from 'antd';
import { CopyrightOutlined, CloseOutlined, LoadingOutlined, HistoryOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import copy from 'clipboard-copy';
import dayjs from 'dayjs';
import { memo, useEffect, useRef, useState } from 'react';
import PlanList from './PlanList';
import Good from '../good';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { planCancel, qrCode, bindPlugin } from 'api/redBook/batchIndex';
import { getMaterialTitle, createBatchMaterial } from 'api/redBook/material';
import { plugExecute, plugexEcuteResult } from 'api/redBook/plug';
import { aiIdentify } from 'api/plug/index';
import JSZip from 'jszip';
import _ from 'lodash-es';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditType } from 'views/materialLibrary/detail';
import infoStore from 'store/entitlementAction';

const Right = ({
    isexample,
    setIsexample,
    rightPage,
    batchTotal,
    bathList,
    exampleList,
    collapseActive,
    batchOpen,
    changeCollapse,
    batchDataList,
    setBusinessUid,
    setDetailOpen,
    timeFailure,
    getbatchPages,
    setSeleValue,
    planUid
}: {
    isexample: boolean;
    setIsexample: (data: any) => void;
    rightPage: number;
    batchTotal: number;
    bathList: any[];
    exampleList: any[];
    collapseActive: any;
    batchOpen: boolean;
    changeCollapse: (data: any) => void;
    batchDataList: any[];
    setBusinessUid: (data: any) => void;
    setDetailOpen: (data: any) => void;
    timeFailure: (data: any) => void;
    getbatchPages: (data: any) => void;
    setSeleValue: (data: any) => void;
    planUid: string;
}) => {
    const { use } = infoStore();
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const scrollRef: any = useRef(null);
    const getStatus = (status: any) => {
        switch (status) {
            case 'PENDING':
                return <Tag>待执行</Tag>;
            case 'RUNNING':
                return <Tag color="processing">执行中</Tag>;
            case 'PAUSE':
                return <Tag color="warning">暂停</Tag>;
            case 'CANCELED':
                return <Tag>已取消</Tag>;
            case 'COMPLETE':
                return <Tag color="success">已完成</Tag>;
            case 'FAILURE':
                return <Tag color="error">失败</Tag>;
            default:
                return <Tag>待执行</Tag>;
        }
    };
    const [pageNum, setPageNum] = useState(1);
    const getMore = () => {
        getbatchPages({ pageNo: pageNum + 1, pageSize: 10 });
        setPageNum(pageNum + 1);
    };
    //批量下载
    const [downOpen, setDownOpen] = useState(false);
    const [downList, setDownList] = useState<any[]>([]);
    const batchDownload = (data: any[]) => {
        setDownList(data?.filter((item) => item.status === 'SUCCESS'));
        setCheckValue(data?.filter((item) => item.status === 'SUCCESS')?.map((item) => item.uid));
        setDownOpen(true);
    };
    const [checkValue, setCheckValue] = useState<undefined | any[]>(undefined);
    const appendIndexToDuplicates = (list: any[]) => {
        const countMap: any = {};
        const result = list.map((item) => {
            // 初始化计数器
            if (!countMap[item?.executeResult?.copyWriting?.title]) {
                countMap[item?.executeResult?.copyWriting?.title] = 0;
            }
            countMap[item?.executeResult?.copyWriting?.title] += 1;

            // 如果是重复的，添加计数后缀
            if (countMap[item?.executeResult?.copyWriting?.title] > 1) {
                const newData = _.cloneDeep(item);
                newData.executeResult.copyWriting.title = `${item?.executeResult?.copyWriting?.title}_${
                    countMap[item?.executeResult?.copyWriting?.title] - 1
                }`;
                return newData;
            }
            return item;
        });
        return result;
    };
    const [imgLoading, setImgLoading] = useState(false);
    const downloadImage = async () => {
        setImgLoading(true);
        const zip = new JSZip();
        const imageList = appendIndexToDuplicates(downList.filter((item) => checkValue?.includes(item.uid)));
        const result = await qrCode(
            imageList?.map((item) => ({
                domain: process.env.REACT_APP_SHARE_URL || 'https://cn-test.mofabiji.com',
                uid: item.uid,
                type: item?.executeResult?.video ? 'video' : 'image'
            }))
        );
        const promises = imageList.map(async (imageUrl: any, index: number) => {
            const response = await fetch(result?.find((item: any) => item.uid === imageUrl.uid)?.qrCode);
            const arrayBuffer = await response.arrayBuffer();
            zip.file(imageUrl?.executeResult?.copyWriting?.title + '.png', arrayBuffer);
        });
        Promise.all(promises)
            .then(() => {
                setImgLoading(false);
                zip.generateAsync({ type: 'blob' }).then((content: any) => {
                    const url = window.URL.createObjectURL(content);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '二维码分享.zip'; // 设置下载的文件名
                    a.click();
                    window.URL.revokeObjectURL(url);
                });
            })
            .catch((error) => {
                setImgLoading(false);
                console.error('Error downloading images:', error);
            });
    };
    const [textLoading, setTextLoading] = useState(false);
    const downloadText = async () => {
        setTextLoading(true);
        const zip = new JSZip();
        const imageList = appendIndexToDuplicates(downList.filter((item) => checkValue?.includes(item.uid)));
        const promises = imageList.map(async (item: any, index: number) => {
            const folder: any = zip.folder(item?.executeResult?.copyWriting?.title);
            let images;
            if (item?.executeResult?.video) {
                images = item?.executeResult?.video?.videoList?.map(async (el: any, i: number) => {
                    const response = await fetch(el.videoUrl);
                    const arrayBuffer = await response.arrayBuffer();
                    folder.file('video' + (i + 1) + `.mp4`, arrayBuffer);
                });
            } else {
                images = item?.executeResult?.imageList?.map(async (el: any, i: number) => {
                    const response = await fetch(el.url);
                    const arrayBuffer = await response.arrayBuffer();
                    folder.file('image' + (i + 1) + `.${el?.url?.split('.')[el?.url?.split('.')?.length - 1]}`, arrayBuffer);
                });
            }

            await Promise.all(images)
                .then(async (res) => {
                    let index = 1;
                    folder.file(item?.executeResult?.copyWriting?.title + '.txt', item?.executeResult?.copyWriting?.content);
                    zip.file(folder);
                })
                .catch((err) => {
                    setTextLoading(false);
                });
        });

        Promise.all(promises)
            .then(() => {
                setTextLoading(false);
                zip.generateAsync({ type: 'blob' }).then((content: any) => {
                    const url = window.URL.createObjectURL(content);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '小红书素材.zip'; // 设置下载的文件名
                    a.click();
                    window.URL.revokeObjectURL(url);
                });
            })
            .catch((error) => {
                setTextLoading(false);
                console.error('Error downloading images:', error);
            });
    };

    useEffect(() => {
        if (rightPage) setPageNum(1);
    }, [rightPage]);

    //小红书分享
    const [batchid, setBatchid] = useState('');
    const [publishOpen, setPublishOpen] = useState(false);

    //右下角智能生成
    const [isExe, setIsExe] = useState(true);

    const [exeInputOpen, setExeInputOpen] = useState(false);
    const [exeInputValue, setExeInputValue] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [aiRocord, setAiRocord] = useState<any>(undefined); //获取详情数据
    const [aiData, setAiData] = useState(undefined);
    const getAIData = async () => {
        const result = await bindPlugin({
            appUid: query.get('appUid') || query.get('uid'),
            planUid,
            source: query.get('appUid') ? 'MARKET' : 'APP'
        });
        const res = result?.pluginDetailList?.length > 0 ? result?.pluginDetailList[0] : undefined;
        setAiRocord(res ? { ...res?.pluginDefinition, ...res?.pluginConfig } : res);
    };

    const handleAiExe = async () => {
        setExeInputOpen(true);
        setErrMsg('');
        setAiData(undefined);
        setStepCurrent(0);
        if (!exeInputValue) {
            return false;
        }
        //点击 ai生成笔记
        setAiStepOpen(true);
        try {
            const result = await aiIdentify({
                pluginName: aiRocord?.pluginName,
                description: aiRocord?.description,
                userPrompt: aiRocord?.userPrompt,
                userInput: exeInputValue,
                inputFormart: aiRocord?.inputFormart
            });
            setStepCurrent(1);
            setAiData(result);
            handleNextExe(result);
        } catch (err: any) {
            setErrMsg(err.msg);
        }
    };
    const timer = useRef<any>(null);
    const timer1 = useRef<any>(null);
    const handleNextExe = async (result: any) => {
        //ai生成笔记生成笔记完成 开始执行
        try {
            const code = await plugExecute({
                inputParams: result,
                uuid: aiRocord.pluginUid,
                libraryUid: aiRocord.libraryUid
            });
            setStepCurrent(2);
            timer.current = setInterval(async () => {
                try {
                    const res = await plugexEcuteResult({
                        code,
                        uuid: aiRocord.pluginUid
                    });
                    if (res.status === 'completed') {
                        clearTimeout(timer1.current);
                        let List;
                        if (Array.isArray(res.output) && aiRocord.outputType === 'list') {
                            List = res.output;
                        } else if (typeof res.output === 'object' && res.output !== null && aiRocord.outputType === 'obj') {
                            List = [res.output];
                        } else {
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: '返回数据类型有误，请稍后再试',
                                    variant: 'alert',
                                    alert: {
                                        color: 'error'
                                    },
                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                    close: false
                                })
                            );
                            clearInterval(timer.current);
                            return false;
                        }
                        const bindFieldData = JSON.parse(aiRocord?.fieldMap);
                        const newList = List.map((item: any) => {
                            const newItem: any = {};
                            for (let key in item) {
                                if (bindFieldData[key]) {
                                    newItem[bindFieldData[key]] = item[key];
                                } else {
                                    newItem[key] = item[key];
                                }
                            }
                            return newItem;
                        });
                        getResult(newList);
                        clearInterval(timer.current);
                    } else if (res.status === 'failed' || res.status === 'requires_action' || res.status === 'canceled') {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message:
                                    res.status === 'failed'
                                        ? '对话失败'
                                        : res.status === 'requires_action'
                                        ? '对话中断，需要进一步处理'
                                        : res.status === 'canceled'
                                        ? '对话已取消'
                                        : '',
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                },
                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                close: false
                            })
                        );
                        clearInterval(timer.current);
                    }
                } catch (err: any) {
                    console.log(err, 'err');
                    setErrMsg(err?.reason || err?.msg);
                    clearInterval(timer.current);
                    clearTimeout(timer1.current);
                }
            }, 4000);
            timer1.current = setTimeout(() => {
                clearInterval(timer.current);
                setErrMsg('请求超时，请联系管理员');
            }, 240000);
        } catch (err: any) {
            setErrMsg(err.msg);
        }
    };
    const getResult = async (data: any[]) => {
        if (!data || data?.length === 0) {
            setErrMsg('未生成素材，请稍后重试');
            return false;
        }
        const result = await getMaterialTitle({ appUid: query.get('uid') });
        const newData = data.map((record) => {
            const content = result?.tableMeta?.map((item: any) => {
                if (item.columnType === EditType.Image) {
                    return {
                        columnId: item.id,
                        columnName: item.columnName,
                        columnCode: item.columnCode,
                        value: record[item.columnCode] || '',
                        description: record[item.columnCode + '_description'],
                        tags: record[item.columnCode + '_tags'],
                        extend: record[item.columnCode + '_extend']
                    };
                } else {
                    return {
                        columnId: item.id,
                        columnName: item.columnName,
                        columnCode: item.columnCode,
                        value: record[item.columnCode],
                        extend: record[item.columnCode + '_extend']
                    };
                }
            });
            return {
                libraryId: result.id,
                content: content
            };
        });
        try {
            const res = await createBatchMaterial({ saveReqVOS: newData });
            setStepCurrent(3);
            setSeleValue(res);
            setTimeout(() => {
                setAiStepOpen(false);
            }, 1000);
        } catch (err: any) {
            setErrMsg(err.msg);
        }
    };
    const getrejectData = (data: any) => {
        if (!data) '';
        const result = [];
        for (let key in data) {
            result.push(
                <div>
                    {key}：{typeof data[key] === 'object' ? data[key].join(',') : data[key]}
                </div>
            );
        }
        return <div className="flex flex-col gap-1">{result}</div>;
    };
    //获取表头
    useEffect(() => {
        if (planUid) {
            getAIData();
        }
    }, [planUid]);
    const [aiStepOpen, setAiStepOpen] = useState(false);
    const [stepCurrent, setStepCurrent] = useState(0);

    return (
        <div className="h-full overflow-x-hidden">
            {bathList?.length === 0 || isexample ? (
                <div style={{ height: '100%' }} className="flex gap-2 relative flex-col justify-center items-center">
                    {isexample && (
                        <Button
                            onClick={() => setIsexample(false)}
                            className="absolute top-2 right-2"
                            size="small"
                            type="primary"
                            shape="circle"
                            icon={<CloseOutlined />}
                        ></Button>
                    )}
                    {exampleList?.length > 0 ? (
                        <div className="w-full overflow-x-auto flex justify-center gap-2">
                            {exampleList?.map((item: any) => (
                                <div className="xs:w-[200px] xl:w-[200px] 2xl:w-[380px]" key={item?.businessUid}>
                                    <Good
                                        item={item}
                                        setBusinessUid={(data: any) => {
                                            setBusinessUid({ uid: data, index: 0 });
                                        }}
                                        setDetailOpen={setDetailOpen}
                                        show={true}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <svg
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            x="0px"
                            y="0px"
                            width="200px"
                            height="200px"
                            viewBox="0 0 48 48"
                            enableBackground="new 0 0 48 48"
                            xmlSpace="preserve"
                        >
                            <image
                                id="image0"
                                width="48"
                                height="48"
                                x="0"
                                y="0"
                                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
                AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABFFBMVEUAAAAbidsSptUZmtcV
                p9MWn9cUp9IIxsYA3bgA37kA27YhhN4Wo9QXnNsTp9MXntYVodUTptMMvcoA4LoA3roA3rUA4rwH
                zcIRsc8Up9UdiuIeiOEdiOIOs8yMAP9DW+tBXOlDWupFWuw1beZEXOtgOPJRS+9WRO8qeOU8Y+li
                OPINvcqOBP90H/iOAv+NA/8Xmtkakt4VodcJxsQtdOVrLvdgPfRWS/JOVPB+FvtyKPhoNfYSrNFf
                P/QUptUXn9dfQPRIWu9gP/Q8betcQfQArd46ZegqgOcEtOJrL/cCsuAhi+cDsd46bes1behxKPgA
                rdsFstsDst0pgeVFXu9cQ/NpM/ZbQ/M5b+lfQfOSAP/////updnfAAAAW3RSTlMAHCtHV3KCYlM3
                HB8vTV18qrqaelwfPYqqiz1cenwfii+6XZqLTap8iqqaTT2KelyaiqpsbHqKmqqKmqqauop6i3xd
                TS8ffGw9fHqKXJpNTRw4U2NygnJXRyscgI11jwAAAAFiS0dEW3S8lTQAAAAHdElNRQfnBgcPKQZz
                ezFgAAAgBElEQVR42u2d6WPbVnbFOZO004ayE9txRiPJrGl6WJkRaTXTxZaqluPWqWzX6bTpNv3/
                /5ASBBeQxPLevecuD8T5kG+RQfzuO+e+BUCvd0T6xS9++csvvvjiyy+//JOF/nStX/3qz/58oa++
                +sr6AjtJqH/y4MHDh19/882jEj1+/KSgb799an21nXDqP3j49del2Mvgr/Wd9WV34uskG/GP6vT4
                8a+fVKkrgYSVjfpHDTqtgZ8nQRcEKSqEfZXv76urgMT04OFvmtmH0u8qIC09ePhNCPzTYPhdI5CO
                Akd+xNDfyPqndWrSSSD8Bf5o+p0FeNfDh4HwY62/q4AEFNLtrwf/r4n4uxBwqn4EfZr3dxbgV/2w
                hp/c+HUW4Fox9JmDv7MAdwrv+lD4nzz51vpHd1rpQRR9euPfZYBLxdFHDf8uA3wopukH4+8KwF6x
                gx+Kv8sAY0UmPx5/VwCWivZ+XO/XFYC9oge/wPB/0h0LMFKfgP8RY9G/KwBXOqPglxj+XQFYiIRf
                in83D9RW3IKvNP7OAZRFwy/IvysATRHxn4p0f10BaCt+1Ud8+HcFoCgifmH+3UKQkqj4Re3/CepA
                QP/s7Ox8o7N+3/p2exMV/6NTWfyAAliwP7841KIKrG+6H5HxS9v/E24LcHZ2UaPzrgYyEVt/Hf6c
                FqCefl4CXQ0whr8Gf3oCNNPvbKDHwi+z97MnagKE4j/yEjgJfbTPij8tAfox+I+5BDjDX4c/KQFi
                8R9rCbDw6/CnJAAF/1GWQAr847eCqfiPrgR4+JX4x3cAHP4LnVlj0dLJMxZ+8eW/lWIDgIn/eEqA
                OfwfKfGP7AD753z+x5EDXP5K/h/JHzD8j8MEuPi1+EcGAIx/200gGf5RMwCM/W9NYGCNyS1+jfX/
                paICADj8c/3Fc2tSx84/KgDg/C8uhi+sWQmItfJ/XPwvRsOXz615ocUf/nr8YxoACf4LCxgOf2tN
                zB1/rQWgKP7Y9q9gAcN2xQDf/l1OAPoy+HMLGL5szWwAMPz1+EdMAOT4Ly1gOG5JDED4O5wACvLP
                LaAljUDHn2wBw+FfWtNj6wSBX60BjOAv0/5vdJkXwHCceCMAGf4e+cuO/4VerSsg6RjA8He4AyjO
                f50BaTcCIP5KDYAr/us2MOlGADH71wsAF/P/gl5tKyDNFQFM+/dI6wiQN/6FDFg0As+tacYLZP8e
                jwALrf/u6XJYVHKNAIy/TgMQs/+nw7/YBAzT2xqA8VdpAKK+FazFv9gEJFcBMP4qARB1/kt4Aaig
                0TDZCgC1/0oB4JT/QQGkMx3E8dcIgKjzvzoTgFyXw4MKSGM6iOOvEABxDwBq8t/vAjNNEqiAp6c4
                /vIBEPkAqFoDWFEACVTACZC//EvAIp//0+W/Pw1IYncQtvynEQCxz38rNoBLjYbJVQCUv3AAxA5/
                df7lBeC6Ar5H8hcOgOjXP+g2gNUFMBxfWXNW4S8bANHDX70BqC4At2dEcMt/4gFA+BCIPv/KAnC6
                NYQd/5IBQPkOjHoDUFsAHisA2v9JBsC3FP76DUB9AfirADB/OQOgfQbKIADqC8BbBYD5ixkA8Stg
                JvxLF4KczgbR/IU6QOpH4CwagKYCcFUBaP4yAfAdlb9JA9BYAI4qALn/IxcA9G9A2gRA6WbQjibW
                4NcC7v+KGQDjE6BGAVByHmBfTk6IoPkLGADnC7BWARBQAD4qAM4fbgC8DwBbBUBIAXioAOwCsIAB
                ML//bMa/qQfMZX5SFM8fOwXkfv7bLACae8BcxgtC2A2ApTzht+QfkgDmFYBeAIAaAHneX5BdAAQX
                wNBwOUCAP6wDROC3NICwFiCT4YIQfAIA6wC/w3z225B/YAuQ6WWL+GMMADH4MxkGQHgCDM0mg/gJ
                AMYAUPhNAyA8ATKZTAYl+PMNABL9K1nyjzEAmwoQaAD5BgCkbxsAcQawkPpJ4acS/JkGAMVvGwAR
                LWAu9Z1BgQaQZwBI71/K1ABGsQWg3QhKNAAcA0DTt9sEzhWbANptgMAKMMMA4IO/Zx0AkS2gehsg
                0gBSDUCAfs84ACgGoLoiKNIAkAxAYvBnsg2AymfCJpPpdLbWdDoZj00aQd63f4EGIETfOgBKpwCT
                yaxU00IRKLUBIg1gvAFIDf5MtgEwOhz501mNptN1DahsDcs0ALEGIEjf2gD2O8B6+hsjWFaKRiOI
                PgNOMADJwZ/JUwc4CaC/LQGFNkCmAYgxAGH6rjrAYPxLTRTaAJkVgHADAG3018lPAMThz11AuA0Q
                2QIINgDSk93R8hIA0fjzEpC9OTIrAGEGoELf2gBGLPyZRPtAoRlgwFFg6b5vK1MDuGTzF60AoRlg
                81FgNfrWHeArNv6F5JaEpQKg3gAU+r6CPPAPmfjX6LXUvRELgJoWUM/6czk4BcAb/oIhIBYA1S2g
                Mn3jDhDFfzaTuTliAXDqY/Bnsj8IzrR/QQsQC4ByAzCg7+Ag+BiBX6YC5ALg1Mfgz2RpAK9A9r+U
                QB8oFgAHBqCz3lcmyykglL+ABUjtARwYgO6kb0eWATDC8of3gfAXgW312MXgz2QYACNU+ydlAUKb
                wJlcDP5MhgaA5w+2ALkOcJMAtoM/k50BSPDHWoBcB7hqAY0HfyY7AxDhD7UAuSWA3ADMB38mMwMY
                4ab/QhYgGAALA7Ca8+/JzACy8S/BH1gAggFw6oN+z84AhPwfmQFyBnB9fWbNfS2rNSBB/jALkDKA
                67+6uLDmvpER/1eC/FEWILQGeJ39/nNr7msZfhJCjj/oaJDEGuAP1/kN6FuDX8mmA7xEbf9XCZIB
                AlPA6xV+PwZg900oSf6QPUH8gwDX21tw1AYgzx/SBKA3Aa6L98Aa/FoWBqDBH5AB4CngDn43CWBh
                AEv+IguA2AKATgGv926ClwTQN4D8+J84f34GIA1gH/8RG8AIcvxfowBgBnB9fXgbjtYARojHf8LE
                XAlAGUAZfjctoLoBKPLnNgEYAyjH7yYBlA1g/fivQgPALgCIAVTgd5MAygagy5+5FAQwgB+q8B+p
                AWwe/1doAJfi3BqAAVxX34pjNIDt639UGgBuAbAN4LruZliTX0nTALb8lQKAVwBcA6jF7yUBFLeB
                C29/0uPPKQCeAVw33A4nCaDHv/j2N60GYMZZCGAZQBP+4zOAIn+1BoBVAAwDuG7kf2wGsPPyR8UA
                YBQAwwCa8XtpAbUMwI4/vQDIBhCC30sCGOBXbQAYBUA1gCD8XhJAxwD2+Gs2AIwCIB4ECuR/RAaw
                /+5/3QCgTwMl8R+RAVwefPxHNwDIBUB5FiB7ziNQ1uhzyfM//PaPcgCQC4DQAgYPfy8JIG4AJZ9+
                0g4A6m5gfAsYgd9LAhjwVw8AagFEG0AU/6MwgNIvv6kHAPFASOzDIFH4Ly58PBEsiv+y9MuP6gFA
                nQVGzgEj+ftIAFEDqPjwo3oAEAsg7pVwP8TeHR8JoI/fIACIk4CoOWDs8G+9AYyqvvtrEADEHjCm
                BYzn72MRQI7/sEoGAUBLgIg5IAG/jwSQMoBq/CYBQEuAcAOg8PeRAOr4TQKAmADBLSCJf3sN4LKO
                v0kA0FYBQhMguvvP1VoDqMVvEwC0FiAwAUjD/8JHCyjwLEA9fqE3QTaJlACBq4BU/i4SAP4sQBN+
                mwCgGUDYIkD4zu+ePCQA2gAqZ/62HaDgHIAY/xftNIDG4W9lAGIJQLX/Cx/7QFgDCMBv1AHSEuB3
                ovxdJADSAELwWwWA1CIAh7+HBAAaQBB+qwCQWgbm8G+XAQTiT8sAGltAFn8PiwAoAwjFn5YBNCYA
                efq3lIcEwBhA88zPugOkGUBTAvD4e0gAiAGMwoe/VQAQDaB+DkCf/rfKAGLwmwWAyGlg5vhviQFE
                4U/MAJ6K8vfQArINIA6/mQEQXw/4O1H+DhKAawCx+NPqAOsTgM3fQwLwDCAav9EuMPmZ8Kei/FM3
                AAJ+KwOgvh/2RJK/h30ghgFQ8Ke1BtirSwAAfw8JoIs/sTXAugeCeOu/uRwkAPUoKBG/lQGQXxB+
                Isk/XQOg4rcyAPoL4p9J8k/VAOj4jQyA8X74ihaAuwCcK8kWMG7Rd18m/BlvBn0qyd9BAkTPAXn4
                jaaAjC+EVLQAiAmAiwSINAAmfqMA4Hwh5pkg/+QMgIs/pUfB1iqdBEIawOQMgI8/pWdBVyptAUAN
                gIMWMMIA+PSNDID3gagTwQBwkADBBgDBb2MAvI9EPpMLAAcJEGoAGPwJvQ1kq1O5AEjGAFD4TQyA
                yb+sBUDxT8QAYPjTeR9cQSUPBaMaAActYIABAPGn80LIgp6JNQAOEqDZAJD4LRaBmd+I7pVsBMAa
                AAcJ0LANBJj27yiVNwLvSC4A7A2gfh8Yjd/AAAD8T+QCwLcBwOkbGAA7/3uHPSAuABwYQHULKIBf
                3wAQ/A96QFwA2D8OUtkCiuBXnwJC+O8vAwENwD4BKgxABr/2FJC3/r/RUzkDME+AUgO4FMKvbQAg
                /vs9IK4D9GkA+MbfyAAA7X+uvR4Qx9+jAQjiVzYAGP+9HrDVBiBJX9kAcPx3e0BgB+jOAGTx6xoA
                kH9PqgO0nwPuGIA0flUDwEz/cp1IGYD5PmDRAMTxaxoAcvjvFUA7DUC089M3ACz/nUkA0gDsW0BN
                /IoGAOa/MwlAGoB5C3im5f2qBoBa/dmqcBgAOAV0YgBa+NUMAD38ezuzwFYZQF8Tv5YBCPB/2tYO
                4K8V8SsZwGvk7G+tk3YawNVvNfHrGIDA8O8VJwEtMoCr17OxagFoGIAM/8L7IVtjAFeLuzVtmwHg
                u/+VtrPAlhjA1fJ+tc0AhIZ/rzAJaMc2UI6/dQYgx39bAMAEsDKAwdX6hrXLAATxb2eB6RvA1QZ/
                ywyAyX+wVGMBpG4ABfyz2aRFBsDAP7haTIc2el26jHDSDgO42r1pLTIAMv+rq5K/dlgD62WApE+C
                7f/U9hgAHX/on/wenwDaBnD4W1VbQEkDoPK/qvujuy7wLPWHQUp+q24LKGcAZPyvG/5wcVHpWdIG
                UJpzbTEAkeG/0tYEfoNeBVQ0gHL8LTEAgfQvrYDTZJ8Hvqr6pW0wgNdU/oPQf2FdAafgBNAygOo6
                b4MBCA//pfL/4Sm6BdAxgLrfmb4B0Jd+IvivOsGn4ARQMYDan5m+AZD5D5q6/5J/5wRcAAoG0FDl
                qRuAzvBfalsACb0UsOlXJm4AV/RTf9H8l7X2PXYSaI1feRUYbgCMjZ94/ksL+B6aALIGMAj5jSkb
                AGfbl8I/+we/RyaAaAd4FfQTdbeB3OCn8d8UAMoABDvAMPzKLSD0nYAG/LMMeAZMADkDCMWv3AJ6
                wU/mPxssCwCVAGL4w6e3iRoA88wXmf/iHwYWgFAHGPPr0jQAxtSPyX9VAJ4DIO7HJbkIxD3yy+Cf
                F4Djr4NG/rYUF4HYJ74HnH/9dbYZiEkAgQCILu30DIB/4J/FH1gA+ACId7bkDADxvEfc/k9ZAWAS
                AB0AlGBLzACu7PnjCgAcAKS+JjEDgDzuxWkAM/3NogAQCYANAOKvSsoAME/7cfnP/nZRAN4CgPyj
                EjIA0MOeAy7/2d/1ThEJAAwAek2nsw8Me9aX2QAs9AZSALgACF7zL1EqBoB71JvP/+2iAPgtAIw/
                B79uC0g3AOCT/uwGYDa7WRSAmwaAhV+5BaQaAGTmt9KAz392+6b3914aAGY9p2AASPyIAJjN7t70
                /sFHALDtLAEDwL7nBRAAs7eLAvhHD/z5P8b/PjD4NT8DAP/ZzaIAAj6tLt0AIGrZ+0EQ+FueEAEw
                u+UXAJ8/Ar93A8C/5Aty12Z37AJgN4CYH+LbAATe8TaA3LW3WQGcWfJnzvw28rwNJPKKP0gALBLg
                bs4qADZ/DH7P20Ayb3gE3bhFAfyeUwDMCQAMv18DEHrB5wB03+6yAugb8cfhd2sAYu93xQRA1gJw
                CoDFH4nfqQHIvd4XdfNulwXQM+Af8aBHiDwagOTbnVH3bcH/7l2P2ASw+EPxe9wHlsQPu31vOQXA
                4I/G7+8giCh+WAe4TIC7f+qRMoA+/4Pjd2cAsvhhHWChAOItwBV/XwYgjR9nAMsEuPvn7G+q8RfA
                78sAxPEDDaBQAJEWQOUvgt/TNpACfuBNXCbA3fvlX43aECLu/wW934cgL9tA5Fe7xgl34+4KBRCx
                GORr+LsxAOxhr2rhFlDyBLhb/d3gECDyl8LvZBFICz+uA1wnwJv1Xw6sAHf8PawCq+FHGsAqAeab
                Px2SAu7wezAA7utdYjTA3bi3+wXQ6zd2gg75mxuA3uDPBDSAPAGyvaCtzlLDb24AuviRBrBKgGwr
                oKAaE6Dix2777cvWAJTxQw1glQDLleDmGjj3Nvdby9IA1PFDDWCVAPlC4F4J7NbA+Zmvhd+iDA1A
                H7+IAZQVwKoK+mdnZ4v/Mq5XnL+dAVjgFzGA1UKg98utkJUBmOCHGsC6BdwsBOIlP/yNDEBx1WdX
                A+Cdu1nzf8O/rnLJNv+5LAzADD/2lm4SYC5zrRrDX9kAlttAdvSxBrBpAXfXgRLjr2sAE1v8QgZw
                uAyQDH51A7DFL2QAlbPABPjrGsCPtvilDAA/C4z8ciVDmgYw0vsedpWQt27LHz4L1Br+qgYw0vse
                tsqNvdnynzu+zAZpGcBoxDgGiRPy1t2JFYAifyUDyPHbG8AAeOsKBoCdBSIvslEqBjC6XG2ImRuA
                xDYQehKgOPx1DGC03RC15j8A3rpboQJQ5a9gAKPCjnhrDQA4CVCb/S0lbgCjnRMR1vwHwFu3YwCw
                rSDkFYZI2ABGu+eh2msAc9AF6tq/tAHs4Zf7Hm6oBsBbt2MAqJ0Abf6SBjA6wC/1PVyT+3uzwx/U
                A6rzlzOAEvz2BoBcBNrlj9kJUOcvZgCl+O0NYIC7c3sGAOkB9fkLGUAp/Xa1gG/3DGDu6uqCJWIA
                VfhbNQe83SsAfg8IvLhgSRhAJf5WGwC/B7TgL2AANfjtDQDXAh7wZ68DmvCHvxKsDr8DA8Dd5P0A
                YLcAJvzRrwSrx+/AAGAJcHMHLgAb/lgDaMDfJgM4DABmD2jDH2kAo0b8bTKA28MC4PWABvO/GbID
                DMDfJgM4DADmMpANf9gUMAh/iwygJAB4LYD++t9SIAMIw+/AAKAfBkAmgBF/jAEE0vdgAAPQjbsF
                FwDqumKFMIBg/B4MAJQAN2X8GS2AFX+AAUTgd7APDLrRZQ0AqwWwaQABBhCF334fGHWjSwOAkQBG
                DQDbAOLwOzAA3NdBoQUwMOLPNIBY/K1pAW/uwAlgFQCsReBo/K1pASv40wvAKgA4i8AE/G0xgCr+
                5ASAXBVF9ACg4PdgAIih9raKP/k8qFUAkDtAGn4HBoC41dX854ZVSRLRAIj4PRjAAHDXbisLgLoV
                bMWfZgBk/C0xgGr+1BYgKQOg42+JAdTwn5tdFE2EKSAHvwcD4N/rGv53/0K7KKsOMH4KyMLvwQD4
                97qOPzEB+EVJVKwBbF7tcsQGUMufuBOYyBQw9LhHqw2glj+1BTDiH9cBvmLj92AA3Htdzz+xBIgy
                AD5+FwbAvNcN/ImPBCVwDACB34UBsO712wb8xARgFiVZ4R0gBH/6BtDIn5gARgYQHAAg/MkbwE0j
                f+IcwIZ/aACg8LswAM69buafVgKEGQAOvwsDYNzrAP5pJUCIAfAn/s4MgH6vQ/jPaRdlwz+kA0Ti
                T9wAmqZ/S9H2AegXxVFAAEDxezgLTr/Xze1/cgnQGABg/B7OgpPvdYj90xPApACaAgCOP2UDCOSf
                1DJwPX7Aqn+LDCAo/jOpViVPY+Xh78MASO126PBPKgGm2vh9GMBAlD/1MKBFAYy18fswgPhb/TbY
                /unHwQ34T9T5J2oAEcOffBgw/qrYmqrjT9QAovhTHwgyKICxNn4fBhDrtXH4E3ogaKLP34UBDET5
                kx8JVe8Bp+r4nRhA1J2OxU9/Jly9AMbq+BM0gGj+9LeCaBfARJ+/DwOIyNp4/IwXgynzn+rj92EA
                ESONwP/uXSoFMNbn78MABpL4OR8J0+U/0ceflgG8pfGf0y9Mlf9BALxiPuqXjAEE3mcafta7YVUL
                QH/4ezGAgSR+jgEEXRhKY338Lk4C9oISgOj+TAPQdICJAX8XR4GDxhkdP+/zAHr8p+rpn5ABMPAz
                PxCjVwBj/eHvxQCa7jILP/MTYWr8J/rD340BDOrxR5z6gBuAWgFMDIa/GwOoS4Ab3vBnfyNQaS9g
                asI/AQPg4md/JlipAMYG+BMwAD5+9ldidQ6E2PB3YgCVMQvAz/9OuEoBbBsAre7PkwEMBPGzDUCl
                AKYWw9+PAZQmAAY/3wA01oKN+Hs2ABR+vgFozAPHFvbv2QBg+AEGoFAAE5Ph78YA9m8wY89HxADE
                mwAr/l4MYLA7+JH4IQYgXQBW/N0YQDEBsPQxBiDcBU5N4v/CyzmQnduLxo8xANkmIOf/Sh2/l4Ng
                BQPA47/7PfgSBTS2sX93BgDt/DYCXaNgE2DG30sHmN9ccOe3Fv1ZgF0N2sffTQeY2asMfVAHuJQo
                f/32z5MBDMTwozrATEIZMDHj78YA7j+I4QcagFAGGPJ3YgD3Hz/J8QcagEwGTIymf14M4P7+48eP
                b+T4ozrApQQywJK/AwPI6C8kaADQy8VngCV/cwO4X+GXTABkAPTwFmDK33gNaE1fNAHm4IsGF4Ap
                f9MAuC/gT8gAwG3g2JK/ZQDc/+vHouQMANoBLgW0gKnV9o+xAewMflkDmAtcPpb/0Iy/lQHs0xc1
                AHgA9HAWMDHa/jc1gPsS/IIGgA+ATO3gb2EAZfQX+izF/1bmZ0AsYGx0/Gsj9SngfQV+wUUgiQDI
                hBr+lvyVA+B9JX3BBJAJgB7AAuz56wZADX3BFnAu94N4+Kerxz/sJoCqBnBfj1/OAKQCoMe0gM3j
                n4YNoJ4BNNAXNACxAOBVwGTz+LdlACh1gE2DX9IA5qK/rD/lDn9T/ionwd8H0Bc0AMEAyPRiTCmB
                wtt/LBsAjQAIoy9nAKIBsKyAYXQJ7Lz90bIBEO8AQ6xf1gDm0j+x11tAjCqB3Zd/mgaAsAGE05cz
                AHn+CwsYhtfAdO/dr6YBINoBRgx+QQMQbgCKFRBSApODbz+0NQDi6IsZgHgDkOvlGud4Oq0Z+yVf
                /mhnBxg5+OUMYK7Df9kGbGpgPDmsgumk4sN/lvyFDCBw0qdiAAOtAvhpH+yiDBaaZv8Z13z12TIA
                ZAyAMPjlDEClAcj1YkhR6zpAGn0pA1BqAHL9SCmAdnWAxMEvZgAfNPn3eq8SMwB0ANDpCxnAXJd/
                r5+WAWADgDH4xQxAsQHI9VMs/9acAuDR/yhzEuzftPnHN4ItOQXAxi9yFFS1ASRWgCF/WAAwvV+s
                A5hb8I9sBA0TABUACPwiHYAR/7hGMPkHASD0ZQxAbQVwXxGNoKEBQAIAhF/EANQnAFuFtwF25wAQ
                AQDDL2EABhMAQgXYJQA7ADDRL2YAJhOA+Aow488NACh+AQMw5l84HOCzBWAGABa/wBqQ8g4AuQLM
                EoAVAGj8+DWguTX9TCHLAVYFwAkAOH58ANyaTQCL6gdUgBF/RgDg8Qt0gIYTwJ0KcNsCMPjj8eMN
                wAn/gAUhowIgNwAS+PEG4IZ/cwXYLANRGwAZ/HADcMS/sQJS+iKAEH64AZguAB7qhb8CIAWAGH70
                FNAZ/4YKsCgAZ/zBAWC+ABhXAQb8KQ2AHH50ADjkX1sB+vwJDcDea3w9G4BL/nUVoF8A8QEgOfzB
                mwBO+ddUgH/+svixAeCWf3UFaPOPbgCE+UMDwDH/ygpwzl8YPzYAXPOvqgDdaWBsAyjOHxkAzvlX
                rAnqFkBcAyCOHxoA7vn3es9LCkB1L8Abf2QAuFr/r6yAV6YFENcAKPAHBkAS/MtOiChuB0fxV8CP
                3ANIhP+iAl6aFYA7/rgGYG6NNUb7bxDR4h81AdDgjwsAB+d/Y7Q3HVSaBkTxl1z63wgWAAm0/3UV
                oNQFRlzfew38R8x/rwJ0moCICaCK/eMagAT57y0IHCV/WAOQTPu/VwFj1Qzwxx8UALeJ8u/1Bi8V
                C6C1/OfWGDl6oZYBEQsASvxBDUCS8b/VT0oW0PH3qvXOgGwB+OMPagCTjf+CfpTPAH/5j2kAkh/+
                uV5IW0DH37nyGOj4Hyv/1faglAVE8NdZ/8U0gHNraFi9kLKAmP2flPi3aPjn+knGAmL2/7X4I86A
                tY7/MgZs+evs/35ETABbiD/TC7gFuDv/0/Gv1fNzKP7zqPO/WgHwmYt/3obFnyqdWQ3/dPi3dvjn
                6hvx12oAOv6NwsSAu8e/MPzbj3+hPqAEYh//VAqAjn+YuJ1A/OtfdAKAyf9Y8GdimUA8f50A6PhH
                iJ4DlLc/JcD/uPBnopUA6e2fKh0Ai/87F6/91lZ8CZzR3v6q0QHw+FujsFJcCRDxqxgAZ/33aPFn
                6p+F1gD92w8KBsDgf3vU/DOF2MA559Mf4vg/MfgfPf6l6muAav0riScA4/xHh3+j/vl5+dBnf/hT
                ehHgc4cfpUVDsK2C8wV7yFd/hVsAMv/jnPqFCfO555VkC4DKv+v91CTKn9r+dfjVJNkDUtu/Dr+i
                BAuAaP8dflXJFQCNf4dfWVIFQLP/Dr+6hAqANPw7/AaSKQAC/w8dfhNJFAAB/7sOv5U88O/oG8oc
                /02H31TgpeBY/u/cfeT12ATdDYzGb/3rO0ELII5/1/j5kA3+btbnRqAmIAp/R9+RIBkQg7/r+5wJ
                gD+cfxf8/sS1gHD8HX2fUsF/+67N73ZJWwwLCKT/oTvi6VrUiUAY/s74/YtC/1MI/g5+GooPgc/N
                B37fdb6fjuIqoLnx6+CnpvAKaLD+23ddu5+k3gd1grVj//ZDxz5lNZnAp+rcn7/rxn0LVGMCnyvg
                LwZ9R75NOqyBT58Obf92vhzyHflW6g9/+Pf/WOrnn3/+z//a6L//J9P//vGP/2d9gZr6fwApfYYx
                DHMWAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA2LTA3VDE1OjQxOjA2KzA4OjAwLJ5v2AAAACV0
                RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNi0wN1QxNTo0MTowNiswODowMF3D12QAAAAASUVORK5CYII="
                            />
                        </svg>
                    )}
                    <div className="flex flex-col justify-center items-center">
                        <div className="font-[500] text-[20px] text-[#1b2337] my-[8px]">魔法创作计划</div>
                        <div>在左侧输入你的创意，保存并开始生成吧</div>
                    </div>
                </div>
            ) : (
                <>
                    <Collapse
                        accordion
                        onChange={changeCollapse}
                        activeKey={collapseActive}
                        items={bathList?.map((item, i) => {
                            return {
                                key: item.uid,
                                label: (
                                    <div className="w-full flex justify-between items-center text-sm pr-[20px]">
                                        <div className="flex items-center">
                                            {item.status === 'RUNNING' && (
                                                <Popconfirm
                                                    title="提示"
                                                    description="请再次确认是否全部取消?"
                                                    onConfirm={async (e) => {
                                                        e?.stopPropagation();
                                                        const result = await planCancel({ batchUid: item.uid });
                                                        dispatch(
                                                            openSnackbar({
                                                                open: true,
                                                                message: '取消成功',
                                                                variant: 'alert',
                                                                alert: {
                                                                    color: 'success'
                                                                },
                                                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                                close: false
                                                            })
                                                        );
                                                    }}
                                                    onCancel={(e) => {
                                                        e?.stopPropagation();
                                                    }}
                                                    okText="确认"
                                                    cancelText="取消"
                                                >
                                                    <Button
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="mr-1"
                                                        size="small"
                                                        danger
                                                        type="primary"
                                                    >
                                                        全部取消
                                                    </Button>
                                                </Popconfirm>
                                            )}
                                            <Popover
                                                content={
                                                    <div className="flex items-center gap-2">
                                                        <span>批次号：{item.uid}</span>
                                                        <CopyrightOutlined
                                                            onClick={(e) => {
                                                                copy(item.uid);
                                                                dispatch(
                                                                    openSnackbar({
                                                                        open: true,
                                                                        message: '复制成功',
                                                                        variant: 'alert',
                                                                        alert: {
                                                                            color: 'success'
                                                                        },
                                                                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                                        close: false
                                                                    })
                                                                );
                                                                e.stopPropagation();
                                                            }}
                                                            className="cursor-pointer"
                                                        />
                                                    </div>
                                                }
                                            >
                                                {getStatus(item.status)}
                                            </Popover>
                                            <span className="font-[600]">生成时间：</span>
                                            {dayjs(item?.createTime)?.format('YYYY-MM-DD HH:mm:ss')}
                                            <div className="w-[71px] inline-block whitespace-nowrap ml-1">
                                                <span className="font-[600]">版本号：</span>
                                                {item?.version}
                                            </div>
                                        </div>
                                        <div className="hidden xl:hidden 2xl:block">
                                            <div className="flex items-center gap-1 flex-wrap">
                                                <span className="font-[600]">执行人:</span>
                                                <div className="!w-[80px] line-clamp-1">{item?.creator}</div>
                                                <span className="font-[600]">生成成功数:</span>
                                                <span className="w-[17px]">{item?.successCount}</span>
                                                <span className="font-[600]">生成失败数:</span>
                                                <span className="w-[17px]">{item?.failureCount}</span>
                                                <span className="font-[600]">生成总数:</span>
                                                <span className="w-[17px]">{item?.totalCount}</span>
                                                {item.status === 'COMPLETE' && batchDataList[i] && collapseActive[0] === item.uid && (
                                                    <>
                                                        <Button
                                                            onClick={(e) => {
                                                                batchDownload(batchDataList[i]);
                                                                e.stopPropagation();
                                                            }}
                                                            size="small"
                                                            type="primary"
                                                        >
                                                            批量下载
                                                        </Button>
                                                        <Button
                                                            onClick={(e) => {
                                                                setBatchid(item?.uid);
                                                                setPublishOpen(true);
                                                                e.stopPropagation();
                                                            }}
                                                            size="small"
                                                            type="primary"
                                                        >
                                                            批量分享
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="hidden 2xl:hidden xl:block lg:block md:block sm:block xs:block">
                                            <div className="flex items-center gap-1 flex-wrap">
                                                {item.status === 'COMPLETE' && batchDataList[i] && collapseActive[0] === item.uid && (
                                                    <>
                                                        <Button
                                                            onClick={(e) => {
                                                                batchDownload(batchDataList[i]);
                                                                e.stopPropagation();
                                                            }}
                                                            size="small"
                                                            type="primary"
                                                        >
                                                            批量下载
                                                        </Button>
                                                        <Button
                                                            onClick={(e) => {
                                                                setBatchid(item?.uid);
                                                                setPublishOpen(true);
                                                                e.stopPropagation();
                                                            }}
                                                            size="small"
                                                            type="primary"
                                                        >
                                                            批量分享
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ),
                                children: (
                                    <Spin className="!max-h-full" spinning={batchOpen}>
                                        <div className="overflow-y-auto overflow-x-hidden flex flex-wrap gap-2" ref={scrollRef}>
                                            <PlanList
                                                key={item.uid}
                                                batchDataList={batchDataList[i]}
                                                setBusinessUid={setBusinessUid}
                                                setDetailOpen={setDetailOpen}
                                                timeFailure={(index) => timeFailure({ i, index })}
                                            />
                                        </div>
                                    </Spin>
                                )
                            };
                        })}
                    />
                    {batchTotal > pageNum * 10 && (
                        <div className="flex justify-center mt-4">
                            <Button size="small" type="primary" onClick={getMore}>
                                更多
                            </Button>
                        </div>
                    )}
                </>
            )}
            <Modal
                title="批量下载"
                width="60%"
                open={downOpen}
                onCancel={() => {
                    setCheckValue(undefined);
                    setDownOpen(false);
                }}
                footer={false}
            >
                <Checkbox.Group value={checkValue} onChange={setCheckValue}>
                    <div className="grid grid-cols-4 gap-4">
                        {downList?.map((item: any) => (
                            <div className="relative" key={item?.businessUid}>
                                <Good
                                    item={item}
                                    noDetail={true}
                                    setBusinessUid={(data: any) => {
                                        setBusinessUid({ uid: data, index: 0 });
                                    }}
                                    setDetailOpen={setDetailOpen}
                                    show={true}
                                />
                                <Checkbox value={item?.uid} className="absolute top-2 right-2 z-[1]" />
                            </div>
                        ))}
                    </div>
                </Checkbox.Group>
                <div className="flex justify-center gap-2 mt-4">
                    <Button
                        loading={textLoading}
                        onClick={downloadText}
                        disabled={!checkValue || checkValue?.length === 0}
                        size="small"
                        type="primary"
                    >
                        批量下载素材({checkValue?.length || 0})
                    </Button>
                    <Button
                        loading={imgLoading}
                        onClick={downloadImage}
                        disabled={!checkValue || checkValue?.length === 0}
                        size="small"
                        type="primary"
                    >
                        批量下载二维码({checkValue?.length || 0})
                    </Button>
                </div>
            </Modal>
            <Modal open={publishOpen} title={'批量分享'} footer={null} onCancel={() => setPublishOpen(false)} closable={false}>
                <div className="w-full flex justify-center items-center flex-col gap-2">
                    <QRCode value={`${process.env.REACT_APP_SHARE_URL}/batchShare?uid=` + batchid} />
                    <div className="flex flex-col items-center">
                        <div
                            onClick={() => window.open(`${process.env.REACT_APP_SHARE_URL}/batchShare?uid=${batchid}`)}
                            className="text-md underline cursor-pointer text-[#673ab7]"
                        >
                            查看效果
                        </div>
                    </div>
                </div>
            </Modal>
            {aiRocord &&
                (isExe ? (
                    <div className="absolute w-[400px] left-[calc(50%-200px)] bottom-10 bg-[#ede7f6] rounded-lg px-4 pt-1 pb-2 flex flex-col items-center gap-2 border-[0.5px] border-solid border-[#d9d9d9] z-[1]">
                        <div className="w-full flex justify-between text-sm font-bold mb-2 relative">
                            <div>智能生成</div>
                            <CloseOutlined
                                onClick={() => setIsExe(false)}
                                className="text-xs cursor-pointer border border-solid border-[transparent] hover:border-[#d9d9d9] rounded-full w-[20px] h-[20px] flex justify-center items-center"
                            />
                        </div>
                        <div className="w-full">
                            <Input
                                placeholder={aiRocord?.userInput}
                                status={exeInputOpen && !exeInputValue ? 'error' : ''}
                                value={exeInputValue}
                                onChange={(e) => setExeInputValue(e.target.value)}
                            />
                            {exeInputOpen && !exeInputValue && <div className="text-xs text-[#ff4d4f] mt-1 ml-1">内容必填</div>}
                        </div>
                        <Button onClick={handleAiExe} type="primary" size="small">
                            点击生成笔记
                        </Button>
                        <div className="text-xs text-black/50 text-center">
                            邀请好友一起体验，双方都可获得魔法豆。
                            <span
                                className="text-[#673ab7] cursor-pointer ml-1"
                                onClick={() => {
                                    copy(window.location.protocol + '//' + window.location.host + '/login?q=' + use?.inviteCode);
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: '复制成功, 快去邀请吧~',
                                            variant: 'alert',
                                            zIndex: 9999,
                                            alert: {
                                                color: 'success'
                                            },
                                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                            close: false
                                        })
                                    );
                                }}
                            >
                                点击复制邀请链接
                            </span>
                        </div>
                    </div>
                ) : (
                    <Tooltip title="点击展开智能生成" placement="topLeft">
                        <div
                            onClick={() => setIsExe(true)}
                            className="absolute right-[-20px] bottom-4 bg-[#ede7f6] cursor-pointer w-[70px] h-[40px] p-4 flex items-center rounded-full border border-solid border-[#d9d9d9]"
                        >
                            <svg
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="4429"
                                width="25"
                                height="25"
                            >
                                <path
                                    d="M443.904 352.512c-10.368 0-12.8-10.965333-12.8-10.965333-7.253333-36.48-13.354667-57.472-13.354667-57.472-6.101333-20.992-16.768-32.256-16.768-32.256-10.666667-11.264-31.616-17.664-31.616-17.664-20.992-6.4-59.306667-14.293333-59.306666-14.293334-11.562667-1.792-11.562667-12.16-11.562667-12.16 0-10.325333 11.52-12.8 11.52-12.8 38.357333-7.893333 59.349333-14.250667 59.349333-14.250666 20.992-6.4 31.616-17.664 31.616-17.664 10.666667-11.264 16.768-31.914667 16.768-31.914667 6.058667-20.693333 13.354667-57.173333 13.354667-57.173333 2.432-11.605333 12.8-11.605333 12.8-11.605334 9.728 0 12.16 11.562667 12.16 11.562667 7.893333 36.522667 13.653333 57.173333 13.653333 57.173333 5.802667 20.693333 16.469333 32 16.469334 32 10.666667 11.221333 31.914667 17.621333 31.914666 17.621334 21.333333 6.4 59.008 14.293333 59.008 14.293333 11.562667 2.432 11.562667 12.8 11.562667 12.8 0 10.325333-11.52 12.117333-11.52 12.117333-37.76 7.936-59.050667 14.293333-59.050667 14.293334-21.290667 6.4-31.914667 17.664-31.914666 17.664-10.666667 11.264-16.426667 32.256-16.426667 32.256-5.802667 20.992-13.696 57.472-13.696 57.472a13.013333 13.013333 0 0 1-12.16 10.965333zM154.453333 561.408s2.816 2.986667 7.893334 2.986667c0 0 9.301333 0 11.178666-10.666667 0 0 6.016-32.981333 11.136-52.266667 0 0 5.12-19.285333 14.890667-29.738666 0 0 9.728-10.453333 29.269333-16.042667 0 0 19.498667-5.546667 54.826667-11.605333 0 0 10.666667-1.877333 10.666667-11.605334 0 0 0-9.813333-10.666667-11.648 0 0-35.328-6.016-54.826667-11.818666 0 0-19.541333-5.845333-29.269333-16.042667 0 0-9.813333-10.24-14.890667-29.525333 0 0-5.12-19.285333-11.136-52.736 0 0-1.877333-10.24-11.178666-10.24 0 0-9.728 0-11.605334 10.24 0 0-6.058667 33.450667-11.136 52.736 0 0-5.12 19.285333-14.890666 29.525333 0 0-9.770667 10.24-29.269334 16.042667 0 0-19.498667 5.802667-54.357333 11.818666 0 0-10.666667 1.877333-10.666667 11.648 0 0 0 9.728 10.666667 11.605334 0 0 34.858667 6.016 54.357333 11.605333 0 0 19.498667 5.546667 29.269334 16.042667 0 0 9.770667 10.453333 14.890666 29.738666 0 0 5.12 19.285333 11.136 52.266667 0 0 0.938667 4.650667 3.712 7.68zM524.8 503.04a42.666667 42.666667 0 0 1 60.330667 0l373.290666 373.248a42.666667 42.666667 0 0 1-60.373333 60.373333l-373.248-373.333333a42.666667 42.666667 0 0 1 0-60.288zM374.613333 976.554667c-7.338667 0-12.373333-4.48-12.373333-4.48a18.688 18.688 0 0 1-5.546667-11.306667 952.618667 952.618667 0 0 0-14.464-82.176c-7.125333-29.525333-22.613333-44.501333-22.613333-44.501333-15.573333-15.018667-46.677333-23.466667-46.677333-23.466667-31.061333-8.405333-85.333333-18.432-85.333334-18.432-16.341333-3.157333-16.341333-17.92-16.341333-17.92 0-7.381333 4.736-12.117333 4.736-12.117333 4.778667-4.736 11.605333-5.802667 11.605333-5.802667 54.272-7.381333 85.333333-15.018667 85.333334-15.018667 31.104-7.637333 46.634667-23.168 46.634666-23.168 15.530667-15.530667 22.912-45.824 22.912-45.824 7.381333-30.293333 14.250667-84.053333 14.250667-84.053333 2.090667-16.298667 17.92-16.298667 17.92-16.298667 15.786667 0 17.365333 16.853333 17.365333 16.853334 6.826667 52.693333 13.952 82.176 13.952 82.176 7.125333 29.482667 23.168 44.245333 23.168 44.245333 16.085333 14.762667 47.146667 22.912 47.146667 22.912 31.104 8.192 84.821333 18.176 84.821333 18.176 16.341333 3.157333 16.341333 17.92 16.341334 17.92 0 14.762667-18.432 17.92-18.432 17.92-53.76 8.405333-84.309333 16.341333-84.309334 16.341333-30.549333 7.893333-46.08 23.168-46.08 23.168-15.530667 15.274667-22.656 45.312-22.656 45.312-7.125333 30.037333-13.952 82.688-13.952 82.688-1.578667 16.853333-17.408 16.853333-17.408 16.853334z m385.834667-505.130667s1.92 10.581333 12.032 10.581333c0 0 9.642667 0 11.562667-10.581333 0 0 6.272-34.688 11.52-54.613333 0 0 5.333333-20.053333 15.445333-30.634667 0 0 10.112-10.581333 30.592-16.597333 0 0 20.48-6.016 56.576-12.288 0 0 11.093333-1.92 11.093333-12.032 0 0 0-10.112-11.093333-12.032 0 0-36.138667-6.272-56.576-12.032 0 0-20.48-5.802667-30.592-16.64 0 0-10.112-10.837333-15.402667-30.805334 0 0-5.290667-19.968-11.562666-54.186666 0 0-1.92-11.093333-11.52-11.093334 0 0-10.154667 0-12.074667 11.093334 0 0-6.272 34.218667-11.52 54.186666 0 0-5.333333 19.968-15.445333 30.805334 0 0-10.112 10.837333-30.336 16.64 0 0-20.224 5.76-56.32 12.032 0 0-4.864 0.981333-7.978667 4.096 0 0-3.114667 3.114667-3.114667 7.936 0 0 0 10.112 11.093334 12.032 0 0 36.096 6.272 56.32 12.288 0 0 20.224 6.016 30.293333 16.64 0 0 10.154667 10.581333 15.445333 30.549333 0 0 5.290667 19.968 11.52 54.656z"
                                    p-id="4430"
                                ></path>
                            </svg>
                        </div>
                    </Tooltip>
                ))}
            <Modal
                title="笔记生成进度"
                open={aiStepOpen}
                onCancel={() => setAiStepOpen(false)}
                closable={errMsg ? true : false}
                maskClosable={false}
                footer={false}
                keyboard={false}
            >
                <div className="mt-4 flex justify-center">
                    <Steps
                        direction="vertical"
                        size="small"
                        current={stepCurrent}
                        status={errMsg ? 'error' : 'process'}
                        items={[
                            {
                                icon: stepCurrent === 0 && !errMsg ? <LoadingOutlined /> : null,
                                title: 'AI 识别中生成···',
                                description: (
                                    <div className="text-xs font-bold">{stepCurrent === 0 && errMsg ? `错误信息：(${errMsg})` : ''}</div>
                                )
                            },
                            {
                                icon: stepCurrent === 1 && !errMsg ? <LoadingOutlined /> : null,
                                title: 'AI 识别生成成功，开始 Ai 执行中···',
                                description: (
                                    <div className="text-xs font-bold">
                                        {stepCurrent === 1 && errMsg ? (
                                            `错误信息：(${errMsg})`
                                        ) : (
                                            <div className="max-h-[300px] overflow-y-scroll font-[500] flex gap-2 items-center mt-2">
                                                {aiData && <div>入参信息：</div>}
                                                <div>{getrejectData(aiData)}</div>
                                            </div>
                                        )}
                                    </div>
                                )
                            },
                            {
                                icon: stepCurrent === 2 && !errMsg ? <LoadingOutlined /> : null,
                                title: <div>AI 执行成功，生成素材中···</div>,
                                description: (
                                    <div className="text-xs font-bold mt-2">
                                        {stepCurrent === 2 && errMsg ? (
                                            <div>
                                                错误信息：插件执行异常，请重试或联系管理员{' '}
                                                <Tooltip className="cursor-pointer" title={errMsg}>
                                                    <ExclamationCircleOutlined />
                                                </Tooltip>
                                            </div>
                                        ) : stepCurrent === 2 ? (
                                            <span className="text-[#673ab7]">
                                                <HistoryOutlined /> 预计耗时：
                                                {((aiRocord?.executeTimeAvg * 1.1) / 1000) | 40}s
                                            </span>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                )
                            },
                            {
                                icon: stepCurrent === 3 && !errMsg ? <LoadingOutlined /> : null,
                                title: '素材生成成功，准备插入并生成···',
                                description: (
                                    <div className="text-xs font-bold">{stepCurrent === 3 && errMsg ? `错误信息：(${errMsg})` : ''}</div>
                                )
                            },
                            { title: 'AI 生成笔记···' }
                        ]}
                    />
                </div>
            </Modal>
        </div>
    );
};
const RightMemo = (prevProps: any, nextProps: any) => {
    return (
        _.isEqual(prevProps?.isexample, nextProps?.isexample) &&
        _.isEqual(prevProps?.planUid, nextProps?.planUid) &&
        _.isEqual(prevProps?.bathList, nextProps?.bathList) &&
        _.isEqual(prevProps?.collapseActive, nextProps?.collapseActive) &&
        _.isEqual(prevProps?.batchOpen, nextProps?.batchOpen) &&
        _.isEqual(prevProps?.batchDataList, nextProps?.batchDataList) &&
        _.isEqual(prevProps?.exampleList, nextProps?.exampleList)
    );
};
export default memo(Right, RightMemo);
