import { Card, Tabs, Tab, Box, Typography, Grid } from '@mui/material';
import Item from 'antd/es/list/Item';
import { useState } from 'react';
import SubCard from 'ui-component/cards/SubCard';
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
            name: '魔法值',
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
    return (
        <Card sx={{ p: 2 }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="版本权益" {...a11yProps(0)} />
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
            <CustomTabPanel value={value} index={1}>
                暂未开放
            </CustomTabPanel>
        </Card>
    );
};
export default SpaceEquity;
