import { Button, Card, Checkbox, IconButton, Tooltip } from '@mui/material';

// material-ui
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    // Stack
    TableSortLabel
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

// project imports
import MainCard from 'ui-component/cards/MainCard';
// import { CSVExport } from 'views/forms/tables/TableExports';

// assets
import { getOrderIsPay, getOrderRecord, submitOrder } from 'api/vip';
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

type TableEnhancedCreateDataType = {
    id: number;
    status: number;
    amount: number;
    body: string;
    merchantOrderId: string;
    subject: string;
    createTime: number;
};

// table filter
function descendingComparator(a: KeyedObject, b: KeyedObject, orderBy: string) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order: ArrangementOrder, orderBy: string) {
    return order === 'desc'
        ? (a: KeyedObject, b: KeyedObject) => descendingComparator(a, b, orderBy)
        : (a: KeyedObject, b: KeyedObject) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: TableEnhancedCreateDataType[], comparator: (a: KeyedObject, b: KeyedObject) => number) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0] as TableEnhancedCreateDataType, b[0] as TableEnhancedCreateDataType);
        if (order !== 0) return order;
        return (a[1] as number) - (b[1] as number);
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'merchantOrderId', numeric: false, disablePadding: false, label: '站点' },
    { id: 'subject', numeric: false, disablePadding: false, label: '标题' },
    { id: 'body', numeric: false, disablePadding: false, label: 'ASIN' },
    { id: 'createTime', numeric: false, disablePadding: false, label: '更新时间' },
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
                        sx={{ pl: 3, whiteSpace: 'nowrap' }} // 加上 white-space: nowrap
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// ==============================|| TABLE - ENHANCED ||============================== //
let interval: any;

const ListingBuilderPage: React.FC = () => {
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [dense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();

    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);
    const forceUpdate = () => setCount((pre) => pre + 1);

    useEffect(() => {
        const fetchPageData = async () => {
            const pageVO = { pageNo: page + 1, pageSize: rowsPerPage };
            // const encodedPageVO = encodeURIComponent(JSON.stringify(pageVO));
            getOrderRecord(pageVO)
                .then((res) => {
                    // Once the data is fetched, map it and update rows state
                    const fetchedRows = res.list;
                    console.log(fetchedRows, 'fetchedRows');

                    setRows([...fetchedRows]);

                    // Update total
                    setTotal(res?.total);
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        fetchPageData();
    }, [page, rowsPerPage, count]);

    // Add a new state for rows
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
                // const newSelectedId: string[] = rows.map((n) => n.benefitsName);
                // setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: any[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
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

    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const transformValue = (v: number) => {
        switch (v) {
            case 10:
                return '支付成功';
            case 20:
                return '支付关闭';
            case 0:
                return '未支付';
        }
    };

    const [open, setOpen] = React.useState(false);
    const [payUrl, setPayUrl] = useState('');
    const [isTimeout, setIsTimeout] = useState(false);
    const [openPayDialog, setOpenPayDialog] = useState(false);
    const [orderId, setOrderId] = useState<string>();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setPayUrl('');
        setOpen(false);
    };

    const onRefresh = async () => {
        const resOrder = await submitOrder({
            orderId,
            channelCode: 'alipay_pc',
            channelExtras: { qr_pay_mode: '4', qr_code_width: 250 },
            displayMode: 'qr_code'
        });
        setPayUrl(resOrder.displayContent);
        setIsTimeout(false);
        interval = setInterval(() => {
            getOrderIsPay({ orderId }).then((isPayRes) => {
                if (isPayRes) {
                    handleClose();
                    setOpenPayDialog(true);
                    setTimeout(() => {
                        setOpenPayDialog(false);
                        forceUpdate();
                    }, 3000);
                }
            });
        }, 1000);

        setTimeout(() => {
            clearInterval(interval);
            setIsTimeout(true);
        }, 5 * 60 * 1000);
    };

    const handlePay = async (id: string) => {
        setOrderId(id);
        const resOrder = await submitOrder({
            orderId: id,
            channelCode: 'alipay_pc',
            channelExtras: { qr_pay_mode: '4', qr_code_width: 250 },
            displayMode: 'qr_code'
        });
        setPayUrl(resOrder.displayContent);
        handleOpen();
        interval = setInterval(() => {
            getOrderIsPay({ orderId: id }).then((isPayRes) => {
                if (isPayRes) {
                    handleClose();
                    clearInterval(interval);
                    setOpenPayDialog(true);
                    setTimeout(() => {
                        setOpenPayDialog(false);
                        forceUpdate();
                    }, 3000);
                }
            });
        }, 1000);

        setTimeout(() => {
            clearInterval(interval);
            setIsTimeout(true);
        }, 5 * 60 * 1000);
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;
    return (
        <MainCard
            content={false}
            title="Listing草稿箱"
            secondary={
                <div>
                    <Button color="secondary" startIcon={<DeleteIcon />}>
                        批量删除
                    </Button>
                    <Divider type={'vertical'} />
                    <Button color="secondary" startIcon={<CloudDownloadIcon />}>
                        批量导出
                    </Button>
                    <Divider type={'vertical'} />
                    <Button color="secondary" startIcon={<AddIcon />} onClick={() => navigate('/listingBuilder')}>
                        新增Listing
                    </Button>
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
                        {stableSort(
                            rows.filter((row) => typeof row !== 'number'),
                            getComparator(order, orderBy)
                        ).map((row, index) => {
                            if (typeof row === 'number') {
                                return null; // 忽略数字类型的行
                            }
                            const isItemSelected = isSelected(row.id);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    key={row.id}
                                    onClick={(event) => handleClick(event, row.id)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            // inputProps={{
                                            //     'aria-labelledby': labelId
                                            // }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">{row.merchantOrderId}</TableCell>
                                    <TableCell align="center">{row.subject}</TableCell>
                                    <TableCell align="center">{row.body}</TableCell>
                                    <TableCell align="center">
                                        {row.createTime && dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'编辑'}>
                                            <IconButton aria-label="delete" size="small">
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
                                            <IconButton aria-label="delete" size="small">
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
        </MainCard>
    );
};

export default ListingBuilderPage;
