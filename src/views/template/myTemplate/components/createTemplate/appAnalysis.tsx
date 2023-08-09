import {
    Box,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Pagination
} from '@mui/material';
import { gridSpacing } from 'store/constant';
import { useState, useEffect } from 'react';
import { logTimeType } from 'api/template';
interface QueryParams {
    pageNo: number;
    pageSize: number;
    name?: string;
    date?: string;
}
interface Item {
    label: string;
    value: string;
}
function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9)
];
const AppAnalysis = () => {
    const [queryParams, setQueryParams] = useState<QueryParams>({
        pageNo: 1,
        pageSize: 10
    });
    const handleChange = (event: any) => {
        const { name, value } = event;
        setQueryParams({
            ...queryParams,
            [name]: value
        });
    };
    const [total, setTotal] = useState(0);
    const paginationChange = (event: any, value: number) => {
        setQueryParams({
            ...queryParams,
            pageNo: value
        });
    };
    const getList = () => {};
    useEffect(() => {
        getList();
    }, [queryParams.pageNo]);
    //获取筛选时间列表
    const [dateList, setDateList] = useState([]);
    useEffect(() => {
        logTimeType().then((res) => {
            setDateList(res);
        });
    }, []);
    return (
        <Box>
            <Grid container alignItems="center" spacing={gridSpacing}>
                <Grid item md={3} xs={12}>
                    <TextField name="name" InputLabelProps={{ shrink: true }} label="名称" fullWidth value={queryParams.name} />
                </Grid>
                <Grid item md={3} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="date">date</InputLabel>
                        <Select labelId="date" name="date" value={queryParams.date} label="date" onChange={handleChange}>
                            {dateList?.map((item: Item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Button variant="contained" onClick={getList}>
                        搜索
                    </Button>
                </Grid>
            </Grid>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                        <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                        <TableCell align="right">Protein&nbsp;(g)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                            <TableCell align="right">{row.carbs}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Box my={2}>
                <Pagination page={queryParams.pageNo} count={Math.ceil(total / queryParams.pageSize)} onChange={paginationChange} />
            </Box>
        </Box>
    );
};
export default AppAnalysis;
