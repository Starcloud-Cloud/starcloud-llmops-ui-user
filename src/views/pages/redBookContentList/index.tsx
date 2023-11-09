import { Button, Checkbox, IconButton, Tooltip } from '@mui/material';

import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import ReplayIcon from '@mui/icons-material/Replay';
import MainCard from 'ui-component/cards/MainCard';
import ReorderIcon from '@mui/icons-material/Reorder';

import React, { useEffect, useState } from 'react';
import { ArrangementOrder, EnhancedTableHeadProps } from 'types';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Divider, Tag } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { delListing, draftClone } from 'api/listing/build';
import { Confirm } from 'ui-component/Confirm';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { config } from 'utils/axios/config';
import axios from 'axios';
import { getAccessToken } from 'utils/auth';
import { DetailModal } from './component/detailModal';
import { delContent, getContentPage } from 'api/redBook';
const { base_url } = config;

export interface DraftConfig {}

export interface ItemScore {
    matchSearchers: number;
    totalSearches: number;
}

export interface FiveDesc {}

const headCells = [
    { id: 'businessUid', numeric: false, disablePadding: false, label: 'id' },
    { id: 'copyWritingUid', numeric: false, disablePadding: false, label: '文案模版' },
    { id: 'copyWritingTitle', numeric: false, disablePadding: false, label: '文字数量' },
    { id: 'copyWritingStatus', numeric: false, disablePadding: false, label: ' 文案状态' },
    { id: 'copyWritingRetryCount', numeric: false, disablePadding: false, label: '文案重试次数' },
    { id: 'copyWritingStartTime', numeric: false, disablePadding: false, label: '文案开始时间' },
    { id: 'copyWritingEndTime', numeric: false, disablePadding: false, label: '文案结束时间' },
    { id: 'copyWritingExecuteTime', numeric: false, disablePadding: false, label: '文案消耗时间(毫秒)' },
    { id: 'pictureTempUid', numeric: false, disablePadding: false, label: '图片模版' },
    { id: 'pictureNum', numeric: false, disablePadding: false, label: '图片数量' },
    { id: 'pictureStatus', numeric: false, disablePadding: false, label: ' 图片状态' },
    { id: 'pictureRetryCount', numeric: false, disablePadding: false, label: '图片重试次数' },
    { id: 'pictureStartTime', numeric: false, disablePadding: false, label: '图片开始时间' },
    { id: 'pictureEndTime', numeric: false, disablePadding: false, label: '图片结束时间' },
    { id: 'pictureExecuteTime', numeric: false, disablePadding: false, label: '图片消耗时间(毫秒)' },
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
    const [rowsPerPage, setRowsPerPage] = useState(5);
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
        <MainCard
            content={false}
            title="创作内容"
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
                                        <span className="line-clamp-1 w-[300px] mx-auto">{row.businessUid}</span>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex items-center justify-center">{row.copyWritingUid}</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex items-center justify-center">{row.copyWritingTitle}</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">{handleTransfer(row.copyWritingStatus)}</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">{row.copyWritingRetryCount}</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">
                                            <span> {row.copyWritingStartTime && dayjs(row.copyWritingStartTime).format('YYYY-MM-DD')}</span>
                                            <span> {row.copyWritingStartTime && dayjs(row.copyWritingStartTime).format('HH:mm:ss')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">
                                            <span> {row.copyWritingEndTime && dayjs(row.copyWritingEndTime).format('YYYY-MM-DD')}</span>
                                            <span> {row.copyWritingEndTime && dayjs(row.copyWritingEndTime).format('HH:mm:ss')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">{row.copyWritingExecuteTime / 1000}</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <span className="line-clamp-1 w-[300px] mx-auto">{row.pictureTempUid}</span>
                                    </TableCell>
                                    <TableCell align="center">
                                        <span className="line-clamp-1 w-[300px] mx-auto">{row.pictureNum}</span>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex items-center justify-center">{handleTransfer(row.pictureStatus)}</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">{row.pictureRetryCount}</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">
                                            <span> {row.pictureStartTime && dayjs(row.pictureStartTime).format('YYYY-MM-DD')}</span>
                                            <span> {row.pictureStartTime && dayjs(row.pictureStartTime).format('HH:mm:ss')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">
                                            <span> {row.pictureEndTime && dayjs(row.pictureEndTime).format('YYYY-MM-DD')}</span>
                                            <span> {row.pictureEndTime && dayjs(row.pictureEndTime).format('HH:mm:ss')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">{row.pictureExecuteTime}</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex flex-col items-center">{row.claim}</div>
                                    </TableCell>
                                    <TableCell align="center" className="sticky right-0 bg-white">
                                        <div className="flex items-center w-[130px]">
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
                rowsPerPageOptions={[5, 10]}
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
    );
};

export default RedBookContentList;
