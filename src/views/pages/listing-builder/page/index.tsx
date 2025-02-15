import { Button, Checkbox, IconButton, Tooltip, Modal, CardContent } from '@mui/material';

import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import MainCard from 'ui-component/cards/MainCard';

import React, { useEffect, useState } from 'react';
import { ArrangementOrder, EnhancedTableHeadProps } from 'types';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Divider, Progress } from 'antd';
import AddIcon from '@mui/icons-material/Add';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useNavigate } from 'react-router-dom';
import { delListing, draftClone, draftExport, getListingPage } from 'api/listing/build';
import { Confirm } from 'ui-component/Confirm';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { COUNTRY_LIST } from '../data';
import { config } from 'utils/axios/config';
import axios from 'axios';
import { getAccessToken } from 'utils/auth';
import StorageCache from 'web-storage-cache';
import { useAllDetail } from '../../../../contexts/JWTContext';
const { base_url } = config;

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
    userName: string;
    createTime: number;
    updateTime: number;
    matchSearchers: number;
    searchersProportion: number;
    scoreProportion: number;
    type: number;
}

const headCells = [
    { id: 'title', numeric: false, disablePadding: false, label: '商品标题' },
    { id: 'endpoint', numeric: false, disablePadding: false, label: '站点' },
    // { id: 'asin', numeric: false, disablePadding: false, label: 'ASIN' },
    // { id: 'status', numeric: false, disablePadding: false, label: ' 状态' },
    { id: 'score', numeric: false, disablePadding: false, label: '分值/搜索量' },
    { id: 'userName', numeric: false, disablePadding: false, label: '创建者' },
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
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [delAnchorEl, setDelAnchorEl] = useState<null | HTMLElement>(null);
    const [delVisible, setDelVisible] = useState(false);
    const [delType, setDelType] = useState(0); //0.单个 1.多个
    const [row, setRow] = useState<TableEnhancedCreateDataType | null>();

    const delOpen = Boolean(delAnchorEl);
    const navigate = useNavigate();

    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);
    const forceUpdate = () => setCount((pre) => pre + 1);

    const storage = new StorageCache();
    const [videoOpne, setVideoOpen] = useState(false);
    const all_detail = useAllDetail();

    useEffect(() => {
        if (!storage.get(`video-${all_detail?.allDetail?.id}`)) {
            setVideoOpen(true);
        }
    }, []);
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
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    close: false
                })
            );
            setDelVisible(false);
            forceUpdate();
            setSelected([]);
        }
    };

    const addListing = async () => {
        navigate('/listingBuilder');
    };

    const handleEdit = async (type: number, uid: string, version: number) => {
        if (type === 1) {
            navigate('/listingBuilder?uid=' + uid + '&version=' + version);
        } else {
            navigate('/listingBuilderOptimize?uid=' + uid + '&version=' + version);
        }
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

    const doClone = async (row: any) => {
        const res = await draftClone({
            version: row.version,
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
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
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
            title={
                <div>
                    Listing草稿箱
                    <span className="cursor-pointer text-[#6839b7] ml-1 text-[14px]" onClick={() => setVideoOpen(true)}>
                        查看视频教程
                    </span>
                </div>
            }
            secondary={
                <div>
                    <Button
                        className="ml-1"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => addListing()}
                        variant="contained"
                        size="small"
                    >
                        新增Listing
                    </Button>
                    <Button
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/listingBuilderOptimize')}
                        variant="contained"
                        size="small"
                        className="ml-1"
                    >
                        优化已有Listing
                    </Button>
                    <Divider type={'vertical'} />
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
                        onClick={() => doExport()}
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
                                    <TableCell align="center">
                                        <Tooltip title={row.title}>
                                            <span className="line-clamp-1 w-[300px] mx-auto">{row.title}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex items-center justify-center">
                                            {COUNTRY_LIST.find((item: any) => item.key === row.endpoint)?.icon}
                                            <span className="ml-1">
                                                {COUNTRY_LIST.find((item: any) => item.key === row.endpoint)?.label}
                                            </span>
                                        </div>
                                    </TableCell>
                                    {/* <TableCell align="center">{row.asin}</TableCell> */}
                                    {/* <TableCell align="center">{handleTransfer(row.status)}</TableCell> */}
                                    <TableCell align="center">
                                        <div className="flex items-center justify-center">
                                            <Tooltip
                                                title={'这按亚马逊官方推荐的标准进行打分，共有9个打分项，满分100分'}
                                                placement="top"
                                                arrow
                                            >
                                                <div className="flex flex-col cursor-pointer">
                                                    <div className="text-base font-semibold">{row?.scoreProportion || 0}</div>
                                                    <div className="text-sm">{row.score || 0}/9 </div>
                                                </div>
                                            </Tooltip>
                                            <Divider type={'vertical'} />
                                            <Tooltip title={'List中已埋词的总搜索量占总关键词搜索量的比值'} placement="top" arrow>
                                                <div className="cursor-pointer">
                                                    <Progress
                                                        type="circle"
                                                        percent={row?.searchersProportion * 100}
                                                        format={(percent) => (percent === 100 ? '100%' : `${percent}%`)}
                                                        size={35}
                                                    />
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">
                                            <span> {row?.userName}</span>
                                        </div>
                                    </TableCell>
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
                                        <Tooltip title={'编辑'}>
                                            <IconButton
                                                aria-label="delete"
                                                size="small"
                                                onClick={() => {
                                                    handleEdit(row.type, row.uid, row.version);
                                                }}
                                            >
                                                <EditIcon className="text-base" />
                                            </IconButton>
                                        </Tooltip>
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
            <Modal disableAutoFocus open={videoOpne}>
                <MainCard
                    sx={{
                        position: 'absolute',
                        width: '80%',
                        aspectRatio: '1695/950',
                        maxWidth: '960px',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                    headerSX={{ p: '16px !important' }}
                    contentSX={{ p: '16px !important' }}
                    title={'使用视频'}
                    content={false}
                >
                    <IconButton
                        onClick={() => {
                            storage.set(`video-${all_detail?.allDetail?.id}`, 1);
                            setVideoOpen(false);
                        }}
                        size="large"
                        aria-label="close modal"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    <CardContent sx={{ p: '0 !important', height: 'calc(100% - 73px)' }}>
                        <iframe
                            src="//player.bilibili.com/player.html?aid=707499588&bvid=BV1tQ4y137ee&cid=1372711174&p=1"
                            scrolling="no"
                            style={{
                                width: '100%',
                                height: '100%'
                            }}
                        ></iframe>
                    </CardContent>
                </MainCard>
            </Modal>
            <Confirm open={delVisible} handleClose={() => setDelVisible(false)} handleOk={delDraft} />
        </MainCard>
    );
};

export default ListingBuilderPage;
