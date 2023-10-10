// material-ui
import CloseIcon from '@mui/icons-material/Close';
import { CardContent, IconButton, Button, Modal, Tabs, Tab, Box, Typography, Divider, Link, TextField } from '@mui/material';
import { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
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
                <Box sx={{ p: 2 }}>
                    <Box>{children}</Box>
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
const WeSetting = ({ name }: { name: string }) => {
    return (
        <>
            <Typography sx={{ cursor: 'pointer' }} color="secondary" mb={1}>
                查看填写示意图
            </Typography>
            <Box display="flex" alignItems="center">
                <Box width="10px" height="10px" borderRadius="50%" sx={{ backgroundColor: '#673ab7' }}></Box>
                <Typography ml={2}>
                    进入微信<span style={{ color: '#00e676', cursor: 'pointer' }}>「公众号后台」</span>
                </Typography>
            </Box>
            <Box display="flex">
                <Divider sx={{ borderColor: '#673ab7', ml: '5px' }} orientation="vertical" flexItem />
                {name === '添加菜单' && (
                    <Box>
                        <Typography my={1} ml="21px" color="#b5bed0" fontSize="12px">{`请确保您的公众号已过微信认证`}</Typography>
                        <Typography
                            my={1}
                            ml="21px"
                            color="#b5bed0"
                            fontSize="12px"
                        >{`路径：内容与互动 > 自定义菜单 > 添加菜单`}</Typography>
                    </Box>
                )}
                {name === '自动回复' && (
                    <Typography my={1} ml="21px" color="#b5bed0" fontSize="12px">{`路径：内容与互动 > 自动回复 > 收到消息回复`}</Typography>
                )}
            </Box>
            <Box display="flex" alignItems="center">
                <Box width="10px" height="10px" borderRadius="50%" sx={{ backgroundColor: '#673ab7' }}></Box>
                <Typography ml={2}>创建自动回复</Typography>
            </Box>
            <Box display="flex">
                <Divider sx={{ borderColor: '#673ab7', ml: '5px' }} orientation="vertical" flexItem />
                <Box>
                    {name === '添加菜单' && (
                        <Typography my={1} ml="21px" color="#b5bed0" fontSize="12px">
                            填写菜单名称，将以下链接或二维码，配置到菜单里
                        </Typography>
                    )}
                    {name === '自动回复' && (
                        <Typography my={1} ml="21px" color="#b5bed0" fontSize="12px">
                            选择自动回复类型，将以下链接或二维码，配置到回复里
                        </Typography>
                    )}
                    {name === '添加菜单' && (
                        <Typography ml="21px" fontSize="12px">
                            https://chato.cn/b/jp1637w9331rmo8e?source=mp_reply
                        </Typography>
                    )}
                    {name === '自动回复' && (
                        <Typography ml="21px" fontSize="12px">
                            https://chato.cn/b/jp1637w9331rmo8e?source=mp_reply
                        </Typography>
                    )}
                    <Box ml="21px" mt={1} display="flex">
                        <Button size="small" color="secondary">
                            复制链接
                        </Button>
                        <Button size="small" color="secondary">
                            保存二维码
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};
export default function WechatModal({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Modal
            open={open}
            onClose={() => {
                setOpen(false);
            }}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <MainCard
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title={'配置公众号'}
                content={false}
                className="sm:w-[700px] xs:w-[300px]"
                secondary={
                    <IconButton
                        onClick={() => {
                            setOpen(false);
                        }}
                        size="large"
                        aria-label="close modal"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent sx={{ p: '0 !important' }}>
                    <Tabs
                        indicatorColor="secondary"
                        textColor="secondary"
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                    >
                        <Tab label="添加菜单" {...a11yProps(0)} />
                        <Tab label="自动回复" {...a11yProps(1)} />
                        <Tab label="消息调用" {...a11yProps(1)} />
                    </Tabs>
                    <CustomTabPanel value={value} index={0}>
                        <WeSetting name="添加菜单" />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <WeSetting name="自动回复" />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        <Link sx={{ mb: 2 }} color="secondary">
                            查看示例图
                        </Link>
                        <div>
                            <div>
                                进入微信 <span className="text-[#2AC74A] mt-[8px]">「公众号后台」</span> 复制开发信息
                            </div>
                            <div className="text-[12px] text-[#697586] mt-[8px]">{`路径：设置与开发 > 基本配置，启用开发者密码后，复制并填写在下方`}</div>
                            <div className="text-[12px] text-[#EA0000] mt-[8px]">未认证公众号暂不支持</div>
                            <div className="text-[12px] text-[#EA0000] mt-[8px]">启用后，请在微信公众号后台复制IP白名单</div>
                            <TextField
                                sx={{ mt: 2, mb: 1 }}
                                label="开发者ID"
                                color="secondary"
                                helperText=" "
                                fullWidth
                                required
                                name="id"
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="开发者密码"
                                color="secondary"
                                helperText=" "
                                fullWidth
                                required
                                name="password"
                                InputLabelProps={{ shrink: true }}
                            />
                            <div className="flex justify-end">
                                <Button sx={{ width: '200px' }} color="secondary" variant="contained">
                                    提交
                                </Button>
                            </div>
                        </div>
                        <div>
                            <div className="font-[500]">服务器配置</div>
                            <div className="text-[#697586] my-[8px]">公众号后台启用后，请在微信公众号后台复制IP白名单</div>
                            <div className="text-[#697586]">复制下方信息，在后台修改配置时粘贴</div>
                            <div className="flex justify-between mt-[8px]">
                                <div>服务器地址（URL）：</div>
                                <Button size="small" color="secondary">
                                    复制
                                </Button>
                            </div>
                            <div className="flex justify-between">
                                <div>令牌（Token）：</div>
                                <Button size="small" color="secondary">
                                    复制
                                </Button>
                            </div>
                            <div className="flex justify-between">
                                <div>消息加解密密钥（EncodingAESKey）：</div>
                                <Button size="small" color="secondary">
                                    复制
                                </Button>
                            </div>
                            <div className="flex justify-between">
                                <div>ip白名单：</div>
                                <Button size="small" color="secondary">
                                    复制
                                </Button>
                            </div>
                            <div className="flex justify-between">
                                <div>消息加解密方式</div>
                                <div>明文模式</div>
                            </div>
                            <Button variant="outlined">重新部署</Button>
                        </div>
                    </CustomTabPanel>
                </CardContent>
            </MainCard>
        </Modal>
    );
}
