import {
    Box,
    FormControl,
    InputLabel,
    Select as Selects,
    MenuItem,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Pagination,
    TextField,
    Button as Button2,
    Drawer,
    Card,
    Divider,
    Chip,
    IconButton,
    CardContent,
    Tooltip,
    Link
} from '@mui/material';
import { Row, Col, Tag, Image, Select, Button } from 'antd';
import formatDate from 'hooks/useDate';
import CloseIcon from '@mui/icons-material/Close';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart, { Props } from 'react-apexcharts';
import { logStatistics, statisticsByAppUid, infoPage, infoPageByAppUid, logMetaData, detailImage, detailApp } from 'api/template';
import SearchIcon from '@mui/icons-material/Search';
import { t } from 'hooks/web/useI18n';
import Perform from '../carryOut/perform';
import marketStore from 'store/market';
import PicModal from 'views/picture/create/Modal';
import { getChatRecord } from 'api/chat';
import { metadata } from 'api/template';
import { schemeMetadata } from 'api/redBook/copywriting';
import { materialTemplate } from 'api/redBook/batchIndex';
import { ChatRecord } from '../myChat/createChat/components/ChatRecord';
import ImageDetail from 'views/picture/components/detail';
import Echarts from './components/echart';
import useUserStore from 'store/user';
import { Charts } from 'types/chat';
import { DetailModal } from 'views/pages/redBookContentList/component/detailModal';
import _ from 'lodash-es';
import { ENUM_PERMISSION, getPermission } from 'utils/permission';
interface LogStatistics {
    updateDate: string;
    completionCostPoints: number;
    matrixCostPoints: number;
    completionErrorCount: number;
    imageAvgElapsed: number;
    completionAvgElapsed: number;
    imageCostPoints: number;
    completionTokens: number;
    chatTokens: number;
    imageSuccessCount: number;
    imageErrorCount: number;
    completionSuccessCount: number;
}
interface TableData {
    uid: string;
    appMode: string;
    fromScene: string;
    appName: string;
    imagePoints?: string;
    totalAnswerTokens: number;
    matrixPoints: number;
    totalMessageTokens: number;
    totalElapsed: number;
    status: string;
    createTime: number;
    errorMessage: string;
    endUser: string;
    appExecutor: string;
    updateTime: number;
    errorCode?: string;
    errorMsg?: string;
    tokens?: number;
    costPoints?: number;
    userLevels?: string[];
}
interface Date {
    label: string;
    value: string;
}
interface Query {
    appName?: string;
    userId?: string;
    timeType?: string;
    appMode?: string;
    fromScene?: string;
}
interface Detail {
    name?: string;
    description?: string;
    categories?: string[];
    tags?: string[];

    uid?: string;
    appMode?: string;
    appName?: string;
    fromScene?: string;
    status?: string;
    errorMessage?: string;
    endUser?: string;
    createTime?: number;
    imageInfo?: any;
    appExecutor?: string;
    appInfo?: any;
}
function ApplicationAnalysis({
    appUid = null,
    value = 2,
    type = 'GENERATE_RECORD'
}: {
    appUid: string | null | undefined;
    value: number;
    type: string;
}) {
    const { Option } = Select;
    const [queryParams, setQuery] = useState<Query>({
        timeType: 'LAST_7D'
    });
    const [generate, setGenerate] = useState<Charts[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState({
        pageNo: 1,
        pageSize: 15
    });
    const [totalData, setTotalData] = useState<TableData[]>([]);
    //获取表格数据
    const infoList = (params: any) => {
        if (type === 'GENERATE_RECORD') {
            infoPage({ ...params, ...queryParams, appUid }).then((res) => {
                setTotalData(res.list);
                setTotal(res.total);
            });
        } else {
            infoPageByAppUid({ ...params, ...queryParams, appUid }).then((res) => {
                setTotalData(res.list);
                setTotal(res.total);
            });
        }
    };
    const permissions = useUserStore((state) => state.permissions);

    //获取标数据
    const getStatistic = async () => {
        const APP_HOME = getPermission(ENUM_PERMISSION.APP_HOME);

        let res: any;
        if (type === 'GENERATE_RECORD') {
            res = await logStatistics({ ...queryParams, appUid });
        } else {
            res = await statisticsByAppUid({ ...queryParams, appUid });
        }
        const completionSuccessCount = res?.map((item: LogStatistics) => ({ y: item.completionSuccessCount, x: item.updateDate }));
        const completionCostPoints = res?.map((item: LogStatistics) => ({
            y: APP_HOME ? item.completionCostPoints : item.matrixCostPoints,
            x: item.updateDate
        }));
        const completionErrorCount = res?.map((item: LogStatistics) => ({ y: item.completionErrorCount, x: item.updateDate }));

        const imageAvgElapsed = res?.map((item: LogStatistics) => ({
            y: APP_HOME ? item.imageAvgElapsed?.toFixed(2) : item.completionAvgElapsed?.toFixed(2),
            x: item.updateDate
        }));
        const completionAvgElapsed = res?.map((item: LogStatistics) => ({ y: item.completionAvgElapsed?.toFixed(2), x: item.updateDate }));
        const imageSuccessCount = res?.map((item: LogStatistics) => ({
            y: APP_HOME ? item.imageSuccessCount : item.completionSuccessCount,
            x: item.updateDate
        }));
        const imageErrorCount = res?.map((item: LogStatistics) => ({
            y: APP_HOME ? item.imageErrorCount : item.completionErrorCount,
            x: item.updateDate
        }));

        const imageCostPoints = res?.map((item: LogStatistics) => ({ y: item.imageCostPoints, x: item.updateDate }));
        const completionTokens = res?.map((item: LogStatistics) => ({ y: item.completionTokens, x: item.updateDate }));
        const chatTokens = res?.map((item: LogStatistics) => ({ y: item.chatTokens, x: item.updateDate }));
        const newList = [];
        permissions?.includes('log:app:analysis:completionCostPoints') &&
            newList.push({
                title:
                    type === 'GENERATE_RECORD'
                        ? '生成/聊天消耗魔法豆数'
                        : type === 'APP_ANALYSIS'
                        ? '生成消耗魔法豆数'
                        : '聊天消耗魔法豆数',
                subTitle: '全部消耗的魔法豆数',
                name: '执行成功次数',
                errTitle: '执行失败次数',
                data: completionCostPoints,
                successData: completionSuccessCount,
                errData: completionErrorCount,
                key: true
            });
        permissions?.includes('log:app:analysis:imageCostPoints') &&
            type === 'GENERATE_RECORD' &&
            newList.push({
                title: '生成图片消耗数',
                data: imageCostPoints
            });
        permissions?.includes('log:app:analysis:completionAvgElapsed') &&
            newList.push({
                title:
                    type === 'GENERATE_RECORD' ? '生成/聊天平均耗时(S)' : type === 'APP_ANALYSIS' ? '生成平均耗时(S)' : '聊天平均耗时(S)',
                data: completionAvgElapsed
            });
        permissions?.includes('log:app:analysis:imageAvgElapsed') &&
            type === 'GENERATE_RECORD' &&
            newList.push({ title: '生成图片平均耗时(S)', data: imageAvgElapsed });
        permissions?.includes('log:app:analysis:completionTokens') &&
            (type === 'APP_ANALYSIS' || type === 'GENERATE_RECORD') &&
            newList.push({ title: '生成消耗Tokens', data: completionTokens });
        permissions?.includes('log:app:analysis:chatTokens') &&
            (type === 'CHAT_ANALYSIS' || type === 'GENERATE_RECORD') &&
            newList.push({ title: '聊天消耗Tokens', data: chatTokens });
        setGenerate(newList);
    };
    //时间
    const [dateList, setDateList] = useState([] as Date[]);
    //模式
    const [appMode, setAppMode] = useState([] as Date[]);
    //执行模式（3.5 4.0）
    const [exeList, setExeList] = useState<any[]>([]);
    //场景
    const [appScene, setAppScene] = useState([] as Date[]);

    useEffect(() => {
        logMetaData(type).then((res) => {
            setDateList(res.timeType);
            setAppMode(res.appMode);
            setAppScene(res.appScene);
        });
        metadata().then((res) => {
            setExeList(res.llmModelType);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (value === 2 || value === 7) {
            //获取echarts
            getStatistic();
            infoList(page);
        }
    }, [value]);
    //输入框输入
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setQuery({ ...queryParams, [name]: value });
    };
    //切换分页
    const paginationChange = (event: any, value: number) => {
        setPage((oldValue) => {
            const newValue = {
                ...oldValue,
                pageNo: value
            };
            infoList(newValue);
            return newValue;
        });
    };
    //封装的echarts
    const list = (item: Charts, key?: boolean): Props => {
        return {
            height: 200,
            type: 'area',
            options: {
                tooltip: {
                    enabled: true
                },
                chart: {
                    id: item.title,
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    },
                    sparkline: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight',
                    width: 2
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.5,
                        opacityTo: 0,
                        stops: [0, 80, 100]
                    }
                },
                legend: {
                    show: true
                },
                yaxis: {
                    labels: {
                        show: true
                    },
                    axisBorder: {
                        show: true
                    }
                },
                xaxis: {
                    labels: {
                        show: true
                    },
                    axisBorder: {
                        show: true
                    }
                }
            },
            series: key
                ? [
                      { name: item.subTitle, data: item.data },
                      { name: item.name, data: item.successData as any[] },
                      { name: item.errTitle, data: item.errData as any[] }
                  ]
                : [{ name: '', data: item.data }]
        };
    };
    //搜索
    const querys = () => {
        setPage((oldValue) => {
            const newValue = {
                ...oldValue,
                pageNo: 1
            };
            getStatistic();
            infoList(newValue);
            return newValue;
        });
    };
    const categoryList = marketStore((state) => state.categoryList);
    const getDeList = (row: { appMode: string; uid: string }) => {
        if (row.appMode === 'IMAGE') {
            detailImage({ appConversationUid: row.uid }).then((res) => {
                if (res) {
                    if (
                        res.fromScene === 'IMAGE_REMOVE_BACKGROUND' ||
                        res.fromScene === 'IMAGE_REMOVE_TEXT' ||
                        res.fromScene === 'IMAGE_UPSCALING' ||
                        res.fromScene === 'IMAGE_VARIANTS' ||
                        res.fromScene === 'IMAGE_SKETCH'
                    ) {
                        setDetailData(res.imageInfo);
                        setDetailOpen(true);
                    } else {
                        setResult(res);
                        setImgDetail(res.imageInfo || { images: [{ url: '' }], prompt: '', engine: '', width: 0, height: 0 });
                        setPicOpen(true);
                    }
                }
            });
        }
    };
    const [ImgDetail, setImgDetail] = useState({
        images: [],
        prompt: '',
        engine: '',
        width: 0,
        height: 0,
        stylePreset: ''
    });
    const [currentIndex, setCurrentIndex] = useState(0);
    //图片弹框
    const [picOpen, setPicOpen] = useState(false);
    //执行弹窗
    const [exeOpen, setExeOpen] = useState(false);
    const [detail, setDetail] = useState<Detail[] | null>(null);
    //智能抠图弹窗
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState<any>({});
    //小红书弹窗
    const [redBookOpen, setRedBookOpen] = useState(false);
    const [executeResult, setExecuteResult] = useState<any>(null);
    //接口请求出来的全部内容
    const [result, setResult] = useState<any>({});
    const [aimodel, setAiModel] = useState('');
    const detailRef = useRef<any>(null);
    const [exeDetail, setExeDetail] = useState<any>({});
    //聊天
    const [chatVisible, setChatVisible] = useState(false);
    //绘话id
    const [conversationUid, setConversationUid] = useState('');
    const navigate = useNavigate();
    const getImage = (active: string) => {
        let image;
        try {
            image = require('../../../assets/images/category/' + active + '.svg');
        } catch (_) {
            image =
                'data:image/png;base64,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';
        }
        return image;
    };

    const stepMarRef = useRef<any[]>([]);
    const [stepMaterial, setStepMaterial] = useState<any[]>([]);
    const getStepMater = async () => {
        const arr: any[] = [];
        const newList = detailRef.current?.workflowConfig?.steps.map((item: any) => {
            const arr = item?.variable?.variables;
            return arr?.find((i: any) => i?.field === 'MATERIAL_TYPE')?.value;
        });
        const allper = newList?.map(async (el: any, index: number) => {
            if (el) {
                const res = await materialTemplate(el);
                arr[index] = getHeader(res?.fieldDefine, index);
            } else {
                arr[index] = undefined;
            }
        });
        await Promise.all(allper);
        stepMarRef.current = arr;
        setStepMaterial(stepMarRef?.current);
    };
    //获取数据表头
    const getHeader = (data: any, i: number) => {
        const newList = data.map((item: any) => ({
            title: item.desc,
            align: 'center',
            width: 200,
            dataIndex: item.fieldName,
            render: (_: any, row: any) => (
                <div className="flex justify-center items-center flex-wrap break-all gap-2">
                    <div className="line-clamp-5">
                        {item.type === 'image' ? (
                            row[item.fieldName] ? (
                                <Image
                                    fallback={
                                        'data:image/png;base64,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'
                                    }
                                    width={50}
                                    height={50}
                                    preview={false}
                                    src={row[item.fieldName]}
                                />
                            ) : (
                                <div className="w-[50px] h-[50px] rounded-md border border-solid border-black/10"></div>
                            )
                        ) : (
                            row[item.fieldName]
                        )}
                    </div>
                </div>
            ),
            type: item.type
        }));

        return [
            ...newList,
            {
                title: '操作',
                align: 'center',
                width: 100,
                fixed: 'right',
                render: (_: any, row: any, index: number) => (
                    <div className="flex justify-center">
                        <Button disabled={true} size="small" type="link">
                            编辑
                        </Button>

                        <Button disabled={true} size="small" type="link" danger>
                            删除
                        </Button>
                    </div>
                )
            }
        ];
    };
    return (
        <Box>
            <Row className="my-4" gutter={[20, 20]}>
                {!appUid && (
                    <>
                        <Col md={8} lg={6} xs={12}>
                            <TextField
                                label={t('generateLog.name')}
                                value={queryParams.appName}
                                name="appName"
                                type="search"
                                InputLabelProps={{ shrink: true }}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Col>
                        <Col md={8} lg={6} xs={12}>
                            <TextField
                                label={'用户 ID'}
                                value={queryParams.userId}
                                name="userId"
                                type="search"
                                InputLabelProps={{ shrink: true }}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Col>
                        <Col md={8} lg={6} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="appMode">模式</InputLabel>
                                <Selects
                                    type="search"
                                    labelId="appMode"
                                    name="appMode"
                                    label="模式"
                                    value={queryParams.appMode}
                                    onChange={handleChange}
                                >
                                    {appMode.map((item) => (
                                        <MenuItem value={item.value}>{item.label}</MenuItem>
                                    ))}
                                </Selects>
                            </FormControl>
                        </Col>
                    </>
                )}
                <Col md={8} lg={6} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="fromScene">场景</InputLabel>
                        <Selects labelId="fromScene" name="fromScene" label="场景" value={queryParams.fromScene} onChange={handleChange}>
                            {appScene.map((item) => (
                                <MenuItem value={item.value}>{item.label}</MenuItem>
                            ))}
                        </Selects>
                    </FormControl>
                </Col>
                <Col md={8} lg={6} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">{t('generateLog.date')}</InputLabel>
                        <Selects
                            labelId="demo-simple-select-label"
                            name="timeType"
                            label={t('generateLog.date')}
                            value={queryParams.timeType}
                            onChange={handleChange}
                        >
                            {dateList?.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Selects>
                    </FormControl>
                </Col>
                <Col md={8} lg={6} xs={12}>
                    <Button2 onClick={querys} startIcon={<SearchIcon />} variant="contained" color="primary">
                        {t('generateLog.search')}
                    </Button2>
                </Col>
            </Row>
            <Echarts generate={generate} list={list} />
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ minWidth: '200px' }} align="center">
                                {t('generate.name')}
                            </TableCell>
                            <TableCell sx={{ minWidth: '100px' }} align="center">
                                {t('generate.mode')}
                            </TableCell>
                            {permissions?.includes('log:app:page:adminColumns') && (
                                <TableCell sx={{ minWidth: '100px' }} align="center">
                                    执行场景
                                </TableCell>
                            )}
                            <TableCell sx={{ minWidth: '120px' }} align="center">
                                消耗魔法豆数
                            </TableCell>
                            <TableCell sx={{ minWidth: '120px' }} align="center">
                                消耗图片数
                            </TableCell>
                            {permissions?.includes('log:app:page:adminColumns') && (
                                <TableCell sx={{ minWidth: '100px' }} align="center">
                                    {t('generate.totalElapsed')} (s)
                                </TableCell>
                            )}
                            <TableCell sx={{ minWidth: '100px' }} align="center">
                                用户
                            </TableCell>
                            <TableCell sx={{ minWidth: '200px' }} align="center">
                                {t('generate.status')}
                            </TableCell>
                            <TableCell sx={{ minWidth: '150px' }} align="center">
                                更新时间
                            </TableCell>
                            {permissions?.includes('log:app:page:adminColumns') && (
                                <TableCell sx={{ minWidth: '100px' }} align="center">
                                    消耗总Token
                                </TableCell>
                            )}
                            {permissions?.includes('log:app:page:adminColumns') && (
                                <TableCell sx={{ minWidth: '100px' }} align="center">
                                    用户等级
                                </TableCell>
                            )}
                            <TableCell sx={{ minWidth: '50px' }} align="center">
                                操作
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {totalData?.map((row) => (
                            <TableRow key={row.uid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="center">{row.appName}</TableCell>
                                <TableCell align="center">{t('generate.' + row.appMode)}</TableCell>
                                {permissions?.includes('log:app:page:adminColumns') && (
                                    <TableCell align="center">{appScene.find((item) => item.value === row.fromScene)?.label}</TableCell>
                                )}
                                <TableCell align="center">
                                    {getPermission(ENUM_PERMISSION.APP_HOME) ? row.costPoints || 0 : row.matrixPoints || 0}
                                </TableCell>
                                <TableCell align="center">{row.imagePoints || 0}</TableCell>
                                {permissions?.includes('log:app:page:adminColumns') && (
                                    <TableCell align="center">{row.totalElapsed}</TableCell>
                                )}
                                <TableCell align="center">{row.appExecutor}</TableCell>
                                <TableCell align="center">
                                    {row.status !== 'SUCCESS' ? (
                                        row.errorCode === '2004008003' ? (
                                            <Link
                                                onClick={() =>
                                                    window.open(window.location.protocol + '//' + window.location.host + '/subscribe')
                                                }
                                                color="secondary"
                                                className="cursor-pointer"
                                            >
                                                魔法豆不足，去升级
                                            </Link>
                                        ) : row.errorCode === '2004008004' ? (
                                            <Link
                                                onClick={() =>
                                                    window.open(window.location.protocol + '//' + window.location.host + '/subscribe')
                                                }
                                                color="secondary"
                                                className="cursor-pointer"
                                            >
                                                图片不足，去升级
                                            </Link>
                                        ) : (
                                            <>
                                                <Tooltip placement="top" title={<Typography>{`系统异常（${row.errorCode}）`}</Typography>}>
                                                    <Tag className="cursor-pointer" color="error">
                                                        失败
                                                    </Tag>
                                                </Tooltip>
                                                <span className="hidden">{row.errorCode}</span>
                                            </>
                                        )
                                    ) : (
                                        <>
                                            <Tag color="success">成功</Tag>
                                            <span className="hidden"></span>
                                        </>
                                    )}
                                </TableCell>
                                <TableCell align="center">{formatDate(row.updateTime)}</TableCell>
                                {permissions?.includes('log:app:page:adminColumns') && <TableCell align="center">{row.tokens}</TableCell>}
                                {permissions?.includes('log:app:page:adminColumns') && (
                                    <TableCell align="center">
                                        {row.userLevels?.map((item) => (
                                            <p className="mt-[5px]">
                                                <Tag
                                                    color={
                                                        item === 'MOFAAI_FREE'
                                                            ? 'processing'
                                                            : item === 'MOFAAI_BASIC'
                                                            ? 'processing'
                                                            : item === 'MOFAAI_PLUS'
                                                            ? '#673ab7'
                                                            : item === 'MOFAAI_PRO'
                                                            ? 'warning'
                                                            : item === 'MOFAAI_ADMIN'
                                                            ? 'error'
                                                            : item === 'MOFAAI_DEV'
                                                            ? 'error'
                                                            : 'processing'
                                                    }
                                                >
                                                    {item === 'MOFAAI_FREE'
                                                        ? '免费版'
                                                        : item === 'MOFAAI_BASIC'
                                                        ? '基础版'
                                                        : item === 'MOFAAI_PLUS'
                                                        ? '高级版'
                                                        : item === 'MOFAAI_PRO'
                                                        ? '团队版'
                                                        : item === 'MOFAAI_ADMIN'
                                                        ? '管理员'
                                                        : item === 'MOFAAI_DEV'
                                                        ? '运营'
                                                        : item}
                                                </Tag>
                                            </p>
                                        ))}
                                    </TableCell>
                                )}
                                <TableCell align="center">
                                    <Button2
                                        color="secondary"
                                        size="small"
                                        onClick={() => {
                                            if (row.appMode === 'IMAGE') {
                                                getDeList(row);
                                            } else if (row.appMode === 'COMPLETION') {
                                                detailApp({ appConversationUid: row.uid }).then((res) => {
                                                    if (!res?.executeResult) {
                                                        const newData = _.cloneDeep(res);
                                                        newData?.appInfo?.workflowConfig?.steps?.forEach((item: any) => {
                                                            const arr = item?.variable?.variables;
                                                            if (
                                                                arr?.find((el: any) => el.field === 'MATERIAL_TYPE') &&
                                                                arr?.find((el: any) => el.style === 'MATERIAL') &&
                                                                arr?.find((el: any) => el.style === 'MATERIAL')?.value
                                                            ) {
                                                                let list: any;

                                                                try {
                                                                    list = JSON.parse(
                                                                        arr?.find((el: any) => el.style === 'MATERIAL')?.value
                                                                    );
                                                                } catch (err) {
                                                                    list = arr?.find((el: any) => el.style === 'MATERIAL')?.value;
                                                                }
                                                                arr.find((el: any) => el.style === 'MATERIAL').value = list;
                                                            }
                                                        });
                                                        detailRef.current = newData.appInfo;
                                                        setExeDetail(detailRef.current);
                                                        setAiModel(newData.aiModel);
                                                        setResult(newData);
                                                        setConversationUid(newData.conversationUid);
                                                        getStepMater();
                                                        setExeOpen(true);
                                                    } else {
                                                        setExecuteResult(res);
                                                        setRedBookOpen(true);
                                                    }
                                                });
                                            } else if (row.appMode === 'CHAT') {
                                                setConversationUid(row.uid);
                                                getChatRecord({
                                                    appConversationUid: row.uid,
                                                    pageNo: 1,
                                                    pageSize: 100,
                                                    fromScene: row.fromScene
                                                }).then((res) => {
                                                    if (res) {
                                                        setChatVisible(true);
                                                        setDetail(res.list);
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        {t('generate.detail')}
                                    </Button2>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box my={2}>
                <Pagination page={page.pageNo} count={Math.ceil(total / page.pageSize)} onChange={paginationChange} />
            </Box>
            {picOpen && (
                <PicModal
                    open={picOpen}
                    setOpen={() => {
                        setPicOpen(false);
                        setCurrentIndex(0);
                    }}
                    currentIndex={currentIndex}
                    setCurrentIndex={(currentIndex) => {
                        setCurrentIndex(currentIndex);
                    }}
                    currentImageList={ImgDetail.images}
                    prompt={ImgDetail.prompt}
                    engine={ImgDetail.engine}
                    width={ImgDetail.width}
                    height={ImgDetail.height}
                    stylePreset={ImgDetail?.stylePreset}
                />
            )}
            {chatVisible && (
                <Drawer
                    anchor="right"
                    open={chatVisible}
                    sx={{ '& .MuiDrawer-paper': { overflow: 'hidden' } }}
                    onClose={() => {
                        setChatVisible(false);
                        setConversationUid('');
                        setDetail(null);
                    }}
                >
                    <div className="bg-[#f4f6f8] w-[350px] md:w-[600px] flex items-center justify-center">
                        <div className="m-[10px] bg-[#fff] h-[calc(100vh-20px)] w-[100%] rounded-lg">
                            <Card>
                                <ChatRecord list={detail} conversationUid={conversationUid} />
                            </Card>
                        </div>
                    </div>
                </Drawer>
            )}
            {exeOpen && (
                <Drawer
                    anchor="right"
                    open={exeOpen}
                    sx={{ '& .MuiDrawer-paper': { overflowY: 'auto' } }}
                    onClose={() => {
                        setExeOpen(false);
                        detailRef.current = {};
                        setExeDetail(detailRef.current);
                        setAiModel('');
                        setResult({});
                        setConversationUid('');
                    }}
                >
                    <div className="bg-[#f4f6f8] w-[1100px] md:w-[900px] flex justify-center">
                        <div className="m-[10px] bg-[#fff] h-[calc(100vh-20px)] w-[100%] rounded-lg">
                            <MainCard
                                title={
                                    <Box display="flex" alignItems="end">
                                        <Typography variant="h3">历史详情</Typography>
                                        <Typography fontSize="12px" color="#697586" ml={1}>
                                            (会话id：{conversationUid})
                                        </Typography>
                                    </Box>
                                }
                                content={false}
                                secondary={
                                    <IconButton
                                        onClick={() => {
                                            setExeOpen(false);
                                            setConversationUid('');
                                        }}
                                        size="large"
                                        aria-label="close modal"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                }
                            >
                                <CardContent>
                                    <Box>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                {exeDetail?.icon && (
                                                    <Image
                                                        preview={false}
                                                        height={60}
                                                        className="rounded-lg overflow-hidden"
                                                        src={getImage(exeDetail?.icon)}
                                                    />
                                                )}
                                                <Box ml={1}>
                                                    <Box>
                                                        <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                                                            {exeDetail?.name}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        {exeDetail?.categories?.map((item: any) => (
                                                            <span key={item}>
                                                                #{categoryList?.find((el: { code: string }) => el.code === item)?.name}
                                                            </span>
                                                        ))}
                                                        {exeDetail?.tags?.map((el: any) => (
                                                            <Chip
                                                                key={el}
                                                                sx={{ marginLeft: 1 }}
                                                                size="small"
                                                                label={el}
                                                                variant="outlined"
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </Box>
                                            {exeDetail?.workflowConfig?.steps?.length == 1 && (
                                                <Select
                                                    style={{ width: 100, height: 23 }}
                                                    bordered={false}
                                                    className="rounded-2xl border-[0.5px] border-[#673ab7] border-solid"
                                                    rootClassName="modelSelect"
                                                    popupClassName="modelSelectPopup"
                                                    value={aimodel}
                                                    disabled
                                                >
                                                    {exeList?.map((item: any) => (
                                                        <Option key={item.value} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </Box>
                                        {result.status !== 'ERROR' && <Divider sx={{ my: 1 }} />}
                                        <Typography variant="h5" sx={{ fontSize: '1.1rem', mb: 3 }}>
                                            {exeDetail?.description}
                                        </Typography>
                                        <Perform
                                            history={true}
                                            config={exeDetail.workflowConfig}
                                            columns={stepMaterial}
                                            changeConfigs={() => {}}
                                            changeSon={() => {}}
                                            changeanswer={() => {}}
                                            loadings={[]}
                                            isDisables={[]}
                                            isShows={[]}
                                            variableChange={() => {}}
                                            promptChange={() => {}}
                                            isallExecute={() => {}}
                                            source="myApp"
                                        />
                                    </Box>
                                </CardContent>
                            </MainCard>
                        </div>
                    </div>
                </Drawer>
            )}
            {detailOpen && <ImageDetail detailOpen={detailOpen} detailData={detailData} handleClose={() => setDetailOpen(false)} />}
            {redBookOpen && (
                <DetailModal open={redBookOpen} handleClose={() => setRedBookOpen(false)} executeResult={executeResult} businessUid={''} />
            )}
        </Box>
    );
}
export default ApplicationAnalysis;
