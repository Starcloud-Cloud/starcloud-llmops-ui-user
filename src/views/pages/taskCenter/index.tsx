import { Button, Checkbox, IconButton, Tooltip } from '@mui/material';
import { Tag } from 'antd';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import MainCard from 'ui-component/cards/MainCard';

import React, { useEffect, useState } from 'react';
import { Image } from 'antd';
import { ArrangementOrder, EnhancedTableHeadProps } from 'types';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Divider } from 'antd';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { Confirm } from 'ui-component/Confirm';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { schemePage, schemeDelete, schemeCopy } from 'api/redBook/copywriting';
import { listTemplates } from 'api/redBook/batchIndex';
import AddModal from './components/addModal';

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
    { id: 'title', numeric: false, disablePadding: false, label: '任务名称' },
    { id: 'endpoint', numeric: false, disablePadding: false, label: '任务模式' },
    { id: 'score', numeric: false, disablePadding: false, label: '任务周期' },
    { id: 'status', numeric: false, disablePadding: false, label: ' 任务投入总价' },
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
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts'
                        }}
                    />
                </TableCell>
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
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('');
    const [selected, setSelected] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [dense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [delAnchorEl, setDelAnchorEl] = useState<null | HTMLElement>(null);
    const [delVisible, setDelVisible] = useState(false);
    const [delType, setDelType] = useState(0); //0.单个 1.多个
    const [row, setRow] = useState<TableEnhancedCreateDataType | null>();

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
            schemePage({ ...pageVO }).then((res) => {
                const fetchedRows = res?.list;
                setRows([...fetchedRows]);
                setTotal(res?.total);
            });
        };
        if (!detailOpen) {
            fetchPageData();
        }
    }, [page, rowsPerPage, count, order, orderBy, detailOpen]);
    const [title, setTitle] = useState('');
    const [rows, setRows] = useState<any[]>([{}]);

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
        const res = await schemeDelete(row?.uid);
        if (res) {
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
            setDelVisible(false);
            forceUpdate();
            setSelected([]);
        }
    };

    const [executeOpen, setExecuteOpen] = useState(false);
    const Execute = () => {
        schemeCopy({ uid: row?.uid }).then((res) => {
            if (res) {
                forceUpdate();
                setExecuteOpen(false);
                openSnackbar({
                    open: true,
                    message: '复制成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                });
            }
        });
        // planExecute({ uid: row?.uid }).then((res) => {
        setExecuteOpen(false);
        // });
    };

    const addPlan = async () => {
        setTitle('新建创作方案');
        setDetailOpen(true);
    };
    const [editUid, setEditUid] = useState('');
    const handleEdit = async (uid: string) => {
        setEditUid(uid);
        setTitle('编辑创作方案');
        setDetailOpen(true);
    };

    return (
        <MainCard
            content={false}
            title="通告中心"
            secondary={
                <div>
                    <Button color="secondary" startIcon={<AddIcon />} onClick={() => addPlan()} variant="contained" size="small">
                        创作任务
                    </Button>
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
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            onClick={(event) => handleClick(event, row.id)}
                                            color="primary"
                                            checked={isItemSelected}
                                            inputProps={{
                                                'aria-labelledby': labelId
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={row.name}>
                                            <span className="line-clamp-1 w-[200px] mx-auto">{row.name}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex items-center justify-center">{row.model}</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div>{row.category}</div>
                                    </TableCell>
                                    <TableCell align="center">{row.example}</TableCell>
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
                                        <div className="whitespace-nowrap">
                                            <Button
                                                variant="text"
                                                color="secondary"
                                                aria-label="delete"
                                                size="small"
                                                onClick={() => {
                                                    handleEdit(row.uid);
                                                }}
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
                                                }}
                                            >
                                                发布任务、取消任务
                                            </Button>
                                            <Button
                                                aria-label="delete"
                                                size="small"
                                                color="secondary"
                                                onClick={() => {
                                                    setRow(row);
                                                    setExecuteOpen(true);
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
                rowsPerPageOptions={[5, 10]}
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
            {detailOpen && <AddModal title={title} uid={editUid} detailOpen={detailOpen} setDetailOpen={setDetailOpen} />}
        </MainCard>
    );
};

export default TaskCenter;
