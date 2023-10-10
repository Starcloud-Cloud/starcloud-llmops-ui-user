import {
    Card,
    Box,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Button,
    Tabs,
    Tab,
    Divider,
    IconButton
} from '@mui/material';
import { Image } from 'antd';
import { Add, ContentPaste, ArrowCircleDown, BorderColor, MoreHoriz } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
import { useState } from 'react';
import _ from 'lodash-es';
import nothing from 'assets/images/upLoad/nothing.svg';
import MaskDrawer from './maskDrawer';
import { v4 as uuidv4 } from 'uuid';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

const WeShop = () => {
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    //商品列表
    const [goodList, setGoodList] = useState<{ name: string }[]>([{ name: '商品_dask12312' }]);
    //新增商品
    const addGood = () => {
        const newValue = _.cloneDeep(goodList);
        newValue.unshift({ name: '商品_' + uuidv4().split('-')[0] });
        setGoodList(newValue);
        setSelectedIndex(0);
    };
    //选中商品
    const [selectedIndex, setSelectedIndex] = useState<null | number>(null);
    const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
        setSelectedIndex(index);
        setOpen(true);
    };
    const [open, setOpen] = useState(false);
    return (
        <Card sx={{ height: '100%' }}>
            <Grid container sx={{ height: '100%', overflowY: 'auto' }}>
                <Grid item md={9}>
                    {selectedIndex === null && (
                        <Box>
                            <Tabs value={value} onChange={handleChange}>
                                <Tab label="我的星标" {...a11yProps(0)} />
                                <Tab label="优秀案例" {...a11yProps(1)} />
                            </Tabs>
                            <CustomTabPanel value={value} index={0}>
                                <Box height="100%" textAlign="center" display="flex" justifyContent="center" alignItems="center">
                                    <Box>
                                        <img width="100px" src={nothing} alt="" />
                                        <Typography color="#697586">暂无星标，赶快去收藏星标吧！</Typography>
                                    </Box>
                                </Box>
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                                Item Two
                            </CustomTabPanel>
                        </Box>
                    )}
                    {selectedIndex !== null && (
                        <Box height="100%" px="40px" py={2} sx={{ overflowY: 'auto', overflowX: 'auto', position: 'relative' }}>
                            <Box pb={2} display="flex" alignItems="center">
                                <Typography variant="h4">名称</Typography>
                                <Divider sx={{ mx: 2 }} orientation="vertical" flexItem />
                                <Typography color="#697586">任务号：</Typography>
                            </Box>
                            <Divider />
                            <Box pt="40px">
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="h5">颜色更艳丽一点</Typography>
                                        <IconButton sx={{ ml: 1 }} color="secondary" size="small">
                                            <ContentPaste fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <Box display="flex">
                                        <Button
                                            variant="outlined"
                                            startIcon={<ArrowCircleDown fontSize="small" />}
                                            color="secondary"
                                            size="small"
                                        >
                                            PSD下载
                                        </Button>
                                        <Button
                                            sx={{ mx: 1 }}
                                            variant="outlined"
                                            startIcon={<BorderColor fontSize="small" />}
                                            color="secondary"
                                            size="small"
                                        >
                                            再次编辑
                                        </Button>
                                        <IconButton color="secondary" size="small">
                                            <MoreHoriz fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <div>
                                    <span
                                        style={{
                                            color: '#697586',
                                            background: '#edeaea',
                                            borderRadius: '4px',
                                            padding: '4px 0',
                                            marginRight: '4px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        第一次执行
                                    </span>
                                    <span style={{ color: '#697586', fontSize: '14px' }}>2023-09-12 09:45:51</span>
                                </div>
                                <Box mt="16px" display="flex">
                                    <Grid flexWrap="wrap" container spacing={1}>
                                        <Grid item md={3}>
                                            <Image
                                                style={{ borderRadius: '10px' }}
                                                src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`}
                                                preview={{
                                                    src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={3}>
                                            <Image
                                                style={{ borderRadius: '10px' }}
                                                src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`}
                                                preview={{
                                                    src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={3}>
                                            <Image
                                                style={{ borderRadius: '10px' }}
                                                src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`}
                                                preview={{
                                                    src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={3}>
                                            <Image
                                                style={{ borderRadius: '10px' }}
                                                src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`}
                                                preview={{
                                                    src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={3}>
                                            <Image
                                                style={{ borderRadius: '10px' }}
                                                src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`}
                                                preview={{
                                                    src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                            <MaskDrawer open={open} setOpen={setOpen} />
                        </Box>
                    )}
                </Grid>
                <Grid sx={{ borderLeft: '1px solid #eeeeee' }} item md={3}>
                    <Box p={2}>
                        <Typography variant="h4">Ai生成图片</Typography>
                        <Typography pt={1} fontSize="12px" color="#697586">
                            只需要将服装穿到人台上，即可用符合品牌调性的各类型真人模特展示服装。
                        </Typography>
                        <Button onClick={addGood} sx={{ my: 2 }} fullWidth color="secondary" variant="outlined" startIcon={<Add />}>
                            新增商品
                        </Button>
                        <List>
                            {goodList.map((item, index) => (
                                <ListItem key={item.name} sx={{ px: '0 !important' }}>
                                    <ListItemButton
                                        selected={selectedIndex === index}
                                        onClick={(event) => handleListItemClick(event, index)}
                                        sx={{ px: '0 !important' }}
                                    >
                                        <ListItemIcon>
                                            <ImageIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={item.name} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Grid>
            </Grid>
        </Card>
    );
};
export default WeShop;
