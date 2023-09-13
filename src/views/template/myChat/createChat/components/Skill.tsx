import { InboxOutlined } from '@ant-design/icons';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    Chip,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    MenuItem,
    Modal,
    Select,
    Stack,
    Switch,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import { Popover, Upload, UploadProps } from 'antd';
import workWechatPay from 'assets/images/landing/work_wechat_pay.png';
import React, { useEffect, useState } from 'react';
import { gridSpacing } from 'store/constant';
import { TabsProps } from 'types';
import MainCard from 'ui-component/cards/MainCard';
import { IChatInfo } from '../index';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { getListAll, getSkillList, modifySkill, skillCreate } from 'api/chat';
import { useLocation, useNavigate } from 'react-router-dom';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddIcon from '@mui/icons-material/Add';
import SkillCard from './SkillCard';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import SearchIcon from '@mui/icons-material/Search';
import SkillWorkflowCard from './SkillWorkflowCard';
import imgLoading from 'assets/images/picture/loading.gif';
import InfiniteScroll from 'react-infinite-scroll-component';
import _ from 'lodash';
import { UpgradeSkillModel } from './modal/upgradeSkillModel';
import useUserStore from 'store/user';
import { SkillUpgradeOnline } from './modal/skillUpgradeOnline';

const WorkflowEditModal = ({
    open,
    handleClose,
    workflowCurrentRecord,
    forceUpdate
}: {
    open: boolean;
    handleClose: () => void;
    workflowCurrentRecord: any;
    forceUpdate: () => void;
}) => {
    useEffect(() => {
        formik.setValues({
            ...workflowCurrentRecord,
            desc: workflowCurrentRecord.description,
            copyWriting: workflowCurrentRecord.copyWriting
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
            desc: '',
            copyWriting: ''
        },
        validationSchema: yup.object({
            name: yup.string().max(50, '技能名称最多50个字').required('技能名称是必填的'),
            desc: yup.string().max(200, '技能描述最多200个字').required('技能描述是必填的')
        }),
        onSubmit: (values: any) => {
            const data: any = {
                uid: values.uid,
                type: values.type,
                appConfigId: values.appConfigId,
                disabled: values.disabled
            };
            if (data.type === 5) {
                data.systemHandlerSkillDTO = {
                    name: values.name,
                    desc: values.desc,
                    copyWriting: values.copyWriting,
                    code: values.code,
                    icon: values.images
                };
            }
            if (data.type === 3) {
                data.appWorkflowSkillDTO = {
                    name: values.name,
                    desc: values.desc,
                    copyWriting: values.copyWriting,
                    skillAppUid: values.skillAppUid,
                    icon: values.images,
                    appType: values?.appType,
                    defaultPromptDesc: values.defaultPromptDesc
                };
            }

            modifySkill(data).then((res) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '修改成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
                handleClose();
                forceUpdate();
            });
        }
    });

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    width: '800px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title="编辑技能"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <form>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    label={'技能名称'}
                                    fullWidth
                                    id="name"
                                    name="name"
                                    color="secondary"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && (formik.errors.name as string)}
                                    disabled={workflowCurrentRecord.type === 5}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    label={'技能描述'}
                                    multiline
                                    fullWidth
                                    id="desc"
                                    name="desc"
                                    color="secondary"
                                    value={formik.values.desc}
                                    onChange={formik.handleChange}
                                    error={formik.touched.desc && Boolean(formik.errors.desc)}
                                    helperText={formik.touched.desc && (formik.errors.desc as string)}
                                    disabled={workflowCurrentRecord.type === 5}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    label={'提示文案'}
                                    fullWidth
                                    id="copyWriting"
                                    name="copyWriting"
                                    color="secondary"
                                    value={formik.values.copyWriting}
                                    onChange={formik.handleChange}
                                    error={formik.touched.copyWriting && Boolean(formik.errors.copyWriting)}
                                    helperText={formik.touched.copyWriting && (formik.errors.copyWriting as string)}
                                    disabled={workflowCurrentRecord.type === 5}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="outlined" onClick={() => handleClose()} className="mr-2">
                            取消
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            type={'submit'}
                            disabled={workflowCurrentRecord.type === 5}
                            onClick={() => formik.handleSubmit()}
                        >
                            保存
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};

const WorkflowCreateModal = ({
    open,
    handleClose,
    forceUpdate,
    workflowList,
    setSkillCountVisible
}: {
    open: boolean;
    handleClose: () => void;
    forceUpdate: () => void;
    setSkillCountVisible: (skillCountVisible: boolean) => void;
    workflowList: any[];
}) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const appId = searchParams.get('appId');
    const permissions = useUserStore((state) => state.permissions);

    const [list, setList] = useState<any[]>([]);
    const [selectType, setSelectType] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [pageData, setPageData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [skillUpgradeOnline, setSkillUpgradeOnline] = useState(false);

    useEffect(() => {
        (async () => {
            const list = await getListAll();
            const appRespList = list.appRespList.map((item: any) => ({ ...item, images: item.images?.[0] }));
            const marketRespList = list.marketRespList.map((item: any) => ({ ...item, type: 'market', images: item.images?.[0] }));
            const systemSkill = list.systemSkill?.map((item: any) => ({
                name: item.name,
                description: item.desc,
                images: item.icon,
                code: item.code,
                type: item.type,
                usage: item.usage
            }));
            // setList([...systemSkill, ...marketRespList, ...appRespList]);
            setList([...systemSkill]);
        })();
    }, []);

    const filterList = React.useMemo(() => {
        setLoading(true);
        if (list.length) {
            let data = [];
            if (selectType === 1) {
                data = list;
            }
            if (selectType === 2) {
                // 系统通过code判断
                data = list.filter((item) => item.type === 'system');
            }
            if (selectType === 3) {
                data = list.filter((item) => item.type === 'market');
            }
            if (selectType === 4) {
                data = list.filter((item) => item.type === 'MYSELF');
            }
            setLoading(false);
            return data.filter((item) => item.name.includes(searchValue)) || [];
        }
    }, [selectType, list, searchValue, setLoading]);

    useEffect(() => {
        setPageData(filterList?.slice(0, 20) || []);
        setPage(2);
    }, [filterList]);

    const fetchMoreData = () => {
        if (setPageData.length >= filterList!.length) {
            setHasMore(false);
            return;
        }
        setTimeout(() => {
            setPageData(filterList?.slice(0, 20 * page) || []);
            setPage(page + 1);
        }, 100);
    };

    const handleCreate = async (item: any) => {
        if (!permissions.includes('chat:config:skills')) {
            setSkillUpgradeOnline(true);
            return;
        }
        if (workflowList?.length >= 3) {
            setSkillCountVisible(true);
            return;
        }

        let data: any = {};
        data.appConfigId = appId;
        data.type = item.type === 'system' ? 5 : 3;
        data.disabled = false;
        if (data.type === 5) {
            data.systemHandlerSkillDTO = {
                name: item.name,
                desc: item.description,
                code: item.code,
                icon: item.images
                // usage: item.usage
            };
        }
        if (data.type === 3) {
            data.appWorkflowSkillDTO = {
                name: item.name,
                desc: item.description,
                skillAppUid: item.uid,
                icon: item.images,
                defaultPromptDesc: '',
                appType: item.type === 'market' ? 1 : 0 //"appType": 0 我的应用 1：应用市场 -> type 3
            };
        }

        await skillCreate(data);
        dispatch(
            openSnackbar({
                open: true,
                message: '添加成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                close: false
            })
        );
        // handleClose();
        forceUpdate();
    };

    return (
        <>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
                <MainCard
                    style={{
                        position: 'absolute',
                        width: '920px',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                    title="新增技能"
                    content={false}
                    secondary={
                        <IconButton onClick={handleClose} size="large" aria-label="close modal">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    <CardContent sx={{ p: 2 }}>
                        <div className="flex justify-between items-baseline">
                            <Stack direction="row" spacing={1} className="mb-3">
                                <Chip
                                    label="全部"
                                    color={selectType === 1 ? 'secondary' : 'default'}
                                    variant="filled"
                                    className="w-[80px] cursor-pointer"
                                    onClick={() => setSelectType(1)}
                                />
                                <Chip
                                    label="系统"
                                    color={selectType === 2 ? 'secondary' : 'default'}
                                    variant="filled"
                                    className="w-[80px] cursor-pointer"
                                    onClick={() => setSelectType(2)}
                                />
                                <Chip
                                    label="应用市场"
                                    color={selectType === 3 ? 'secondary' : 'default'}
                                    variant="filled"
                                    className="w-[80px] cursor-pointer"
                                    onClick={() => setSelectType(3)}
                                />
                                <Chip
                                    label="我的应用"
                                    color={selectType === 4 ? 'secondary' : 'default'}
                                    variant="filled"
                                    className="w-[80px] cursor-pointer"
                                    onClick={() => setSelectType(4)}
                                />
                            </Stack>
                            <TextField
                                size="small"
                                id="filled-start-adornment"
                                sx={{ width: '300px', ml: 2 }}
                                placeholder={'搜索应用'}
                                name="name"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </div>
                        {loading && (
                            <div className="flex justify-center items-center w-full h-[545px]">
                                <img width={60} src={imgLoading} alt="loading" />
                            </div>
                        )}
                        {(selectType === 2 || selectType === 1) && !loading && (
                            <InfiniteScroll
                                dataLength={pageData.length}
                                next={fetchMoreData}
                                hasMore={hasMore}
                                loader={<></>}
                                height={545}
                                className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-[545px] overflow-y-auto mt-[8px]"
                            >
                                {pageData?.map((item: any, index: number) => (
                                    <Box key={index} className="w-full relative">
                                        <SkillCard data={item} handleCreate={handleCreate} workflowList={workflowList} />
                                    </Box>
                                ))}
                            </InfiniteScroll>
                        )}
                        {(selectType === 3 || selectType === 4) && (
                            <div className="h-[545px] mt-[8px] flex justify-center items-center flex-col">
                                <Popover
                                    zIndex={9999}
                                    content={
                                        <div className="flex justify-start items-center flex-col">
                                            <div className="text-sm text-center w-[330px]">
                                                <div>功能正在封闭测试中。</div>
                                                <div>可联系我们产品顾问进一步了解，</div>
                                                <div>并获得提前免费使用的权利。</div>
                                            </div>
                                            <img className="w-40" src={workWechatPay} alt="" />
                                        </div>
                                    }
                                    trigger="hover"
                                >
                                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="128" height="128">
                                        <path
                                            d="M880.64 358.4h-819.2v423.936c0 34.816 26.624 61.44 61.44 61.44h491.52c12.288 0 20.48 8.192 20.48 20.48s-8.192 20.48-20.48 20.48h-491.52c-57.344 0-102.4-45.056-102.4-102.4v-552.96c0-57.344 45.056-102.4 102.4-102.4h696.32c57.344 0 102.4 45.056 102.4 102.4v176.128c0 12.288-8.192 20.48-20.48 20.48s-20.48-8.192-20.48-20.48v-47.104z m0-40.96v-88.064c0-34.816-26.624-61.44-61.44-61.44h-696.32c-34.816 0-61.44 26.624-61.44 61.44v88.064h819.2z m-204.8-51.2c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m-448.512 241.664c6.144-10.24 18.432-12.288 28.672-8.192 10.24 6.144 12.288 18.432 8.192 28.672l-102.4 178.176c-6.144 10.24-18.432 12.288-28.672 8.192s-12.288-18.432-8.192-28.672l102.4-178.176z m-126.976 6.144l-55.296 90.112 55.296 94.208c6.144 10.24 2.048 22.528-8.192 28.672-10.24 6.144-22.528 2.048-28.672-8.192l-67.584-114.688 67.584-110.592c6.144-10.24 18.432-12.288 28.672-6.144 10.24 4.096 12.288 16.384 8.192 26.624z m188.416 184.32l55.296-94.208-55.296-90.112c-6.144-10.24-2.048-22.528 6.144-28.672 10.24-6.144 22.528-2.048 28.672 6.144l67.584 110.592-67.584 114.688c-6.144 10.24-18.432 12.288-28.672 8.192-8.192-4.096-10.24-18.432-6.144-26.624z m577.536-122.88l4.096 10.24-40.96 51.2c-8.192 10.24-8.192 26.624 0 36.864l38.912 47.104-4.096 10.24c-8.192 26.624-22.528 51.2-38.912 71.68l-8.192 10.24-61.44-10.24c-12.288-2.048-26.624 6.144-30.72 18.432l-20.48 61.44-10.24 2.048c-32.768 8.192-69.632 8.192-102.4 0l-12.288-2.048-20.48-61.44c-4.096-12.288-18.432-20.48-30.72-18.432l-63.488 10.24-8.192-8.192c-8.192-10.24-16.384-20.48-22.528-32.768-8.192-12.288-14.336-26.624-18.432-40.96l-4.096-10.24 40.96-49.152c8.192-10.24 8.192-26.624 0-36.864l-40.96-49.152 4.096-10.24c10.24-26.624 22.528-51.2 40.96-73.728l8.192-8.192 61.44 10.24c12.288 2.048 26.624-6.144 30.72-18.432l22.528-61.44 10.24-2.048c32.768-6.144 67.584-6.144 100.352 0l12.288 2.048 20.48 59.392c4.096 12.288 18.432 20.48 30.72 20.48l63.488-8.192 8.192 8.192c8.192 10.24 16.384 20.48 22.528 32.768 8.192 12.288 14.336 24.576 18.432 38.912z m-53.248-20.48l-12.288-18.432-38.912 4.096c-32.768 4.096-65.536-16.384-75.776-47.104l-12.288-36.864c-20.48-4.096-40.96-4.096-61.44 0l-14.336 38.912c-10.24 30.72-45.056 51.2-75.776 45.056l-36.864-6.144c-10.24 12.288-16.384 26.624-22.528 40.96l26.624 30.72c20.48 24.576 20.48 63.488 0 90.112l-26.624 30.72c4.096 8.192 6.144 16.384 12.288 24.576 4.096 6.144 6.144 12.288 10.24 16.384l40.96-6.144c32.768-4.096 65.536 16.384 75.776 47.104l12.288 38.912c20.48 4.096 40.96 4.096 61.44 0l14.336-40.96c10.24-30.72 45.056-51.2 75.776-45.056l36.864 6.144c8.192-12.288 16.384-26.624 22.528-40.96l-24.576-28.672c-20.48-24.576-20.48-63.488-2.048-88.064l26.624-32.768c-4.096-6.144-8.192-14.336-12.288-22.528z m-169.984 202.752c-57.344 0-102.4-45.056-102.4-102.4s45.056-102.4 102.4-102.4 102.4 45.056 102.4 102.4c0 55.296-47.104 102.4-102.4 102.4z m0-40.96c34.816 0 61.44-26.624 61.44-61.44s-26.624-61.44-61.44-61.44-61.44 26.624-61.44 61.44 26.624 61.44 61.44 61.44z"
                                            fill="#515151"
                                            p-id="6181"
                                        ></path>
                                    </svg>
                                </Popover>
                                <div className="text-base">即将推出</div>
                            </div>
                        )}
                    </CardContent>
                </MainCard>
            </Modal>
            <SkillUpgradeOnline open={skillUpgradeOnline} handleClose={() => setSkillUpgradeOnline(false)} />
        </>
    );
};

export const Skill = ({ chatBotInfo, setChatBotInfo }: { chatBotInfo: IChatInfo; setChatBotInfo: (chatInfo: IChatInfo) => void }) => {
    const theme = useTheme();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const appId = searchParams.get('appId');

    const [workflowEditVisible, setWorkflowEditVisible] = useState(false);
    const [workflowCreateVisible, setWorkflowCreateVisible] = useState(false);
    const [workflowList, setWorkflowList] = useState<any[]>([]);
    const [workflowCurrentRecord, setWorkflowCurrentRecord] = useState({});
    const [count, setCount] = useState(0);

    const [skillCountVisible, setSkillCountVisible] = useState(false);
    const forceUpdate = () => setCount((pre) => pre + 1);

    useEffect(() => {
        getSkillList(appId || '').then((res) => {
            const appWorkFlowList =
                res?.['3']?.map((item: any) => ({
                    name: item.appWorkflowSkillDTO?.name,
                    description: item.appWorkflowSkillDTO?.desc,
                    type: item.type,
                    skillAppUid: item.appWorkflowSkillDTO?.skillAppUid,
                    uid: item.uid,
                    images: item.appWorkflowSkillDTO?.icon,
                    appConfigId: item.appConfigId,
                    appType: item.appWorkflowSkillDTO?.appType,
                    defaultPromptDesc: item.appWorkflowSkillDTO?.defaultPromptDesc,
                    copyWriting: item.appWorkflowSkillDTO?.copyWriting,
                    disabled: item.disabled
                })) || [];

            const systemList =
                res?.['5']?.map((item: any) => ({
                    name: item.systemHandlerSkillDTO?.name,
                    description: item.systemHandlerSkillDTO?.desc,
                    type: item.type,
                    code: item.systemHandlerSkillDTO?.code,
                    uid: item.uid,
                    images: item.systemHandlerSkillDTO?.icon,
                    appConfigId: item.appConfigId,
                    copyWriting: item.systemHandlerSkillDTO?.copyWriting,
                    disabled: item.disabled
                })) || [];

            const mergedArray = [...appWorkFlowList, ...systemList];
            const enableList = mergedArray.filter((v) => !v.disabled);
            const copyChatBotInfo = _.cloneDeep(chatBotInfo);
            copyChatBotInfo.skillWorkflowList = enableList;
            setChatBotInfo(copyChatBotInfo);
            setWorkflowList(mergedArray);
        });
    }, [count]);

    return (
        <div>
            <div>
                <div>
                    <Box display="flex" justifyContent="space-between" alignContent="center">
                        <div className="flex">
                            <span
                                className={
                                    "before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black"
                                }
                            >
                                学习工作流程
                            </span>
                            <Tooltip title={'让你的机器人可直接执行定制的AI应用，实现更复杂和深度的内容创作和工作内容。'} placement="top">
                                <HelpOutlineIcon className="text-base ml-1 cursor-pointer" />
                            </Tooltip>
                        </div>
                        <Box>
                            <Button
                                variant={'contained'}
                                startIcon={<AddIcon />}
                                color={'secondary'}
                                size={'small'}
                                onClick={() => {
                                    setWorkflowCreateVisible(true);
                                }}
                            >
                                添加技能
                            </Button>
                        </Box>
                    </Box>
                    <div className={'mt-3'}>
                        {workflowList.length === 0 ? (
                            <Box height="626px" display="flex" justifyContent="center" alignItems="center">
                                <Box position="relative" display="flex" flexDirection="column" alignItems="center">
                                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                                        <path
                                            d="M689.737143 650.496c8.996571-5.339429 18.797714-9.435429 29.220571-12.105143a28.233143 28.233143 0 0 1-0.219428-3.474286v-27.940571a27.940571 27.940571 0 0 1 55.881143 0v27.940571a28.196571 28.196571 0 0 1-0.219429 3.474286c10.386286 2.669714 20.224 6.765714 29.257143 12.105143a28.233143 28.233143 0 0 1 2.267428-2.596571l19.748572-19.748572a27.940571 27.940571 0 1 1 39.497143 39.497143l-19.748572 19.748571a28.16 28.16 0 0 1-2.56 2.304c5.302857 9.033143 9.435429 18.834286 12.068572 29.257143a28.233143 28.233143 0 0 1 3.474285-0.219428h27.940572a27.940571 27.940571 0 1 1 0 55.881143h-27.940572a28.16 28.16 0 0 1-3.474285-0.219429 111.067429 111.067429 0 0 1-12.068572 29.257143c0.877714 0.658286 1.755429 1.462857 2.56 2.267428l19.748572 19.748572a27.940571 27.940571 0 1 1-39.497143 39.497143l-19.748572-19.748572a28.233143 28.233143 0 0 1-2.304-2.56 111.067429 111.067429 0 0 1-29.257142 12.068572 28.196571 28.196571 0 0 1 0.256 3.474285v27.940572a27.940571 27.940571 0 1 1-55.881143 0v-27.940572c0-1.170286 0.073143-2.304 0.219428-3.474285a111.067429 111.067429 0 0 1-29.257143-12.068572 28.233143 28.233143 0 0 1-2.304 2.56l-19.748571 19.748572a27.940571 27.940571 0 1 1-39.497143-39.497143l19.748572-19.748572a28.269714 28.269714 0 0 1 2.596571-2.304 111.067429 111.067429 0 0 1-12.105143-29.257142 28.16 28.16 0 0 1-3.474286 0.256h-27.940571a27.940571 27.940571 0 0 1 0-55.881143h27.940571c1.170286 0 2.340571 0.073143 3.474286 0.219428 2.669714-10.422857 6.765714-20.224 12.105143-29.257143a28.16 28.16 0 0 1-2.596571-2.304l-19.748572-19.748571a27.940571 27.940571 0 1 1 39.497143-39.497143l19.748571 19.748572a28.233143 28.233143 0 0 1 2.304 2.596571zM914.285714 582.436571A233.947429 233.947429 0 0 0 746.678857 512a234.057143 234.057143 0 0 0-172.397714 75.446857h-11.995429v14.043429A233.691429 233.691429 0 0 0 512 746.678857c0 65.645714 26.953143 125.001143 70.436571 167.606857H182.857143a73.142857 73.142857 0 0 1-73.142857-73.142857V182.857143a73.142857 73.142857 0 0 1 73.142857-73.142857h658.285714a73.142857 73.142857 0 0 1 73.142857 73.142857v399.579428z m-640.950857-197.485714l-37.924571 36.059429 106.057143 116.114285L512 374.747429l-35.328-38.729143-132.644571 126.354285-70.692572-77.421714z m0 201.142857l-37.924571 36.059429 106.057143 116.114286L512 575.890286l-35.328-38.729143-132.644571 126.354286-70.692572-77.421715z m288.950857-199.789714v50.249143h201.142857v-50.249143h-201.142857z m184.393143 416.219429a55.881143 55.881143 0 1 0 0-111.725715 55.881143 55.881143 0 0 0 0 111.725715z"
                                            fill="#6580A9"
                                            p-id="1616"
                                        ></path>
                                    </svg>
                                    <Typography color="#9da3af">您还没有添加技能，快去添加吧！</Typography>
                                    <Button
                                        variant={'outlined'}
                                        startIcon={<AddIcon />}
                                        color={'secondary'}
                                        sx={{ mt: 3 }}
                                        onClick={() => {
                                            setWorkflowCreateVisible(true);
                                        }}
                                    >
                                        添加技能
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <MainCard
                                sx={{
                                    padding: '12px',
                                    '& > .MuiCardContent-root': {
                                        padding: 0
                                    }
                                }}
                            >
                                <Grid container spacing={1} sx={{ height: '560px', overflowY: 'auto' }}>
                                    {workflowList?.map((item, index) => (
                                        <Grid key={item.uid + index} item>
                                            <SkillWorkflowCard
                                                data={item}
                                                forceUpdate={forceUpdate}
                                                handleEdit={() => {
                                                    setWorkflowEditVisible(true);
                                                    setWorkflowCurrentRecord(item);
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </MainCard>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[2px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-[1.125rem] font-medium pl-[12px] relative text-black mt-5"
                    }
                >
                    学习API
                </span>
                <div className="text-sm text-[#9da3af] ml-3">
                    让你的机器人可以实时查询信息和操作其他API数据的能力，让你的机器人帮助你完成更多真实的工作。
                </div>
                <div className={'mt-3'}>
                    <MainCard>
                        <Grid
                            container
                            direction="row"
                            spacing={gridSpacing}
                            className={'h-[220px] flex justify-center items-center flex-col cursor-pointer'}
                        >
                            <Popover
                                content={
                                    <div className="flex justify-start items-center flex-col">
                                        <div className="text-sm text-center w-[330px]">
                                            <div>功能正在封闭测试中。</div>
                                            <div>可联系我们产品顾问进一步了解，</div>
                                            <div>并获得提前免费使用的权利。</div>
                                        </div>
                                        <img className="w-40" src={workWechatPay} alt="" />
                                    </div>
                                }
                                trigger="hover"
                            >
                                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="128" height="128">
                                    <path
                                        d="M880.64 358.4h-819.2v423.936c0 34.816 26.624 61.44 61.44 61.44h491.52c12.288 0 20.48 8.192 20.48 20.48s-8.192 20.48-20.48 20.48h-491.52c-57.344 0-102.4-45.056-102.4-102.4v-552.96c0-57.344 45.056-102.4 102.4-102.4h696.32c57.344 0 102.4 45.056 102.4 102.4v176.128c0 12.288-8.192 20.48-20.48 20.48s-20.48-8.192-20.48-20.48v-47.104z m0-40.96v-88.064c0-34.816-26.624-61.44-61.44-61.44h-696.32c-34.816 0-61.44 26.624-61.44 61.44v88.064h819.2z m-204.8-51.2c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m61.44 0c-12.288 0-20.48-8.192-20.48-20.48s8.192-20.48 20.48-20.48 20.48 8.192 20.48 20.48-8.192 20.48-20.48 20.48z m-448.512 241.664c6.144-10.24 18.432-12.288 28.672-8.192 10.24 6.144 12.288 18.432 8.192 28.672l-102.4 178.176c-6.144 10.24-18.432 12.288-28.672 8.192s-12.288-18.432-8.192-28.672l102.4-178.176z m-126.976 6.144l-55.296 90.112 55.296 94.208c6.144 10.24 2.048 22.528-8.192 28.672-10.24 6.144-22.528 2.048-28.672-8.192l-67.584-114.688 67.584-110.592c6.144-10.24 18.432-12.288 28.672-6.144 10.24 4.096 12.288 16.384 8.192 26.624z m188.416 184.32l55.296-94.208-55.296-90.112c-6.144-10.24-2.048-22.528 6.144-28.672 10.24-6.144 22.528-2.048 28.672 6.144l67.584 110.592-67.584 114.688c-6.144 10.24-18.432 12.288-28.672 8.192-8.192-4.096-10.24-18.432-6.144-26.624z m577.536-122.88l4.096 10.24-40.96 51.2c-8.192 10.24-8.192 26.624 0 36.864l38.912 47.104-4.096 10.24c-8.192 26.624-22.528 51.2-38.912 71.68l-8.192 10.24-61.44-10.24c-12.288-2.048-26.624 6.144-30.72 18.432l-20.48 61.44-10.24 2.048c-32.768 8.192-69.632 8.192-102.4 0l-12.288-2.048-20.48-61.44c-4.096-12.288-18.432-20.48-30.72-18.432l-63.488 10.24-8.192-8.192c-8.192-10.24-16.384-20.48-22.528-32.768-8.192-12.288-14.336-26.624-18.432-40.96l-4.096-10.24 40.96-49.152c8.192-10.24 8.192-26.624 0-36.864l-40.96-49.152 4.096-10.24c10.24-26.624 22.528-51.2 40.96-73.728l8.192-8.192 61.44 10.24c12.288 2.048 26.624-6.144 30.72-18.432l22.528-61.44 10.24-2.048c32.768-6.144 67.584-6.144 100.352 0l12.288 2.048 20.48 59.392c4.096 12.288 18.432 20.48 30.72 20.48l63.488-8.192 8.192 8.192c8.192 10.24 16.384 20.48 22.528 32.768 8.192 12.288 14.336 24.576 18.432 38.912z m-53.248-20.48l-12.288-18.432-38.912 4.096c-32.768 4.096-65.536-16.384-75.776-47.104l-12.288-36.864c-20.48-4.096-40.96-4.096-61.44 0l-14.336 38.912c-10.24 30.72-45.056 51.2-75.776 45.056l-36.864-6.144c-10.24 12.288-16.384 26.624-22.528 40.96l26.624 30.72c20.48 24.576 20.48 63.488 0 90.112l-26.624 30.72c4.096 8.192 6.144 16.384 12.288 24.576 4.096 6.144 6.144 12.288 10.24 16.384l40.96-6.144c32.768-4.096 65.536 16.384 75.776 47.104l12.288 38.912c20.48 4.096 40.96 4.096 61.44 0l14.336-40.96c10.24-30.72 45.056-51.2 75.776-45.056l36.864 6.144c8.192-12.288 16.384-26.624 22.528-40.96l-24.576-28.672c-20.48-24.576-20.48-63.488-2.048-88.064l26.624-32.768c-4.096-6.144-8.192-14.336-12.288-22.528z m-169.984 202.752c-57.344 0-102.4-45.056-102.4-102.4s45.056-102.4 102.4-102.4 102.4 45.056 102.4 102.4c0 55.296-47.104 102.4-102.4 102.4z m0-40.96c34.816 0 61.44-26.624 61.44-61.44s-26.624-61.44-61.44-61.44-61.44 26.624-61.44 61.44 26.624 61.44 61.44 61.44z"
                                        fill="#515151"
                                        p-id="6181"
                                    ></path>
                                </svg>
                            </Popover>
                            <div className="text-base">即将推出</div>
                        </Grid>
                    </MainCard>
                </div>
            </div>

            {workflowEditVisible && (
                <WorkflowEditModal
                    open={workflowEditVisible}
                    handleClose={() => setWorkflowEditVisible(false)}
                    workflowCurrentRecord={workflowCurrentRecord}
                    forceUpdate={forceUpdate}
                />
            )}
            {workflowCreateVisible && (
                <WorkflowCreateModal
                    open={workflowCreateVisible}
                    handleClose={() => setWorkflowCreateVisible(false)}
                    forceUpdate={forceUpdate}
                    workflowList={workflowList}
                    setSkillCountVisible={setSkillCountVisible}
                />
            )}
            <UpgradeSkillModel open={skillCountVisible} handleClose={() => setSkillCountVisible(false)} />
        </div>
    );
};
