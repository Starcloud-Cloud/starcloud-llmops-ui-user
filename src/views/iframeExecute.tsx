import Perform from './template/carryOut/perform';
import { Card, Box, Chip, Divider, Typography } from '@mui/material';
import { Image } from 'antd';
import { useState, useEffect, useRef, useMemo } from 'react';
import { appDetail, appExecute } from 'api/template/share';
import _ from 'lodash-es';
import { t } from 'hooks/web/useI18n';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useLocation, useParams } from 'react-router-dom';
import { PermissionUpgradeModal } from 'views/template/myChat/createChat/components/modal/permissionUpgradeModal';
interface Details {
    name?: string;
    description?: string;
    categories?: string[];
    icon?: string;
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
const IframeExecute = () => {
    const location = useLocation();
    const params = useParams();
    const searchParams = new URLSearchParams(location.search);
    const url = window.location.href;
    const pattern = /\/([^/]+)\/[^/]+$/;
    const match = url.match(pattern);

    const extractedPart = (match && match[1]) || '';

    const statisticsMode = useMemo(() => {
        switch (extractedPart) {
            case 'app_i':
                return 'SHARE_IFRAME';
            case 'app_js':
                return 'SHARE_JS';
            case 'app_web':
                return 'SHARE_WEB';
            default:
                return '';
        }
    }, [extractedPart]);
    const [detail, setDetail] = useState<Details>({
        workflowConfig: {
            steps: []
        }
    });
    const detailRef: any = useRef(null);
    //token不足
    const [tokenOpen, setTokenOpen] = useState(false);
    const [from, setFrom] = useState('');
    const [loadings, setLoadings] = useState<any[]>([]);
    //是否显示分享翻译
    const [isShows, setIsShow] = useState<any[]>([]);
    //类别列表
    const [categoryList, setCategoryList] = useState<any[]>([]);
    useEffect(() => {
        getList();
    }, []);
    const getList = () => {
        appDetail(params.mediumUid).then((res: any) => {
            detailRef.current = _.cloneDeep(res);
            setDetail(res);
        });
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
            let resp: any = await appExecute({
                scene: statisticsMode,
                mediumUid: params.mediumUid,
                stepId: stepId,
                appReqVO: detailRef.current,
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
    return (
        <Card elevation={2} sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                    {detail?.icon && (
                        <Image
                            preview={false}
                            className="rounded-lg overflow-hidden"
                            height={60}
                            src={require('../assets/images/category/' + detail?.icon + '.svg')}
                        />
                    )}
                    <Box>
                        <Box>
                            <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                                {detail?.name}
                            </Typography>
                        </Box>
                        <Box>
                            {detail?.categories?.map((item: any) => (
                                <span key={item}>#{categoryList?.find((el: { code: string }) => el.code === item)?.name}</span>
                            ))}
                            {detail?.tags?.map((el: any) => (
                                <Chip key={el} sx={{ marginLeft: 1 }} size="small" label={el} variant="outlined" />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h5" sx={{ fontSize: '1.1rem', mb: 3 }}>
                {detail?.description}
            </Typography>
            <Perform
                config={_.cloneDeep(detailRef.current?.workflowConfig)}
                changeSon={changeData}
                changeConfigs={changeConfigs}
                changeanswer={changeanswer}
                loadings={loadings}
                isShows={isShows}
                variableChange={exeChange}
                promptChange={promptChange}
                isallExecute={(flag: boolean) => {
                    isAllExecute = flag;
                }}
                source="myApp"
            />
            <PermissionUpgradeModal
                from={from}
                open={tokenOpen}
                handleClose={() => setTokenOpen(false)}
                title={'当前魔法豆不足，升级会员，立享五折优惠！'}
            />
        </Card>
    );
};
export default IframeExecute;
