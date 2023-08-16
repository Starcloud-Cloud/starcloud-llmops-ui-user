import { Typography, Breadcrumbs, Link, Box, Card, Chip, Divider, CircularProgress } from '@mui/material';

import AccessAlarm from '@mui/icons-material/AccessAlarm';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {
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
function Deatail() {
    const ref = useRef<HTMLDivElement | null>(null);
    const { setUserInfo }: any = userInfoStore();
    const { uid = '' } = useParams<{ uid?: string }>();
    const navigate = useNavigate();
    const [detailData, setDetailData] = useState<Details>(null as unknown as Details);
    const detailRef: any = useRef(null);
    //执行loading
    const [loadings, setLoadings] = useState<any[]>([]);
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
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: t('market.error'),
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            },
                            close: false
                        })
                    );
                    const newValue1 = [...loadings];
                    newValue1[index] = false;
                    setLoadings(newValue1);
                    return;
                }
                if (done) {
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
                const newValue1 = [...loadings];
                newValue1[index] = false;
                setLoadings(newValue1);
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
                    if (bufferObj?.code === 200) {
                        if (!conversationUid && index === 0 && isAllExecute) {
                            conversationUid = bufferObj.conversationUid;
                        }
                        const contentData1 = _.cloneDeep(contentData);
                        contentData.workflowConfig.steps[index].flowStep.response.answer =
                            contentData.workflowConfig.steps[index].flowStep.response.answer + bufferObj.content;
                        contentData1.workflowConfig.steps[index].flowStep.response.answer =
                            contentData.workflowConfig.steps[index].flowStep.response.answer + bufferObj.content;
                        detailRef.current = contentData1;
                        setDetailData(contentData1);
                    } else if (bufferObj && bufferObj.code !== 200) {
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
                <Typography color="text.primary">
                    {categoryList?.find((el: { code: string }) => el.code === (detailData?.categories && detailData?.categories[0]))?.name}
                </Typography>
            </Breadcrumbs>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <AccessAlarm sx={{ fontSize: '70px' }} />
                    <Box>
                        <Box>
                            <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                                {detailData?.name}
                            </Typography>
                        </Box>
                        <Box>
                            {detailData?.categories?.map((item: any) => (
                                <span key={item}>#{categoryList?.find((el: { code: string }) => el.code === item).name}</span>
                            ))}
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
            </Box>
            <Divider sx={{ mb: 1, borderColor: isDarkMode ? '#bdc8f0' : '#ccc' }} />
            <CarryOut
                config={detailData}
                changeData={changeData}
                variableChange={variableChange}
                promptChange={promptChange}
                loadings={loadings}
                changeanswer={changeanswer}
                allExecute={(value: boolean) => {
                    isAllExecute = value;
                }}
            />
        </Card>
    );
}
export default Deatail;
