import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';

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
import { getOrderIsPay, getOrderRecord, submitOrder, templateList } from 'api/vip';
import React, { useEffect, useState } from 'react';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject } from 'types';
import { PayModal } from '../PayModal';
import dayjs from 'dayjs';
import jsCookie from 'js-cookie';

import { Tabs, Row, Col } from 'antd';
import { useAllDetail } from 'contexts/JWTContext';

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
    // { id: 'body', numeric: false, disablePadding: false, label: '商品描述' },
    { id: 'amount', numeric: false, disablePadding: false, label: '支付金额(元)' },
    { id: 'payChannelCode', numeric: false, disablePadding: false, label: '支付方式' },
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
let interval: any;

const Record: React.FC = () => {
    const userInfo = useAllDetail();
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [dense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);
    const [record, setRecord] = useState<any>({});
    const forceUpdate = () => setCount((pre) => pre + 1);

    useEffect(() => {
        jsCookie.remove('client-redemption');
        return () => {
            jsCookie.remove('client-redemption');
        };
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
            case 0:
                return '未支付';
            case 30:
                return '支付成功';
            case 40:
                return '支付关闭';
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
            id: record.payOrderId,
            channelCode: 'alipay_pc',
            channelExtras: { qr_pay_mode: '4', qr_code_width: 250 },
            displayMode: 'qr_code'
        });
        setPayUrl(resOrder.displayContent);
        setIsTimeout(false);
        interval = setInterval(() => {
            getOrderIsPay({ id: record.id }).then((isPayRes) => {
                if (isPayRes) {
                    // 出入token 供客户端
                    jsCookie.set('client-redemption', 'true');

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

    const handlePay = async (row: any) => {
        const resOrder = await submitOrder({
            id: row.payOrderId,
            channelCode: row.payChannelCode,
            channelExtras: { qr_pay_mode: '4', qr_code_width: 250 },
            displayMode: 'qr_code'
        });
        setPayUrl(resOrder.displayContent);
        handleOpen();
        interval = setInterval(() => {
            getOrderIsPay({ id: row.id }).then((isPayRes) => {
                if (isPayRes) {
                    jsCookie.set('client-redemption', 'true');
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

    useEffect(() => {
        return () => {
            clearInterval(interval);
        };
    }, []);

    const [templateLists, setTemplateLists] = useState<any>([]);
    useEffect(() => {
        templateList().then((res: any) => {
            setTemplateLists(res);
        });
    }, []);

    return (
        <MainCard content={false} title="订单记录">
            <Tabs
                className="px-4"
                items={[
                    {
                        label: '订单记录',
                        key: '1',
                        children: (
                            <>
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
                                                .map((row: any, index) => {
                                                    if (typeof row === 'number') {
                                                        return null; // 忽略数字类型的行
                                                    }

                                                    return (
                                                        <TableRow hover key={row.id}>
                                                            {/* <TableCell align="center">{row.id}</TableCell> */}
                                                            <TableCell align="center">{row.no}</TableCell>
                                                            <TableCell align="center">
                                                                {row?.items?.[0]?.spuName} - {row?.items?.[0]?.properties?.[0]?.valueName}
                                                            </TableCell>
                                                            {/* <TableCell align="center">{row.body}</TableCell> */}
                                                            <TableCell align="center">{(row?.payPrice / 100).toFixed(2)}</TableCell>
                                                            <TableCell align="center">
                                                                {row.payChannelCode.startsWith('wx') ? '微信' : '支付宝'}
                                                            </TableCell>
                                                            <TableCell align="center">{transformValue(row.status)}</TableCell>
                                                            <TableCell align="center">
                                                                {row.createTime && dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Button
                                                                    variant="text"
                                                                    color="secondary"
                                                                    disabled={row.status === 30 || row.status === 40}
                                                                    onClick={() => {
                                                                        setRecord(row);
                                                                        handlePay(row);
                                                                    }}
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
                            </>
                        )
                    },
                    {
                        label: '高级模版',
                        key: '2',
                        children: (
                            <>
                                <div className="text-xs text-black/50 mb-4 font-semibold">
                                    {`已经绑定和使用的高级模版。(已绑定模版${templateLists?.length}个, 可绑定模版${
                                        userInfo?.allDetail?.rights?.find((item: any) => item.type === 'TEMPLATE')?.totalNum || 0
                                    }个)`}
                                </div>
                                <div className="mb-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
                                    {templateLists?.map((el: any, i: number) => (
                                        <div key={el?.uid} className={`xxxl-col flex-shrink-0`}>
                                            <div
                                                className="w-full aspect-[.75] overflow-hidden group rounded-[12px] cursor-pointer bg-white relative p-4 !bg-cover hover:shadow-lg"
                                                style={{
                                                    aspectRatio: '.75',
                                                    background: `url(${el?.posterStyle?.example})`
                                                }}
                                            >
                                                <div className="bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.8))] absolute bottom-0 right-0 w-full aspect-[2]">
                                                    <div className="flex flex-col gap-1 items-start absolute left-[16px] bottom-[20px]">
                                                        <div className="text-white text-[16px] font-bold line-clamp-2">
                                                            {el?.posterStyle?.name}
                                                        </div>
                                                        <div className="text-white text-xs">
                                                            绑定时间：{dayjs(el.createTime).format('YYYY-MM-DD HH:mm:ss')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )
                    }
                ]}
            />
            {/* table pagination */}

            <PayModal
                open={open}
                handleClose={() => handleClose()}
                url={payUrl}
                isTimeout={isTimeout}
                onRefresh={onRefresh}
                payPrice={record.payPrice / 100}
            />
            <Dialog
                open={openPayDialog}
                onClose={() => setOpenPayDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ p: 2 }}
            >
                {openPayDialog && (
                    <>
                        <DialogTitle id="alert-dialog-title">提示</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Typography variant="h5" component="span">
                                    支付成功，3S后自动关闭弹窗...
                                </Typography>
                            </DialogContentText>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </MainCard>
    );
};

export default Record;
