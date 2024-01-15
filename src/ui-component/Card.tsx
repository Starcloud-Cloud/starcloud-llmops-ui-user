// material-ui
import LinkIcon from '@mui/icons-material/Link';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Typography,
    linearProgressClasses
} from '@mui/material';
import { Image, Popover, Menu } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { styled, useTheme } from '@mui/material/styles';
import Share from 'assets/images/share/share.png';
import copy from 'clipboard-copy';
import { themesDarkAfter, themesDarkBefor, themesLight } from 'hooks/useThemes';
import { t } from 'hooks/web/useI18n';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dispatch } from 'store';
import infoStore from 'store/entitlementAction';
import { openSnackbar } from 'store/slices/snackbar';
import useUserStore from 'store/user';
import { vipSwitch } from 'utils/vipSwtich';
import { useAllDetail } from 'contexts/JWTContext';
import { deptList } from 'api/section';
// styles

const CardStyle = styled(Card)(({ theme, level }: { theme: any; level: any }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : themesLight(level, theme, 1),
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.mode === 'dark' ? themesDarkAfter(level, theme) : themesLight(level, theme, 3),
        opacity: theme.palette.mode !== 'dark' ? 0.4 : 1,
        borderRadius: '50%',
        top: -125,
        right: -155,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.mode === 'dark' ? themesDarkBefor(level, theme) : themesLight(level, theme, 2),
        borderRadius: '50%',
        top: -145,
        right: -100,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

// ==============================|| PROFILE MENU - UPGRADE PLAN CARD ||============================== //
const BorderLinearProgress = styled(LinearProgress)(({ theme, level }: { theme: any; level: any }) => ({
    height: 10,
    borderRadius: 30,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.light : '#fff'
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'dark' ? themesLight(level, theme, 3) : themesLight(level, theme, 3)
    }
}));

// ==============================|| PROGRESS BAR WITH LABEL ||============================== //
interface LinearProgressWithLabelProps {
    info: any;
}
interface BenefitItem {
    type: string;
    name: string;
    percentage: number;
    usedNum: number;
    totalNum: number;
    remaining: number;
}
function LinearProgressWithLabel({ info }: LinearProgressWithLabelProps) {
    const theme = useTheme();
    const list = info?.allDetail?.rights?.filter((v: any) => ['MAGIC_BEAN', 'MAGIC_IMAGE'].includes(v.type));
    return (
        <Box>
            {list?.map((item: BenefitItem) => (
                <Grid key={item.type} container direction="column" spacing={1} sx={{ mt: 1.5 }}>
                    <Grid item>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color:
                                            theme.palette.mode === 'dark'
                                                ? theme.palette.dark.light
                                                : themesLight(vipSwitch(info?.allDetail?.levels[0]?.levelId), theme, 3)
                                    }}
                                >
                                    {t('user.' + item.name)}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6">
                                    {t('user.remaining')}&nbsp;&nbsp;{item?.totalNum - item?.usedNum}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Tooltip title={item?.remaining + '/' + item?.totalNum} placement="top">
                            <BorderLinearProgress
                                level={vipSwitch(info?.allDetail?.levels[0]?.levelId)}
                                variant="determinate"
                                value={(item?.remaining / item?.totalNum) * 100}
                                theme={theme}
                            />
                        </Tooltip>
                    </Grid>
                </Grid>
            ))}
        </Box>
    );
}

const Cards = ({ flag = false }) => {
    const permissions = useUserStore((state) => state.permissions);
    const allDetail = useAllDetail();
    const theme = useTheme();
    const { use } = infoStore();
    const navigate = useNavigate();
    const copyCode = () => {
        copy(window.location.protocol + '//' + window.location.host + '/login?q=' + use?.inviteCode);
        dispatch(
            openSnackbar({
                open: true,
                message: '复制成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                close: false
            })
        );
    };
    const [open, setOpen] = useState(false);
    //获取切换列表
    const [spaceList, setSpaceList] = useState<any[]>([]);
    useEffect(() => {
        const getList = async () => {
            const result = await deptList();
            setSpaceList(result);
        };
        if (flag) getList();
    }, []);
    return (
        <CardStyle
            sx={{ width: flag ? '240px' : '100%', marginLeft: flag ? '-16px' : 0, marginRight: flag ? '-16px' : 0 }}
            level={vipSwitch(allDetail?.allDetail?.levels[0]?.levelId)}
            theme={theme}
        >
            <CardContent sx={{ p: '16px !important' }}>
                <List sx={{ p: 0, m: 0 }}>
                    <ListItem alignItems="center" disableGutters sx={{ p: 0 }}>
                        <ListItemText sx={{ mt: 0 }}>
                            <Box display="inline-block" padding="4px 10px" border="1px solid #bdbdbd" borderRadius="5px">
                                {/* {userInfo?.userLevel ? t('user.' + userInfo?.userLevel) : t('user.free')} */}
                                {allDetail?.allDetail?.levels[0]?.levelName}
                            </Box>
                        </ListItemText>
                        <ListItemText sx={{ mt: 0 }}>
                            {vipSwitch(allDetail?.allDetail?.levels[0]?.levelId) !== 'pro' && (
                                <Button
                                    onClick={() => {
                                        navigate('/exchange');
                                    }}
                                    size="small"
                                    variant="contained"
                                    sx={{ boxShadow: 'none' }}
                                    color={
                                        vipSwitch(allDetail?.allDetail?.levels[0]?.levelId) === 'free'
                                            ? 'primary'
                                            : vipSwitch(allDetail?.allDetail?.levels[0]?.levelId) === 'basic'
                                            ? 'secondary'
                                            : vipSwitch(allDetail?.allDetail?.levels[0]?.levelId) === 'plus'
                                            ? 'warning'
                                            : vipSwitch(allDetail?.allDetail?.levels[0]?.levelId) === 'media'
                                            ? 'success'
                                            : vipSwitch(allDetail?.allDetail?.levels[0]?.levelId) === 'pro'
                                            ? 'warning'
                                            : 'primary'
                                    }
                                >
                                    {t('EntitlementCard.ppgrades')}
                                </Button>
                            )}
                        </ListItemText>
                    </ListItem>
                </List>
                {flag && (
                    // permissions.includes('space:member:switch') &&
                    <div className="flex items-center gap-2 text-black my-[10px]">
                        <Image
                            onClick={() => navigate('spaceEquity')}
                            preview={false}
                            className="rounded-full overflow-hidden cursor-pointer"
                            width={36}
                            height={36}
                            src={require('../assets/images/users/avatar-1.png')}
                        />
                        <div className="w-[140px] line-clamp-1 cursor-pointer" onClick={() => navigate('spaceEquity')}>
                            {spaceList?.find((item) => item.deptId === allDetail?.allDetail?.deptId)?.deptName} 的空间
                        </div>
                        <Popover
                            title="我的空间"
                            placement="right"
                            arrow={false}
                            zIndex={9999}
                            content={
                                <div className="w-[250px]">
                                    <Menu
                                        onClick={(e) => {
                                            console.log(e);
                                        }}
                                        mode="inline"
                                        selectedKeys={[allDetail?.allDetail?.deptId?.toString()]}
                                        items={spaceList?.map((item: any) => {
                                            return {
                                                label: item.deptName + ' 的空间',
                                                key: item.deptId
                                            };
                                        })}
                                    />
                                </div>
                            }
                            trigger="click"
                            open={open}
                            onOpenChange={(newOpen: boolean) => setOpen(newOpen)}
                        >
                            <SwapOutlined className="cursor-pointer" rev={undefined} />
                        </Popover>
                    </div>
                )}
                <LinearProgressWithLabel info={allDetail} />
                {flag && (
                    <Box mt={1} color={theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black}>
                        <Divider sx={{ mb: 1 }} />
                        <Box position="relative">
                            <img style={{ width: '100%' }} src={Share} alt="" />
                            <Typography
                                sx={{
                                    position: 'absolute',
                                    top: '5px',
                                    left: 0,
                                    right: 0,
                                    margin: 'auto',
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    color: '#111936'
                                }}
                            >
                                {t('market.inGive')}
                            </Typography>
                        </Box>
                        <Box mt={1} whiteSpace="normal">
                            {t('market.insucess')}
                        </Box>
                        <List sx={{ pb: 0 }}>
                            <ListItem sx={{ padding: 0, fontSize: '12px' }}>
                                <ListItemIcon>
                                    <LinkIcon />
                                </ListItemIcon>
                                <ListItemText primary={t('market.copyFiend')} />
                            </ListItem>
                        </List>
                        <Tooltip arrow placement="top" title={<Box sx={{ p: 0.5, fontSize: '14px' }}>{t('market.copy')}</Box>}>
                            <Typography
                                onClick={copyCode}
                                sx={{
                                    whiteSpace: 'normal',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    '&:hover': { color: '#673ab7' }
                                }}
                            >
                                {window.location.protocol + '//' + window.location.host + '/login?q=' + use?.inviteCode}
                            </Typography>
                        </Tooltip>
                        <Box marginTop={3} textAlign="center">
                            <QRCode
                                size={100}
                                value={window.location.protocol + '//' + window.location.host + '/login?q=' + use?.inviteCode}
                            />
                            <Typography variant="h5">{t('market.invitation')}</Typography>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </CardStyle>
    );
};

export default Cards;
