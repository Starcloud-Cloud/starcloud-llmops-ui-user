import { Button, Tooltip } from '@mui/material';
import { Tag, Popover } from 'antd';
import {
    Box,
    Table,
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
import { DatePicker } from 'antd';
import { visuallyHidden } from '@mui/utils';
import MainCard from 'ui-component/cards/MainCard';
import React, { useEffect, useState } from 'react';
import { ArrangementOrder, EnhancedTableHeadProps } from 'types';
import dayjs from 'dayjs';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
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

export interface FiveDesc {}

export interface TableEnhancedCreateDataType {
    id: number;
    uid: string;
    title: string;
    endpoint: string;
    asin: string;
    keywordResume?: any;
    keywordMetaData?: any;
    draftConfig: DraftConfig;
    score?: any;
    itemScore: ItemScore;
    fiveDesc: FiveDesc;
    productDesc: string;
    searchTerm: string;
    version: number;
    status: string;
    createTime: number;
    updateTime: number;
    matchSearchers: number;
    searchersProportion: number;
    scoreProportion: number;
    type: number;
}

const headCells = [
    { id: 'uid', numeric: false, disablePadding: false, label: 'ID' },
    { id: 'title', numeric: false, disablePadding: false, label: '通告名称' },
    { id: 'platform', numeric: false, disablePadding: false, label: '发布平台' },
    { id: 'type', numeric: false, disablePadding: false, label: '通告类型' },
    { id: 'field', numeric: false, disablePadding: false, label: '通告类目' },
    { id: 'status', numeric: false, disablePadding: false, label: '通告状态' },
    { id: 'startTime', numeric: false, disablePadding: false, label: '通告开始时间' },
    { id: 'endTime', numeric: false, disablePadding: false, label: '通告结束时间' },
    { id: 'settlementCount', numeric: false, disablePadding: false, label: '任务状态' },
    { id: 'postingUnitPrice', numeric: false, disablePadding: false, label: '单价' },
    // { id: 'singleBudget', numeric: false, disablePadding: false, label: '单个任务最大预算' },
    { id: 'notificationBudget', numeric: false, disablePadding: false, label: '通告总预算' },
    { id: 'createUser', numeric: false, disablePadding: false, label: '创建者' },
    { id: 'createTime', numeric: false, disablePadding: false, label: '创建时间' },
    { id: 'updateTime', numeric: false, disablePadding: false, label: '更新时间' },
    { id: 'operate', numeric: false, disablePadding: false, label: '操作' }
];

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }: EnhancedTableHeadProps) {
    const createSortHandler = (property: string) => (event: React.SyntheticEvent) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'center'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ pl: 3, whiteSpace: 'nowrap' }}
                    >
                        {['updateTime', 'createTime', 'score'].includes(headCell.id) ? (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id && (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                )}
                            </TableSortLabel>
                        ) : (
                            headCell.label
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// ==============================|| TABLE - ENHANCED ||============================== //

const TaskCenter: React.FC = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('');
    const [selected, setSelected] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [dense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [delAnchorEl, setDelAnchorEl] = useState<null | HTMLElement>(null);
    const [delVisible, setDelVisible] = useState(false);
    const [delType, setDelType] = useState(0); //0.单个 1.多个
    const [row, setRow] = useState<TableEnhancedCreateDataType | null>();
    //创建的内容
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
                startTime: query.createTime ? query.createTime[0]?.valueOf() : undefined,
                endTime: query.createTime ? query.createTime[1]?.valueOf() : undefined,
                createTime: undefined
            }).then((res) => {
                const fetchedRows = res?.list;
                setRows([...fetchedRows]);
                setTotal(res?.total);
            });
        };
        fetchPageData();
    }, [page, rowsPerPage, count, order, orderBy]);
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
    const [rows, setRows] = useState<any[]>([]);

    const handleRequestSort = (event: React.SyntheticEvent, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            if (selected.length > 0) {
                setSelected([]);
            } else {
                const newSelectedId: number[] = rows.map((n) => n.id);
                setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: any[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
        setRowsPerPage(parseInt(event?.target.value!, 10));
        setPage(0);
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const delDraft = async () => {
        const res = await notificationDelete(row?.uid);
        if (res) {
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
            setDelVisible(false);
            forceUpdate();
            setSelected([]);
        }
    };
    const [executeOpen, setExecuteOpen] = useState(false);
    const [publish, setPublish] = useState(true);
    const Execute = () => {
        notificationPublish(row?.uid, publish).then((res) => {
            if (res) {
                forceUpdate();
                setExecuteOpen(false);
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
            }
        });
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
                    <Button
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/taskModal')}
                        variant="contained"
                        size="small"
                    >
                        创作任务
                    </Button>
                </div>
            }
        >
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
                    <Button variant="contained" color="secondary" onClick={forceUpdate}>
                        搜索
                    </Button>
                </Grid>
            </Grid>
            <TableContainer>
                <Table sx={{ minWidth: 1000 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                    />
                    <TableBody>
                        {rows.map((row, index) => {
                            if (typeof row === 'number') {
                                return null; // 忽略数字类型的行
                            }
                            const isItemSelected = isSelected(row.uid);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    key={row.id}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    selected={isItemSelected}
                                >
                                    <TableCell align="center">
                                        <div className="flex items-center">
                                            <Popover
                                                zIndex={9999}
                                                content={
                                                    <div>
                                                        <div>{row.uid}</div>
                                                    </div>
                                                }
                                            >
                                                <div className="line-clamp-1 w-[70px] break-words cursor-pointer">{row.uid}</div>
                                            </Popover>
                                            <Tooltip title={'复制'}>
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
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={row.name}>
                                            <span className="line-clamp-1 w-[100px] mx-auto">{row.name}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center" className="w-[100px]">
                                        {platformList?.filter((item) => item.value === row.platform)[0]?.label}
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex items-center justify-center">{row.type === 'posting' ? '发帖' : row.type}</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tag color="blue">{categoryList?.filter((item) => item.code === row.field)[0]?.name}</Tag>
                                    </TableCell>
                                    <TableCell align="center">{handleTransfer(row.status)}</TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">
                                            <span> {row.startTime && dayjs(row.startTime).format('YYYY-MM-DD')}</span>
                                            <span> {row.startTime && dayjs(row.startTime).format('HH:mm:ss')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">
                                            <span> {row.endTime && dayjs(row.endTime).format('YYYY-MM-DD')}</span>
                                            <span> {row.endTime && dayjs(row.endTime).format('HH:mm:ss')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="text-center w-[150px]">
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
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="!w-[120px] text-center">
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
                                    </TableCell>
                                    {/* <TableCell align="center">{row.singleBudget}</TableCell> */}
                                    <TableCell align="center">{row.notificationBudget}</TableCell>
                                    <TableCell align="center">{row.createUser}</TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">
                                            <span> {row.createTime && dayjs(row.createTime).format('YYYY-MM-DD')}</span>
                                            <span> {row.createTime && dayjs(row.createTime).format('HH:mm:ss')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">
                                            <span> {row.updateTime && dayjs(row.updateTime).format('YYYY-MM-DD')}</span>
                                            <span> {row.updateTime && dayjs(row.updateTime).format('HH:mm:ss')}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell align="center">
                                        <div className="whitespace-nowrap">
                                            <Button
                                                variant="text"
                                                color="secondary"
                                                aria-label="delete"
                                                size="small"
                                                onClick={() => navigate('/taskModal?notificationUid=' + row.uid)}
                                            >
                                                编辑
                                            </Button>
                                            <Button
                                                aria-label="delete"
                                                size="small"
                                                color="secondary"
                                                onClick={() => {
                                                    setRow(row);
                                                    setExecuteOpen(true);
                                                    setPublish(row.status === 'init' || row.status === 'cancel_published' ? true : false);
                                                }}
                                            >
                                                {row.status === 'init' || row.status === 'cancel_published' ? '发布任务' : '取消任务'}
                                            </Button>
                                            <Button
                                                aria-label="delete"
                                                size="small"
                                                color="secondary"
                                                onClick={() => {
                                                    navigate('/taskModal?notificationUid=' + row.uid + '&view=1');
                                                }}
                                            >
                                                查看通告任务
                                            </Button>
                                            <Button
                                                variant="text"
                                                color="error"
                                                aria-label="delete"
                                                size="small"
                                                onClick={() => {
                                                    setDelType(0);
                                                    setDelVisible(true);
                                                    setRow(row);
                                                }}
                                            >
                                                删除
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

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
            <Confirm open={delVisible} handleClose={() => setDelVisible(false)} handleOk={delDraft} />
            <Confirm open={executeOpen} handleClose={() => setExecuteOpen(false)} handleOk={Execute} />
        </MainCard>
    );
};

export default TaskCenter;
