import { Divider } from 'antd';
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
    TableSortLabel,
    Box,
    TableCell,
    TableBody,
    Checkbox,
    TableRow,
    Tooltip,
    IconButton
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { ArrangementOrder, EnhancedTableHeadProps } from 'types';
import { Search, Add, Delete, Edit } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const headCells = [
    { id: 'title', numeric: false, disablePadding: false, label: '词库名称' },
    { id: 'endpoint', numeric: false, disablePadding: false, label: '所谓站点' },
    { id: 'asin', numeric: false, disablePadding: false, label: '关键词数量' },
    { id: 'status', numeric: false, disablePadding: false, label: ' 创建时间' },
    { id: 'score', numeric: false, disablePadding: false, label: '更新时间' },
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
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
const Thesaurus = () => {
    const [pageQuery, setPageQuery] = useState({
        pageNo: 1,
        pageSize: 10
    });

    const navigate = useNavigate();
    const [dense] = useState(false);
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('');
    const [selected, setSelected] = useState<any[]>([]);
    const rows = [{ id: 1 }, { id: 2 }];
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
    const isSelected = (id: number) => selected.indexOf(id) !== -1;
    return (
        <div className="h-full">
            <div className="bg-[#fff] p-[16px]">
                <Grid container alignItems="center" spacing={2}>
                    <Grid item md={2}>
                        <TextField size="small" label="站点名称" color="secondary" />
                    </Grid>
                    <Grid item md={2}>
                        <TextField size="small" fullWidth InputLabelProps={{ shrink: true }} label="词库名称" color="secondary" />
                    </Grid>
                    <Grid item md={2}>
                        <TextField size="small" fullWidth InputLabelProps={{ shrink: true }} label="包含关键词" color="secondary" />
                    </Grid>
                    <Grid item md={2}>
                        <Button size="small" variant="contained" color="secondary" startIcon={<Search />}>
                            查询
                        </Button>
                        <Button size="small" sx={{ ml: 1 }} variant="contained" color="secondary" startIcon={<Add />}>
                            新建词库
                        </Button>
                    </Grid>
                </Grid>
            </div>
            <div className="bg-[#fff] py-[16px]">
                <div className="px-[16px] flex items-center justify-between">
                    <div>
                        <Button size="small" variant="contained" color="secondary" startIcon={<Delete />}>
                            批量删除
                        </Button>
                    </div>
                    <div className="flex items-center">
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
                        <Button size="small" variant="contained" color="secondary">
                            确定
                        </Button>
                    </div>
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
                                        <TableCell align="center">1111222</TableCell>
                                        <TableCell align="center">{33333}</TableCell>
                                        <TableCell align="center">222222</TableCell>
                                        <TableCell align="center">555</TableCell>
                                        <TableCell align="center">333</TableCell>
                                        <TableCell align="center">
                                            <Tooltip placement="top" title={'查看关键词列表'}>
                                                <IconButton
                                                    aria-label="delete"
                                                    size="small"
                                                    onClick={() => {
                                                        navigate('/termSearch');
                                                    }}
                                                >
                                                    <Edit className="text-base" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};
export default Thesaurus;
