import {
    IconButton,
    CardContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CardActions,
    Grid,
    FormHelperText,
    InputAdornment,
    Typography,
    Box
} from '@mui/material';
import KeyboardBackspace from '@mui/icons-material/KeyboardBackspace';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Divider, DatePicker, Row, Col, Tabs } from 'antd';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import _ from 'lodash-es';
import './addModal.scss';
import Announce from './announce';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { notificationCreate, notificationDetail, notificationModify, singleMetadata } from 'api/redBook/task';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
const AddModal = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    // 1.模板名称
    const [params, setParams] = useState<any>({});
    const [value, setValue] = useState('');
    const [time, setTime] = useState<any>({});
    const [nameOpen, setNameOpen] = useState(false);
    const [platformOpen, setPlatformOpen] = useState(false);
    const [fieldOpen, setFieldOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);
    const [postingUnitPriceOpen, setPostingUnitPriceOpen] = useState(false);
    const [replyUnitPriceOpen, setReplyUnitPriceOpen] = useState(false);
    const [likeUnitPriceOpen, setLikeUnitPriceOpen] = useState(false);
    const [startTimeOpen, setStartTimeOpen] = useState(false);
    const [endTimeOpen, setEndTimeOpen] = useState(false);
    const [singleBudgetOpen, setSingleBudgetOpen] = useState(false);
    const [notificationBudgetOpen, setNotificationBudgetOpen] = useState(false);
    const changeParams = (data: any) => {
        setParams({
            ...params,
            [data.name]: data.value
        });
    };
    const handleSave = async () => {
        const {
            name,
            platform,
            field,
            startTime,
            endTime,
            type,
            postingUnitPrice,
            replyUnitPrice,
            likeUnitPrice,
            singleBudget,
            notificationBudget
        } = params;
        if (
            !name ||
            !platform ||
            !field ||
            !startTime ||
            !endTime ||
            !type ||
            (!postingUnitPrice && postingUnitPrice !== 0) ||
            (!replyUnitPrice && replyUnitPrice !== 0) ||
            (!likeUnitPrice && likeUnitPrice !== 0) ||
            (!singleBudget && singleBudget !== 0) ||
            (!notificationBudget && notificationBudget !== 0)
        ) {
            setNameOpen(true);
            setPlatformOpen(true);
            setFieldOpen(true);
            setTypeOpen(true);
            setPostingUnitPriceOpen(true);
            setReplyUnitPriceOpen(true);
            setLikeUnitPriceOpen(true);
            setStartTimeOpen(true);
            setEndTimeOpen(true);
            setSingleBudgetOpen(true);
            setNotificationBudgetOpen(true);
            return false;
        }
        const basis = {
            ...params,
            description: value,
            postingUnitPrice: undefined,
            replyUnitPrice: undefined,
            likeUnitPrice: undefined,
            unitPrice: {
                postingUnitPrice: params.postingUnitPrice,
                replyUnitPrice: params.replyUnitPrice,
                likeUnitPrice: params.likeUnitPrice
            }
        };
        if (!searchParams.get('notificationUid')) {
            const result = await notificationCreate(basis);
            if (result) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '创建成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        transition: 'SlideDown',
                        close: false
                    })
                );
                navigate('/taskCenter');
            }
        } else {
            const result = await notificationModify(basis);
            if (result) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '编辑成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        transition: 'SlideDown',
                        close: false
                    })
                );
                navigate('/taskCenter');
            }
        }
    };

    const [platformList, setPlatformList] = useState<any[]>([]);
    const [cateList, setCategoryList] = useState<any[]>([]);
    const [singleMissionStatusEnumList, setSingleMissionStatusEnumList] = useState<any[]>([]);
    useEffect(() => {
        singleMetadata().then((res) => {
            setPlatformList(res.platform);
            setCategoryList(res.category);
            setSingleMissionStatusEnumList(res.singleMissionStatusEnum);
        });
        if (searchParams.get('view')) {
            setActive('2');
        }
        if (searchParams.get('notificationUid')) {
            notificationDetail(searchParams.get('notificationUid')).then((res) => {
                if (res) {
                    setTime({
                        startTime: res.startTime && dayjs(res.startTime),
                        endTime: res.endTime && dayjs(res.endTime)
                    });
                    setParams({
                        ...res,
                        ...res?.unitPrice,
                        unitPrice: undefined
                    });
                    setValue(res?.description);
                }
            });
        } else {
            setParams({
                type: 'posting',
                postingUnitPrice: 0,
                replyUnitPrice: 0,
                likeUnitPrice: 0,
                singleBudget: 0,
                notificationBudget: 0
            });
        }
    }, []);
    //tabs
    const [active, setActive] = useState('1');
    const changeActive = (e: string) => {
        setActive(e);
    };
    const setTaskTime = (num: number) => {
        const today = new Date();
        const threeDaysLater = new Date();
        threeDaysLater.setDate(today.getDate() + num);
        setTime({
            ...time,
            startTime: dayjs(new Date().getTime()),
            endTime: dayjs(threeDaysLater.getTime())
        });
        setParams({
            ...params,
            startTime: new Date().getTime(),
            endTime: threeDaysLater.getTime()
        });
    };
    return (
        <MainCard>
            <CardContent>
                <SubCard
                    sx={{ mb: 3 }}
                    contentSX={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px !important' }}
                >
                    <div>
                        <IconButton
                            onClick={() => {
                                navigate('/taskCenter');
                            }}
                            color="secondary"
                        >
                            <KeyboardBackspace fontSize="small" />
                        </IconButton>
                        <span className="text-[#000c] font-[500]">通告中心</span>&nbsp;
                        <span className="text-[#673ab7] font-[500]">
                            - {searchParams.get('notificationUid') ? '编辑通告中心' : '新建通告中心'}
                        </span>
                    </div>
                    <div></div>
                </SubCard>
                <Tabs
                    activeKey={active}
                    items={[
                        {
                            label: '通告任务基础信息',
                            key: '1',
                            children: (
                                <>
                                    <div className="text-[18px] font-[600] mb-[10px]">1. 基本信息</div>
                                    <Row gutter={20}>
                                        <Col span={24}>
                                            <TextField
                                                sx={{ mb: 2 }}
                                                size="small"
                                                color="secondary"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                label="通告名称"
                                                name="name"
                                                value={params.name}
                                                error={!params.name && nameOpen}
                                                helperText={!params.name && nameOpen ? '通告名称必填' : ''}
                                                onChange={(e: any) => {
                                                    setNameOpen(true);
                                                    changeParams(e.target);
                                                }}
                                            />
                                        </Col>
                                        <Col span={24}>
                                            <FormControl
                                                sx={{ mb: 2 }}
                                                error={!params.platform && platformOpen}
                                                key={params.platform}
                                                color="secondary"
                                                size="small"
                                                fullWidth
                                            >
                                                <InputLabel id="categorys">发布平台</InputLabel>
                                                <Select
                                                    name="platform"
                                                    value={params.platform}
                                                    onChange={(e: any) => {
                                                        setPlatformOpen(true);
                                                        changeParams(e.target);
                                                    }}
                                                    labelId="categorys"
                                                    label="发布平台"
                                                >
                                                    {platformList?.map((item: any) => (
                                                        <MenuItem value={item.value} key={item.value}>
                                                            {item.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <FormHelperText>{!params.platform && platformOpen ? '平台必选' : ''}</FormHelperText>
                                            </FormControl>
                                        </Col>
                                        <Col span={24}>
                                            <FormControl
                                                sx={{ mb: 2 }}
                                                error={!params.field && fieldOpen}
                                                key={params.field}
                                                color="secondary"
                                                size="small"
                                                fullWidth
                                            >
                                                <InputLabel id="fields">通告类目</InputLabel>
                                                <Select
                                                    name="field"
                                                    value={params.field}
                                                    onChange={(e: any) => {
                                                        setFieldOpen(true);
                                                        changeParams(e.target);
                                                    }}
                                                    endAdornment={
                                                        params.field && (
                                                            <InputAdornment className="mr-[10px]" position="end">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => {
                                                                        changeParams({ name: 'field', value: '' });
                                                                    }}
                                                                >
                                                                    <ClearIcon />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }
                                                    labelId="fields"
                                                    label="通告类目"
                                                >
                                                    {cateList?.map((item) => (
                                                        <MenuItem key={item.code} value={item.code}>
                                                            {item.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <FormHelperText>{!params.field && fieldOpen ? '通告类目必选' : ''}</FormHelperText>
                                            </FormControl>
                                        </Col>
                                    </Row>
                                    <Row gutter={20}>
                                        <Col md={8} sm={24}>
                                            <div className="relative">
                                                <DatePicker
                                                    showTime
                                                    size="large"
                                                    status={!params.startTime && startTimeOpen ? 'error' : ''}
                                                    className="!w-full mb-[5px]"
                                                    value={time.startTime}
                                                    onChange={(date, dateString) => {
                                                        setStartTimeOpen(true);
                                                        setTime({
                                                            ...time,
                                                            startTime: date
                                                        });
                                                        changeParams({ name: 'startTime', value: date?.valueOf() });
                                                    }}
                                                />
                                                <span
                                                    style={{ color: !params.startTime && startTimeOpen ? '#ff4d4f' : '#697586' }}
                                                    className="text-[#697586] font-[400] text-[12px] absolute px-[5px] top-[-8px] left-[10px] bg-gradient-to-b from-[#fff] to-[#f8fafc]"
                                                >
                                                    任务开始时间
                                                </span>
                                            </div>
                                            {!params.startTime && startTimeOpen && (
                                                <span className="ml-[10px] text-[#ff4d4f] text-[12px]">开始时间必选</span>
                                            )}
                                        </Col>
                                        <Col md={8} sm={24}>
                                            <div className="relative">
                                                <DatePicker
                                                    showTime
                                                    size="large"
                                                    status={!params.endTime && endTimeOpen ? 'error' : ''}
                                                    className="!w-full mb-[5px]"
                                                    value={time.endTime}
                                                    onChange={(date, dateString) => {
                                                        setEndTimeOpen(true);
                                                        setTime({
                                                            ...time,
                                                            endTime: date
                                                        });
                                                        changeParams({ name: 'endTime', value: date?.valueOf() });
                                                    }}
                                                />
                                                <span
                                                    style={{ color: !params.endTime && endTimeOpen ? '#ff4d4f' : '#697586' }}
                                                    className="text-[#697586] font-[400] text-[12px] absolute px-[5px] top-[-8px] left-[10px] bg-gradient-to-b from-[#fff] to-[#f8fafc]"
                                                >
                                                    任务结束时间
                                                </span>
                                            </div>

                                            {!params.endTime && endTimeOpen && (
                                                <span className="ml-[10px] text-[#ff4d4f] text-[12px]">结束时间必选</span>
                                            )}
                                        </Col>
                                        <Col md={8} sm={24}>
                                            <div className="w-full flex gap-2">
                                                <Button onClick={() => setTaskTime(3)} type="primary">
                                                    三天
                                                </Button>
                                                <Button onClick={() => setTaskTime(7)} type="primary">
                                                    七天
                                                </Button>
                                                <Button onClick={() => setTaskTime(14)} type="primary">
                                                    十四天
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Divider />
                                    <div className="text-[18px] font-[600]  mb-[10px]">2. 成本</div>
                                    <Row gutter={20}>
                                        <Col span={24}>
                                            <div className="text-[14px] font-600 mb-[10px]">任务类型</div>
                                            <div className="flex gap-2 flex-wrap mb-[10px]">
                                                <SubCard
                                                    sx={{
                                                        mb: 1,
                                                        cursor: 'pointer',
                                                        borderColor: params.type === 'posting' ? '#673ab7' : 'rgba(230,230,231,1)'
                                                    }}
                                                    contentSX={{ p: '10px !important', width: '200px' }}
                                                >
                                                    <Box
                                                        onClick={() => {
                                                            changeParams({
                                                                name: 'type',
                                                                value: 'posting'
                                                            });
                                                        }}
                                                    >
                                                        <Typography variant="h4" mb={1}>
                                                            发帖
                                                        </Typography>
                                                        <Typography height="48px" className="line-clamp-3" color="#697586" fontSize="12px">
                                                            {'小红书发布贴子'}
                                                        </Typography>
                                                    </Box>
                                                </SubCard>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <TextField
                                                size="small"
                                                color="secondary"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">¥</InputAdornment>
                                                }}
                                                label="发帖单价"
                                                type="number"
                                                name="postingUnitPrice"
                                                value={params.postingUnitPrice}
                                                error={!params.postingUnitPrice && params.postingUnitPrice !== 0 && postingUnitPriceOpen}
                                                helperText={
                                                    !params.postingUnitPrice && params.postingUnitPrice !== 0 && postingUnitPriceOpen
                                                        ? '发帖单价必填'
                                                        : ''
                                                }
                                                onChange={(e) => {
                                                    setPostingUnitPriceOpen(true);
                                                    if (e.target.value === '' || /^\d+(\.\d{0,1})?$/.test(e.target.value)) {
                                                        changeParams(e.target);
                                                    }
                                                }}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            {' '}
                                            <TextField
                                                size="small"
                                                color="secondary"
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">¥</InputAdornment>
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                                label="回复单价"
                                                type="number"
                                                name="replyUnitPrice"
                                                value={params.replyUnitPrice}
                                                error={!params.replyUnitPrice && params.replyUnitPrice !== 0 && replyUnitPriceOpen}
                                                helperText={
                                                    !params.replyUnitPrice && params.replyUnitPrice !== 0 && replyUnitPriceOpen
                                                        ? '回复单价必填'
                                                        : ''
                                                }
                                                onChange={(e: any) => {
                                                    setReplyUnitPriceOpen(true);
                                                    if (e.target.value === '' || /^\d+(\.\d{0,1})?$/.test(e.target.value)) {
                                                        changeParams(e.target);
                                                    }
                                                }}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <TextField
                                                size="small"
                                                color="secondary"
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">¥</InputAdornment>
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                                label="点赞单价"
                                                type="number"
                                                name="likeUnitPrice"
                                                value={params.likeUnitPrice}
                                                error={!params.likeUnitPrice && params.likeUnitPrice !== 0 && likeUnitPriceOpen}
                                                helperText={
                                                    !params.likeUnitPrice && params.likeUnitPrice !== 0 && likeUnitPriceOpen
                                                        ? '点赞单价必填'
                                                        : ''
                                                }
                                                onChange={(e: any) => {
                                                    setLikeUnitPriceOpen(true);
                                                    if (e.target.value === '' || /^\d+(\.\d{0,1})?$/.test(e.target.value)) {
                                                        changeParams(e.target);
                                                    }
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Divider />
                                    <TextField
                                        size="small"
                                        color="secondary"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">¥</InputAdornment>
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        label="单任务预算上限"
                                        type="number"
                                        name="singleBudget"
                                        value={params.singleBudget}
                                        error={!params.singleBudget && params.singleBudget !== 0 && singleBudgetOpen}
                                        helperText={
                                            !params.singleBudget && params.singleBudget !== 0 && singleBudgetOpen
                                                ? '单任务预算上限必填'
                                                : ''
                                        }
                                        onChange={(e: any) => {
                                            setSingleBudgetOpen(true);
                                            if (e.target.value === '' || /^\d+(\.\d{0,1})?$/.test(e.target.value)) {
                                                changeParams(e.target);
                                            }
                                        }}
                                    />
                                    <TextField
                                        sx={{ mt: 2 }}
                                        size="small"
                                        color="secondary"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">¥</InputAdornment>
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        label="通告总预算"
                                        type="number"
                                        name="notificationBudget"
                                        value={params.notificationBudget}
                                        error={!params.notificationBudget && params.notificationBudget !== 0 && notificationBudgetOpen}
                                        helperText={
                                            !params.notificationBudget && params.notificationBudget !== 0 && notificationBudgetOpen
                                                ? '通告总预算必填'
                                                : ''
                                        }
                                        onChange={(e: any) => {
                                            setNotificationBudgetOpen(true);
                                            if (e.target.value === '' || /^\d+(\.\d{0,1})?$/.test(e.target.value)) {
                                                changeParams(e.target);
                                            }
                                        }}
                                    />
                                    <Divider />
                                    <div className="text-[18px] font-[600] mb-[10px]">3. 通告说明</div>
                                    <Row gutter={20}>
                                        <Col span={24}>
                                            <ReactQuill className="h-[300px] mb-[60px]" theme="snow" value={value} onChange={setValue} />
                                        </Col>
                                        <Col span={12}>
                                            <TextField
                                                size="small"
                                                color="secondary"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                label="备注"
                                                multiline
                                                minRows={4}
                                                maxRows={6}
                                                type="number"
                                                name="remark"
                                                value={params.remark}
                                                onChange={(e: any) => {
                                                    changeParams(e.target);
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Divider />
                                    <CardActions>
                                        <Grid container justifyContent="flex-end">
                                            <Button disabled={params.status === 'published'} type="primary" onClick={handleSave}>
                                                保存
                                            </Button>
                                        </Grid>
                                    </CardActions>
                                </>
                            )
                        },
                        {
                            label: '通告任务',
                            key: '2',
                            children: <Announce singleMissionStatusEnumList={singleMissionStatusEnumList} status={params.status} />
                        }
                    ]}
                    onChange={changeActive}
                />
            </CardContent>
        </MainCard>
    );
};
export default AddModal;
