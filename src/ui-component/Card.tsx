// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
    Card,
    CardContent,
    Grid,
    LinearProgress,
    List,
    ListItem,
    Button,
    ListItemText,
    Typography,
    linearProgressClasses,
    Box
} from '@mui/material';
import { t } from 'hooks/web/useI18n';
import { userBenefits } from 'api/template';
import { useEffect } from 'react';
import userInfoStore from 'store/entitlementAction';
import { themesLight, themesTwo, themesEight } from 'hooks/useThemes';
// styles

const CardStyle = styled(Card)(({ theme, level }: { theme: any; level: any }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : themesLight(level, theme),
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.mode === 'dark' ? themesEight(level, theme) : themesEight(level, theme),
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
        background: theme.palette.mode === 'dark' ? themesTwo(level, theme) : themesTwo(level, theme),
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
        backgroundColor: theme.palette.mode === 'dark' ? themesEight(level, theme) : themesEight(level, theme)
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
                                        color: theme.palette.mode === 'dark' ? theme.palette.dark.light : themesEight(info.userLevel, theme)
                                    }}
                                >
                                    {item.name}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6">{item?.usedNum + '/' + item?.totalNum}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <BorderLinearProgress level={info?.userLevel} variant="determinate" value={item?.percentage} theme={theme} />
                    </Grid>
                </Grid>
            ))}
        </Box>
    );
}

const Cards = () => {
    const theme = useTheme();
    const { userInfo, setUserInfo }: any = userInfoStore();
    useEffect(() => {
        userBenefits().then((res) => {
            setUserInfo(res);
        });
    }, [setUserInfo]);
    return (
        <CardStyle level={userInfo?.userLevel} theme={theme}>
            <CardContent sx={{ p: 2 }}>
                <List sx={{ p: 0, m: 0 }}>
                    <ListItem alignItems="center" disableGutters sx={{ p: 0 }}>
                        <ListItemText sx={{ mt: 0 }}>
                            <Box display="inline-block" padding="4px 10px" border="1px solid #bdbdbd" borderRadius="5px">
                                {userInfo?.userLevel || 'Free'}
                            </Box>
                        </ListItemText>
                        <ListItemText sx={{ mt: 0 }}>
                            {userInfo?.userLevel !== 'pro' && (
                                <Button
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
