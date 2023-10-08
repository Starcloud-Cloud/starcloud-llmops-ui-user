import { Typography, Breadcrumbs, Link, Box, Card, Chip, Divider, CircularProgress, Button } from '@mui/material';
import { Image, Popconfirm } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {
    delMarket,
    marketDeatail
    // installTemplate
} from 'api/template';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { executeMarket } from 'api/template/fetch';
import CarryOut from 'views/template/carryOut';
import { Execute, Details } from 'types/template';
import marketStore from 'store/market';
import { t } from 'hooks/web/useI18n';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { userBenefits } from 'api/template';
import userInfoStore from 'store/entitlementAction';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash-es';
import useUserStore from 'store/user';
import { PermissionUpgradeModal } from 'views/template/myChat/createChat/components/modal/permissionUpgradeModal';
function Deatail() {
    const ref = useRef<HTMLDivElement | null>(null);
    const { setUserInfo }: any = userInfoStore();
    const { uid = '' } = useParams<{ uid?: string }>();
    const navigate = useNavigate();
    const [detailData, setDetailData] = useState<Details>(null as unknown as Details);
    const detailRef: any = useRef(null);
    //token不足
    const [tokenOpen, setTokenOpen] = useState(false);
    //执行loading
    const [loadings, setLoadings] = useState<any[]>([]);
    //是否显示分享翻译
    const [isShows, setIsShow] = useState<any[]>([]);
    let isAllExecute = false;
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
            for (let i = index; i < detailData.workflowConfig.steps.length; i++) {
                value[i] = true;
            }
            setLoadings(value);
        }
        const fetchData = async () => {
            let resp: any = await executeMarket({
                appUid: uid,
                stepId: stepId,
                appReqVO: detailRef.current,
                conversationUid
            });
            const contentData = _.cloneDeep(detailRef.current);
            contentData.workflowConfig.steps[index].flowStep.response.answer = '';
            detailRef.current = contentData;
            setDetailData(contentData);
            const reader = resp.getReader();
            const textDecoder = new TextDecoder();
            let outerJoins: any;
            while (1) {
                let joins = outerJoins;
                const { done, value } = await reader.read();
                if (textDecoder.decode(value).includes('2008002007')) {
                    setTokenOpen(true);
                    const newValue1 = [...loadings];
                    newValue1.forEach((item) => {
                        item = false;
                    });
                    setLoadings(newValue1);
                    return;
                }
                if (done) {
                    const newValue1 = [...loadings];
                    newValue1[index] = false;
                    setLoadings(newValue1);
                    const newShow = _.cloneDeep(isShows);
                    newShow[index] = true;
                    setIsShow(newShow);
                    userBenefits().then((res) => {
                        setUserInfo(res);
                    });
                    if (
                        isAllExecute &&
                        index < detailData.workflowConfig.steps.length - 1 &&
                        detailData.workflowConfig.steps[index + 1].flowStep.response.style !== 'BUTTON'
                    ) {
                        changeData({
                            index: index + 1,
                            stepId: detailData.workflowConfig.steps[index + 1].field,
                            steps: detailData.workflowConfig.steps[index + 1]
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
                        const newValue1 = _.cloneDeep(loadings);
                        newValue1[index] = false;
                        setLoadings(newValue1);
                        if (!conversationUid && index === 0 && isAllExecute) {
                            conversationUid = bufferObj.conversationUid;
                        }
                        const contentData1 = _.cloneDeep(contentData);
                        contentData1.workflowConfig.steps[index].flowStep.response.answer =
                            detailRef.current.workflowConfig.steps[index].flowStep.response.answer + bufferObj.content;
                        detailRef.current = contentData1;
                        setDetailData(contentData1);
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
    //更改answer
    const changeanswer = ({ value, index }: any) => {
        const newValue = _.cloneDeep(detailData);
        newValue.workflowConfig.steps[index].flowStep.response.answer = value;
        detailRef.current = newValue;
        setDetailData(newValue);
    };
    //设置执行的prompt
    const promptChange = ({ e, steps, i, flag = false }: any) => {
        const newValue = _.cloneDeep(detailRef.current);
        if (flag) {
            newValue.workflowConfig.steps[steps].variable.variables[i].value = e.value;
        } else {
            newValue.workflowConfig.steps[steps].flowStep.variable.variables[i].value = e.value;
        }
        detailRef.current = newValue;
        setDetailData(newValue);
    };
    //更改变量的值
    const variableChange = ({ e, steps, i }: any) => {
        const newValue = _.cloneDeep(detailData);
        newValue.workflowConfig.steps[steps].variable.variables[i].value = e.value;
        detailRef.current = newValue;
        setDetailData(newValue);
    };
    //增加 删除 改变变量
    const changeConfigs = (data: any) => {
        detailRef.current = _.cloneDeep({
            ...detailData,
            workflowConfig: data
        });
        setDetailData(
            _.cloneDeep({
                ...detailData,
                workflowConfig: data
            })
        );
    };
    useEffect(() => {
        marketDeatail({ uid }).then((res: any) => {
            setAllLoading(false);
            detailRef.current = res;
            setDetailData(res);
        });
        if (ref.current !== null && ref.current.parentNode !== null) {
            const top: any = ref.current.parentNode;
            setTimeout(() => {
                top.scrollTop = 286;
            }, 100);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const permissions = useUserStore((state) => state.permissions);
    //删除模板
    const delTemplate = async () => {
        const res = await delMarket(detailData.uid);
        navigate('/appMarket/list');
        dispatch(
            openSnackbar({
                open: true,
                message: '删除成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                close: false
            })
        );
    };
    // const iconStyle = {
    //     fontSize: '16px',
    //     display: 'inline-block',
    //     margin: '0 8px 0 4px'
    // };
    //下载模板
    // const [loading, setLoading] = useState(false);
    // const install = () => {
    //     setLoading(true);
    //     installTemplate({ uid }).then((res) => {
    //         if (res.data) {
    //             setLoading(false);
    // detailRef.current = {
    //                 ...detailData,
    //                 installStatus: { installStatus: 'INSTALLED' }
    //             }
    //             setDetailData({
    //                 ...detailData,
    //                 installStatus: { installStatus: 'INSTALLED' }
    //             });
    //         }
    //     });
    // };
    //页面进入loading
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [allLoading, setAllLoading] = useState(true);
    //过滤出category
    const categoryList = marketStore((state) => state.categoryList);
    return (
        <Card ref={ref} elevation={2} sx={{ padding: 2, position: 'relative' }}>
            {allLoading && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: !isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.4)',
                        zIndex: 100
                    }}
                >
                    <CircularProgress />
                </div>
            )}
            <Breadcrumbs aria-label="breadcrumb">
                <Link sx={{ cursor: 'pointer' }} underline="hover" color="inherit" onClick={() => navigate('/appMarket/list')}>
                    {t('market.all')}
                </Link>
                <Typography color="text.primary">{detailData?.category}</Typography>
            </Breadcrumbs>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                    {detailData?.icon && (
                        <Image
                            preview={false}
                            className="rounded-lg overflow-hidden"
                            height={60}
                            src={require('../../../../assets/images/category/' + detailData?.icon + '.svg')}
                        />
                    )}
                    <Box>
                        <Box>
                            <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                                {detailData?.name}
                            </Typography>
                        </Box>
                        <Box>
                            <span>#{detailData?.category}</span>
                            {detailData?.tags?.map((el: any) => (
                                <Chip key={el} sx={{ marginLeft: 1 }} size="small" label={el} variant="outlined" />
                            ))}
                        </Box>
                        {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <RemoveRedEyeIcon fontSize="small" />
                            <span style={iconStyle}>{detailData?.viewCount}</span>
                            <VerticalAlignBottomIcon fontSize="small" />
                            <span style={iconStyle}>{detailData?.installCount}</span>
                            <ThumbUpIcon fontSize="small" />
                            <span style={iconStyle}>{detailData?.likeCount}</span>
                        </Box> */}
                    </Box>
                </Box>
                {/* <LoadingButton
                    color="info"
                    disabled={detailData.installStatus?.installStatus === 'INSTALLED'}
                    onClick={install}
                    loading={loading}
                    loadingIndicator="downLoad..."
                    variant="outlined"
                >
                    {detailData.installStatus?.installStatus === 'UNINSTALLED' ? t('market.down') : t('market.ins')}
                </LoadingButton> */}
                {permissions.includes('app:market:delete') && (
                    <Popconfirm placement="top" title="请再次确认是否删除" onConfirm={delTemplate} okText="Yes" cancelText="No">
                        <Button
                            startIcon={<DeleteIcon fontSize="small" />}
                            variant="outlined"
                            className="absolute top-[16px] right-[16px]"
                            color="error"
                        >
                            删除模板
                        </Button>
                    </Popconfirm>
                )}
            </Box>
            <Divider sx={{ my: 1, borderColor: isDarkMode ? '#bdc8f0' : '#ccc' }} />
            <CarryOut
                config={detailData}
                isShows={isShows}
                changeConfigs={changeConfigs}
                changeData={changeData}
                variableChange={variableChange}
                promptChange={promptChange}
                loadings={loadings}
                changeanswer={changeanswer}
                allExecute={(value: boolean) => {
                    isAllExecute = value;
                }}
            />
            <PermissionUpgradeModal open={tokenOpen} handleClose={() => setTokenOpen(false)} title={'当前使用的令牌不足'} />
        </Card>
    );
}
export default Deatail;
