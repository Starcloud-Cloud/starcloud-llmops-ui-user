// material-ui
import CloseIcon from '@mui/icons-material/Close';
import { CardContent, IconButton, Button, Modal, Tabs, Tab, Box, Typography, Divider, Link, TextField } from '@mui/material';
import { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { bindCreate, bindModify, bindDelete } from 'api/chat';
import { v4 as uuidv4 } from 'uuid';
import copy from 'clipboard-copy';
import { openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';
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
const WeSetting = ({ name, updateBtn }: { name: string; updateBtn: any }) => {
    return (
        <>
            <Typography sx={{ cursor: 'pointer' }} color="secondary" mb={1}>
                查看填写示意图
            </Typography>
            <Box display="flex" alignItems="center">
                <Box width="10px" height="10px" borderRadius="50%" sx={{ backgroundColor: '#673ab7' }}></Box>
                <Typography ml={2}>
                    进入微信
                    <span style={{ color: '#00e676', cursor: 'pointer' }} onClick={() => window.open('https://mp.weixin.qq.com/')}>
                        「公众号后台」
                    </span>
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
                            {`${window.location.origin}/cb_web/${updateBtn?.channelMap?.[2]?.[0]?.mediumUid}?source=mp_menu`}
                        </Typography>
                    )}
                    {name === '自动回复' && (
                        <Typography ml="21px" fontSize="12px">
                            {`${window.location.origin}/cb_web/${updateBtn?.channelMap?.[2]?.[0]?.mediumUid}?source=mp_reply`}
                        </Typography>
                    )}
                    <Box ml="21px" mt={1} display="flex">
                        <Button
                            onClick={() => {
                                copy(
                                    name === '添加菜单'
                                        ? `${window.location.origin}/cb_web/${updateBtn?.channelMap?.[2]?.[0]?.mediumUid}?source=mp_menu`
                                        : `${window.location.origin}/cb_web/${updateBtn?.channelMap?.[2]?.[0]?.mediumUid}?source=mp_reply`
                                );
                                dispatch(
                                    openSnackbar({
                                        open: true,
                                        message: '复制成功',
                                        variant: 'alert',
                                        alert: {
                                            color: 'success'
                                        },
                                        close: false,
                                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                        transition: 'SlideLeft'
                                    })
                                );
                            }}
                            size="small"
                            color="secondary"
                        >
                            复制链接
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};
export default function WechatModal({
    open,
    updateBtn,
    setOpen,
    getUpdateBtn
}: {
    open: boolean;
    updateBtn: any;
    setOpen: (open: boolean) => void;
    getUpdateBtn: () => void;
}) {
    const [value, setValue] = useState(0);
    const [idOpen, setIdOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [numberOpen, setNumberOpen] = useState(false);
    const [resizeOpen, setRestOpen] = useState(false);
    const [query, setQuery] = useState({
        account: '',
        appId: '',
        appSecret: ''
    });
    //部署
    const saveWechat = async () => {
        if (Object.values(query).every((value) => value !== '')) {
            if (!resizeOpen) {
                const result = await bindCreate({
                    appUid: updateBtn.appUid,
                    publishUid: updateBtn.uid,
                    name: uuidv4(),
                    ...query
                });
            } else {
                await bindModify(updateBtn?.channelMap[6][0]?.uid, {
                    appUid: updateBtn.appUid,
                    publishUid: updateBtn.uid,
                    name: uuidv4(),
                    ...query
                });
            }
            setRestOpen(false);
            getUpdateBtn();
        } else {
            setIdOpen(true);
            setPasswordOpen(true);
            setNumberOpen(true);
        }
    };
    //取消部署
    const delWP = async () => {
        setQuery({
            appId: updateBtn?.channelMap[6][0]?.config?.wxAppId,
            appSecret: updateBtn?.channelMap[6][0]?.config?.appSecret,
            account: updateBtn?.channelMap[6][0]?.config?.account
        });
        setRestOpen(true);
        // const result = await bindDelete(updateBtn?.channelMap[6][0]?.uid);
        // if (result) {
        //     getUpdateBtn();
        // }
    };
    //复制
    const message = () => {
        dispatch(
            openSnackbar({
                open: true,
                message: '复制成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                close: false,
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                transition: 'SlideLeft'
            })
        );
    };
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
                    width: '800px',
                    maxHeight: '80%',
                    overflowY: 'auto',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, 0)'
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
                        <WeSetting name="添加菜单" updateBtn={updateBtn} />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <WeSetting name="自动回复" updateBtn={updateBtn} />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        <Typography sx={{ cursor: 'pointer' }} color="secondary" mb={1}>
                            查看填写示意图
                        </Typography>
                        {!(updateBtn?.channelMap[6]?.length > 0) || resizeOpen ? (
                            <div>
                                <div>
                                    进入微信
                                    <span
                                        onClick={() => window.open('https://mp.weixin.qq.com/')}
                                        className="text-[#2AC74A] mt-[8px] cursor-pointer"
                                    >
                                        「公众号后台」
                                    </span>
                                    复制开发信息
                                </div>
                                <div className="text-[12px] text-[#697586] mt-[8px]">{`路径：设置与开发 > 基本配置，启用开发者密码后，复制并填写在下方`}</div>
                                <div className="text-[12px] text-[#EA0000] mt-[8px]">未认证公众号暂不支持</div>
                                <div className="text-[12px] text-[#EA0000] mt-[8px]">启用后，请在微信公众号后台复制IP白名单</div>
                                <TextField
                                    sx={{ mt: 2, mb: 1, width: '60%' }}
                                    size="small"
                                    label="开发者ID"
                                    color="secondary"
                                    helperText=" "
                                    required
                                    name="appId"
                                    error={idOpen && !query.appId}
                                    value={query.appId}
                                    onChange={(e) => {
                                        setIdOpen(true);
                                        setQuery({
                                            ...query,
                                            appId: e.target.value
                                        });
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    sx={{ width: '60%' }}
                                    label="开发者密码"
                                    size="small"
                                    color="secondary"
                                    helperText=" "
                                    fullWidth
                                    required
                                    name="appSecret"
                                    error={passwordOpen && !query.appSecret}
                                    value={query.appSecret}
                                    onChange={(e) => {
                                        setPasswordOpen(true);
                                        setQuery({
                                            ...query,
                                            appSecret: e.target.value
                                        });
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    sx={{ width: '60%' }}
                                    label="公众号微信号-自动回复使用"
                                    size="small"
                                    color="secondary"
                                    helperText=" "
                                    fullWidth
                                    required
                                    name="account"
                                    error={numberOpen && !query.account}
                                    value={query.account}
                                    onChange={(e) => {
                                        setNumberOpen(true);
                                        setQuery({
                                            ...query,
                                            account: e.target.value
                                        });
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <div className="flex justify-end">
                                    <Button onClick={saveWechat} sx={{ width: '200px' }} color="secondary" variant="contained">
                                        提交
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="font-[500]">服务器配置</div>
                                <div className="text-[#697586] my-[8px]">公众号后台启用后，请在微信公众号后台复制IP白名单</div>
                                <div className="text-[#697586]">复制下方信息，在后台修改配置时粘贴</div>
                                <div className="flex justify-between mt-[8px]">
                                    <div>服务器地址（URL）：{updateBtn?.channelMap[6][0]?.config?.url}</div>
                                    <Button
                                        onClick={() => {
                                            copy(updateBtn?.channelMap[6][0]?.config?.url);
                                            message();
                                        }}
                                        size="small"
                                        color="secondary"
                                    >
                                        复制
                                    </Button>
                                </div>
                                <div className="flex justify-between">
                                    <div>令牌（Token）：{updateBtn?.channelMap[6][0]?.config?.token}</div>
                                    <Button
                                        onClick={() => {
                                            copy(updateBtn?.channelMap[6][0]?.config?.token);
                                            message();
                                        }}
                                        size="small"
                                        color="secondary"
                                    >
                                        复制
                                    </Button>
                                </div>
                                <div className="flex justify-between">
                                    <div>ip白名单：{updateBtn?.channelMap[6][0]?.config?.whitelist?.toString()}</div>
                                    <Button
                                        onClick={() => {
                                            copy(updateBtn?.channelMap[6][0]?.config?.whitelist?.toString());
                                            message();
                                        }}
                                        size="small"
                                        color="secondary"
                                    >
                                        复制
                                    </Button>
                                </div>
                                <div className="flex justify-between mb-[12px]">
                                    <div>消息加解密方式</div>
                                    <div>明文模式</div>
                                </div>
                                <Button onClick={delWP} size="small" color="secondary" variant="outlined">
                                    重新部署
                                </Button>
                            </div>
                        )}
                    </CustomTabPanel>
                </CardContent>
            </MainCard>
        </Modal>
    );
}
