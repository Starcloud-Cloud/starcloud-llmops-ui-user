import { Tag, Tooltip, DatePicker, Table, Button, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import {
    Box,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    IconButton,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    InputAdornment,
    MenuItem
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import MainCard from 'ui-component/cards/MainCard';
import React, { useEffect, useState } from 'react';
import { ArrangementOrder, EnhancedTableHeadProps } from 'types';
import dayjs from 'dayjs';
import ClearIcon from '@mui/icons-material/Clear';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import { Confirm } from 'ui-component/Confirm';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { notificationPage, notificationDelete, notificationPublish, singleMetadata } from 'api/redBook/task';
import copy from 'clipboard-copy';

export interface DraftConfig {}

export interface ItemScore {
    matchSearchers: number;
    totalSearches: number;
}

// ==============================|| TABLE - ENHANCED ||============================== //

const TaskCenter: React.FC = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const columns: TableProps<any>['columns'] = [
        {
            title: 'ID',
            align: 'center',
            width: 200,
            render: (_, row) => (
                <div className="flex items-center">
                    <Tooltip title={row.uid}>
                        <div className="line-clamp-1 break-words cursor-pointer">{row.uid}</div>
                    </Tooltip>
                    <Tooltip placement="top" title={'复制'}>
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => {
                                copy(row.uid);
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
                        >
                            <ContentCopyIcon className="text-base" />
                        </IconButton>
                    </Tooltip>
                </div>
            )
        },
        {
            title: '通告名称',
            align: 'center',
            width: 200,
            dataIndex: 'name'
        },
        {
            title: '发布平台',
            align: 'center',
            width: 100,
            render: (_, row) => platformList?.filter((item) => item.value === row.platform)[0]?.label
        },
        {
            title: '通告类型',
            align: 'center',
            width: 100,
            render: (_, row) => (row.type === 'posting' ? '发帖' : row.type)
        },
        {
            title: '通告类目',
            align: 'center',
            width: 100,
            render: (_, row) => <Tag color="blue">{categoryList?.filter((item) => item.code === row.field)[0]?.name}</Tag>
        },
        {
            title: '通告状态',
            align: 'center',
            width: 100,
            render: (_, row) => handleTransfer(row.status)
        },
        {
            title: '通告开始时间',
            align: 'center',
            width: 200,
            render: (_, row) => dayjs(row.startTime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '通告结束时间',
            align: 'center',
            width: 200,
            render: (_, row) => dayjs(row.endTime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '任务状态',
            align: 'center',
            width: 160,
            render: (_, row) => (
                <div className="flex justify-center">
                    <div className="text-left">
                        <div>
                            待领取数：
                            {row.stayClaimCount}
                        </div>
                        <div>
                            领取数：
                            {row.claimCount}
                        </div>
                        <div>
                            用户发布数：
                            {row.publishedCount}
                        </div>
                        <div>
                            结算数：
                            {row.settlementCount}
                        </div>
                        <div>
                            任务总数：
                            {row.total}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: '任务状态',
            align: 'center',
            width: 150,
            render: (row: any) => (
                <div className="flex justify-center">
                    <div className="text-left">
                        <div>
                            发帖单价：
                            {row.unitPrice?.postingUnitPrice}元
                        </div>
                        <div>
                            回复单价：
                            {row.unitPrice?.replyUnitPrice}元
                        </div>
                        <div>
                            点赞单价：
                            {row.unitPrice?.likeUnitPrice}元
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: '通告总预算',
            align: 'center',
            width: 150,
            dataIndex: 'notificationBudget'
        },
        {
            title: '创建者',
            align: 'center',
            width: 200,
            dataIndex: 'createUser'
        },
        {
            title: '创建时间',
            align: 'center',
            width: 200,
            render: (_, row) => dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '更新时间',
            align: 'center',
            width: 200,
            render: (_, row) => dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '操作',
            align: 'center',
            fixed: 'right',
            width: 350,
            render: (_, row) => (
                <div className="flex">
                    <Button type="link" onClick={() => navigate('/taskModal?notificationUid=' + row.uid)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="提示"
                        description="请再次确认是否进行该操作？"
                        onConfirm={async () => {
                            await notificationPublish(row?.uid, row.status === 'init' || row.status === 'cancel_published' ? true : false);
                            forceUpdate();
                            openSnackbar({
                                open: true,
                                message: '操作成功',
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                },
                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                transition: 'SlideDown',
                                close: false
                            });
                        }}
                    >
                        <Button type="link">{row.status === 'init' || row.status === 'cancel_published' ? '发布任务' : '取消任务'}</Button>
                    </Popconfirm>
                    <Button type="link" onClick={() => navigate('/taskModal?notificationUid=' + row.uid + '&view=1')}>
                        查看通告任务
                    </Button>
                    <Popconfirm
                        title="提示"
                        description="请再次确认是否删除？"
                        onConfirm={async () => {
                            await notificationDelete(row?.uid);
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
                            forceUpdate();
                        }}
                    >
                        <Button type="link" danger>
                            删除
                        </Button>
                    </Popconfirm>
                </div>
            )
        }
    ];
    //创建的内容
    const handleTransfer = (key: string) => {
        switch (key) {
            case 'init':
                return (
                    <Tag className="!mr-0" color="blue">
                        待发布
                    </Tag>
                );
            case 'published':
                return (
                    <Tag className="!mr-0" color="success">
                        发布
                    </Tag>
                );
            case 'cancel_published':
                return (
                    <Tag className="!mr-0" color="blue">
                        取消发布
                    </Tag>
                );
        }
    };
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);
    const forceUpdate = () => setCount((pre) => pre + 1);
    useEffect(() => {
        const fetchPageData = async () => {
            const pageVO: any = { pageNo: page + 1, pageSize: rowsPerPage };
            if (orderBy) {
                pageVO.sortField = orderBy;
                pageVO.asc = order === 'asc';
            }
            notificationPage({
                ...pageVO,
                ...query,
                createStartTime: query.createTime ? query.createTime[0]?.format('YYYY-MM-DD') + ' 00:00:00' : undefined,
                createEndTime: query.createTime ? query.createTime[1]?.format('YYYY-MM-DD') + ' 23:59:59' : undefined,
                createTime: undefined
            }).then((res) => {
                const fetchedRows = res?.list;
                setTableData([...fetchedRows]);
                setTotal(res?.total);
            });
        };
        fetchPageData();
    }, [page, rowsPerPage, count, order, orderBy]);
    const [tableData, setTableData] = useState<any[]>([]);

    //分页设置
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
        setRowsPerPage(parseInt(event?.target.value!, 10));
        setPage(0);
    };

    const [categoryList, setCategoryList] = useState<any[]>([]);
    const [platformList, setPlatformList] = useState<any[]>([]);
    const [notificationStatusEnumList, setNotificationStatusEnumList] = useState<any[]>([]);

    useEffect(() => {
        singleMetadata().then((res) => {
            setCategoryList(res?.category);
            setPlatformList(res?.platform);
            setNotificationStatusEnumList(res?.notificationStatusEnum);
        });
    }, []);

    //搜索
    const { RangePicker } = DatePicker;
    const [query, setQuery] = useState<any>({});
    const changeQuery = (data: { name: string; value: string }) => {
        setQuery({
            ...query,
            [data.name]: data.value
        });
    };
    return (
        <MainCard
            content={false}
            title="通告中心"
            secondary={
                <div>
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => navigate('/taskModal')}>
                        创作任务
                    </Button>
                </div>
            }
        >
            <div className="p-4 pb-0">
                <Grid container sx={{ my: 2 }} spacing={2}>
                    <Grid item xl={2} md={3}>
                        <TextField
                            fullWidth
                            size="small"
                            color="secondary"
                            InputLabelProps={{ shrink: true }}
                            label="通告名称"
                            name="name"
                            value={query.name}
                            onChange={(e: any) => {
                                changeQuery(e.target);
                            }}
                        />
                    </Grid>
                    <Grid item xl={2} md={3}>
                        <FormControl key={query.field} color="secondary" size="small" fullWidth>
                            <InputLabel id="types">通告类目</InputLabel>
                            <Select
                                name="field"
                                value={query.field}
                                onChange={(e: any) => changeQuery({ name: 'field', value: e.target.value })}
                                endAdornment={
                                    query.field && (
                                        <InputAdornment className="mr-[10px]" position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    changeQuery({ name: 'field', value: '' });
                                                }}
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                                labelId="types"
                                label="通告类目"
                            >
                                {categoryList?.map((item) => (
                                    <MenuItem value={item.code}>{item.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xl={2} md={3}>
                        <FormControl key={query.status} color="secondary" size="small" fullWidth>
                            <InputLabel id="statuss">通告状态</InputLabel>
                            <Select
                                name="status"
                                value={query.status}
                                onChange={(e: any) => changeQuery({ name: 'status', value: e.target.value })}
                                endAdornment={
                                    query.status && (
                                        <InputAdornment className="mr-[10px]" position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    changeQuery({ name: 'status', value: '' });
                                                }}
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                                labelId="types"
                                label="通告状态"
                            >
                                {notificationStatusEnumList?.map((item) => (
                                    <MenuItem value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xl={2} md={3}>
                        <RangePicker
                            className="bg-[#f8fafc] w-full"
                            placeholder={['创建开始时间', '创建结束时间']}
                            value={query.createTime}
                            onChange={(day, days) => {
                                setQuery({
                                    ...query,
                                    createTime: day
                                });
                            }}
                            size="large"
                        />
                    </Grid>
                    <Grid item xl={2} md={3}>
                        <Button icon={<SearchOutlined />} type="primary" onClick={forceUpdate}>
                            搜索
                        </Button>
                    </Grid>
                </Grid>
                <Table virtual pagination={false} columns={columns} dataSource={tableData} />
                {/* table pagination */}
                <TablePagination
                    rowsPerPageOptions={[20, 50, 100]}
                    component="div"
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="每页行数"
                />
            </div>
        </MainCard>
    );
};

export default TaskCenter;
