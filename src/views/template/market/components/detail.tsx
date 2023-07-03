import { Typography, Breadcrumbs, Link, Box, Card, Chip, Divider } from '@mui/material';
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
import { executeMarket } from 'api/template/fetch';
import CarryOut from 'views/template/carryOut';
import { Execute, Details } from 'types/template';
import marketStore from 'store/market';
import { t } from 'hooks/web/useI18n';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
function Deatail() {
    const { categoryList } = marketStore();
    const { uid = '' } = useParams<{ uid?: string }>();
    const navigate = useNavigate();
    const [detailData, setDetailData] = useState<Details>({} as Details);
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
                const reader = resp.getReader();
                const textDecoder = new TextDecoder();
                while (1) {
                    const { done, value } = await reader.read();
                    if (done) {
                        if (isAllExecute && index < newData.workflowConfig.steps.length - 1) {
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
                    // if (str.includes('&error&')) {
                    //     str = '';
                    // } else if (str.includes('&start&')) {
                    //     str = str.split('&start&')[1];
                    // } else if (str.includes('&end&')) {
                    //     str = str.split('&start&')[1].split('&end&')[0];
                    // }
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
                                            answer: str
                                        }
                                    }
                                },
                                ...newData.workflowConfig.steps.slice(index + 1, newData.workflowConfig.steps.length)
                            ]
                        }
                    });
                }
            };
            fetchData();
            return newData;
        });
    };
    useEffect(() => {
        marketDeatail({ uid }).then((res: any) => {
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
    return (
        <Card elevation={2} sx={{ padding: 2 }}>
            <Breadcrumbs sx={{ padding: 2 }} aria-label="breadcrumb">
                <Link
                    sx={{ cursor: 'pointer' }}
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate('/template/templateMarket/list')}
                >
                    {t('market.all')}
                </Link>
                <Typography color="text.primary">Breadcrumbs</Typography>
            </Breadcrumbs>
            <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <AccessAlarm sx={{ fontSize: '80px' }} />
                    <Box>
                        <Box>
                            <Typography variant="h2">{detailData.name}</Typography>
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
