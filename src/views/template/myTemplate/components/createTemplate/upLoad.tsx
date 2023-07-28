import {
    Box,
    Grid,
    Typography,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper
} from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import { Code, ContentPaste, CheckCircle, Storefront, CloudUploadOutlined, HistoryOutlined } from '@mui/icons-material';
import { useState } from 'react';
function Upload() {
    const IconList: { [key: string]: any } = {
        cloudUploadOutlined: <CloudUploadOutlined sx={{ fontSize: '12px' }} />,
        historyOutlined: <HistoryOutlined sx={{ fontSize: '12px' }} />,
        contentPaste: <ContentPaste sx={{ fontSize: '12px' }} />
    };
    const upLoadList = [
        {
            title: '网页',
            desc: '用户在此链接可以直接和您的机器人聊天',
            comingSoon: true,
            action: [
                { title: '复制链接', icon: 'contentPaste' },
                { title: '预览体验', icon: 'historyOutlined' },
                { title: '域名部署', icon: 'historyOutlined' }
            ]
        },
        {
            title: 'JS嵌入',
            desc: '可添加到网站的任何位置，将此 iframe 添加到 html 代码中',
            comingSoon: true,
            action: [
                { title: '创建站点', icon: 'cloudUploadOutlined' },
                { title: '查看代码', icon: 'historyOutlined' }
            ]
        },
        {
            title: 'API调用',
            desc: '通过API，可直接进行调用或发出请求',
            comingSoon: true,
            action: [
                { title: '接口秘钥', icon: 'cloudUploadOutlined' },
                { title: '接口文档', icon: 'historyOutlined' }
            ]
        },
        {
            title: '微信群聊',
            desc: '微信群在新创建的微信群聊中提供机器人服务，首位进群人员为管理员；',
            comingSoon: true,
            action: [
                { title: '创建群聊', icon: 'cloudUploadOutlined' },
                { title: '查看群聊', icon: 'historyOutlined' }
            ]
        },
        {
            title: '微信公众号',
            desc: '可在微信公众号后台配置，提供机器人服务',
            comingSoon: true,
            action: [{ title: '配置微信公众号', icon: 'cloudUploadOutlined' }]
        }
    ];
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
    //发表历史记录弹框
    const [historyState, setHistorySate] = useState(false);
    return (
        <Box>
            <SubCard
                sx={{ p: 2, mb: 4 }}
                contentSX={{ height: '50px', p: '0 !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <Box>
                    <Typography fontSize={16} fontWeight={500}>
                        点击[更新]按钮保存设置以便发布。
                    </Typography>
                    <Box fontSize={12} mt="12px" display="flex" alignItems="center">
                        <CheckCircle color="success" sx={{ fontSize: '14px' }} /> 所有设置已更新!最后一次更新日期：
                        <Typography color="secondary">2023-07-28 16:34:56</Typography>
                    </Box>
                </Box>
                <Button color="secondary" variant="outlined">
                    更新
                </Button>
            </SubCard>
            <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                    <SubCard contentSX={{ height: '120px', p: '20px', display: 'flex' }}>
                        <Box>
                            <Box
                                width="40px"
                                height="40px"
                                borderRadius="50%"
                                sx={{ background: '#673ab74f' }}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Storefront color="secondary" />
                            </Box>
                        </Box>
                        <Box ml={2}>
                            <Typography fontSize={16} fontWeight={500} display="flex" alignItems="center">
                                模板市场
                                <Chip sx={{ ml: 1.5 }} size="small" label="未发表的" />
                            </Typography>
                            <Typography margin="10px 0 24px" lineHeight="16px" color="#9da3af">
                                用户可在模板市场中下载你上传的应用
                            </Typography>
                            <Box display="flex">
                                <Box
                                    color="#b5bed0"
                                    fontSize="12px"
                                    display="flex"
                                    alignItems="center"
                                    mr={2}
                                    sx={{ cursor: 'pointer', '&:hover': { color: '#673ab7' } }}
                                >
                                    <CloudUploadOutlined sx={{ fontSize: '12px' }} />
                                    &nbsp;&nbsp; 发布到市场
                                </Box>
                                <Box
                                    color="#b5bed0"
                                    fontSize="12px"
                                    display="flex"
                                    alignItems="center"
                                    mr={2}
                                    sx={{ cursor: 'pointer', '&:hover': { color: '#673ab7' } }}
                                    onClick={() => {
                                        setHistorySate(true);
                                    }}
                                >
                                    <HistoryOutlined sx={{ fontSize: '12px' }} />
                                    &nbsp;&nbsp; 发布历史记录
                                </Box>
                            </Box>
                        </Box>
                    </SubCard>
                </Grid>
                {upLoadList.map((item) => (
                    <Grid item md={6} xs={12}>
                        <SubCard contentSX={{ height: '120px', p: '20px', display: 'flex' }}>
                            <Box>
                                <Box
                                    width="40px"
                                    height="40px"
                                    borderRadius="50%"
                                    sx={{ background: '#f2f3f5' }}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Code />
                                </Box>
                            </Box>
                            <Box ml={2}>
                                <Typography fontSize={16} fontWeight={500} display="flex" alignItems="center">
                                    {item.title}
                                    {item.comingSoon && <Chip sx={{ ml: 1.5 }} size="small" label="即将推出" />}
                                </Typography>
                                <Typography margin="10px 0 24px" lineHeight="16px" color="#9da3af">
                                    {item.desc}
                                </Typography>
                                <Box display="flex">
                                    {item.action.map((el) => (
                                        <Box color="#b5bed0" fontSize="12px" display="flex" alignItems="center" mr={2}>
                                            {IconList[el.icon]}
                                            &nbsp;&nbsp; {el.title}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </SubCard>
                    </Grid>
                ))}
            </Grid>
            <Dialog maxWidth="lg" fullWidth open={historyState} onClose={() => setHistorySate(false)}>
                <DialogTitle>历史记录</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table size="small">
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
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
export default Upload;
