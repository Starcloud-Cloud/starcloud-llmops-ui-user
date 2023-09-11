import { Button, Switch, TablePagination } from '@mui/material';

// material-ui
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
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
import React, { useEffect, useState } from 'react';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject } from 'types';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { getSkillList } from 'api/chat';
import { useLocation } from 'react-router-dom';

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
    { id: 'key', numeric: false, disablePadding: false, label: '关键词' },
    { id: 'value', numeric: false, disablePadding: false, label: '回复内容' },
    { id: 'disabled', numeric: false, disablePadding: false, label: '状态' },
    { id: 'operate', numeric: false, disablePadding: false, label: '编辑' }
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
                        <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'}>
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// ==============================|| TABLE - ENHANCED ||============================== //

const Record: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const appId = searchParams.get('appId');

    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [menuList, setMenuList] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
        setRowsPerPage(parseInt(event?.target.value!, 10));
        setPage(0);
    };

    useEffect(() => {
        getSkillList(appId || '').then((res) => {
            const list =
                res?.['1']?.map((item: any) => ({
                    key: item.chatMenuConfigDTO?.key,
                    value: item.chatMenuConfigDTO?.key,
                    type: item.chatMenuConfigDTO?.type,
                    medias: item.systemHandlerSkillDTO?.medias,
                    uid: item.uid,
                    appConfigId: item.appConfigId,
                    disabled: item.disabled
                })) || [];
            setTotal(list.length);
            const currentData = list.slice(page * 10, page * 10 + 10);
            setRows([...currentData]);
        });
    }, [page]);

    // Add a new state for rows
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
                // const newSelectedId: string[] = rows.map((n) => n.benefitsName);
                // setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    return (
        <MainCard content={false}>
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'small'}>
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
                            return (
                                <TableRow hover key={row.id}>
                                    <TableCell align="center">{row.key}</TableCell>
                                    <TableCell align="center">{row.value}</TableCell>
                                    <TableCell align="center">
                                        <Switch color={'secondary'} checked={row.disabled} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            className={'min-w-[30px] h-[30px] ml-2'}
                                            startIcon={<BorderColorIcon />}
                                            color={'secondary'}
                                            size={'small'}
                                            sx={{
                                                '& .MuiButton-startIcon': {
                                                    marginRight: 0
                                                }
                                            }}
                                        />
                                        <Button
                                            className={'min-w-[30px] h-[30px] ml-2'}
                                            startIcon={<DeleteOutlineIcon />}
                                            color={'secondary'}
                                            size={'small'}
                                            sx={{
                                                '& .MuiButton-startIcon': {
                                                    marginRight: 0
                                                }
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10]}
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

export default Record;
