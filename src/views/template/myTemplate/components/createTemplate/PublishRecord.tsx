import { Button } from '@mui/material';

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
import { getOrderRecord } from 'api/vip';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject } from 'types';

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
    { id: 'merchantOrderId', numeric: false, disablePadding: false, label: '商户订单编号' },
    { id: 'subject', numeric: false, disablePadding: false, label: '商品标题' },
    { id: 'body', numeric: false, disablePadding: false, label: '商品描述' },
    { id: 'amount', numeric: false, disablePadding: false, label: '支付金额(元)' },
    { id: 'status', numeric: false, disablePadding: false, label: '支付状态' },
    { id: 'createTime', numeric: false, disablePadding: false, label: '支付时间' },
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

export const PublishRecord: React.FC = () => {
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [dense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);
    const forceUpdate = () => setCount((pre) => pre + 1);

    // TODO 删除
    useEffect(() => {
        forceUpdate();
    }, []);

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

    const handlePay = async (id: string) => {};

    return (
        <MainCard content={false} title="发布记录">
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
                        )
                            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                if (typeof row === 'number') {
                                    return null; // 忽略数字类型的行
                                }

                                return (
                                    <TableRow hover key={row.id}>
                                        <TableCell align="center">{row.merchantOrderId}</TableCell>
                                        <TableCell align="center">{row.subject}</TableCell>
                                        <TableCell align="center">{row.body}</TableCell>
                                        <TableCell align="center">{(row.amount / 100).toFixed(2)}</TableCell>
                                        <TableCell align="center">{transformValue(row.status)}</TableCell>
                                        <TableCell align="center">{dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="text"
                                                color="secondary"
                                                disabled={row.status === 10 || row.status === 20}
                                                onClick={() => handlePay(row.merchantOrderId)}
                                            >
                                                支付
                                            </Button>
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
