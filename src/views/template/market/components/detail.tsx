import { Typography, Breadcrumbs, Link, Box, Card, Chip, Divider, CircularProgress } from '@mui/material';
// import LoadingButton from '@mui/lab/LoadingButton';

import AccessAlarm from '@mui/icons-material/AccessAlarm';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import StarIcon from '@mui/icons-material/Star';
// import StarBorderIcon from '@mui/icons-material/StarBorder';
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
import { useEffect, useState } from 'react';
import { userBenefits } from 'api/template';
import userInfoStore from 'store/entitlementAction';
import { useTheme } from '@mui/material/styles';
function Deatail() {
    const { setUserInfo }: any = userInfoStore();
    const { uid = '' } = useParams<{ uid?: string }>();
    const navigate = useNavigate();
    const [detailData, setDetailData] = useState<Details>({} as Details);
    //执行loading
    const [loadings, setLoadings] = useState<any[]>([]);
    const [isAllExecute, setIsAllExecute] = useState<boolean>(false);
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
        setDetailData((oldValue) => {
            const newData = {
                ...oldValue,
                workflowConfig: {
                    steps: [
                        ...oldValue.workflowConfig.steps.slice(0, index),
                        data.steps,
                        ...oldValue.workflowConfig.steps.slice(index + 1, oldValue.workflowConfig.steps.length)
                    ]
                }
            };
            const fetchData = async () => {
                let resp: any = await executeMarket({
                    appUid: uid,
                    stepId: stepId,
                    appReqVO: newData
                });
                setDetailData({
                    ...newData,
                    workflowConfig: {
                        steps: [
                            ...newData.workflowConfig.steps.slice(0, index),
                            {
                                ...newData.workflowConfig.steps[index],
                                flowStep: {
                                    ...newData.workflowConfig.steps[index].flowStep,
                                    response: {
                                        ...newData.workflowConfig.steps[index].flowStep.response,
                                        answer: ''
                                    }
                                }
                            },
                            ...newData.workflowConfig.steps.slice(index + 1, newData.workflowConfig.steps.length)
                        ]
                    }
                });
                const reader = resp.getReader();
                const textDecoder = new TextDecoder();
                while (1) {
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
                            index < newData.workflowConfig.steps.length - 1 &&
                            newData.workflowConfig.steps[index + 1].flowStep.response.style !== 'BUTTON'
                        ) {
                            changeData({
                                index: index + 1,
                                stepId: newData.workflowConfig.steps[index + 1].field,
                                steps: newData.workflowConfig.steps[index + 1]
                            });
                        }
                        break;
                    }
                    const newValue1 = [...loadings];
                    newValue1[index] = false;
                    setLoadings(newValue1);
                    let str = textDecoder.decode(value);
                    setDetailData({
                        ...newData,
                        workflowConfig: {
                            steps: [
                                ...newData.workflowConfig.steps.slice(0, index),
                                {
                                    ...newData.workflowConfig.steps[index],
                                    flowStep: {
                                        ...newData.workflowConfig.steps[index].flowStep,
                                        response: {
                                            ...newData.workflowConfig.steps[index].flowStep.response,
                                            answer: newData.workflowConfig.steps[index].flowStep.response.answer + str
                                        }
                                    }
                                },
                                ...newData.workflowConfig.steps.slice(index + 1, newData.workflowConfig.steps.length)
                            ]
                        }
                    });
                    // if (str.includes('&error&')) {
                    //     str = '';
                    // } else if (str.includes('&start&')) {
                    //     str = str.split('&start&')[1];
                    // } else if (str.includes('&end&')) {
                    //     str = str.split('&start&')[1].split('&end&')[0];
                    // }
                }
            };
            fetchData();
            return newData;
        });
    };
    useEffect(() => {
        marketDeatail({ uid }).then((res: any) => {
            setAllLoading(false);
            setDetailData(res);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const iconStyle = {
        fontSize: '16px',
        display: 'inline-block',
        margin: '0 8px 0 4px'
    };
    //下载模板
    // const [loading, setLoading] = useState(false);
    // const install = () => {
    //     setLoading(true);
    //     installTemplate({ uid }).then((res) => {
    //         if (res.data) {
    //             setLoading(false);
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
        <Card elevation={2} sx={{ padding: 2, position: 'relative' }}>
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
            <Breadcrumbs sx={{ padding: 2 }} aria-label="breadcrumb">
                <Link sx={{ cursor: 'pointer' }} underline="hover" color="inherit" onClick={() => navigate('/appMarket/list')}>
                    {t('market.all')}
                </Link>
                <Typography color="text.primary">
                    {categoryList?.find((el: { code: string }) => el.code === (detailData.categories && detailData.categories[0]))?.name}
                </Typography>
            </Breadcrumbs>
            <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <AccessAlarm sx={{ fontSize: '80px' }} />
                    <Box>
                        <Box>
                            <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                                {detailData.name}
                            </Typography>
                        </Box>
                        <Box my={0.5}>
                            {detailData.categories &&
                                detailData.categories.map((item: any) => (
                                    <span key={item}>#{categoryList?.find((el: { code: string }) => el.code === item).name}</span>
                                ))}
                            {detailData.tags &&
                                detailData.tags.map((el: any) => (
                                    <Chip key={el} sx={{ marginLeft: 1 }} size="small" label={el} variant="outlined" />
                                ))}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <RemoveRedEyeIcon fontSize="small" />
                            <span style={iconStyle}>{detailData.viewCount}</span>
                            <VerticalAlignBottomIcon fontSize="small" />
                            <span style={iconStyle}>{detailData.installCount}</span>
                            <ThumbUpIcon fontSize="small" />
                            <span style={iconStyle}>{detailData.likeCount}</span>
                        </Box>
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
            <Divider sx={{ my: 1 }} />
            <CarryOut
                config={detailData}
                changeData={changeData}
                loadings={loadings}
                allExecute={(value: boolean) => {
                    setIsAllExecute(value);
                }}
            />
        </Card>
    );
}
export default Deatail;
