import {
    CardContent,
    IconButton,
    Modal,
    Divider,
    CardActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Box,
    Button,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from '@mui/material';
import { infoPageByMarketUid, detailApp } from 'api/template';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState, useRef } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { t } from 'hooks/web/useI18n';
import { executeMarket } from 'api/template/fetch';
import { listMarketAppOption, marketDeatail } from 'api/template';
import Perform from 'views/template/carryOut/perform';
import nothing from 'assets/images/upLoad/nothing.svg';
import _ from 'lodash-es';
import { useAllDetail } from 'contexts/JWTContext';
import formatDate from 'hooks/useDate';
import { PermissionUpgradeModal } from 'views/template/myChat/createChat/components/modal/permissionUpgradeModal';
interface Details {
    name?: string;
    description?: string;
    categories?: string[];
    scenes?: string[];
    tags?: string[];
    example?: string;
    viewCount?: string;
    likeCount?: string;
    installCount?: string;
    uid?: string;
    version?: number;
    installStatus?: any;
    workflowConfig: { steps: any[] };
}
interface Execute {
    index: number;
    stepId: string;
    steps: any;
}
const AppModal = ({
    open,
    tags,
    title,
    value,
    setOpen,
    emits
}: {
    open: boolean;
    tags: string[];
    title: string;
    value: string | undefined;
    setOpen: (data: boolean) => void;
    emits: (data: any) => void;
}) => {
    const allDetail = useAllDetail();
    useEffect(() => {
        if (open && tags.length > 0) {
            const fn = async () => {
                const res = await listMarketAppOption({ tags });
                setAppList(res);
            };
            fn();
        }
    }, [open, ...tags]);
    const [appValue, setAppValue] = useState('');
    const [appList, setAppList] = useState<any[]>([]);
    const [detail, setDetail] = useState<Details>({
        workflowConfig: {
            steps: []
        }
    });
    const [perform, setPerform] = useState(0);
    const detailRef: any = useRef(null);
    //token不足
    const [tokenOpen, setTokenOpen] = useState(false);
    const [loadings, setLoadings] = useState<any[]>([]);
    //是否显示分享翻译
    const [isShows, setIsShow] = useState<any[]>([]);
    //历史记录
    const [historyList, setHistoryList] = useState<any[]>([]);
    const [from, setFrom] = useState('');

    //点击历史记录填入数据
    const setPreForm = (row: { appInfo: any }) => {
        const res = _.cloneDeep(row.appInfo);
        detailRef.current = _.cloneDeep(res);
        const newValue = _.cloneDeep(res);
        newValue.workflowConfig.steps[newValue.workflowConfig.steps.length - 1].variable.variables.forEach((item: any) => {
            if (item.defaultValue && !item.value) {
                item.value = item.defaultValue;
            }
            if (item.field === 'CONTENT') {
                item.value = value;
            }
            detailRef.current = newValue;
            setPerform(perform + 1);
            setDetail(newValue);
        });
    };
    useEffect(() => {
        if (appList.length > 0) {
            setAppValue(appList[0].value);
            getDetail(appList[0].value);
        }
    }, [appList]);
    //点击获取执行详情
    const getDetail = async (data: string) => {
        const res = await marketDeatail({ uid: data });
        const result = await infoPageByMarketUid({ timeType: 'LAST_3M', pageNo: 1, pageSize: 20, marketUid: res.uid });
        setHistoryList(result.list);
        detailRef.current = _.cloneDeep(res);
        const newValue = _.cloneDeep(res);
        newValue.workflowConfig.steps[newValue.workflowConfig.steps.length - 1].variable.variables.forEach((item: any) => {
            if (item.defaultValue && !item.value) {
                item.value = item.defaultValue;
            }
            if (item.field === 'CONTENT') {
                item.value = value;
            }
        });
        detailRef.current = newValue;
        setDetail(newValue);
        setPerform(perform + 1);
    };
    //更改answer
    const changeanswer = ({ value, index }: any) => {
        const newValue = _.cloneDeep(detail);
        if (newValue.workflowConfig) {
            newValue.workflowConfig.steps[index].flowStep.response.answer = value;
        }
        detailRef.current = newValue;
        setDetail(newValue);
    };
    //设置执行的步骤的模型
    const exeChange = ({ e, steps, i }: any) => {
        const newValue = _.cloneDeep(detail);
        if (newValue.workflowConfig) {
            newValue.workflowConfig.steps[steps].variable.variables[i].value = e.value;
        }
        detailRef.current = _.cloneDeep(newValue);
        setDetail(newValue);
    };
    //设置执行步骤的参数
    const promptChange = async ({ e, steps, i, flag = false }: any) => {
        const newValue = _.cloneDeep(detailRef.current);
        if (flag) {
            newValue.workflowConfig.steps[steps].variable.variables[i].value = e.value;
        } else {
            newValue.workflowConfig.steps[steps].flowStep.variable.variables[i].value = e.value;
        }
        detailRef.current = _.cloneDeep(newValue);
        setDetail(newValue);
    };
    //是否全部执行
    let isAllExecute = false;
    //绘话id
    let conversationUid: undefined | string = undefined;
    //执行
    const changeData = (data: Execute) => {
        const { stepId, index }: { stepId: string; index: number } = data;
        const newValue = [...loadings];
        newValue[index] = true;
        if (!isAllExecute) {
            setLoadings(newValue);
        } else {
            const value: any[] = [];
            for (let i = index; i < detail.workflowConfig.steps.length; i++) {
                value[i] = true;
            }
            setLoadings(value);
        }
        const fetchData = async () => {
            let resp: any = await executeMarket({
                appUid: detail.uid,
                stepId: stepId,
                appReqVO: detailRef.current,
                scene: 'OPTIMIZE_PROMPT',
                conversationUid
            });

            const contentData = _.cloneDeep(detailRef.current);
            contentData.workflowConfig.steps[index].flowStep.response.answer = '';
            detailRef.current = _.cloneDeep(contentData);
            setDetail(contentData);
            const reader = resp.getReader();
            const textDecoder = new TextDecoder();
            let outerJoins: any;
            while (1) {
                let joins = outerJoins;
                const { done, value } = await reader.read();

                if (done) {
                    const newValue1 = [...loadings];
                    newValue1[index] = false;
                    setLoadings(newValue1);
                    const newShow = _.cloneDeep(isShows);
                    newShow[index] = true;
                    setIsShow(newShow);
                    allDetail?.setPre(allDetail?.pre + 1);
                    if (
                        isAllExecute &&
                        index < detail.workflowConfig.steps.length - 1 &&
                        detail.workflowConfig.steps[index + 1].flowStep.response.style !== 'BUTTON'
                    ) {
                        changeData({
                            index: index + 1,
                            stepId: detail.workflowConfig.steps[index + 1].field,
                            steps: detail.workflowConfig.steps[index + 1]
                        });
                    }
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
                        const newValue1 = [...loadings];
                        newValue1[index] = false;
                        setLoadings(newValue1);
                        if (!conversationUid && index === 0 && isAllExecute) {
                            conversationUid = bufferObj.conversationUid;
                        }
                        const contentData1 = _.cloneDeep(contentData);
                        contentData1.workflowConfig.steps[index].flowStep.response.answer =
                            detailRef.current.workflowConfig.steps[index].flowStep.response.answer + bufferObj.content;
                        detailRef.current = _.cloneDeep(contentData1);
                        setDetail(contentData1);
                    } else if (bufferObj?.code === 200 && bufferObj.type === 'ads-msg') {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: bufferObj.content,
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                },
                                close: false
                            })
                        );
                    } else if (bufferObj?.code === 2004008003) {
                        setFrom(`${bufferObj?.scene}_${bufferObj?.bizUid}`);
                        setTokenOpen(true);
                        const newValue1 = [...loadings];
                        newValue1[index] = false;
                        setLoadings(newValue1);
                        return;
                    } else if (bufferObj && bufferObj.code !== 200 && bufferObj.code !== 300900000) {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: t('market.warning'),
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                },
                                close: false
                            })
                        );
                    }
                });
                outerJoins = joins;
            }
        };
        fetchData();
    };
    //增加 删除 改变变量
    const changeConfigs = (data: any) => {
        detailRef.current = _.cloneDeep({
            ...detail,
            workflowConfig: data
        });
        setDetail(
            _.cloneDeep({
                ...detail,
                workflowConfig: data
            })
        );
    };
    const leftRef: any = useRef(null);
    const [leftHeight, setLeftHeight] = useState(0);
    useEffect(() => {}, [leftRef.current?.clientHeight]);
    return (
        <Modal
            open={open}
            onClose={() => {
                setOpen(false);
            }}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: 'fixed',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    width: '80%',
                    maxHeight: '80%'
                }}
            >
                <MainCard
                    sx={{ position: 'relative' }}
                    title={title}
                    content={false}
                    secondary={
                        <IconButton
                            onClick={() => {
                                setOpen(false);
                            }}
                            size="large"
                            aria-label="close modal"
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    <CardContent sx={{ p: '0 16px !important', maxHeight: 'calc(80vh - 85px)', overflowY: 'auto' }}>
                        <Grid container spacing={2}>
                            <Grid item md={6}>
                                <Box ref={leftRef}>
                                    <FormControl size="small" color="secondary" fullWidth sx={{ my: 2 }}>
                                        <InputLabel id="appList">优化选择</InputLabel>
                                        <Select
                                            color="secondary"
                                            labelId="appList"
                                            name="appValue"
                                            value={appValue}
                                            label="优化选择"
                                            onChange={(e) => {
                                                setAppValue(e.target.value);
                                                getDetail(e.target.value);
                                            }}
                                        >
                                            {appList.map((item) => (
                                                <MenuItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {perform > 0 && (
                                        <Perform
                                            config={_.cloneDeep(detailRef.current?.workflowConfig)}
                                            changeSon={changeData}
                                            changeConfigs={changeConfigs}
                                            changeanswer={changeanswer}
                                            loadings={loadings}
                                            isShows={isShows}
                                            variableChange={exeChange}
                                            promptChange={promptChange}
                                            key={perform}
                                            isallExecute={(flag: boolean) => {
                                                isAllExecute = flag;
                                            }}
                                            source="myApp"
                                        />
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={6}>
                                {historyList.length > 0 && perform > 0 && (
                                    <Box>
                                        <List
                                            key={leftRef.current.clientHeight}
                                            sx={{ ml: 4, overflowY: 'auto', height: leftRef.current?.clientHeight, minHeight: '500px' }}
                                        >
                                            {historyList.map((item) => (
                                                <div key={item.uid}>
                                                    <ListItem>
                                                        <ListItemButton
                                                            sx={{ display: 'flex', width: '100%' }}
                                                            onClick={() => {
                                                                setPreForm(item);
                                                            }}
                                                        >
                                                            <Box width="150px" whiteSpace="nowrap" mr={2}>
                                                                {formatDate(item.createTime)}
                                                            </Box>
                                                            <Box className="line-clamp-2">{item.answer}</Box>
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <Divider />
                                                </div>
                                            ))}
                                        </List>
                                    </Box>
                                )}
                                {historyList.length === 0 && (
                                    <Box height="100%" textAlign="center" display="flex" justifyContent="center" alignItems="center">
                                        <Box>
                                            <img width="100px" src={nothing} alt="" />
                                            <Typography color="#697586">暂无历史记录</Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                        <Box height="85px"></Box>
                        <Box sx={{ background: '#fff' }} position="absolute" bottom="0" right="0" width="100%">
                            <Divider />
                            <CardActions>
                                <Grid container justifyContent="flex-end" alignItems="center">
                                    <Typography sx={{ color: '#697586', fontSize: '0.75rem' }} mr={1}>
                                        (如果觉得AI生成的内容不错，可点击确定将自动把内容复制到页面对应的位置)
                                    </Typography>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            if (
                                                !detailRef.current?.workflowConfig.steps[detailRef.current.workflowConfig.steps.length - 1]
                                                    ?.flowStep.response.answer
                                            ) {
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: '无AI结果，无法插入',
                                                        variant: 'alert',
                                                        alert: {
                                                            color: 'error'
                                                        },
                                                        close: false,
                                                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                                        transition: 'SlideLeft'
                                                    })
                                                );
                                            } else {
                                                emits(
                                                    detailRef.current?.workflowConfig.steps[
                                                        detailRef.current.workflowConfig.steps.length - 1
                                                    ]?.flowStep.response.answer
                                                );
                                            }
                                        }}
                                    >
                                        确定
                                    </Button>
                                </Grid>
                            </CardActions>
                        </Box>
                    </CardContent>
                </MainCard>
                <PermissionUpgradeModal
                    from={from}
                    open={tokenOpen}
                    handleClose={() => setTokenOpen(false)}
                    title={'当前魔法豆不足，升级会员，立享五折优惠！'}
                />
            </Box>
        </Modal>
    );
};
export default AppModal;
