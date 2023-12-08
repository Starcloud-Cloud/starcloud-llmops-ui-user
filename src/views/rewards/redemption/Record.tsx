import CloseIcon from '@mui/icons-material/Close';
import { Chip, Modal } from '@mui/material';

// material-ui
import {
    Box,
    IconButton,
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
import { getUserBenefitsPage } from 'api/rewards';
import { Fragment, useEffect, useState } from 'react';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject } from 'types';

type TableEnhancedCreateDataType = {
    benefitsName: string;
    effectiveTime: number;
    benefitsList: string[];
    validity: number;
    validityUnit: string;
    expirationTime: number;
    id: number;
    enabled: boolean;
};

function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

let uniqueId = 0;

function createData(
    benefitsName: string,
    effectiveTime: number,
    benefitsList: string[],
    validity: number,
    validityUnit: string,
    expirationTime: number,
    enabled: boolean
) {
    uniqueId += 1;
    return {
        id: uniqueId,
        benefitsName,
        effectiveTime,
        benefitsList,
        validity,
        validityUnit,
        expirationTime,
        enabled
    };
}

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
    { id: 'benefitsName', numeric: false, disablePadding: false, label: '权益名称' },
    { id: 'status', numeric: false, disablePadding: false, label: '权益状态' },
    { id: 'benefitsList', numeric: false, disablePadding: false, label: '创作额度' },
    { id: 'effectiveTime', numeric: true, disablePadding: false, label: '到账时间' },
    { id: 'validity', numeric: true, disablePadding: false, label: '有效期' },
    { id: 'expirationTime', numeric: true, disablePadding: false, label: '过期时间' }
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
                        align={'center'}
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

interface ShareProps {
    open: boolean;
    handleClose: () => void;
}

const Record: React.FC<ShareProps> = ({ open, handleClose }) => {
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [dense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchPageData = async () => {
            const pageVO = { pageNo: page + 1, pageSize: rowsPerPage };
            getUserBenefitsPage(pageVO)
                .then((res) => {
                    // Once the data is fetched, map it and update rows state
                    const fetchedRows = res.list.map((item) =>
                        createData(
                            item.benefitsName,
                            item.effectiveTime,
                            item.benefitsList.map((benefit) => `${benefit.name} · ${benefit.amount}`),
                            item.validity,
                            item.validityUnit,
                            item.expirationTime,
                            item.enabled
                        )
                    );

                    setRows(fetchedRows);

                    // Update total
                    setTotal(res?.total);
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        fetchPageData();
    }, [page, rowsPerPage]);

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
                const newSelectedId: string[] = rows.map((n) => n.benefitsName);
                setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<HTMLTableRowElement> | undefined, benefitsName: string) => {
        const selectedIndex = selected.indexOf(benefitsName);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, benefitsName);
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

    const isSelected = (benefitsName: string) => selected.indexOf(benefitsName) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{
                '& > div:focus-visible': { outline: 'none' }
            }}
        >
            <MainCard
                content={false}
                title="权益记录"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { lg: '60%', md: '70%', xs: '80%' }
                }}
                secondary={
                    <IconButton onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
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

                                const isItemSelected = isSelected(row.benefitsName);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.benefitsName)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                    >
                                        <TableCell align="center" sx={{ pl: 3 }} padding="checkbox" component="th" id={labelId} scope="row">
                                            {row.benefitsName}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row?.enabled ? (
                                                <Chip label="生效中" size="small" color="primary" />
                                            ) : (
                                                <Chip size={'small'} label="已过期" />
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.benefitsList.map((benefit, id) => (
                                                <Fragment key={id}>
                                                    {benefit}
                                                    <br />
                                                </Fragment>
                                            ))}
                                        </TableCell>
                                        <TableCell align="center">{formatTime(row.effectiveTime)}</TableCell>
                                        <TableCell align="center">
                                            {row.validity} {row.validityUnit === 'MONTH' ? '月' : row.validityUnit === 'WEEK' ? '周' : '年'}
                                        </TableCell>
                                        <TableCell sx={{ pr: 3 }} align="center">
                                            {formatTime(row.expirationTime)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                            {/* {emptyRows > 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} />
                                </TableRow>
                            )} */}
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
        </Modal>
    );
};

export default Record;
