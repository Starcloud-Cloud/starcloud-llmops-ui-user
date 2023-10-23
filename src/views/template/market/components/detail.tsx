import { Typography, Breadcrumbs, Link, Box, Card, Chip, Divider, CircularProgress } from '@mui/material';
import { Image, Select } from 'antd';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {
    marketDeatail,
    metadata
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
import useCategory from 'hooks/useCategory';
import useUserStore from 'store/user';
import { PermissionUpgradeModal } from 'views/template/myChat/createChat/components/modal/permissionUpgradeModal';
interface Items {
    label: string;
    value: string;
}
interface AppModels {
    aiModel?: Items[];
    language?: Items[];
    type?: Items[];
}
function Deatail() {
    const ref = useRef<HTMLDivElement | null>(null);
    const { setUserInfo }: any = userInfoStore();
    const { categoryTrees } = marketStore();
    const { uid = '' } = useParams<{ uid?: string }>();
    const navigate = useNavigate();
    const [detailData, setDetailData] = useState<Details>(null as unknown as Details);
    const detailRef: any = useRef(null);
    //token不足
    const [tokenOpen, setTokenOpen] = useState(false);
    //类型 模型类型
    const [openUpgradeModel, setOpenUpgradeModel] = useState(false);
    const [appModels, setAppModel] = useState<AppModels>({});
    const [aiModels, setAiModels] = useState<string>('gpt-3.5-turbo');
    const aimodeRef = useRef('gpt-3.5-turbo');
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
                aiModel: aimodeRef.current,
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
            if (res) {
                const newRes = _.cloneDeep(res);
                const result = {
                    ...newRes,
                    workflowConfig: {
                        ...newRes.workflowConfig,
                        steps: newRes.workflowConfig.steps.map((item: any) => {
                            return {
                                ...item,
                                flowStep: {
                                    ...item.flowStep,
                                    response: {
                                        ...item.flowStep.response,
                                        defaultValue: item.flowStep.response.answer,
                                        answer: ''
                                    }
                                },
                                variable: item.variable
                                    ? {
                                          variables: item.variable?.variables.map((el: any) => {
                                              if (el.value) {
                                                  return {
                                                      ...el,
                                                      defaultValue: el.value,
                                                      value: ''
                                                  };
                                              } else {
                                                  return el;
                                              }
                                          })
                                      }
                                    : null
                            };
                        })
                    }
                };
                detailRef.current = result;
                setDetailData(result);
            }
        });
        metadata().then((res) => {
            setAppModel(res);
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
    const { Option } = Select;
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
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1, display: 'inline-block' }}>
                <Link sx={{ cursor: 'pointer' }} underline="hover" color="inherit" onClick={() => navigate('/appMarket')}>
                    {t('market.all')}
                </Link>
                <Link
                    color="secondary"
                    sx={{ cursor: 'pointer' }}
                    underline="hover"
                    onClick={() => {
                        console.log(detailData?.category);
                        if (detailData?.category.startsWith('SEO_WRITING')) {
                            navigate('/appMarket?category=SEO_WRITING');
                        } else if (detailData?.category.startsWith('SOCIAL_MEDIA')) {
                            navigate('/appMarket?category=SOCIAL_MEDIA');
                        } else {
                            navigate('/appMarket?category=' + detailData?.category?.split('_')[0]);
                        }
                    }}
                >
                    {useCategory(categoryTrees, detailData?.category)?.name}
                </Link>
            </Breadcrumbs>
            <Box display="flex" justifyContent="space-between" alignItems="end">
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
                            <span>#{useCategory(categoryTrees, detailData?.category)?.name}</span>
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
                {appModels.aiModel && (
                    <Select
                        style={{ width: 100, height: 23 }}
                        bordered={false}
                        className="rounded-2xl border-[0.5px] border-[#673ab7] border-solid"
                        rootClassName="modelSelect"
                        popupClassName="modelSelectPopup"
                        value={aiModels}
                        onChange={(value) => {
                            if (value === 'gpt-4' && !permissions.includes('app:execute:llm:gpt4')) {
                                setOpenUpgradeModel(true);
                                return;
                            }
                            aimodeRef.current = value;
                            setAiModels(value);
                        }}
                    >
                        {appModels.aiModel.map((item: any) => (
                            <Option key={item.value} value={item.value}>
                                {item.label}
                            </Option>
                        ))}
                    </Select>
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
            {openUpgradeModel && <PermissionUpgradeModal open={openUpgradeModel} handleClose={() => setOpenUpgradeModel(false)} />}
            {tokenOpen && (
                <PermissionUpgradeModal open={tokenOpen} handleClose={() => setTokenOpen(false)} title={'当前使用的魔法豆不足'} />
            )}
        </Card>
    );
}
export default Deatail;
