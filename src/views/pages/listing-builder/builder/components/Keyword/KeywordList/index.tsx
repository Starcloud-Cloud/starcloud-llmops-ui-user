import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Checkbox, Paper } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import MainCard from 'ui-component/cards/MainCard';

import React, { useEffect, useState } from 'react';
import { ArrangementOrder, EnhancedTableHeadProps, KeyedObject } from 'types';
import { getListingDetail } from 'api/listing/build';
import { useListing } from 'contexts/ListingContext';

type TableEnhancedCreateDataType = {
    keyword: string;
    searches: number;
    searchWeeklyRank: number;
    month: string;
    updatedTime: string;
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
    { id: 'keyword', numeric: false, disablePadding: true, label: '关键词' },
    { id: 'score', numeric: false, disablePadding: true, label: '分值' },
    { id: 'searches', numeric: false, disablePadding: true, label: '搜索量' },
    { id: 'body', numeric: false, disablePadding: true, label: ' 购买率' },
    { id: 'body', numeric: false, disablePadding: true, label: '竞争度' },
    { id: 'body', numeric: false, disablePadding: true, label: '推荐值' },
    { id: 'body', numeric: false, disablePadding: true, label: '使用分布' }
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
                        component="th"
                        scope="row"
                        width={150}
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'center'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
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

export const KeywordList: React.FC = () => {
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const { version, uid } = useListing();

    const forceUpdate = () => setCount((pre) => pre + 1);

    // 获取详情
    useEffect(() => {
        if (uid && version !== undefined) {
            getListingDetail(uid, version)
                .then((res) => {
                    const fetchedRows = res.keywordMetaData;
                    setRows([...fetchedRows]);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [count, version, uid]);

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
                const newSelectedId: string[] = rows.map((n) => n.keyword);
                setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, keyword: string) => {
        const selectedIndex = selected.indexOf(keyword);
        let newSelected: any[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, keyword);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const isSelected = (keyword: string) => selected.indexOf(keyword) !== -1;
    return (
        <MainCard content={false}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 750 }} size={'small'}>
                    <EnhancedTableHead
                        size="small"
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
                            const isItemSelected = isSelected(row.keyword);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    key={row.keyword}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            size={'small'}
                                            color="primary"
                                            checked={isItemSelected}
                                            onClick={(event) => handleClick(event, row.keyword)}
                                            inputProps={{
                                                'aria-labelledby': labelId
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">{row.keyword}</TableCell>
                                    <TableCell align="center">{row.keyword}</TableCell>
                                    <TableCell align="center">{row.keyword}</TableCell>
                                    <TableCell align="center">{row.keyword}</TableCell>
                                    <TableCell align="center">{row.keyword}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
};
