import {
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableBody,
    Checkbox,
    TableRow,
    Tooltip,
    IconButton,
    TableSortLabel,
    Box,
    Divider
} from '@mui/material';
import { ArrangementOrder, EnhancedTableHeadProps } from 'types';
import { Add, Delete } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, TablePagination } from '@mui/material';
import { COUNTRY_LIST } from '../listing-builder/data/index';
import { delDict, dictPage } from 'api/listing/thesaurus';
import SummarizeIcon from '@mui/icons-material/Summarize';
import React from 'react';
import dayjs from 'dayjs';
import { visuallyHidden } from '@mui/utils';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { AddDictModal } from './component/addDictModal';
import { Confirm } from 'ui-component/Confirm';

const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: '词库名称' },
    { id: 'endpoint', numeric: false, disablePadding: false, label: '所属站点' },
    { id: 'count', numeric: false, disablePadding: false, label: '关键词数量' },
    { id: 'createUser', numeric: false, disablePadding: false, label: ' 创建者' },
    { id: 'createTime', numeric: false, disablePadding: false, label: ' 创建时间' },
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
                        {['updateTime', 'createTime', 'count'].includes(headCell.id) ? (
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
const Thesaurus = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [total, setTotal] = useState(0);
    const [dense] = useState(false);
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('');
    const [selected, setSelected] = useState<any[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const [query, setQuery] = useState({});
    const [update, forceUpdate] = useState({});
    const [addDictOpen, setAddDictOpen] = useState(false);

    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchPageData = async () => {
            const pageVO: any = { pageNo: page + 1, pageSize: rowsPerPage, ...query };
            if (pageVO.endpoint === 'all') {
                pageVO.endpoint = '';
            }
            if (orderBy) {
                pageVO.sortField = orderBy;
                pageVO.asc = order === 'asc';
            }
            dictPage({ ...pageVO })
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
    }, [page, rowsPerPage, update, order, orderBy, query]);

    const handleRequestSort = (event: React.SyntheticEvent, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
        setRowsPerPage(parseInt(event?.target.value!, 10));
        setPage(0);
    };

    const countryList = [
        {
            key: 'all',
            label: '所有站点',
            icon: (
                <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="1653"
                    width="32"
                    height="32"
                    style={{ width: '16px', height: '16px' }}
                >
                    <path
                        d="M827.038443359375 190.79316406249995l-15.517089843750004-15.517089843750004c-13.965820312500002-12.413671875-26.3794921875-23.27607421875-41.89746093750001-32.586328125-48.10253906249999-34.13759765625-103.96582031250001-57.413671875-162.93076171875-71.3794921875C586.5213535156249 66.65556640624999 566.3486972656249 63.55214843750002 544.625650390625 62h-35.68974609375c-9.31025390625 0-20.172656250000003 0-29.48291015625 1.5521484375-20.172656250000003 1.5512695312499998-41.89746093750001 4.6546875-62.068359375000014 9.31025390625-58.9658203125 12.413671875-114.8291015625 35.68974609375-162.931640625 69.82734374999998l-41.89746093750001 32.586328125-21.723046875 21.72392578125C107.03844335937504 282.34443359375 60.486294921875015 395.6205078125 62.03844335937504 515.10341796875c1.5512695312499998 119.48291015625 48.10253906249999 232.75898437499998 135 316.55214843749997l15.517089843750004 15.517089843750004c13.965820312500002 12.413671875 26.3794921875 23.275195312500003 41.89658203125 32.586328125 45 31.034179687500007 94.65468750000001 54.31025390625 147.41367187499998 66.72392578125 20.172656250000003 4.6546875 40.34443359375 9.31025390625 60.51708984375 10.8615234375 17.068359375 1.5521484375 32.586328125 3.10341796875 49.65556640625 3.10341796875h3.1025390624999996c15.517968749999998 0 31.035058593749998-1.5512695312499998 46.5521484375-3.1025390624999996 20.172656250000003-3.104296875 41.89746093750001-6.20771484375 60.51708984375-10.863281249999998 52.758984375-13.964941406249999 102.41455078125-37.241015625 145.86328125-68.2751953125l41.895703125-32.586328125c93.10341796875-83.7931640625 152.068359375-204.82734375 150.51708984375-339.82734375 0-117.931640625-46.55126953125-229.65556640625002-133.4478515625-315z m82.24101562499999 294.82734374999995H687.382876953125c-3.1025390624999996-76.0341796875-10.8615234375-150.51708984375-24.82734375-220.34443359375 38.7931640625-13.965820312500002 74.48291015625001-32.586328125 108.6205078125-55.86240234375 79.13759765625 68.27607421875001 130.3453125 166.0341796875 138.10341796875002 276.20683593750005zM616.003384765625 746.31025390625c-35.68974609375-7.75810546875-71.37861328125-12.413671875-108.6205078125-12.413671875-34.13759765625 0-68.27607421875001 4.65556640625-100.8615234375 12.413671875-10.863281249999998-66.72392578125-15.517968749999998-136.55126953125003-17.06923828125-207.93164062500003h242.068359375c1.5521484375 71.38037109375001-4.6546875 139.65556640625-15.517089843750004 207.93164062500003z m-201.72392578125002-467.06835937499994c31.034179687500007 7.75810546875 63.620507812499994 10.8615234375 97.758984375 10.8615234375h3.1025390624999996c32.587207031249996 0 63.62138671875-3.10341796875 94.65556640624999-10.862402343749999 12.413671875 66.7248046875 20.172656250000003 135 23.27607421875 206.3794921875h-242.068359375c3.1025390624999996-69.82734374999998 10.8615234375-139.65468749999997 23.275195312500003-206.3794921875z m311.8974609375-102.41455078125a334.3974609375 334.3974609375 0 0 1-74.4837890625 37.24189453125c-7.75810546875-27.931640625000004-15.517089843750004-55.86240234375-23.275195312500003-82.24189453124998 34.13671875 9.31025390625 66.72392578125 24.82822265625 97.75810546875 45zM508.934146484375 113.20683593750005h3.1025390624999996c18.62138671875 0 37.24189453125 1.5521484375 54.3111328125 3.10341796875 12.413671875 35.68974609375 23.27607421875 72.931640625 32.586328125 111.72392578125-26.3794921875 6.2068359375-54.31025390625 9.31025390625-83.7931640625 9.31025390625h-3.10341796875c-29.48291015625 0-58.9658203125-3.1025390624999996-86.89746093750001-9.31025390625 9.3111328125-38.7931640625 20.172656250000003-76.0341796875 32.587207031249996-111.72392578125 17.068359375-1.5512695312499998 34.13759765625-3.1025390624999996 51.2068359375-3.1025390624999996zM395.658951171875 131.82734374999995c-7.758984374999999 26.3794921875-15.517089843750004 54.31025390625-23.27607421875 82.24189453124998a334.3974609375 334.3974609375 0 0 1-74.48291015625001-37.24189453125c31.034179687500007-20.171777343749998 63.62138671875-35.68974609375 97.758984375-45z m-141.20683593750002 77.586328125c34.13759765625 23.27607421875 69.82734374999998 41.89746093750001 108.6205078125 55.86240234375-13.965820312500002 71.3794921875-21.72392578125 145.86152343749998-24.82734375 220.34443359375H114.79654882812497c7.758984374999999-110.17265625 58.9658203125-207.93164062500003 139.65556640625-276.20683593750005zM114.79654882812497 538.3794921875001h221.8974609375c0 76.0341796875 6.20595703125 152.068359375 18.61962890625 223.4478515625-35.6888671875 13.965820312500002-69.82734374999998 31.034179687500007-100.8615234375 52.758984375-80.68974609375-68.27607421875001-131.89746093749997-166.0341796875-139.65556640625-276.20683593750005z m183.10341796875 308.7931640625c20.172656250000003-13.965820312500002 43.44873046875001-24.82822265625 66.7248046875-34.1384765625 4.6546875 24.82822265625 10.8615234375 51.2068359375 18.6205078125 74.48291015625001-31.034179687500007-9.31025390625-58.9658203125-23.27607421875-85.34531249999999-40.34443359375z m217.24189453125 63.620507812499994h-3.10341796875c-23.27607421875 0-46.5521484375-1.5521484375-68.27607421875001-6.2068359375-10.862402343749999-34.1384765625-20.172656250000003-69.82734374999998-26.3794921875-107.068359375 29.48291015625-7.758984374999999 60.51708984375-10.863281249999998 93.10341796875-10.863281249999998h3.10341796875c32.586328125 0 65.17265625 4.65556640625 94.65556640624999 10.863281249999998-7.758984374999999 37.241015625-17.068359375 72.9298828125-26.3794921875 107.068359375-23.27607421875 3.1025390624999996-45 4.6546875-66.72392578125 6.2068359375zM640.830728515625 889.068359375l18.6205078125-74.48291015625001c23.27607421875 9.31025390625 45 20.172656250000003 66.72392578125 34.13759765625-26.3794921875 15.517089843750004-54.31025390625 29.48291015625-85.34443359375 40.345312500000006z m128.7931640625-74.48291015625001c-31.034179687500007-21.72392578125-65.17265625-40.345312500000006-100.86240234375-52.758984375 12.413671875-71.3794921875 18.6205078125-147.41367187499998 18.6205078125-223.4478515625h221.8974609375c-7.758984374999999 110.17265625-58.9658203125 207.93164062500003-139.65556640625 276.20683593750005z"
                        p-id="1654"
                        fill="#707070"
                    ></path>
                </svg>
            )
        },
        ...COUNTRY_LIST
    ];

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
    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const handleDel = async () => {
        const res = await delDict(selected);
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
            forceUpdate({});
            setSelected([]);
        }
    };
    const [delOpen, setDelOpen] = useState(false);
    const [rowIndex, setRowIndex] = useState(-1);
    const delOk = async () => {
        const res = await delDict([rowIndex]);
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
            forceUpdate({});
            setSelected([]);
        }
        setDelOpen(false);
    };
    return (
        <div className="h-full">
            <Card>
                <div className="bg-[#fff] p-[16px]">
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item md={2}>
                            <FormControl fullWidth>
                                <InputLabel size="small" id="model">
                                    站点
                                </InputLabel>
                                <Select
                                    size="small"
                                    labelId="endpoint"
                                    name="endpoint"
                                    label="站点"
                                    onChange={(e) =>
                                        setQuery((pre: any) => ({
                                            ...pre,
                                            endpoint: e.target.value
                                        }))
                                    }
                                >
                                    {countryList.map((item) => (
                                        <MenuItem key={item.key} value={item.key} className="flex items-center">
                                            <div className="flex items-center">
                                                {item.icon}
                                                <span className="ml-1">{item.label}</span>
                                            </div>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={2}>
                            <TextField
                                size="small"
                                fullWidth
                                label="词库名称"
                                color="secondary"
                                onChange={(e) =>
                                    setQuery((pre: any) => ({
                                        ...pre,
                                        name: e.target.value
                                    }))
                                }
                            />
                        </Grid>
                        <Grid item md={3}>
                            <TextField
                                size="small"
                                fullWidth
                                label="包含关键词"
                                color="secondary"
                                onChange={(e) =>
                                    setQuery((pre: any) => ({
                                        ...pre,
                                        keyword: e.target.value
                                    }))
                                }
                            />
                        </Grid>
                        {/* <Grid item md={4}>
                            <Button variant="contained" color="secondary" startIcon={<Search />}>
                                查询
                            </Button>
                            <Button sx={{ ml: 1 }} variant="contained" color="secondary" startIcon={<Add />}>
                                新建词库
                            </Button>
                        </Grid> */}
                    </Grid>
                </div>
            </Card>
            <Card className="mt-4">
                <div className="bg-[#fff] py-[16px]">
                    <div className="px-[16px] flex items-center justify-between">
                        <div className="flex justify-between w-full">
                            <Button
                                size="small"
                                variant="contained"
                                color="secondary"
                                startIcon={<Add />}
                                onClick={() => setAddDictOpen(true)}
                            >
                                新建词库
                            </Button>
                            <Button
                                onClick={handleDel}
                                size="small"
                                variant="contained"
                                color="secondary"
                                startIcon={<Delete />}
                                disabled={!selected.length}
                            >
                                批量删除
                            </Button>
                        </div>
                        {/* <div className="flex items-center">
                            <FormControl size="small" color="secondary" sx={{ width: '140px' }}>
                                <InputLabel>更新时间</InputLabel>
                                <Select label="更新时间">
                                    <MenuItem value="createTime">创建时间</MenuItem>
                                    <MenuItem value="updateTime">更新时间</MenuItem>
                                    <MenuItem value="aaaa">关键词数量</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl size="small" color="secondary" sx={{ width: '80px', mx: 1 }}>
                                <InputLabel>排序</InputLabel>
                                <Select label="排序">
                                    <MenuItem value="createTime">升序</MenuItem>
                                    <MenuItem value="updateTime">降序</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="contained" color="secondary">
                                确定
                            </Button>
                        </div> */}
                    </div>
                    <TableContainer>
                        <Table sx={{ minWidth: 1100 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
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
                                    console.log(row, 'row');
                                    const isItemSelected = isSelected(row.uid);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            key={row.uid}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    onClick={(event) => handleClick(event, row.uid)}
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center" className="w-[300px]">
                                                <div className="w-full line-clamp-1 text-center">{row.name}</div>
                                            </TableCell>
                                            <TableCell align="center">
                                                <div className="flex items-center justify-center">
                                                    {COUNTRY_LIST.find((item: any) => item.key === row.endpoint)?.icon}
                                                    <span className="ml-1">
                                                        {COUNTRY_LIST.find((item: any) => item.key === row.endpoint)?.label}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">{row.count}</TableCell>
                                            <TableCell align="center">
                                                {row.createTime && dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.updateTime && dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip placement="top" title={'查看关键词列表'}>
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => {
                                                            navigate(`/thesaurusDetail?uid=${row.uid}`);
                                                        }}
                                                    >
                                                        <SummarizeIcon className="text-base" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Divider orientation="vertical" flexItem />
                                                <Tooltip placement="top" title={'删除'}>
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => {
                                                            setDelOpen(true);
                                                            setRowIndex(row.uid);
                                                        }}
                                                    >
                                                        <Delete className="text-base" />
                                                    </IconButton>
                                                </Tooltip>
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
                </div>
            </Card>
            <AddDictModal
                open={addDictOpen}
                handleClose={() => {
                    setAddDictOpen(false);
                }}
                forceUpdate={forceUpdate}
            />
            <Confirm open={delOpen} handleClose={() => setDelOpen(false)} handleOk={delOk} />
        </div>
    );
};
export default Thesaurus;
