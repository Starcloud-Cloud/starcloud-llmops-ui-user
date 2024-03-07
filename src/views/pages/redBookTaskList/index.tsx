import { Button, Grid, IconButton, Tooltip, TextField, FormControl, InputLabel, Select, InputAdornment, MenuItem } from '@mui/material';
import { Popover, Spin, Tag, DatePicker } from 'antd';

import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ReorderIcon from '@mui/icons-material/Reorder';

import MainCard from 'ui-component/cards/MainCard';
import React, { useEffect, useState } from 'react';
import { ArrangementOrder, EnhancedTableHeadProps } from 'types';
import dayjs from 'dayjs';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Divider, Progress } from 'antd';
import AddIcon from '@mui/icons-material/Add';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useNavigate } from 'react-router-dom';
import { delListing, draftClone, draftExport, getListingPage } from 'api/listing/build';
import { Confirm } from 'ui-component/Confirm';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { config } from 'utils/axios/config';
import axios from 'axios';
import { getAccessToken } from 'utils/auth';
const { base_url } = config;
import AddModal from './modal';
import DetailModal from './components/addModal';
import { listTemplates, planPage, planDelete, planCopy, planExecute } from 'api/redBook/batchIndex';
import copy from 'clipboard-copy';
import ReplayIcon from '@mui/icons-material/Replay';
import imgLoading from 'assets/images/picture/loading.gif';

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
    { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
    { id: 'title', numeric: false, disablePadding: false, label: '计划名称' },
    { id: 'endpoint', numeric: false, disablePadding: false, label: '渠道' },
    { id: 'score', numeric: false, disablePadding: false, label: '成功数/失败数/总数' },
    { id: 'status', numeric: false, disablePadding: false, label: ' 状态' },
    { id: 'creator', numeric: false, disablePadding: false, label: ' 创作者' },
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
                {/* <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts'
                        }}
                    />
                </TableCell> */}
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'center'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ pl: 3, whiteSpace: 'nowrap' }}
                        className={headCell.label === '操作' ? 'sticky right-0 bg-white !px-2' : '!px-2'}
                    >
                        {[''].includes(headCell.id) ? (
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

const RedBookTaskList: React.FC = () => {
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
    const [loading, setLoading] = useState(false);

    //模板选择
    const [open, setOpen] = useState(false);
    const [templateList, setTemplateList] = useState<any[]>([]);
    useEffect(() => {
        if (open) {
            listTemplates().then((res) => {
                setTemplateList(res);
            });
        }
    }, [open]);

    //创建的内容
    const [detailOpen, setDetailOpen] = useState(false);

    const delOpen = Boolean(delAnchorEl);
    const navigate = useNavigate();
    const [query, setQuery] = useState<any>({});
    const changeQuery = (data: any) => {
        setQuery({
            ...query,
            [data.name]: data.value
        });
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
            planPage({
                ...pageVO,
                ...query,
                startTime: query.createTime ? dayjs(query.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00' : undefined,
                endTime: query.createTime ? dayjs(query.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59' : undefined,
                createTime: undefined
            }).then((res) => {
                const fetchedRows = res.list;
                setRows([...fetchedRows]);
                setTotal(res?.page?.total);
            });
        };
        fetchPageData();
    }, [page, rowsPerPage, count, order, orderBy]);

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
        const data = delType === 0 ? [row?.uid] : selected;
        const res = await planDelete(data);
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
    //复制
    const [copyOpen, setCopyOpen] = useState(false);
    const handleCopy = async () => {
        const res = await planCopy({
            uid: row?.uid
        });
        if (res) {
            setCopyOpen(false);
            dispatch(
                openSnackbar({
                    open: true,
                    message: '复制创作计划成功',
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
        }
    };
    const [executeOpen, setExecuteOpen] = useState(false);
    const Execute = () => {
        planExecute({ uid: row?.uid }).then((res) => {
            setExecuteOpen(false);
            forceUpdate();
        });
    };

    const addPlan = async () => {
        navigate('/batchSmallRedBook');
    };

    const handleEdit = async (uid: string) => {
        navigate('/batchSmallRedBook?uid=' + uid);
    };
    const { RangePicker } = DatePicker;
    return (
        <MainCard
            content={false}
            title={
                <div>
                    <div className="flex justify-between items-center">
                        <div>创作计划</div>
                        <Button color="secondary" startIcon={<AddIcon />} onClick={() => addPlan()} variant="contained" size="small">
                            新建创作计划
                        </Button>
                    </div>
                </div>
            }
            // secondary={
            //     <div>
            //         <Button color="secondary" startIcon={<AddIcon />} onClick={() => addPlan()} variant="contained" size="small">
            //             新建创作计划
            //         </Button>
            //         {/* <Divider type={'vertical'} />
            //         <Button
            //             disabled={selected.length === 0}
            //             className="ml-1"
            //             size="small"
            //             color="secondary"
            //             startIcon={<DeleteIcon />}
            //             onClick={() => {
            //                 setDelVisible(true);
            //                 setDelType(2);
            //             }}
            //             variant="contained"
            //         >
            //             批量删除
            //         </Button> */}
            //     </div>
            // }
        >
            <Grid container sx={{ my: 2 }} spacing={2}>
                <Grid item xl={2} md={3}>
                    <TextField
                        fullWidth
                        size="small"
                        color="secondary"
                        InputLabelProps={{ shrink: true }}
                        label="计划名称"
                        name="name"
                        value={query.name}
                        onChange={(e: any) => {
                            changeQuery(e.target);
                        }}
                    />
                </Grid>
                <Grid item xl={2} md={3}>
                    <FormControl key={query.type} color="secondary" size="small" fullWidth>
                        <InputLabel id="types">渠道</InputLabel>
                        <Select
                            name="type"
                            value={query.type}
                            onChange={(e: any) => changeQuery({ name: 'type', value: e.target.value })}
                            endAdornment={
                                query.type && (
                                    <InputAdornment className="mr-[10px]" position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                changeQuery({ name: 'type', value: '' });
                                            }}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                            labelId="types"
                            label="渠道"
                        >
                            <MenuItem value={'XHS'}>小红书</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xl={2} md={3}>
                    <FormControl key={query.status} color="secondary" size="small" fullWidth>
                        <InputLabel id="statuss">状态</InputLabel>
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
                            label="状态"
                        >
                            <MenuItem value={'PENDING'}>待执行</MenuItem>
                            <MenuItem value={'RUNNING'}>执行中</MenuItem>
                            <MenuItem value={'PAUSE'}>已暂停</MenuItem>
                            <MenuItem value={'CANCELED'}>已取消</MenuItem>
                            <MenuItem value={'COMPLETE'}>已完成</MenuItem>
                            <MenuItem value={'FAILURE'}>已失败</MenuItem>
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
                <Spin tip="请求中..." size={'large'} spinning={loading} indicator={<img width={60} src={imgLoading} />}>
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
                                        sx={{
                                            '.MuiTableCell-root': {
                                                paddingLeft: '8px',
                                                paddingRight: '8px'
                                            }
                                        }}
                                    >
                                        {/* <TableCell padding="checkbox">
                                        <Checkbox
                                            onClick={(event) => handleClick(event, row.id)}
                                            color="primary"
                                            checked={isItemSelected}
                                            inputProps={{
                                                'aria-labelledby': labelId
                                            }}
                                        />
                                    </TableCell> */}
                                        <TableCell align="center">
                                            <div className="flex items-center justify-center">
                                                <Popover
                                                    content={
                                                        <div>
                                                            <div>{row.uid}</div>
                                                        </div>
                                                    }
                                                    title="内容ID"
                                                >
                                                    <div className="line-clamp-1 w-[100px] break-words cursor-pointer">{row.uid}</div>
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
                                                                    close: false,
                                                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                                    transition: 'SlideDown'
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
                                                <span className="line-clamp-1 w-[250px] mx-auto">{row.name}</span>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className="flex items-center justify-center">小红书</div>
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className="flex items-center justify-center">
                                                <div className="flex">
                                                    <div>{row?.successCount || 0}</div>/<div>{row.failureCount || 0}</div>/
                                                    <div>{row.total || 0}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tag
                                                color={
                                                    row.status === 'PENDING'
                                                        ? 'default'
                                                        : row.status === 'RUNNING'
                                                        ? 'green'
                                                        : row.status === 'PAUSE'
                                                        ? 'warning'
                                                        : row.status === 'CANCELED'
                                                        ? 'warning'
                                                        : row.status === 'COMPLETE'
                                                        ? 'blue'
                                                        : row.status === 'FAILURE'
                                                        ? 'error'
                                                        : 'default'
                                                }
                                            >
                                                {row.status === 'PENDING'
                                                    ? '待执行'
                                                    : row.status === 'RUNNING'
                                                    ? '执行中'
                                                    : row.status === 'PAUSE'
                                                    ? '已暂停'
                                                    : row.status === 'CANCELED'
                                                    ? '已取消'
                                                    : row.status === 'COMPLETE'
                                                    ? '已完成'
                                                    : row.status === 'FAILURE'
                                                    ? '已失败'
                                                    : ''}
                                            </Tag>
                                        </TableCell>
                                        <TableCell align="center">{row.creator}</TableCell>
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
                                        <TableCell align="center" className="sticky right-0 bg-white">
                                            <div className="min-w-[180px]">
                                                <Tooltip title={'编辑'}>
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => {
                                                            handleEdit(row.uid);
                                                        }}
                                                    >
                                                        <EditIcon className="text-base" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Divider type={'vertical'} style={{ marginInline: '4px' }} />
                                                <Tooltip title={'复制'}>
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => {
                                                            setCopyOpen(true);
                                                            setRow(row);
                                                        }}
                                                    >
                                                        <ContentCopyIcon className="text-base" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Divider type={'vertical'} style={{ marginInline: '4px' }} />

                                                <Tooltip title={'删除'}>
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => {
                                                            setDelType(0);
                                                            setDelVisible(true);
                                                            setRow(row);
                                                        }}
                                                    >
                                                        <DeleteIcon className="text-base" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Divider type={'vertical'} style={{ marginInline: '4px' }} />
                                                <Tooltip title={'执行'}>
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => {
                                                            setExecuteOpen(true);
                                                            setRow(row);
                                                        }}
                                                    >
                                                        <PlayCircleOutlineIcon className="text-base" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Spin>
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
            <Confirm open={copyOpen} handleClose={() => setCopyOpen(false)} handleOk={handleCopy} />
            <Confirm open={delVisible} handleClose={() => setDelVisible(false)} handleOk={delDraft} />
            <Confirm open={executeOpen} handleClose={() => setExecuteOpen(false)} handleOk={Execute} />
            <AddModal open={open} setOpen={setOpen} templateList={templateList} />
            {detailOpen && <DetailModal detailOpen={detailOpen} setDetailOpen={setDetailOpen} />}
        </MainCard>
    );
};

export default RedBookTaskList;
