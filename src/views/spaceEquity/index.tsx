import {
    Card,
    Tabs,
    Tab,
    Box,
    Typography,
    Grid,
    List,
    ListItem,
    IconButton,
    Button,
    ListItemText,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Pagination,
    Divider
} from '@mui/material';
import { useEffect, useState } from 'react';
import SubCard from 'ui-component/cards/SubCard';
import nothing from 'assets/images/upLoad/nothing.svg';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { getUserInfo } from 'api/login';
import Link from 'assets/images/share/fenxianglianjie.svg';
import register from 'assets/images/share/zhuce.svg';
import Reward from 'assets/images/share/yaoqingjiangli.svg';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}
const SpaceEquity = () => {
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    //空间权益
    const equity = [
        {
            name: '训练机器人',
            icon: 'jiqiren',
            desc: '已训练/总数',
            trained: 1,
            total: 20
        },
        {
            name: '魔力值',
            icon: 'mofa',
            desc: '已使用量/总量',
            trained: 2,
            total: 300
        },
        {
            name: '群聊数',
            icon: 'weixin',
            desc: '已创建数/总数',
            trained: 1,
            total: 1
        },
        {
            name: '图像值',
            icon: 'image',
            desc: '已生成/总数',
            trained: 0,
            total: 5
        }
    ];
    const [tableList, setTableList] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(1);
    const [pageQuery, setPageQuery] = useState({
        pageNo: 1,
        pageSize: 10
    });
    const paginationChange = (event: any, value: number) => {
        setPageQuery({
            ...pageQuery,
            pageNo: value
        });
    };
    const [inviteUrl, setInviteUrl] = useState('');
    const getList = async () => {
        const result = await getUserInfo();
        setInviteUrl(result.inviteUrl);
    };
    useEffect(() => {
        getList();
    }, [pageQuery.pageNo]);
    return (
        <Card sx={{ p: 2 }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="版本权益" {...a11yProps(0)} />
                <Tab label="邀请记录" {...a11yProps(1)} />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
                <>
                    <SubCard
                        sx={{ p: '0 !important', background: '#ede7f6', mb: 2 }}
                        contentSX={{ p: '16px !important', display: 'flex', justifyContent: 'space-between' }}
                    >
                        <Box display="flex" alignItems="end">
                            <Typography color="secondary" variant="h4">
                                免费版
                            </Typography>
                            <Typography ml={1} fontSize="12px" color="#697586">
                                2024/07/31 到期
                            </Typography>
                        </Box>
                        <Box sx={{ cursor: 'pointer' }} fontSize="12px" color="#697586">
                            升级/续费版本，享更多专属权益及服务
                        </Box>
                    </SubCard>
                    <Grid container spacing={2}>
                        {equity.map((item) => (
                            <Grid key={item.name} item lg={3} md={4} xs={12}>
                                <SubCard sx={{ p: '0 !important' }} contentSX={{ p: '16px !important', display: 'flex' }}>
                                    <Box>
                                        <img
                                            style={{ width: '20px' }}
                                            src={require('../../assets/images/upLoad/' + item.icon + '.svg')}
                                            alt=""
                                        />
                                    </Box>
                                    <Box ml={2}>
                                        <Typography variant="h4">{item.name}</Typography>
                                        <Typography color="#697586" my={2}>
                                            {item.desc}
                                        </Typography>
                                        <Typography variant="h4">
                                            {item.trained}/{item.total}
                                        </Typography>
                                    </Box>
                                </SubCard>
                            </Grid>
                        ))}
                    </Grid>
                </>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Box textAlign="center">
                    <Typography variant="h2">邀请你的朋友并赚取魔力值</Typography>
                    <Typography variant="h4" fontWeight={400} my={2}>
                        为您和您的朋友赚取对应的魔力值
                    </Typography>
                    <Typography variant="h4">您推荐的越多，魔力值越高</Typography>
                </Box>
                <SubCard
                    sx={{
                        mb: 5,
                        mt: 3,
                        maxWidth: '900px',
                        margin: '30px auto',
                        background: 'linear-gradient(125.8deg, rgba(255, 255, 255, 0.9) 0%, rgba(241, 229, 252, 0.9) 99.34%)'
                    }}
                    contentSX={{ p: '0 !important', maxWidth: '900px' }}
                >
                    <List>
                        <ListItem>
                            <ListItemText
                                sx={{ minWidth: '80px' }}
                                primary={
                                    <Typography whiteSpace="nowrap" fontWeight={500}>
                                        邀请文案
                                    </Typography>
                                }
                            />
                            <ListItemText primary="邀请成功就送您和好友每人魔力值额度, 奖励无上限" />
                            <IconButton size="small" color="secondary">
                                <BorderColorOutlinedIcon fontSize="small" />
                            </IconButton>
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                sx={{ minWidth: '80px' }}
                                primary={
                                    <Typography whiteSpace="nowrap" fontWeight={500}>
                                        邀请链接
                                    </Typography>
                                }
                            />
                            <ListItemText primary={inviteUrl} />
                            <Button size="small" color="secondary" variant="outlined">
                                复制文案及链接
                            </Button>
                        </ListItem>
                    </List>
                </SubCard>
                <Box sx={{ margin: '0 auto' }} display="flex" maxWidth="900px" alignItems="center" justifyContent="space-evenly">
                    <Typography fontSize="16px" fontWeight={500}>
                        用邀请链接推荐给你的朋友
                    </Typography>
                    <Typography fontSize="16px" fontWeight={500} mr="120px !important">
                        你的朋友注册了
                    </Typography>
                    <Typography fontSize="16px" fontWeight={500}>
                        获取奖励
                    </Typography>
                </Box>
                <Box sx={{ margin: 'auto' }} maxWidth="900px" display="flex" alignItems="center" justifyContent="space-around">
                    <img style={{ width: '50px' }} src={Link} alt="" />
                    <Box height="1px" width="100%" sx={{ background: 'red' }}></Box>
                    <img style={{ width: '50px' }} src={register} alt="" />
                    <Box height="1px" width="100%" sx={{ background: 'red' }}></Box>
                    <img style={{ width: '50px' }} src={Reward} alt="" />
                </Box>
                <Typography variant="h4" mt={5}>
                    邀请记录
                </Typography>
                {tableList.length > 0 && (
                    <Box>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">名称</TableCell>
                                    <TableCell align="center">账户</TableCell>
                                    <TableCell align="center">加入日期</TableCell>
                                    <TableCell align="center">状态</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableList.map((row) => (
                                    <TableRow key={row.name}>
                                        <TableCell align="center">{row.calories}</TableCell>
                                        <TableCell align="center">{row.fat}</TableCell>
                                        <TableCell align="center">{row.carbs}</TableCell>
                                        <TableCell align="center">{row.protein}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Box my={2}>
                            <Pagination page={pageQuery.pageNo} count={Math.ceil(total / pageQuery.pageSize)} onChange={paginationChange} />
                        </Box>
                    </Box>
                )}
                {tableList.length === 0 && (
                    <Box height="100%" textAlign="center" display="flex" justifyContent="center" alignItems="center">
                        <Box>
                            <img width="100px" src={nothing} alt="" />
                            <Typography color="#697586">暂无邀请记录</Typography>
                        </Box>
                    </Box>
                )}
            </CustomTabPanel>
        </Card>
    );
};
export default SpaceEquity;
