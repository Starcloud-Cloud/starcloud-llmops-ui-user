import {
    Button as Buttons,
    Modal,
    IconButton,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    CardActions,
    Grid,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import { Table, Button, Image, Tag, Row, Col, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { formatYear } from 'hooks/useDate';
import { useEffect, useState } from 'react';
import { singlePage, singleModify } from 'api/redBook/task';
import { useLocation } from 'react-router-dom';
import AddAnnounce from './addAnnounce';
import { Confirm } from 'ui-component/Confirm';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { singleDelete } from 'api/redBook/task';
const Announce = ({ status }: { status?: string }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const handleTransfer = (key: string) => {
        switch (key) {
            case 'init':
                return (
                    <Tag className="!mr-0" color="processing">
                        待发布
                    </Tag>
                );
            case 'stay_claim':
                return (
                    <Tag className="!mr-0" color="processing">
                        待认领
                    </Tag>
                );
            case 'claimed':
                return (
                    <Tag className="!mr-0" color="processing">
                        已认领
                    </Tag>
                );
            case 'published':
                return (
                    <Tag className="!mr-0" color="processing">
                        用户已发布
                    </Tag>
                );
            case 'pre_settlement':
                return (
                    <Tag className="!mr-0" color="processing">
                        预结算
                    </Tag>
                );
            case 'settlement':
                return (
                    <Tag className="!mr-0" color="processing">
                        结算
                    </Tag>
                );
            case 'close':
                return (
                    <Tag className="!mr-0" color="processing">
                        关闭
                    </Tag>
                );
            case 'settlement_error':
                return (
                    <Tag className="!mr-0" color="error">
                        结算异常
                    </Tag>
                );
        }
    };
    const columns: ColumnsType<any> = [
        {
            title: '发帖标题',
            dataIndex: 'copywriting',
            render: (_, row) => <div>{row?.content?.title}</div>
        },
        {
            title: '任务图片',
            width: 170,
            render: (_, row) => (
                <div className="flex flex-wrap">
                    {row?.content?.picture?.map((item: any) => (
                        <Image className="mr-[5px]" width={50} height={50} key={item.index} src={item.url} preview={false} />
                    ))}
                </div>
            )
        },
        {
            title: '创作计划',
            dataIndex: 'plan'
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (_, row) => <div>{handleTransfer(row.status)}</div>
        },
        {
            title: '认领人',
            dataIndex: 'claimUsername'
        },
        {
            title: '预估花费',
            dataIndex: 'estimatedAmount'
        },
        {
            title: '结算金额',
            dataIndex: 'settlementAmount'
        },
        {
            title: '支付订单号',
            dataIndex: 'paymentOrder'
        },
        {
            title: '发布时间',
            render: (_, row) => <div>{row.publishTime && formatYear(row.publishTime)}</div>
        },
        {
            title: '预结算时间',
            render: (_, row) => <div>{row.preSettlementTime && formatYear(row.preSettlementTime)}</div>
        },
        {
            title: '结算时间',
            render: (_, row) => <div>{row.settlementTime && formatYear(row.settlementTime)}</div>
        },
        {
            title: '操作',
            width: 140,
            align: 'center',
            render: (_, row, index) => (
                <div className="whitespace-nowrap">
                    <Buttons
                        disabled={status !== 'published'}
                        size="small"
                        color="secondary"
                        onClick={() => {
                            console.log(row);

                            setTime({
                                publishTime: row.publishTime && dayjs(row.publishTime),
                                preSettlementTime: row.preSettlementTime && dayjs(row.preSettlementTime),
                                settlementTime: row.settlementTime && dayjs(row.settlementTime)
                            });
                            setEditData(row);
                            setEditOpen(true);
                        }}
                    >
                        编辑
                    </Buttons>
                    <Buttons
                        onClick={() => {
                            setUid(row.uid);
                            setExecuteOpen(true);
                        }}
                        size="small"
                        color="error"
                    >
                        删除
                    </Buttons>
                </div>
            )
        }
    ];
    const [tableData, setTableData] = useState<any[]>([]);
    const [query, setQuery] = useState<any>({});
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(0);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const statusList = [
        { label: '待发布', value: 'init' },
        { label: '待认领', value: 'stay_claim' },
        { label: '已认领', value: 'claimed' },
        { label: '用户已发布', value: 'published' },
        { label: '预结算', value: 'pre_settlement' },
        { label: '结算', value: 'settlement' },
        { label: '关闭', value: 'close' },
        { label: '结算异常', value: 'settlement_error' }
    ];
    const handleChange = (e: any) => {
        setQuery({
            ...query,
            [e.target.name]: e.target.value
        });
    };
    const getList = async () => {
        const result = await singlePage({ pageNo, pageSize, notificationUid: searchParams.get('notificationUid'), ...query });
        setTableData(result.list);
        setTotal(result.total);
    };
    useEffect(() => {
        if (!addOpen) {
            getList();
        }
    }, [addOpen, pageNo, pageSize, query]);
    //删除
    const [uid, setUid] = useState('');
    const [executeOpen, setExecuteOpen] = useState(false);
    const Execute = async () => {
        const result = await singleDelete(uid);
        if (result) {
            setExecuteOpen(false);
            getList();
            dispatch(
                openSnackbar({
                    open: true,
                    message: '删除成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
        }
    };
    //编辑
    const [time, setTime] = useState<any>({});
    const [editData, setEditData] = useState<any>({});
    const handleEdit = (e: any) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };
    const handleSave = async () => {
        const result = await singleModify(editData);
        if (result) {
            setEditData({});
            setTime({});
            setEditOpen(false);
            getList();
        }
    };
    return (
        <div>
            <Row gutter={20}>
                <Col span={6}>
                    <FormControl color="secondary" size="small" fullWidth>
                        <InputLabel id="status">任务状态</InputLabel>
                        <Select labelId="status" name="status" value={query.status} label="任务状态" onChange={handleChange}>
                            {statusList.map((item: any) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Col>
                <Col span={6}>
                    <TextField
                        size="small"
                        color="secondary"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="认领人 ID"
                        name="claimUserId"
                        value={query.claimUserId}
                        onChange={handleChange}
                    />
                </Col>
                <Col span={6}>
                    <TextField
                        size="small"
                        color="secondary"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        label="认领人"
                        name="claimUser"
                        value={query.claimUser}
                        onChange={handleChange}
                    />
                </Col>
            </Row>
            <div className="flex justify-right items-center my-[20px]">
                <Button
                    disabled={!searchParams.get('notificationUid') || status === 'published'}
                    onClick={() => {
                        setAddOpen(true);
                    }}
                    type="primary"
                    icon={<PlusOutlined rev={undefined} />}
                >
                    绑定创作计划
                </Button>
            </div>
            <Table
                size="small"
                columns={columns}
                dataSource={tableData}
                pagination={{
                    total: total,
                    current: pageNo,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50, 100],
                    onChange: (data: number) => setPageNo(data),
                    onShowSizeChange: (data: number, pageSize: number) => setPageSize(pageSize)
                }}
            />
            <Modal open={editOpen} onClose={() => setEditOpen(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
                <MainCard
                    style={{
                        position: 'absolute',
                        top: '10%',
                        left: '50%',
                        transform: 'translate(-50%, -10%)',
                        maxHeight: '90%',
                        overflow: 'auto'
                    }}
                    title={'编辑单条任务'}
                    content={false}
                    className="w-[80%] max-w-[800px]"
                    secondary={
                        <IconButton onClick={() => setEditOpen(false)} size="large" aria-label="close modal">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    <CardContent>
                        <Row gutter={20}>
                            <Col span={24}>
                                <FormControl sx={{ mb: 2 }} color="secondary" size="small" fullWidth>
                                    <InputLabel id="status">状态</InputLabel>
                                    <Select labelId="status" value={editData.status} label="状态" onChange={handleChange}>
                                        {statusList.map((item: any) => (
                                            <MenuItem key={item.value} value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col span={24}>
                                <TextField
                                    sx={{ mb: 2 }}
                                    size="small"
                                    color="secondary"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    label="发布链接"
                                    name="publishUrl"
                                    value={editData.publishUrl}
                                    onChange={handleEdit}
                                />
                            </Col>
                            <Col span={24}>
                                <TextField
                                    sx={{ mb: 2 }}
                                    size="small"
                                    color="secondary"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    label="预计花费"
                                    name="estimatedAmount"
                                    value={editData.estimatedAmount}
                                    onChange={handleEdit}
                                />
                            </Col>
                            <Col span={24}>
                                <TextField
                                    sx={{ mb: 2 }}
                                    size="small"
                                    color="secondary"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    label="结算金额"
                                    name="settlementAmount"
                                    value={editData.settlementAmount}
                                    onChange={handleEdit}
                                />
                            </Col>
                            <Col span={24}>
                                <TextField
                                    sx={{ mb: 2 }}
                                    size="small"
                                    color="secondary"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    label="支付单号"
                                    name="paymentOrder"
                                    value={editData.paymentOrder}
                                    onChange={handleEdit}
                                />
                            </Col>
                            <Col span={24}>
                                <DatePicker
                                    size="large"
                                    className="!w-full mb-[20px]"
                                    placeholder="请选择发布时间"
                                    value={time.publishTime}
                                    onChange={(date, dateString) => {
                                        setTime({
                                            ...time,
                                            publishTime: date
                                        });
                                        handleEdit({ target: { name: 'publishTime', value: date?.valueOf() } });
                                    }}
                                />
                            </Col>
                            <Col span={24}>
                                <DatePicker
                                    size="large"
                                    className="!w-full mb-[20px]"
                                    placeholder="请选择预结算时间"
                                    value={time.preSettlementTime}
                                    onChange={(date, dateString) => {
                                        setTime({
                                            ...time,
                                            preSettlementTime: date
                                        });
                                        handleEdit({ target: { name: 'preSettlementTime', value: date?.valueOf() } });
                                    }}
                                />
                            </Col>
                            <Col span={24}>
                                <DatePicker
                                    size="large"
                                    className="!w-full mb-[20px]"
                                    placeholder="请选择结算时间"
                                    value={time.settlementTime}
                                    onChange={(date, dateString) => {
                                        setTime({
                                            ...time,
                                            settlementTime: date
                                        });
                                        handleEdit({ target: { name: 'settlementTime', value: date?.valueOf() } });
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
                    </CardContent>
                </MainCard>
            </Modal>
            {addOpen && <AddAnnounce addOpen={addOpen} setAddOpen={setAddOpen} />}
            <Confirm open={executeOpen} handleClose={() => setExecuteOpen(false)} handleOk={Execute} />
        </div>
    );
};
export default Announce;
