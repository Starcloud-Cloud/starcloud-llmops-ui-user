import { Button, IconButton, Tooltip } from '@mui/material';
import { Tag } from 'antd';

import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ReorderIcon from '@mui/icons-material/Reorder';

import MainCard from 'ui-component/cards/MainCard';

import React, { useEffect, useState } from 'react';
import { ArrangementOrder, EnhancedTableHeadProps } from 'types';
import dayjs from 'dayjs';
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
import { listTemplates, planPage, planDelete, planCopy, planExecute } from 'api/redBook/batchIndex';

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
    { id: 'score', numeric: false, disablePadding: false, label: '成功数/总数' },
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

    const [open, setOpen] = useState(false);
    const [templateList, setTemplateList] = useState<any[]>([]);
    useEffect(() => {
        if (open) {
            listTemplates().then((res) => {
                setTemplateList(res);
            });
        }
    }, [open]);

    const delOpen = Boolean(delAnchorEl);
    const navigate = useNavigate();

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
            planPage({ ...pageVO }).then((res) => {
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
                    message: '操作成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
            setDelVisible(false);
            forceUpdate();
            setSelected([]);
        }
    };

    const [executeOpen, setExecuteOpen] = useState(false);
    const Execute = () => {
        planExecute({ uid: row?.uid }).then((res) => {
            setExecuteOpen(false);
        });
    };

    const addPlan = async () => {
        setOpen(true);
    };

    const handleEdit = async (uid: string) => {
        navigate('/batchSmallRedBook?uid=' + uid);
    };

    const doClone = async (row: any) => {
        const res = await planCopy({
            uid: row.uid
        });
        if (res) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '操作成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
            forceUpdate();
        }
    };

    const doExport = async () => {
        await axios({
            url: `${base_url}/listing/draft/export`,
            method: 'post',
            data: selected,
            responseType: 'blob', // 将响应数据视为二进制数据流
            headers: {
                Authorization: 'Bearer ' + getAccessToken()
            }
        })
            .then((response) => {
                // 创建一个blob对象
                const blob = new Blob([response.data], { type: response.headers['content-type'] });

                // 创建一个a标签用于下载
                const downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(blob);
                downloadLink.setAttribute('download', `listing-${new Date().getTime()}.xls`); // 设置下载文件的名称
                document.body.appendChild(downloadLink);

                // 触发点击事件以开始下载
                downloadLink.click();

                // 移除下载链接
                document.body.removeChild(downloadLink);
                setSelected([]);
            })
            .catch((error) => {
                console.error('下载文件时发生错误:', error);
            });
    };

    return (
        <MainCard
            content={false}
            title="创作计划"
            secondary={
                <div>
                    <Button color="secondary" startIcon={<AddIcon />} onClick={() => addPlan()} variant="contained" size="small">
                        新建创作计划
                    </Button>
                    {/* <Divider type={'vertical'} />
                    <Button
                        disabled={selected.length === 0}
                        className="ml-1"
                        size="small"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                            setDelVisible(true);
                            setDelType(2);
                        }}
                        variant="contained"
                    >
                        批量删除
                    </Button> */}
                </div>
            }
        >
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
                            console.log(row, 'row');

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
                                        <Tooltip title={row.name}>
                                            <span className="line-clamp-1 mx-auto">{row.uid}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={row.name}>
                                            <span className="line-clamp-1 w-[120px] mx-auto">{row.name}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex items-center justify-center  w-[100px] ">小红书</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex items-center justify-center">
                                            <div className="flex">
                                                <div>{row?.successCount || 0}</div>/
                                                <div>{row.successCount + row.failureCount + row.pendingCount || 0}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tag
                                            color={
                                                row.status === 'PENDING'
                                                    ? 'green'
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
                                    <TableCell align="center">
                                        <div className="w-[180px]">
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
                                            <Tooltip title={'查看操作任务'}>
                                                <IconButton
                                                    aria-label="delete"
                                                    size="small"
                                                    onClick={() => {
                                                        navigate(`/redBookContentList?uid=${row.uid}&name=${row.name}`);
                                                    }}
                                                >
                                                    <ReorderIcon className="text-base" />
                                                </IconButton>
                                            </Tooltip>
                                            {/* <Divider type={'vertical'} style={{ marginInline: '4px' }} />
                                        <Tooltip title={'开始'}>
                                            <IconButton aria-label="delete" size="small" onClick={() => doClone(row)}>
                                                <PlayCircleOutlineIcon className="text-base" />
                                                <StopIcon className="text-base" />
                                            </IconButton>
                                        </Tooltip> */}
                                            <Divider type={'vertical'} style={{ marginInline: '4px' }} />
                                            <Tooltip title={'复制'}>
                                                <IconButton aria-label="delete" size="small" onClick={() => doClone(row)}>
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
            <AddModal open={open} setOpen={setOpen} templateList={templateList} />
        </MainCard>
    );
};

export default RedBookTaskList;
