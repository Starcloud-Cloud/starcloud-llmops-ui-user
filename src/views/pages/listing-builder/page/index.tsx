import { Button, Checkbox, IconButton, Tooltip, Menu, MenuItem, ListItemIcon, Typography } from '@mui/material';

import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import MainCard from 'ui-component/cards/MainCard';

import React, { useEffect, useState } from 'react';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject } from 'types';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Divider } from 'antd';
import AddIcon from '@mui/icons-material/Add';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { delListing, getListingPage } from 'api/listing/build';
import { Confirm } from 'ui-component/Confirm';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { COUNTRY_LIST } from '../data';

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
}

const headCells = [
    { id: 'title', numeric: false, disablePadding: false, label: '商品标题' },
    { id: 'endpoint', numeric: false, disablePadding: false, label: '站点' },
    { id: 'asin', numeric: false, disablePadding: false, label: 'ASIN' },
    { id: 'status', numeric: false, disablePadding: false, label: ' 状态' },
    { id: 'score', numeric: false, disablePadding: false, label: '分值/搜索量' },
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

const ListingBuilderPage: React.FC = () => {
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('');
    const [selected, setSelected] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [dense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [delAnchorEl, setDelAnchorEl] = useState<null | HTMLElement>(null);
    const [delVisible, setDelVisible] = useState(false);
    const [delType, setDelType] = useState(0); //0.单个 1.多个
    const [row, setRow] = useState<TableEnhancedCreateDataType | null>();

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
            getListingPage({ ...pageVO })
                .then((res) => {
                    const fetchedRows = res.list;
                    setRows([...fetchedRows]);
                    setTotal(res?.total);
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        fetchPageData();
    }, [page, rowsPerPage, count, order, orderBy]);

    const [rows, setRows] = useState<TableEnhancedCreateDataType[]>([]);

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
        const data = delType === 0 ? [row?.id] : selected;
        const res = await delListing(data);
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
        }
    };

    const addListing = async () => {
        navigate('/listingBuilder');
    };

    const handleEdit = async (uid: string, version: number) => {
        navigate('/listingBuilder?uid=' + uid + '&version=' + version);
    };

    const handleTransfer = (key: string) => {
        switch (key) {
            case 'ANALYSIS':
                return '分析中';
            case 'ANALYSIS_ERROR':
                return '分析失败';
            case 'ANALYSIS_END':
                return '分析结束';
            case 'EXECUTING':
                return '执行中';
            case 'EXECUTE_ERROR':
                return '执行失败';
            case 'EXECUTED':
                return '执行结束';
        }
    };

    return (
        <MainCard
            content={false}
            title="Listing草稿箱"
            secondary={
                <div>
                    <Button color="secondary" startIcon={<AddIcon />} onClick={() => addListing()} variant="contained" size="small">
                        新增Listing
                    </Button>
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
                    </Button>
                    <Button
                        disabled={selected.length === 0}
                        className="ml-1"
                        color="secondary"
                        startIcon={<CloudDownloadIcon />}
                        onClick={() => {}}
                        variant="contained"
                        size="small"
                    >
                        批量导出
                    </Button>
                    {/* <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-haspopup="true"
                        className="ml-1"
                        onClick={(e) => {
                            setDelAnchorEl(e.currentTarget);
                        }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="del-menu"
                        MenuListProps={{
                            'aria-labelledby': 'del-button'
                        }}
                        anchorEl={delAnchorEl}
                        open={delOpen}
                        onClose={() => {
                            setDelAnchorEl(null);
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                setDelAnchorEl(null);
                            }}
                        >
                            <ListItemIcon>
                                <AddIcon />
                            </ListItemIcon>
                            <Typography variant="inherit" noWrap>
                                批量AI生成Listing
                            </Typography>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setDelAnchorEl(null);
                                setDelVisible(true);
                                setDelType(2);
                            }}
                        >
                            <ListItemIcon>
                                <DeleteIcon />
                            </ListItemIcon>
                            <Typography variant="inherit" noWrap>
                                批量删除
                            </Typography>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setDelAnchorEl(null);
                            }}
                        >
                            <ListItemIcon>
                                <CloudDownloadIcon />
                            </ListItemIcon>
                            <Typography variant="inherit" noWrap>
                                批量导出
                            </Typography>
                        </MenuItem>
                    </Menu> */}
                </div>
            }
        >
            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
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

                            const isItemSelected = isSelected(row.id);
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
                                    <TableCell align="center">{row.title}</TableCell>
                                    <TableCell align="center">
                                        <div className="flex items-center">
                                            {COUNTRY_LIST.find((item: any) => item.key === row.endpoint)?.icon}
                                            <span className="ml-1">
                                                {COUNTRY_LIST.find((item: any) => item.key === row.endpoint)?.label}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">{row.asin}</TableCell>
                                    <TableCell align="center">{handleTransfer(row.status)}</TableCell>
                                    <TableCell align="center">
                                        {row.score || 0}/{row?.matchSearchers || 0}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.createTime && dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.updateTime && dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'编辑'}>
                                            <IconButton
                                                aria-label="delete"
                                                size="small"
                                                onClick={() => {
                                                    handleEdit(row.uid, row.version);
                                                }}
                                            >
                                                <EditIcon className="text-base" />
                                            </IconButton>
                                        </Tooltip>
                                        <Divider type={'vertical'} />
                                        <Tooltip title={'克隆'}>
                                            <IconButton aria-label="delete" size="small">
                                                <ContentCopyIcon className="text-base" />
                                            </IconButton>
                                        </Tooltip>
                                        <Divider type={'vertical'} />
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
        </MainCard>
    );
};

export default ListingBuilderPage;
