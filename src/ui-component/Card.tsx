// material-ui
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Tooltip,
    Typography,
    linearProgressClasses
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { userBenefits } from 'api/template';
import { themesDarkAfter, themesDarkBefor, themesLight } from 'hooks/useThemes';
import { t } from 'hooks/web/useI18n';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userInfoStore from 'store/entitlementAction';
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
}
function LinearProgressWithLabel({ info }: LinearProgressWithLabelProps) {
    const theme = useTheme();
    return (
        <Box>
            {info?.benefits?.map((item: BenefitItem) => (
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
                                                : themesLight(info?.userLevel, theme, 3)
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
                        <Tooltip title={item?.usedNum + '/' + item?.totalNum} placement="top">
                            <BorderLinearProgress level={info?.userLevel} variant="determinate" value={item?.percentage} theme={theme} />
                        </Tooltip>
                    </Grid>
                </Grid>
            ))}
        </Box>
    );
}

const Cards = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { userInfo, setUserInfo }: any = userInfoStore();
    useEffect(() => {
        if (!userInfo) {
            userBenefits().then((res) => {
                setUserInfo(res);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <CardStyle level={userInfo?.userLevel} theme={theme}>
            <CardContent sx={{ p: 2 }}>
                <List sx={{ p: 0, m: 0 }}>
                    <ListItem alignItems="center" disableGutters sx={{ p: 0 }}>
                        <ListItemText sx={{ mt: 0 }}>
                            <Box display="inline-block" padding="4px 10px" border="1px solid #bdbdbd" borderRadius="5px">
                                {userInfo?.userLevel ? t('user.' + userInfo?.userLevel) : t('user.free')}
                            </Box>
                        </ListItemText>
                        <ListItemText sx={{ mt: 0 }}>
                            {userInfo?.userLevel !== 'pro' && (
                                <Button
                                    onClick={() => {
                                        navigate('/subscribe');
                                    }}
                                    size="small"
                                    variant="contained"
                                    sx={{ boxShadow: 'none' }}
                                    color={
                                        userInfo?.userLevel === 'free'
                                            ? 'primary'
                                            : userInfo?.userLevel === 'plus'
                                            ? 'secondary'
                                            : userInfo?.userLevel === 'pro'
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
                <LinearProgressWithLabel info={userInfo} />
            </CardContent>
        </CardStyle>
    );
};

export default Cards;
