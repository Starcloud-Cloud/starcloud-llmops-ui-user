import {
    Modal as Modals,
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
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import React, { useEffect, useState } from 'react';
import { Table, Button, Divider, DatePicker, Row, Col, Radio } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import _ from 'lodash-es';
import './addModal.scss';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
const AddModal = ({
    detailOpen,
    title,
    uid,
    setDetailOpen
}: {
    detailOpen: boolean;
    title: string;
    uid: string;
    setDetailOpen: (data: boolean) => void;
}) => {
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
    const columns: ColumnsType<any> = [
        {
            title: '任务编码',
            dataIndex: 'encoding'
        },
        {
            title: '任务文案',
            dataIndex: 'copywriting'
        },
        {
            title: '任务图片',
            dataIndex: 'copyImage'
        },
        {
            title: '创作计划',
            dataIndex: 'plan'
        },
        {
            title: '状态',
            dataIndex: 'status'
        },
        {
            title: '认领人',
            dataIndex: 'peoper'
        },
        {
            title: '认领时间',
            dataIndex: 'claimTime'
        },
        {
            title: '提交时间',
            dataIndex: 'submitTime'
        },
        {
            title: '发布链接',
            dataIndex: 'link'
        },
        {
            title: '预结算时间',
            dataIndex: 'lementTime'
        },
        {
            title: '预结花费',
            dataIndex: 'lementPrice'
        },
        {
            title: '结算时间',
            dataIndex: 'lementsTime'
        },
        {
            title: '支付订单号',
            dataIndex: 'payOrder'
        },
        {
            title: '操作',
            render: (_, row, index) => (
                <div className="whitespace-nowrap">
                    <Button
                        type="text"
                        onClick={() => {
                            setRowIndex(index);
                        }}
                    >
                        编辑
                    </Button>
                    <Divider type="vertical" />
                    <Button
                        onClick={() => {
                            const newList = JSON.parse(JSON.stringify(tableData));
                            newList.splice(rowIndex, 1);
                            setTableData(newList);
                        }}
                        danger
                        type="text"
                    >
                        删除
                    </Button>
                </div>
            )
        }
    ];
    const [rowIndex, setRowIndex] = useState(-1);
    const [tableData, setTableData] = useState<any[]>([]);
    const handleSave = () => {
        console.log(params);
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
    };
    useEffect(() => {
        if (uid) {
            console.log(1);
        }
    }, [uid]);
    return (
        <Modals open={detailOpen} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, -10%)',
                    maxHeight: '90%',
                    overflow: 'auto'
                }}
                title={title}
                content={false}
                className="w-[80%] max-w-[1000px]"
                secondary={
                    <IconButton onClick={() => setDetailOpen(false)} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
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
                            <FormControl error={!params.field && fieldOpen} key={params.category} color="secondary" size="small" fullWidth>
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
                            {!params.endTime && endTimeOpen && <span className="ml-[10px] text-[#ff4d4f] text-[12px]">结束时间必选</span>}
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
                                label="任务类型"
                                name="type"
                                value={params.type}
                                error={!params.type && typeOpen}
                                helperText={!params.type && typeOpen ? '任务类型必填' : ''}
                                onChange={(e: any) => {
                                    setTypeOpen(true);
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
                        {/* <Col span={8}>
                            <Radio.Group
                                value={params.options}
                                onChange={(e) => {
                                    changeParams({ name: 'options', value: e.target.value });
                                }}
                                size="large"
                            >
                                <Radio value="a">选项 1</Radio>
                                <Radio value="b">选项 2</Radio>
                                <Radio value="c">选项 3</Radio>
                            </Radio.Group>
                        </Col> */}
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
                    <div className="flex justify-between items-center mt-[20px]">
                        <div className="text-[18px] font-[600]">参考账号</div>
                        <Button onClick={() => {}} className="mb-[20px]" type="primary" icon={<PlusOutlined rev={undefined} />}>
                            新增
                        </Button>
                    </div>
                    <Table scroll={{ y: 200 }} size="small" columns={columns} dataSource={tableData} />
                    {/* <TextField
                        sx={{ width: '300px', mt: 2 }}
                        size="small"
                        color="secondary"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="一人最多认领几次任务"
                        name="task"
                        type="number"
                        helperText="0 是不限制次数"
                        value={params.task}
                        onChange={(e: any) => {
                            changeParams(e.target);
                        }}
                    />
                    <div className="text-[18px] font-[600] my-[20px]">报名人员限制</div>
                    <Row gutter={20}>
                        <Col md={8} sm={24}>
                            <FormControl key={params.adder} color="secondary" size="small" fullWidth>
                                <InputLabel id="categorys">地区限制</InputLabel>
                                <Select
                                    name="adder"
                                    value={params.adder}
                                    onChange={(e: any) => {
                                        changeParams(e.target);
                                    }}
                                    labelId="categorys"
                                    label="地区限制"
                                >
                                    <MenuItem value={'杭州'}>杭州</MenuItem>
                                    <MenuItem value={'北京'}>北京</MenuItem>
                                    <MenuItem value={'深圳'}>深圳</MenuItem>
                                </Select>
                            </FormControl>
                        </Col>
                        <Col md={8} sm={24}>
                            <FormControl key={params.sex} color="secondary" size="small" fullWidth>
                                <InputLabel id="sexs">性别</InputLabel>
                                <Select
                                    name="sex"
                                    value={params.sex}
                                    onChange={(e: any) => {
                                        changeParams(e.target);
                                    }}
                                    labelId="sexs"
                                    label="性别"
                                >
                                    <MenuItem value={'1'}>男</MenuItem>
                                    <MenuItem value={'0'}>女</MenuItem>
                                </Select>
                            </FormControl>
                        </Col>
                        <Col md={8} sm={24}>
                            <FormControl key={params.fans} color="secondary" size="small" fullWidth>
                                <InputLabel id="sexs">粉丝</InputLabel>
                                <Select
                                    name="fans"
                                    value={params.fans}
                                    onChange={(e: any) => {
                                        changeParams(e.target);
                                    }}
                                    labelId="sexs"
                                    label="粉丝"
                                >
                                    <MenuItem value={'1'}>男</MenuItem>
                                    <MenuItem value={'0'}>女</MenuItem>
                                </Select>
                            </FormControl>
                        </Col>
                    </Row> */}
                    <Divider />
                    <CardActions>
                        <Grid container justifyContent="flex-end">
                            <Button type="primary" onClick={handleSave}>
                                保存
                            </Button>
                        </Grid>
                    </CardActions>
                </CardContent>
            </MainCard>
        </Modals>
    );
};
export default AddModal;
