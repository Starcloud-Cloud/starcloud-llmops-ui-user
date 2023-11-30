import { Button, Tooltip } from '@mui/material';
import { Tag } from 'antd';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import MainCard from 'ui-component/cards/MainCard';
import React, { useEffect, useState } from 'react';
import { ArrangementOrder, EnhancedTableHeadProps } from 'types';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { Confirm } from 'ui-component/Confirm';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { notificationPage, notificationDelete, notificationPublish, singleRefresh } from 'api/redBook/task';

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
    { id: 'type', numeric: false, disablePadding: false, label: '通告类型' },
    { id: 'platform', numeric: false, disablePadding: false, label: '发布平台' },
    { id: 'field', numeric: false, disablePadding: false, label: '发布类目' },
    { id: 'status', numeric: false, disablePadding: false, label: '通告状态' },
    { id: 'startTime', numeric: false, disablePadding: false, label: '通告开始时间' },
    { id: 'endTime', numeric: false, disablePadding: false, label: '通告结束时间' },
    { id: 'postingUnitPrice', numeric: false, disablePadding: false, label: '发帖单价' },
    { id: 'replyUnitPrice', numeric: false, disablePadding: false, label: '回复单价' },
    { id: 'likeUnitPrice', numeric: false, disablePadding: false, label: '点赞单价' },
    { id: 'singleBudget', numeric: false, disablePadding: false, label: '单个任务预算' },
    { id: 'notificationBudget', numeric: false, disablePadding: false, label: '通告总预算' },
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
    const [rowsPerPage, setRowsPerPage] = useState(10);
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
            notificationPage({ ...pageVO }).then((res) => {
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
                    close: false
                });
            }
        });
    };
    //计费明细
    const bilingDetail = async (uid: string) => {
        const result = await singleRefresh(uid);
        if (result) {
            forceUpdate();
        }
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
                                    <TableCell align="center">{row.uid}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={row.name}>
                                            <span className="line-clamp-1 w-[200px] mx-auto">{row.name}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex items-center justify-center">{row.type === 'posting' ? '发帖' : row.type}</div>
                                    </TableCell>
                                    <TableCell align="center" className="w-[100px]">
                                        {row.platform === 'xhs'
                                            ? '小红书'
                                            : row.platform === 'tiktok'
                                            ? '抖音'
                                            : row.platform === 'other'
                                            ? '其他'
                                            : ''}
                                    </TableCell>
                                    <TableCell align="center">{row.field}</TableCell>
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
                                    <TableCell align="center">{row.unitPrice?.postingUnitPrice}</TableCell>
                                    <TableCell align="center">{row.unitPrice?.replyUnitPrice}</TableCell>
                                    <TableCell align="center">{row.unitPrice?.likeUnitPrice}</TableCell>
                                    <TableCell align="center">{row.singleBudget}</TableCell>
                                    <TableCell align="center">{row.notificationBudget}</TableCell>

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
                                                aria-label="delete"
                                                size="small"
                                                color="secondary"
                                                onClick={() => bilingDetail(row.uid)}
                                            >
                                                计费明细
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
        </MainCard>
    );
};

export default TaskCenter;
