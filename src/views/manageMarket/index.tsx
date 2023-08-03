import { Box, Pagination, Button, Typography, Tooltip, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { pageAdmin, setAudit } from 'api/template';
import formatDate from 'hooks/useDate';
import { Popconfirm } from 'antd';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { t } from 'hooks/web/useI18n';

interface Row {
    uid: string;
    appUid: string;
    name: string;
    model: string;
    categories: string[];
    language: string;
    description: string;
    createTime: number;
    audit: number;
    updateTime: number;
}
function Form() {
    const [total, setTotal] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [pageQuery, setPageQuery] = useState<{
        pageNo: number;
        pageSize: number;
        name?: string;
        model?: string;
        audit?: number | string;
    }>({
        pageNo: 1,
        pageSize: 10,
        model: '',
        audit: ''
    });
    const modelList = [
        { label: '生成', value: 'COMPLETION' },
        { label: '聊天', value: 'CHAT' }
    ];
    const auditList = [
        { label: '待审核', value: 1 },
        { label: '审核通过', value: 2 },
        { label: '审核拒绝', value: 3 }
    ];
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setPageQuery({
            ...pageQuery,
            [name]: value
        });
    };
    const query = () => {
        getList();
    };
    const getList = async () => {
        const result = await pageAdmin(pageQuery);
        setTableData(result.list);
        setTotal(result.page.total);
    };
    useEffect(() => {
        getList();
    }, [pageQuery.pageNo]);
    const paginationChange = (event: any, value: number) => {
        setPageQuery({
            ...pageQuery,
            pageNo: value
        });
    };
    const approved = async (data: Row) => {
        const { uid, appUid } = { ...data };
        await setAudit({ uid, appUid, status: 2 });
        getList();
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
    };
    const rejected = async (data: Row) => {
        const { uid, appUid } = { ...data };
        await setAudit({ uid, appUid, status: 3 });
        getList();
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
    };
    return (
        <Box>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                    <TextField label="名称" fullWidth name="name" value={pageQuery.name} onChange={handleChange} />
                </Grid>
                <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel id="model">模型</InputLabel>
                        <Select labelId="model" name="model" value={pageQuery.model} label="模型" onChange={handleChange}>
                            {modelList.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel id="audit">状态</InputLabel>
                        <Select labelId="audit" name="audit" value={pageQuery.audit} label="状态" onChange={handleChange}>
                            {auditList.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={3}>
                    <Button variant="outlined" onClick={query}>
                        搜索
                    </Button>
                </Grid>
            </Grid>
            <TableContainer sx={{ mt: 2 }} component={Paper}>
                <Table sx={{ overflow: 'auto' }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">名称</TableCell>
                            <TableCell align="center">模型</TableCell>
                            <TableCell align="center">类别</TableCell>
                            <TableCell align="center">语言</TableCell>
                            <TableCell align="center">简介</TableCell>
                            <TableCell align="center">审核状态</TableCell>
                            <TableCell align="center">创建时间</TableCell>
                            <TableCell align="center">更新时间</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((row: Row) => (
                            <TableRow key={row.uid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="center" component="th" scope="row" sx={{ minWidth: '150px' }}>
                                    {row.name}
                                </TableCell>
                                <TableCell align="center" sx={{ minWidth: '100px' }}>
                                    {row.model === 'COMPLETION' ? '生成' : '聊天'}
                                </TableCell>
                                <TableCell align="center" sx={{ minWidth: '150px' }}>
                                    {row.categories?.toString()}
                                </TableCell>
                                <TableCell align="center" sx={{ minWidth: '150px' }}>
                                    {row.language}
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title={row.description}>
                                        <Typography width="200px" noWrap>
                                            {row.description}
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="center" sx={{ minWidth: '150px' }}>
                                    {row.audit === 0
                                        ? '未发表的'
                                        : row.audit === 1
                                        ? '待审核的'
                                        : row.audit === 2
                                        ? '审核通过'
                                        : row.audit === 3
                                        ? '审核未通过'
                                        : row.audit === 4
                                        ? '用户已取消'
                                        : '已失效'}
                                </TableCell>
                                <TableCell align="center" sx={{ minWidth: '170px' }}>
                                    {formatDate(row.createTime)}
                                </TableCell>
                                <TableCell align="center" sx={{ minWidth: '170px' }}>
                                    {formatDate(row.updateTime)}
                                </TableCell>
                                <TableCell align="center" sx={{ minWidth: '160px' }}>
                                    <Popconfirm
                                        placement="top"
                                        title="请再次确认是否通过这次审查"
                                        onConfirm={() => {
                                            approved(row);
                                        }}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button size="small" color="secondary">
                                            通过
                                        </Button>
                                    </Popconfirm>
                                    <Popconfirm
                                        placement="top"
                                        title="请再次确认是否拒绝这次审查"
                                        onConfirm={() => {
                                            rejected(row);
                                        }}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button size="small">拒绝</Button>
                                    </Popconfirm>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box my={2}>
                <Pagination page={pageQuery.pageNo} count={Math.ceil(total / pageQuery.pageSize)} onChange={paginationChange} />
            </Box>
        </Box>
    );
}
export default Form;
