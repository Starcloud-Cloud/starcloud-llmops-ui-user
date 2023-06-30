import { Typography, Breadcrumbs, Link, Box, Card, Chip, Divider } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import AccessAlarm from '@mui/icons-material/AccessAlarm';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import StarIcon from '@mui/icons-material/Star';
// import StarBorderIcon from '@mui/icons-material/StarBorder';
import { marketDeatail, installTemplate } from 'api/template';
import { executeMarket } from 'api/template/fetch';
import CarryOut from 'views/template/carryOut';
import { Execute, Details } from 'types/template';

import { t } from 'hooks/web/useI18n';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
function Deatail() {
    const { uid = '' } = useParams<{ uid?: string }>();
    const navigate = useNavigate();
    const [detailData, setDetailData] = useState<Details>({} as Details);
    const [stepID, setStepID] = useState('');
    const [num, setNum] = useState<number | null>(null);
    const changeData = (data: Execute) => {
        const { stepId, index }: { stepId: string; index: number } = data;
        setStepID(stepId);
        setNum(index);
        setDetailData({
            ...detailData,
            workflowConfig: {
                steps: [
                    ...detailData.workflowConfig.steps.slice(0, index),
                    data.steps,
                    ...detailData.workflowConfig.steps.slice(index + 1, detailData.workflowConfig.steps.length)
                ]
            }
        });
    };
    useEffect(() => {
        const fetchData = async () => {
            if (!stepID || (!num && num !== 0)) return;
            let resp: any = await executeMarket({
                appUid: uid,
                stepId: stepID,
                appReqVO: detailData
            });
            setStepID('');
            setNum(null);
            const reader = resp.getReader();
            const textDecoder = new TextDecoder();
            while (1) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                const str = textDecoder.decode(value);
                setDetailData({
                    ...detailData,
                    workflowConfig: {
                        steps: [
                            ...detailData.workflowConfig.steps.slice(0, num),
                            {
                                ...detailData.workflowConfig.steps[num],
                                flowStep: {
                                    ...detailData.workflowConfig.steps[num].flowStep,
                                    response: {
                                        ...detailData.workflowConfig.steps[num].flowStep.response,
                                        answer: str
                                    }
                                }
                            },
                            ...detailData.workflowConfig.steps.slice(num + 1, detailData.workflowConfig.steps.length)
                        ]
                    }
                });
            }
        };
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [num, stepID, detailData.workflowConfig?.steps]);
    const [loading, setLoading] = useState(false);
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
    const install = () => {
        setLoading(true);
        installTemplate({ uid }).then((res) => {
            if (res.data) {
                setLoading(false);
                setDetailData({
                    ...detailData,
                    installStatus: { installStatus: 'INSTALLED' }
                });
            }
        });
    };
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
                            {detailData.categories && detailData.categories.map((item: any) => <span key={item}>#{item}</span>)}
                            {detailData.scenes &&
                                detailData.scenes.map((el: any) => (
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
                <LoadingButton
                    color="info"
                    disabled={detailData.installStatus?.installStatus === 'INSTALLED'}
                    onClick={install}
                    loading={loading}
                    loadingIndicator="downLoad..."
                    variant="outlined"
                >
                    {detailData.installStatus?.installStatus === 'UNINSTALLED' ? t('market.down') : t('market.ins')}
                </LoadingButton>
            </Box>
            <Divider sx={{ my: 1 }} />
            <CarryOut config={detailData} changeData={changeData} />
        </Card>
    );
}
export default Deatail;
