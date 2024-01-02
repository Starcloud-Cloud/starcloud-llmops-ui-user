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
    Table as Tables,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Pagination,
    Divider,
    Modal,
    CardContent,
    CardActions
} from '@mui/material';
import straw from '../../assets/images/users/straw.svg';
import { Upload, UploadProps, Image, ColorPicker, Input, Table } from 'antd';
import { PlusOutlined, FormOutlined } from '@ant-design/icons';
import { getAccessToken } from 'utils/auth';
import { useEffect, useState } from 'react';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import nothing from 'assets/images/upLoad/nothing.svg';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { getUserInfo } from 'api/login';
import Link from 'assets/images/share/fenxianglianjie.svg';
import register from 'assets/images/share/zhuce.svg';
import Reward from 'assets/images/share/yaoqingjiangli.svg';
import infoStore from 'store/entitlementAction';
import './index.scss';
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
            name: '魔法豆',
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
    const { use } = infoStore();
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
        // const result = await getUserInfo();
        // setInviteUrl(result.inviteUrl);
    };
    useEffect(() => {
        // getList();
    }, [pageQuery.pageNo]);

    //用户设置
    const [avatarOpen, setavatarOpen] = useState(false);
    const [imageUrl, setimageUrl] = useState('');
    const [active, setActive] = useState('');
    const [color, setColor] = useState<string>('');
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined rev={undefined} />
        </button>
    );
    const props: UploadProps = {
        name: 'image',
        showUploadList: false,
        listType: 'picture-circle',
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 20,
        onChange(info) {
            if (info.file.status === 'done') {
                setActive('');
                setColor('');
                setimageUrl(info?.file?.response?.data?.url);
            }
        }
    };
    const [nameOpen, setNameOpen] = useState(false);
    const [name, setName] = useState('用户名称');
    const colorList = [{ color: '#3698f8' }, { color: '#673ab7' }, { color: '#fcc666' }, { color: '#62d078' }];

    const columns = [
        {
            title: '用户名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '操作',
            width: 200,
            dataIndex: 'name',
            key: 'name'
        }
    ];
    return (
        <Card sx={{ p: 2 }} className="">
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="版本权益" {...a11yProps(0)} />
                {/* <Tab label="邀请记录" {...a11yProps(1)} /> */}
                <Tab label="成员设置" {...a11yProps(1)} />
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
            {/* <CustomTabPanel value={value} index={1}>
                <Box textAlign="center">
                    <Typography variant="h2">邀请你的朋友并赚取魔法豆</Typography>
                    <Typography variant="h4" fontWeight={400} my={2}>
                        为您和您的朋友赚取对应的魔法豆
                    </Typography>
                    <Typography variant="h4">您推荐的越多，魔法豆越高</Typography>
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
                            <ListItemText primary="邀请成功就送您和好友每人魔法豆额度, 奖励无上限" />
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
                            <ListItemText
                                primary={window.location.protocol + '//' + window.location.host + '/login?q=' + use?.inviteCode}
                            />
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
                        <Tables>
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
                        </Tables>
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
            </CustomTabPanel> */}
            <CustomTabPanel value={value} index={1}>
                <SubCard
                    sx={{ p: '0 !important', background: '#ede7f6', mb: 2 }}
                    contentSX={{ p: '16px !important', display: 'flex', justifyContent: 'space-between' }}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <div
                            className="w-[56px] h-[56px] rounded-full overflow-hidden cursor-pointer flex justify-center items-center text-white"
                            style={{ background: active ? active : color ? color : '#3698f8' }}
                            onClick={() => setavatarOpen(true)}
                        >
                            {imageUrl ? <Image width={56} height={56} src={imageUrl} alt="" /> : '用户'}
                        </div>
                        <div className="flex items-center gap-2">
                            {!nameOpen ? (
                                <Typography ml={1} color="#697586">
                                    {name}
                                </Typography>
                            ) : (
                                <Input
                                    defaultValue={name}
                                    onBlur={(e) => {
                                        if (e.target.value) {
                                            setName(e.target.value);
                                        }
                                        setNameOpen(false);
                                    }}
                                    showCount
                                    maxLength={20}
                                    className="w-[600px]"
                                    width={600}
                                />
                            )}
                            {!nameOpen && <FormOutlined onClick={() => setNameOpen(true)} className="cursor-pointer" rev={undefined} />}
                        </div>
                    </Box>
                </SubCard>
                <Table columns={columns} dataSource={[]} />
                <Modal
                    open={avatarOpen}
                    onClose={() => setavatarOpen(false)}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <MainCard
                        style={{
                            position: 'absolute',
                            top: '10%',
                            left: '50%',
                            transform: 'translate(-50%,0%)'
                        }}
                        title={'选择头像'}
                        content={false}
                        className="sm:w-[700px] xs:w-[300px]"
                        secondary={
                            <IconButton onClick={() => setavatarOpen(false)} size="large" aria-label="close modal">
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        }
                    >
                        <CardContent>
                            <div className="flex justify-center">
                                <div
                                    className="w-[56px] h-[56px] rounded-full overflow-hidden flex justify-center items-center text-white"
                                    style={{ background: active ? active : color ? color : '#3698f8' }}
                                >
                                    {imageUrl ? <Image width={56} height={56} src={imageUrl} alt="" /> : '用户'}
                                </div>
                            </div>
                            <div className="my-[20px] text-[15px] font-bold">自定义头像颜色</div>
                            <div className="flex justify-center spaceEquity gap-4 text-white">
                                <Upload {...props} className="!w-[auto] cursor-pointer">
                                    {uploadButton}
                                </Upload>
                                {colorList.map((item) => (
                                    <div
                                        className="w-[56px] h-[56px] cursor-pointer flex justify-center items-center rounded-full overflow-hidden outline-2 outline outline-offset-2"
                                        onClick={() => {
                                            setActive(item.color);
                                            setColor('');
                                            setimageUrl('');
                                        }}
                                        key={item.color}
                                        style={{
                                            outlineColor: active === item.color ? '#673ab7' : 'transparent',
                                            background: item.color
                                        }}
                                    >
                                        用户
                                    </div>
                                ))}
                                <ColorPicker
                                    value={color}
                                    onChange={(value) => {
                                        setColor(value.toHexString().slice(0, 7));
                                        setActive('');
                                        setimageUrl('');
                                    }}
                                >
                                    <div className="w-[56px] h-[56px] cursor-pointer flex justify-center items-center rounded-full overflow-hidden bg-[#f0f1f3]">
                                        <Image width={20} height={20} src={straw} preview={false} alt="" />
                                    </div>
                                </ColorPicker>
                            </div>
                        </CardContent>
                        <Divider />
                        <CardActions>
                            <Grid container justifyContent="flex-end">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        // setActive('')
                                        // setimageUrl('')
                                        // setColor('')
                                        setavatarOpen(false);
                                    }}
                                >
                                    取消
                                </Button>
                                <Button
                                    ml-1
                                    variant="contained"
                                    type="button"
                                    color="secondary"
                                    onClick={() => {
                                        setavatarOpen(false);
                                    }}
                                >
                                    保存
                                </Button>
                            </Grid>
                        </CardActions>
                    </MainCard>
                </Modal>
            </CustomTabPanel>
        </Card>
    );
};
export default SpaceEquity;
