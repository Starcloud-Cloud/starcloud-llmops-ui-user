import {
    Button as Buttons,
    Modal,
    IconButton,
    CardContent,
    Switch,
    FormControl,
    InputLabel,
    Select as Selects,
    MenuItem,
    TextField,
    CardActions,
    Grid,
    Divider,
    InputAdornment,
    Box,
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import MainCard from 'ui-component/cards/MainCard';
import { Table, Button, Tag, Row, Col, DatePicker, Steps, Tooltip, Popover, Collapse, InputNumber, Select, Form } from 'antd';
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
import copy from 'clipboard-copy';
import './addModal.scss';
const Announce = ({
    status,
    isPublic,
    setIsPublic,
    singleMissionStatusEnumList,
    claimLimit,
    minFansNum,
    setminFansNum,
    setclaimLimit,
    limitSave,
    address,
    fansNum,
    gender
}: {
    status?: string;
    isPublic: boolean;
    setIsPublic: (data: boolean) => void;
    singleMissionStatusEnumList: any[];
    claimLimit: any;
    setclaimLimit: (data: any) => void;
    minFansNum: any;
    setminFansNum: (data: any) => void;
    limitSave: (data: boolean) => void;
    address: any[];
    fansNum: any[];
    gender: any[];
}) => {
    const { Option } = Select;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const handleTransfer = (key: string, msg?: string) => {
        switch (key) {
            case 'init':
                return (
                    <Tag className="!mr-0" color="processing">
                        待发布
                    </Tag>
                );
            case 'stay_claim':
                return (
                    <Tag className="!mr-0" color="warning">
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
                    <Tag className="!mr-0" color="success">
                        结算
                    </Tag>
                );
            case 'complete':
                return (
                    <Tag className="!mr-0" color="success">
                        完成
                    </Tag>
                );
            case 'close':
                return (
                    <Popover content={msg}>
                        <Tag className="!mr-0 cursor-pointer" color="error">
                            关闭
                        </Tag>
                    </Popover>
                );
            case 'settlement_error':
                return (
                    <Popover content={msg}>
                        <Tag className="cursor-pointer !mr-0" color="error">
                            结算异常
                        </Tag>
                    </Popover>
                );
            case 'pre_settlement_error':
                return (
                    <Popover content={msg}>
                        <Tag className="!mr-0 cursor-pointer" color="error">
                            预结算异常
                        </Tag>
                    </Popover>
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
            title: '创作计划',
            dataIndex: 'planName'
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (_, row) => (
                <div>
                    {handleTransfer(
                        row.status,
                        row.status === 'close'
                            ? row.closeMsg
                            : row.status === 'pre_settlement_error'
                            ? row.preSettlementMsg
                            : row.status === 'settlement_error'
                            ? row.settlementMsg
                            : undefined
                    )}
                </div>
            )
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
            title: '发布链接',
            render: (_, row) => (
                <Popover content={'点击跳转'}>
                    <div onClick={() => window.open(row.publishUrl)} className="w-[150px] cursor-pointer hover:text-[#673ab7]">
                        {row.publishUrl}
                    </div>
                </Popover>
            )
        },
        {
            title: '认领链接',
            render: (_, row) => (
                <Popover content={'点击复制'}>
                    <div
                        onClick={() => {
                            copy(row.claimUrl);
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: '复制成功',
                                    variant: 'alert',
                                    alert: {
                                        color: 'success'
                                    },
                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                    transition: 'SlideDown',
                                    close: false
                                })
                            );
                        }}
                        className="w-[150px] cursor-pointer hover:text-[#673ab7]"
                    >
                        {row.claimUrl}
                    </div>
                </Popover>
            )
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
                    {status !== 'published' ? (
                        <Tooltip title={<span className="text-[#000]">只有通告发布后才能编辑</span>} color={'#fff'}>
                            <div className="text-[#000]/[0.26] w-[64px] h-[30.75px] inline-block text-center leading-[30.75px] items-center cursor-pointer">
                                编辑
                            </div>
                        </Tooltip>
                    ) : (
                        <Buttons
                            size="small"
                            color="secondary"
                            onClick={() => {
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
                    )}
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
            const result = await singleRefresh({ uid, publishUrl: editData.publishUrl });
            setBilingLoading(false);
            if (result) {
                console.log(result);
                setEditData(result);
            }
        } catch (err) {
            setBilingLoading(false);
        }
    };
    const [tableData, setTableData] = useState<any[]>([]);

    const handleRes = (data: { name: string; value: any }) => {
        setclaimLimit({
            ...claimLimit,
            [data.name]: data.value
        });
    };
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
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    transition: 'SlideDown',
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
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    transition: 'SlideDown',
                    close: false
                })
            );
        }
    };
    //编辑
    const [time, setTime] = useState<any>({});
    const [editData, setEditData] = useState<any>({});
    useEffect(() => {
        if (editData.status === 'settlement') {
            if (!editData.settlementAmount && editData.estimatedAmount) {
                setEditData({
                    ...editData,
                    settlementAmount: editData.estimatedAmount
                });
            }
        }
    }, [editData]);
    const handleEdit = (e: any) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };
    const handleSave = async () => {
        const result = await singleModify({
            ...editData,
            claimUserId: editData.claimUserId || 0,
            likedCount: editData.likedCount || 0,
            commentCount: editData.commentCount || 0
        });
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
            <Collapse
                items={[
                    {
                        key: '1',
                        label: '通告发布配置',
                        children: (
                            <div>
                                <div className="font-[500] mb-[20px]">是否公开通告</div>
                                <div className="flex items-center mb-[20px]">
                                    <span>是否公开</span>
                                    <Switch color="secondary" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
                                </div>
                                <div className="font-[500] mt-[40px] mb-[20px]">领取人员限制</div>
                                <div className="flex justify-between items-center">
                                    <Row className="flex-1" gutter={20}>
                                        <Col className="mb-[20px] flex items-center" lg={12}>
                                            <div className="font-[500] whitespace-nowrap w-[100px]">地区限制</div>
                                            <FormControl
                                                className="w-[300px] 2xl:w-[400px] ml-[10px]"
                                                fullWidth
                                                key={claimLimit?.address}
                                                color="secondary"
                                                size="small"
                                            >
                                                <Selects
                                                    size="small"
                                                    labelId="addres"
                                                    name="address"
                                                    multiple
                                                    endAdornment={
                                                        claimLimit?.address &&
                                                        claimLimit?.address !== 'unlimited' && (
                                                            <InputAdornment className="mr-[10px]" position="end">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => {
                                                                        handleRes({ name: 'address', value: ['unlimited'] });
                                                                    }}
                                                                >
                                                                    <ClearIcon />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }
                                                    renderValue={(selected) => (
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {selected.map((value: any) => (
                                                                <Chip
                                                                    size="small"
                                                                    key={value}
                                                                    label={address?.filter((item) => item.value === value)[0]?.label}
                                                                />
                                                            ))}
                                                        </Box>
                                                    )}
                                                    value={claimLimit?.address}
                                                    onChange={(e: any) => {
                                                        console.log(e.target.value);
                                                        if (e.target.value?.length > 1) {
                                                            handleRes({
                                                                name: 'address',
                                                                value: e.target.value?.filter((value: any) => value !== 'unlimited')
                                                            });
                                                        } else {
                                                            handleRes(e.target);
                                                        }
                                                    }}
                                                >
                                                    {address?.map(
                                                        (item) =>
                                                            item.label !== '不限' && (
                                                                <MenuItem key={item.value} value={item.value}>
                                                                    {item.label}
                                                                </MenuItem>
                                                            )
                                                    )}
                                                </Selects>
                                            </FormControl>
                                        </Col>
                                        <Col className="mb-[20px] flex items-center" lg={12}>
                                            <div className="font-[500] whitespace-nowrap w-[100px]">粉丝</div>
                                            <div className="relative">
                                                <FormControl
                                                    fullWidth
                                                    className="w-[300px]  xl:w-[400px] ml-[10px]"
                                                    key={minFansNum}
                                                    color="secondary"
                                                    size="small"
                                                >
                                                    <Selects
                                                        size="small"
                                                        name="address"
                                                        endAdornment={
                                                            minFansNum && (
                                                                <InputAdornment className="mr-[10px]" position="end">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => {
                                                                            setminFansNum(0);
                                                                        }}
                                                                    >
                                                                        <ClearIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }
                                                        value={minFansNum}
                                                        onChange={(e: any) => {
                                                            setminFansNum(e.target.value);
                                                        }}
                                                    >
                                                        {fansNum?.map((item) => (
                                                            <MenuItem
                                                                style={{ display: item.label !== '不限' ? 'block' : 'none' }}
                                                                key={item.value}
                                                                value={item.value}
                                                            >
                                                                {item.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Selects>
                                                </FormControl>
                                                <div className="bg-[#f8fafc] w-[10px] h-[10px] absolute right-[1px] top-[15px]"></div>
                                            </div>
                                        </Col>
                                        <Col className="flex items-center" lg={12}>
                                            <div className="font-[500] whitespace-nowrap w-[100px]">性别</div>
                                            <FormControl
                                                className="w-[300px]  xl:w-[400px] ml-[10px]"
                                                key={claimLimit?.gender}
                                                color="secondary"
                                                size="small"
                                                fullWidth
                                            >
                                                <Selects
                                                    defaultValue={'不限'}
                                                    name="gender"
                                                    endAdornment={
                                                        claimLimit?.gender &&
                                                        claimLimit?.gender !== 'unlimited' && (
                                                            <InputAdornment className="mr-[10px]" position="end">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => {
                                                                        handleRes({ name: 'gender', value: 'unlimited' });
                                                                    }}
                                                                >
                                                                    <ClearIcon />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }
                                                    value={claimLimit?.gender}
                                                    onChange={(e: any) => handleRes(e.target)}
                                                >
                                                    {gender?.map((item) => (
                                                        <MenuItem
                                                            style={{ display: item.label !== '不限' ? 'block' : 'none' }}
                                                            key={item.value}
                                                            value={item.value}
                                                        >
                                                            {item.label}
                                                        </MenuItem>
                                                    ))}
                                                </Selects>
                                            </FormControl>
                                        </Col>
                                        <Col className="flex items-center" lg={12}>
                                            <div className="font-[500] whitespace-nowrap w-[100px]">每人领取数量</div>
                                            <InputNumber
                                                className="w-[300px]  xl:w-[400px] ml-[10px] bg-[#f8fafc]"
                                                size="large"
                                                min={1}
                                                value={claimLimit?.claimNum}
                                                onChange={(e) => {
                                                    handleRes({ name: 'claimNum', value: e });
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Button
                                        disabled={status === 'published'}
                                        type="primary"
                                        className="ml-[50px]"
                                        onClick={() => {
                                            limitSave(true);
                                        }}
                                    >
                                        保存
                                    </Button>
                                </div>
                            </div>
                        )
                    }
                ]}
            />
            <div className="flex justify-between gap-2 my-[20px]">
                <div className="flex-1">
                    <Row gutter={20} align-items="center">
                        <Col span={6}>
                            <FormControl key={query.status} color="secondary" size="small" fullWidth>
                                <InputLabel id="status">任务状态</InputLabel>
                                <Selects
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
                                </Selects>
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
                                icon={<SearchOutlined />}
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
                    <Button disabled={uids?.length === 0} onClick={() => setDelsOpen(true)} danger icon={<DeleteOutlined />} type="primary">
                        批量删除
                    </Button>
                    <Tooltip
                        title={
                            !searchParams.get('notificationUid') || status === 'published' ? (
                                <span className="text-[#000]">只有待发布状态才能重新绑定创作计划</span>
                            ) : (
                                ''
                            )
                        }
                        color="#fff"
                    >
                        <Button
                            disabled={!searchParams.get('notificationUid') || status === 'published'}
                            onClick={() => {
                                setAddOpen(true);
                            }}
                            type="primary"
                        >
                            绑定创作计划
                        </Button>
                    </Tooltip>
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
                        icon={<ExportOutlined />}
                    >
                        导出
                    </Button>
                    {/* <Button
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
                        icon={<ImportOutlined   />}
                    >
                        导入
                    </Button> */}
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
                                    <Selects labelId="status" name="status" value={editData.status} label="状态" onChange={handleEdit}>
                                        {singleMissionStatusEnumList.map((item: any) => (
                                            <MenuItem disabled={item.value === 'init'} key={item.value} value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Selects>
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
                                        defaultValue={'0'}
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
                            {(editData.status === 'claimed' ||
                                editData.status === 'published' ||
                                editData.status === 'settlement' ||
                                editData.status === 'pre_settlement') && (
                                <Col span={24}>
                                    <div className="relative mb-[20px]">
                                        <DatePicker
                                            disabled={
                                                editData.status === 'published' ||
                                                editData.status === 'settlement' ||
                                                editData.status === 'pre_settlement'
                                            }
                                            placeholder="默认当前时间"
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
                                        <span className=" block px-[5px] absolute top-[-7px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc]">
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
                            {(editData.status === 'published' ||
                                editData.status === 'settlement' ||
                                editData.status === 'pre_settlement') && (
                                <Col span={24}>
                                    <div className="relative">
                                        <DatePicker
                                            disabled={
                                                editData.status === 'pre_settlement' ||
                                                editData.status === 'settlement' ||
                                                editData.status === 'pre_settlement'
                                            }
                                            showTime
                                            size="large"
                                            placeholder="默认当前时间"
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
                                        <span className=" block px-[5px] absolute top-[-7px] left-2 text-[12px] bg-gradient-to-b from-[#fff] to-[#f8fafc]">
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
                            {(editData.status === 'pre_settlement' || editData.status === 'settlement') && (
                                <Col span={24}>
                                    <TextField
                                        disabled={editData.status === 'settlement'}
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
                            {(editData.status === 'pre_settlement' || editData.status === 'settlement') && (
                                <Col span={24}>
                                    <TextField
                                        disabled={editData.status === 'settlement'}
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
                                            placeholder="默认当前时间"
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
                            {editData.status === 'pre_settlement' ||
                                (editData.status === 'settlement' && (
                                    <Col span={24}>
                                        <TextField
                                            sx={{ mb: 2 }}
                                            size="small"
                                            disabled={editData.status === 'pre_settlement' || editData.status === 'settlement'}
                                            color="secondary"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            helperText="点击保存，自动计算预结算金额"
                                            label="预结算金额"
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
                                ))}
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
                                            placeholder="默认当前时间"
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
