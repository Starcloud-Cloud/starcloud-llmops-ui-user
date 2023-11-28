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
    FormHelperText
} from '@mui/material';
import KeyboardBackspace from '@mui/icons-material/KeyboardBackspace';
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
import { notificationCreate, notificationDetail, notificationModify } from 'api/redBook/task';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
const AddModal = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    // 1.模板名称
    const [params, setParams] = useState<any>({});
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
            !postingUnitPrice ||
            !replyUnitPrice ||
            !likeUnitPrice ||
            !singleBudget ||
            !notificationBudget
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
        if (!searchParams.get('notificationUid')) {
            const result = await notificationCreate({
                ...params,
                postingUnitPrice: undefined,
                replyUnitPrice: undefined,
                likeUnitPrice: undefined,
                unitPrice: {
                    postingUnitPrice: params.postingUnitPrice,
                    replyUnitPrice: params.replyUnitPrice,
                    likeUnitPrice: params.likeUnitPrice
                }
            });
            if (result) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '创建成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
                navigate('/taskCenter');
            }
        } else {
            const result = await notificationModify({
                ...params,
                postingUnitPrice: undefined,
                replyUnitPrice: undefined,
                likeUnitPrice: undefined,
                unitPrice: {
                    postingUnitPrice: params.postingUnitPrice,
                    replyUnitPrice: params.replyUnitPrice,
                    likeUnitPrice: params.likeUnitPrice
                }
            });
            if (result) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: '编辑成功',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: false
                    })
                );
                navigate('/taskCenter');
            }
        }
    };
    useEffect(() => {
        if (searchParams.get('notificationUid')) {
            notificationDetail(searchParams.get('notificationUid')).then((res) => {
                if (res) {
                    setTime({
                        startTime: dayjs(res.startTime),
                        endTime: dayjs(res.endTime)
                    });
                    setParams({
                        ...res,
                        ...res?.unitPrice,
                        unitPrice: undefined
                    });
                }
            });
        }
    }, []);

    //tabs
    const [active, setActive] = useState('1');
    const changeActive = (e: string) => {
        setActive(e);
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
                                    <Row gutter={20}>
                                        <Col md={8} sm={24}>
                                            <TextField
                                                size="small"
                                                color="secondary"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                label="任务名称"
                                                name="name"
                                                value={params.name}
                                                error={!params.name && nameOpen}
                                                helperText={!params.name && nameOpen ? '任务名称必填' : ''}
                                                onChange={(e: any) => {
                                                    setNameOpen(true);
                                                    changeParams(e.target);
                                                }}
                                            />
                                        </Col>
                                        <Col md={8} sm={24}>
                                            <FormControl
                                                error={!params.platform && platformOpen}
                                                key={params.platform}
                                                color="secondary"
                                                size="small"
                                                fullWidth
                                            >
                                                <InputLabel id="categorys">平台</InputLabel>
                                                <Select
                                                    name="platform"
                                                    value={params.platform}
                                                    onChange={(e: any) => {
                                                        setPlatformOpen(true);
                                                        changeParams(e.target);
                                                    }}
                                                    labelId="categorys"
                                                    label="平台"
                                                >
                                                    <MenuItem value={'xhs'}>小红书</MenuItem>
                                                </Select>
                                                <FormHelperText>{!params.platform && platformOpen ? '平台必选' : ''}</FormHelperText>
                                            </FormControl>
                                        </Col>
                                        <Col md={8} sm={24}>
                                            <FormControl
                                                error={!params.field && fieldOpen}
                                                key={params.category}
                                                color="secondary"
                                                size="small"
                                                fullWidth
                                            >
                                                <InputLabel id="fields">领域</InputLabel>
                                                <Select
                                                    name="field"
                                                    value={params.field}
                                                    onChange={(e: any) => {
                                                        setFieldOpen(true);
                                                        changeParams(e.target);
                                                    }}
                                                    labelId="fields"
                                                    label="领域"
                                                >
                                                    <MenuItem value={'Xhss'}>领域</MenuItem>
                                                </Select>
                                                <FormHelperText>{!params.field && fieldOpen ? '领域必选' : ''}</FormHelperText>
                                            </FormControl>
                                        </Col>
                                    </Row>
                                    <div className="text-[18px] font-[600] my-[20px]">任务周期</div>
                                    <Row gutter={20}>
                                        <Col md={8} sm={24}>
                                            <DatePicker
                                                size="large"
                                                status={!params.startTime && startTimeOpen ? 'error' : ''}
                                                className="!w-full mb-[5px]"
                                                value={time.startTime}
                                                onChange={(date, dateString) => {
                                                    console.log(date);

                                                    setStartTimeOpen(true);
                                                    setTime({
                                                        ...time,
                                                        startTime: date
                                                    });
                                                    changeParams({ name: 'startTime', value: dateString });
                                                }}
                                            />
                                            {!params.startTime && startTimeOpen && (
                                                <span className="ml-[10px] text-[#ff4d4f] text-[12px]">开始时间必选</span>
                                            )}
                                        </Col>
                                        <Col md={8} sm={24}>
                                            <DatePicker
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
                                                    changeParams({ name: 'endTime', value: dateString });
                                                }}
                                            />
                                            {!params.endTime && endTimeOpen && (
                                                <span className="ml-[10px] text-[#ff4d4f] text-[12px]">结束时间必选</span>
                                            )}
                                        </Col>
                                    </Row>
                                    <Divider />
                                    <Row gutter={20}>
                                        <Col span={8}>
                                            <FormControl
                                                error={!params.type && typeOpen}
                                                key={params.type}
                                                color="secondary"
                                                size="small"
                                                fullWidth
                                            >
                                                <InputLabel id="categorys">平台</InputLabel>
                                                <Select
                                                    name="type"
                                                    value={params.type}
                                                    onChange={(e: any) => {
                                                        setTypeOpen(true);
                                                        changeParams(e.target);
                                                    }}
                                                    labelId="categorys"
                                                    label="平台"
                                                >
                                                    <MenuItem value={'posting'}>小红书</MenuItem>
                                                </Select>
                                                <FormHelperText>{!params.platform && typeOpen ? '任务类型必填' : ''}</FormHelperText>
                                            </FormControl>
                                        </Col>
                                        <Col span={8}>
                                            <TextField
                                                size="small"
                                                color="secondary"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                label="发帖单价"
                                                type="number"
                                                name="postingUnitPrice"
                                                value={params.postingUnitPrice}
                                                error={!params.postingUnitPrice && postingUnitPriceOpen}
                                                helperText={!params.postingUnitPrice && postingUnitPriceOpen ? '发帖单价必填' : ''}
                                                onChange={(e: any) => {
                                                    setPostingUnitPriceOpen(true);
                                                    changeParams(e.target);
                                                }}
                                            />
                                            <TextField
                                                size="small"
                                                sx={{ mt: 2 }}
                                                color="secondary"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                label="回复单价"
                                                type="number"
                                                name="replyUnitPrice"
                                                value={params.replyUnitPrice}
                                                error={!params.replyUnitPrice && replyUnitPriceOpen}
                                                helperText={!params.replyUnitPrice && replyUnitPriceOpen ? '回复单价必填' : ''}
                                                onChange={(e: any) => {
                                                    setReplyUnitPriceOpen(true);
                                                    changeParams(e.target);
                                                }}
                                            />
                                            <TextField
                                                size="small"
                                                sx={{ mt: 2 }}
                                                color="secondary"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                label="点赞单价"
                                                type="number"
                                                name="likeUnitPrice"
                                                value={params.likeUnitPrice}
                                                error={!params.likeUnitPrice && likeUnitPriceOpen}
                                                helperText={!params.likeUnitPrice && likeUnitPriceOpen ? '点赞单价必填' : ''}
                                                onChange={(e: any) => {
                                                    setLikeUnitPriceOpen(true);
                                                    changeParams(e.target);
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Divider />
                                    <Row gutter={20}>
                                        <Col span={8}>
                                            <TextField
                                                size="small"
                                                color="secondary"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                label="单任务预算上限"
                                                type="number"
                                                name="singleBudget"
                                                value={params.singleBudget}
                                                error={!params.singleBudget && singleBudgetOpen}
                                                helperText={!params.singleBudget && singleBudgetOpen ? '单任务预算上限必填' : ''}
                                                onChange={(e: any) => {
                                                    setSingleBudgetOpen(true);
                                                    changeParams(e.target);
                                                }}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <TextField
                                                size="small"
                                                color="secondary"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                label="通告总预算"
                                                type="number"
                                                name="notificationBudget"
                                                value={params.notificationBudget}
                                                error={!params.notificationBudget && notificationBudgetOpen}
                                                helperText={!params.notificationBudget && notificationBudgetOpen ? '通告总预算必填' : ''}
                                                onChange={(e: any) => {
                                                    setNotificationBudgetOpen(true);
                                                    changeParams(e.target);
                                                }}
                                            />
                                        </Col>
                                        <Col span={24}>
                                            <TextField
                                                sx={{ my: 2 }}
                                                size="small"
                                                color="secondary"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                label="任务说明"
                                                multiline
                                                minRows={4}
                                                maxRows={6}
                                                type="number"
                                                name="description"
                                                value={params.description}
                                                onChange={(e: any) => {
                                                    changeParams(e.target);
                                                }}
                                            />
                                        </Col>
                                        <Col span={24}>
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
                                            <Button type="primary" onClick={handleSave}>
                                                保存
                                            </Button>
                                        </Grid>
                                    </CardActions>
                                </>
                            )
                        },
                        {
                            label: '绑定通告任务',
                            key: '2',
                            children: <Announce />
                        }
                    ]}
                    onChange={changeActive}
                />
            </CardContent>
        </MainCard>
    );
};
export default AddModal;
