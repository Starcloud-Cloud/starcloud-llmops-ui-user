import { Button, Checkbox, IconButton, Tooltip } from '@mui/material';
import copy from 'clipboard-copy';

import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import ReplayIcon from '@mui/icons-material/Replay';
import MainCard from 'ui-component/cards/MainCard';
import ReorderIcon from '@mui/icons-material/Reorder';

import React, { useEffect, useRef, useState } from 'react';
import { ArrangementOrder, EnhancedTableHeadProps } from 'types';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Divider, Popover, Tag } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { delListing, draftClone } from 'api/listing/build';
import { Confirm } from 'ui-component/Confirm';
import { dispatch } from 'store';
import { Image } from 'antd';

import { openSnackbar } from 'store/slices/snackbar';
import { config } from 'utils/axios/config';
import axios from 'axios';
import { getAccessToken } from 'utils/auth';
import { DetailModal } from './component/detailModal';
import { delContent, getContentPage } from 'api/redBook';
import CopyToClipboard from 'react-copy-to-clipboard';
import SearchIcon from '@mui/icons-material/Search';

const { base_url } = config;

export interface DraftConfig {}

export interface ItemScore {
    matchSearchers: number;
    totalSearches: number;
}

export interface FiveDesc {}

const headCells = [
    { id: 'businessUid', numeric: false, disablePadding: false, label: '内容Id' },
    { id: 'createTemplate', numeric: false, disablePadding: false, label: '生成参数' },
    { id: 'copyWritingStatus', numeric: false, disablePadding: false, label: ' 文案生成状态' },
    { id: 'copyWritingTitle', numeric: false, disablePadding: false, label: '文案内容' },
    { id: 'copyWritingExecuteTime', numeric: false, disablePadding: false, label: '文案耗时(毫秒)' },
    { id: 'pictureStatus', numeric: false, disablePadding: false, label: ' 图片生成状态' },
    { id: 'pictureContent', numeric: false, disablePadding: false, label: '图片内容' },
    { id: 'pictureExecuteTime', numeric: false, disablePadding: false, label: '图片耗时(毫秒)' },
    { id: 'claim', numeric: false, disablePadding: false, label: '是否被认领' },
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
                        className={headCell.label === '操作' ? 'sticky right-0 bg-white' : ''}
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

const RedBookContentList: React.FC = () => {
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('');
    const [selected, setSelected] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [dense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [delAnchorEl, setDelAnchorEl] = useState<null | HTMLElement>(null);
    const [delVisible, setDelVisible] = useState(false);
    const [delType, setDelType] = useState(0); //0.单个 1.多个
    const [row, setRow] = useState<any>({});
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState<any[]>([]);

    const delOpen = Boolean(delAnchorEl);
    const navigate = useNavigate();

    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);
    const forceUpdate = () => setCount((pre) => pre + 1);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const uid = searchParams.get('uid');
    const name = searchParams.get('name');

    useEffect(() => {
        const fetchPageData = async () => {
            const pageVO: any = { pageNo: page + 1, pageSize: rowsPerPage };
            if (orderBy) {
                pageVO.sortField = orderBy;
                pageVO.asc = order === 'asc';
            }
            getContentPage({ ...pageVO, planUid: uid })
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
    }, [page, rowsPerPage, count, order, orderBy, uid]);

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

    const handleDelContent = async () => {
        const res = await delContent(row.businessUid);
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
            case 'init':
                return <Tag color="green">初始化</Tag>;
            case 'executing':
                return <Tag color="gold">执行中</Tag>;
            case 'execute_success':
                return <Tag color="blue">执行成功</Tag>;
            case 'execute_error':
                return <Tag color="red">执行失败</Tag>;
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
        <div className="redBookContentList">
            <MainCard
                content={false}
                title={`创作内容-${name}`}
                secondary={
                    <div>
                        {/* <Button
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
                                            <div className="flex">
                                                <Popover
                                                    content={
                                                        <div>
                                                            <div>{row.businessUid}</div>
                                                        </div>
                                                    }
                                                    title="内容ID"
                                                >
                                                    <div className="line-clamp-1 w-[100px] break-words cursor-pointer">
                                                        {row.businessUid}
                                                    </div>
                                                </Popover>

                                                <Tooltip title={'复制'}>
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => {
                                                            copy(row.businessUid);
                                                            dispatch(
                                                                openSnackbar({
                                                                    open: true,
                                                                    message: '复制成功',
                                                                    variant: 'alert',
                                                                    alert: {
                                                                        color: 'success'
                                                                    },
                                                                    close: false,
                                                                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                                                    transition: 'SlideLeft'
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
                                            <div className="flex flex-col">
                                                <Popover
                                                    content={
                                                        <div>
                                                            <div>文案模版</div>
                                                            <div>{row.copyWritingUid}</div>
                                                            <Divider className="!my-2" />
                                                            <div>图片模版</div>
                                                            <div>{row.pictureTempUid}</div>
                                                        </div>
                                                    }
                                                    title="模版"
                                                >
                                                    <div className="cursor-pointer">
                                                        <SearchIcon className="text-base" />
                                                    </div>
                                                </Popover>
                                            </div>
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className="flex items-center justify-center">{handleTransfer(row.copyWritingStatus)}</div>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Popover
                                                content={
                                                    <div className="max-w-[500px]">
                                                        <div>
                                                            <div>标题:</div>
                                                            <div>{row.copyWritingTitle}</div>
                                                        </div>
                                                        <Divider className="!my-2" />
                                                        <div>
                                                            <div>内容:</div>
                                                            <div>{row.copyWritingContent}</div>
                                                        </div>
                                                    </div>
                                                }
                                                title="详情"
                                            >
                                                <div className="line-clamp-1 w-[250px]">{row.copyWritingTitle}</div>
                                            </Popover>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Popover
                                                content={
                                                    <div className="max-w-[500px]">
                                                        <div>
                                                            <div>开始时间:</div>
                                                            <div>
                                                                {row.copyWritingStartTime &&
                                                                    dayjs(row.copyWritingStartTime).format('YYYY-MM-DD HH:mm:ss')}
                                                            </div>
                                                        </div>
                                                        <Divider className="!my-2" />
                                                        <div>
                                                            <div>结束时间:</div>
                                                            <div>
                                                                {row.copyWritingEndTime &&
                                                                    dayjs(row.copyWritingEndTime).format('YYYY-MM-DD HH:mm:ss')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                title="详情"
                                            >
                                                <div className="flex flex-col items-center cursor-pointer">
                                                    {row.copyWritingExecuteTime}
                                                </div>
                                            </Popover>
                                        </TableCell>

                                        <TableCell align="center">
                                            <div className="flex items-center justify-center">{handleTransfer(row.pictureStatus)}</div>
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className="w-[300px] overflow-auto">
                                                <Image.PreviewGroup preview={{ rootClassName: 'previewRoot' }}>
                                                    {row.pictureContent?.map((item: any, index: any) => (
                                                        <Image className="object-contain" height={80} width={80} src={item.url} />
                                                    ))}
                                                </Image.PreviewGroup>
                                            </div>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Popover
                                                content={
                                                    <div className="max-w-[500px]">
                                                        <div>
                                                            <div>开始时间:</div>
                                                            <div>
                                                                {row.pictureStartTime &&
                                                                    dayjs(row.pictureStartTime).format('YYYY-MM-DD HH:mm:ss')}
                                                            </div>
                                                        </div>
                                                        <Divider className="!my-2" />
                                                        <div>
                                                            <div>结束时间:</div>
                                                            <div>
                                                                {row.pictureEndTime &&
                                                                    dayjs(row.pictureEndTime).format('YYYY-MM-DD HH:mm:ss')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                title="详情"
                                            >
                                                <div className="flex flex-col items-center cursor-pointer">{row.pictureExecuteTime}</div>
                                            </Popover>
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className="flex flex-col items-center">
                                                {!row.claim ? <Tag color="error">未认领</Tag> : <Tag color="blue">已认领</Tag>}
                                            </div>
                                        </TableCell>
                                        <TableCell align="center" className="sticky right-0 bg-white">
                                            <div className="flex items-center w-[95px]">
                                                {/* <Tooltip title={'编辑'}>
                                                <IconButton
                                                    aria-label="delete"
                                                    size="small"
                                                    onClick={() => {
                                                        handleEdit(row.type, row.uid, row.version);
                                                    }}
                                                >
                                                    <EditIcon className="text-base" />
                                                </IconButton>
                                            </Tooltip> */}
                                                {/* <Divider type={'vertical'} style={{ marginInline: '4px' }} />
                                            <Tooltip title={'复制内容'}>
                                                <IconButton aria-label="delete" size="small" onClick={() => doClone(row)}>
                                                    <ContentCopyIcon className="text-base" />
                                                </IconButton>
                                            </Tooltip> */}
                                                {/* <Divider type={'vertical'} style={{ marginInline: '4px' }} /> */}
                                                <Tooltip title={'查看详情'}>
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => {
                                                            setOpen(true);
                                                            setRow(row);
                                                        }}
                                                    >
                                                        <ReorderIcon className="text-base" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Divider type={'vertical'} style={{ marginInline: '4px' }} />
                                                <Tooltip title={'重试'}>
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => {
                                                            setDelType(0);
                                                            setDelVisible(true);
                                                            setRow(row);
                                                        }}
                                                    >
                                                        <ReplayIcon className="text-base" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Divider type={'vertical'} style={{ marginInline: '4px' }} />
                                                <Tooltip title={'删除'}>
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => {
                                                            setDelVisible(true);
                                                            setRow(row);
                                                        }}
                                                    >
                                                        <DeleteIcon className="text-base" />
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
                <Confirm open={delVisible} handleClose={() => setDelVisible(false)} handleOk={handleDelContent} />
                {open && <DetailModal open={open} handleClose={() => setOpen(false)} businessUid={row.businessUid} />}
            </MainCard>
        </div>
    );
};

export default RedBookContentList;
