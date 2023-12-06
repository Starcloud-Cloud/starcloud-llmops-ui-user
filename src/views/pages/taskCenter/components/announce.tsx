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
    Divider,
    InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import MainCard from 'ui-component/cards/MainCard';
import { Table, Button, Image, Tag, Row, Col, DatePicker, Steps } from 'antd';
import { SearchOutlined, ExportOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import formatDate from 'hooks/useDate';
import { useEffect, useState } from 'react';
import { singlePage, singleModify } from 'api/redBook/task';
import { useLocation } from 'react-router-dom';
import AddAnnounce from './addAnnounce';
import { DetailModal } from '../../redBookContentList/component/detailModal';
import { Confirm } from 'ui-component/Confirm';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { singleDelete, singleRefresh, singleExport, bathDelete } from 'api/redBook/task';
import './addModal.scss';
const Announce = ({ status, singleMissionStatusEnumList }: { status?: string; singleMissionStatusEnumList: any[] }) => {
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
            case 'pre_settlement_error':
                return (
                    <Tag className="!mr-0" color="error">
                        预结算异常
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
            render: (_, row) => (
                <div
                    className="cursor-pointer hover:text-[#673ab7]"
                    onClick={() => {
                        setBusinessUid(row.creativeUid);
                        setDetailOpen(true);
                    }}
                >
                    {row?.content?.title}
                </div>
            )
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
            title: '认领时间',
            render: (_, row) => <div>{row.claimTime && formatDate(row.claimTime)}</div>
        },
        {
            title: '发布时间',
            render: (_, row) => <div>{row.publishTime && formatDate(row.publishTime)}</div>
        },
        {
            title: '互动数据',
            width: 110,
            render: (_, row) => (
                <div>
                    <div>点赞数：{row?.likedCount || 0}</div>
                    <div>评论数：{row?.commentCount || 0}</div>
                </div>
            )
        },
        {
            title: '预估花费',
            dataIndex: 'estimatedAmount'
        },
        {
            title: '预结算时间',
            render: (_, row) => <div>{row.preSettlementTime && formatDate(row.preSettlementTime)}</div>
        },
        {
            title: '结算金额',
            dataIndex: 'settlementAmount'
        },
        {
            title: '结算时间',
            render: (_, row) => <div>{row.settlementTime && formatDate(row.settlementTime)}</div>
        },
        {
            title: '支付订单号',
            dataIndex: 'paymentOrder'
        },
        {
            title: '创建时间',
            render: (_, row) => <div>{row.createTime && formatDate(row.createTime)}</div>
        },
        {
            title: '更新时间',
            render: (_, row) => <div>{row.updateTime && formatDate(row.updateTime)}</div>
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
                                claimTime: row.claimTime && dayjs(row.claimTime),
                                preSettlementTime: row.preSettlementTime && dayjs(row.preSettlementTime),
                                settlementTime: row.settlementTime && dayjs(row.settlementTime)
                            });
                            setEditData(row);
                            setEditOpen(true);
                        }}
                    >
                        编辑
                    </Buttons>
                    {/* <Buttons
                        disabled={
                            row.status === 'init' || row.status === 'stay_claim' || row.status === 'claimed' || row.status === 'close'
                        }
                        aria-label="delete"
                        size="small"
                        color="secondary"
                        onClick={() => bilingDetail(row.uid)}
                    >
                        计费花费
                    </Buttons> */}
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
    //计费明细
    const [bilingLoading, setBilingLoading] = useState(false);
    const bilingDetail = async (uid: string) => {
        try {
            setBilingLoading(true);
            const result = await singleRefresh(uid);
            setBilingLoading(false);
            if (result) {
                setEditOpen(false);
                getList();
            }
        } catch (err) {
            setBilingLoading(false);
        }
    };
    const [tableData, setTableData] = useState<any[]>([]);
    const [query, setQuery] = useState<any>({});
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(0);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
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
    }, [addOpen, pageNo, pageSize]);
    //多选
    const [uids, setUids] = useState<React.Key[]>([]);
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            setUids(selectedRowKeys);
        }
    };
    const [delsOpen, setDelsOpen] = useState(false);
    const handleDels = async () => {
        const res = await bathDelete(uids);
        if (res) {
            setDelsOpen(false);
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
    //详情
    const [detailOpen, setDetailOpen] = useState<any>(false);
    const [businessUid, setBusinessUid] = useState<string>('');
    return (
        <div>
            <div className="flex justify-between gap-2 my-[20px]">
                <div className="flex-1">
                    <Row gutter={20} align-items="center">
                        <Col span={6}>
                            <FormControl key={query.status} color="secondary" size="small" fullWidth>
                                <InputLabel id="status">任务状态</InputLabel>
                                <Select
                                    labelId="status"
                                    name="status"
                                    endAdornment={
                                        query.status && (
                                            <InputAdornment className="mr-[10px]" position="end">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        handleChange({ target: { name: 'status', value: '' } });
                                                    }}
                                                >
                                                    <ClearIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                    value={query.status}
                                    label="任务状态"
                                    onChange={handleChange}
                                >
                                    {singleMissionStatusEnumList.map((item: any) => (
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
                                name="claimUsername"
                                value={query.claimUsername}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col className="flex items-end" span={6}>
                            <Button
                                type="primary"
                                disabled={!searchParams.get('notificationUid')}
                                icon={<SearchOutlined rev={undefined} />}
                                onClick={() => {
                                    getList();
                                }}
                            >
                                搜索
                            </Button>
                        </Col>
                    </Row>
                </div>
                <div className="flex items-end gap-2">
                    <Button
                        disabled={uids?.length === 0}
                        onClick={() => setDelsOpen(true)}
                        danger
                        icon={<DeleteOutlined rev={undefined} />}
                        type="primary"
                    >
                        批量删除
                    </Button>
                    <Button
                        disabled={!searchParams.get('notificationUid') || status === 'published'}
                        onClick={() => {
                            setAddOpen(true);
                        }}
                        type="primary"
                    >
                        绑定创作计划
                    </Button>
                    <Button
                        disabled={tableData.length === 0}
                        onClick={async () => {
                            const res = await singleExport({ ...query, notificationUid: searchParams.get('notificationUid') });
                            if (res) {
                                console.log(res);
                                const link = document.createElement('a');
                                link.href = window.URL.createObjectURL(res);
                                link.download = '绑定通告任务列表.xls';
                                link.click();
                            }
                        }}
                        type="primary"
                        icon={<ExportOutlined rev={undefined} />}
                    >
                        导出
                    </Button>
                </div>
            </div>
            <Table
                rowKey={'uid'}
                size="small"
                rowSelection={{
                    ...rowSelection
                }}
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
                    className="w-[90%]"
                    secondary={
                        <IconButton onClick={() => setEditOpen(false)} size="large" aria-label="close modal">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    <CardContent sx={{ width: '100%' }}>
                        <Steps
                            className="mb-[20px]"
                            onChange={(value) => {
                                setEditData({
                                    ...editData,
                                    status: singleMissionStatusEnumList[value].value
                                });
                            }}
                            current={singleMissionStatusEnumList.findIndex((item) => item.value === editData.status)}
                            size="small"
                            progressDot
                            items={singleMissionStatusEnumList.map((item: any) => {
                                return {
                                    title: item.label
                                };
                            })}
                        />
                        <Row gutter={20}>
                            <Col span={24}>
                                <FormControl sx={{ mb: 2 }} color="secondary" size="small" fullWidth>
                                    <InputLabel id="status">状态</InputLabel>
                                    <Select labelId="status" name="status" value={editData.status} label="状态" onChange={handleEdit}>
                                        {singleMissionStatusEnumList.map((item: any) => (
                                            <MenuItem disabled={item.value === 'init'} key={item.value} value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Col>
                            {(editData.status === 'claimed' ||
                                editData.status === 'published' ||
                                editData.status === 'pre_settlement' ||
                                editData.status === 'settlement') && (
                                <Col span={24}>
                                    <TextField
                                        disabled={
                                            editData.status === 'published' ||
                                            editData.status === 'pre_settlement' ||
                                            editData.status === 'settlement'
                                        }
                                        sx={{ mb: 2 }}
                                        size="small"
                                        color="secondary"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        label="认领 ID"
                                        name="claimUserId"
                                        value={editData.claimUserId}
                                        onChange={handleEdit}
                                    />
                                </Col>
                            )}
                            {(editData.status === 'claimed' ||
                                editData.status === 'published' ||
                                editData.status === 'pre_settlement' ||
                                editData.status === 'settlement') && (
                                <Col span={24}>
                                    <TextField
                                        disabled={
                                            editData.status === 'published' ||
                                            editData.status === 'pre_settlement' ||
                                            editData.status === 'settlement'
                                        }
                                        sx={{ mb: 2 }}
                                        size="small"
                                        color="secondary"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        label="认领人"
                                        name="claimUsername"
                                        value={editData.claimUsername}
                                        onChange={handleEdit}
                                    />
                                </Col>
                            )}
                            {(editData.status === 'claimed' || editData.status === 'published' || editData.status === 'settlement') && (
                                <Col span={24}>
                                    <div className="relative mb-[20px]">
                                        <DatePicker
                                            disabled={editData.status === 'published' || editData.status === 'settlement'}
                                            showTime
                                            size="large"
                                            className="!w-full"
                                            value={time.claimTime}
                                            onChange={(date, dateString) => {
                                                setTime({
                                                    ...time,
                                                    claimTime: date
                                                });
                                                handleEdit({ target: { name: 'claimTime', value: date?.valueOf() } });
                                            }}
                                        />
                                        <span className=" block bg-[#fff] px-[5px] absolute top-[-7px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc]">
                                            认领时间
                                        </span>
                                    </div>
                                </Col>
                            )}
                            {editData.status === 'published' && (
                                <div className="w-full px-[20px]">
                                    <Divider />
                                    <div className="font-[600] mt-[10px] mb-[20px]">更新字段</div>
                                </div>
                            )}
                            {(editData.status === 'published' ||
                                editData.status === 'pre_settlement' ||
                                editData.status === 'settlement') && (
                                <Col span={24}>
                                    <div className="flex mb-[16px] items-center">
                                        <TextField
                                            disabled={editData.status === 'pre_settlement' || editData.status === 'settlement'}
                                            size="small"
                                            color="secondary"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            label="发布链接"
                                            name="publishUrl"
                                            value={editData.publishUrl}
                                            onChange={handleEdit}
                                        />
                                        <Button
                                            disabled={
                                                !editData.publishUrl &&
                                                (editData.status !== 'published' ||
                                                    editData.status !== 'pre_settlement' ||
                                                    editData.status !== 'pre_settlement_error')
                                            }
                                            onClick={() => {
                                                bilingDetail(editData?.uid);
                                            }}
                                            loading={bilingLoading}
                                            className="ml-[10px]"
                                            type="primary"
                                        >
                                            更新互动数据
                                        </Button>
                                    </div>
                                </Col>
                            )}
                            {(editData.status === 'published' || editData.status === 'settlement') && (
                                <Col span={24}>
                                    <div className="relative">
                                        <DatePicker
                                            disabled={editData.status === 'pre_settlement' || editData.status === 'settlement'}
                                            showTime
                                            size="large"
                                            className="!w-full mb-[20px]"
                                            value={time.publishTime}
                                            onChange={(date, dateString) => {
                                                setTime({
                                                    ...time,
                                                    publishTime: date
                                                });
                                                handleEdit({ target: { name: 'publishTime', value: date?.valueOf() } });
                                            }}
                                        />
                                        <span className=" block bg-[#fff] px-[5px] absolute top-[-7px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc]">
                                            发布时间
                                        </span>
                                    </div>
                                </Col>
                            )}
                            {editData.status === 'pre_settlement' && (
                                <div className="w-full px-[20px]">
                                    <Divider />
                                    <div className="font-[600] mt-[10px] mb-[20px]">更新字段</div>
                                </div>
                            )}
                            {editData.status === 'pre_settlement' && (
                                <Col span={24}>
                                    <TextField
                                        sx={{ mb: 2 }}
                                        size="small"
                                        type="number"
                                        color="secondary"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        label="点赞数"
                                        name="likedCount"
                                        defaultValue={0}
                                        value={editData.likedCount}
                                        onChange={handleEdit}
                                    />
                                </Col>
                            )}
                            {editData.status === 'pre_settlement' && (
                                <Col span={24}>
                                    <TextField
                                        sx={{ mb: 2 }}
                                        size="small"
                                        type="number"
                                        color="secondary"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        defaultValue={0}
                                        label="评论数"
                                        name="commentCount"
                                        value={editData.commentCount}
                                        onChange={handleEdit}
                                    />
                                </Col>
                            )}
                            {(editData.status === 'pre_settlement' || editData.status === 'settlement') && (
                                <Col span={24}>
                                    <div className="relative">
                                        <DatePicker
                                            disabled={editData.status === 'settlement'}
                                            showTime
                                            size="large"
                                            className="!w-full mb-[20px]"
                                            value={time.preSettlementTime}
                                            onChange={(date, dateString) => {
                                                setTime({
                                                    ...time,
                                                    preSettlementTime: date
                                                });
                                                handleEdit({ target: { name: 'preSettlementTime', value: date?.valueOf() } });
                                            }}
                                        />
                                        <span className=" block bg-[#fff] px-[5px] absolute top-[-7px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc]">
                                            预结算时间
                                        </span>
                                    </div>
                                </Col>
                            )}
                            {editData.status === 'pre_settlement' && (
                                <Col span={24}>
                                    <TextField
                                        sx={{ mb: 2 }}
                                        size="small"
                                        disabled={editData.status === 'pre_settlement' || editData.status === 'settlement'}
                                        color="secondary"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        helperText="点击保存，自动计算预计花费"
                                        label="预计花费"
                                        name="estimatedAmount"
                                        value={editData.estimatedAmount}
                                        onChange={(e) => {
                                            if (e.target.value === '' || /^\d+(\.\d{0,1})?$/.test(e.target.value)) {
                                                setEditData({
                                                    ...editData,
                                                    [e.target.name]: e.target.value
                                                });
                                            }
                                        }}
                                    />
                                </Col>
                            )}
                            {editData.status === 'settlement' && (
                                <div className="w-full px-[20px]">
                                    <Divider />
                                    <div className="font-[600] mt-[10px] mb-[20px]">更新字段</div>
                                </div>
                            )}
                            {editData.status === 'settlement' && (
                                <Col span={24}>
                                    <div className="relative">
                                        <DatePicker
                                            showTime
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
                                        <span className=" block bg-[#fff] px-[5px] absolute top-[-7px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc]">
                                            结算时间
                                        </span>
                                    </div>
                                </Col>
                            )}
                            {editData.status === 'settlement' && (
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
                                        onChange={(e) => {
                                            if (e.target.value === '' || /^\d+(\.\d{0,1})?$/.test(e.target.value)) {
                                                setEditData({
                                                    ...editData,
                                                    [e.target.name]: e.target.value
                                                });
                                            }
                                        }}
                                    />
                                </Col>
                            )}
                            {/* <Col span={24}>
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
                            </Col> */}
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
            {detailOpen && <DetailModal open={detailOpen} handleClose={() => setDetailOpen(false)} businessUid={businessUid} />}
            {addOpen && <AddAnnounce addOpen={addOpen} setAddOpen={setAddOpen} />}
            <Confirm open={executeOpen} handleClose={() => setExecuteOpen(false)} handleOk={Execute} />
            <Confirm open={delsOpen} handleClose={() => setDelsOpen(false)} handleOk={handleDels} />
        </div>
    );
};
export default Announce;
