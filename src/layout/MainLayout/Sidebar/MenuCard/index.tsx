import { memo } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
    Chip,
    Card,
    CardContent,
    Grid,
    LinearProgress,
    List,
    ListItem,
    Button,
    ListItemText,
    Typography,
    linearProgressClasses
} from '@mui/material';
import { themesLight, themesTwo, themesEight } from 'hooks/useThemes';

// assets

// styles
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 30,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.light : '#fff'
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'dark' ? themesEight(leve, theme) : themesEight(leve, theme)
    }
}));
const leve: string = 'Pro';
const CardStyle = styled(Card)(({ theme }: any) => ({
    background: theme.palette.mode === 'dark' ? theme.palette.dark.main : themesLight(leve, theme),
    marginBottom: '22px',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: '157px',
        height: '157px',
        background: themesTwo(leve, theme),
        borderRadius: '50%',
        top: '-105px',
        right: '-96px'
    }
}));

interface LinearProgressWithLabelProps {
    value: number;
}
// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

function LinearProgressWithLabel({ value, ...others }: LinearProgressWithLabelProps) {
    const theme = useTheme();

    return (
        <Grid container direction="column" spacing={1} sx={{ mt: 1.5 }}>
            <Grid item>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Typography
                            variant="h6"
                            sx={{
                                color: theme.palette.mode === 'dark' ? theme.palette.dark.light : themesEight(leve, theme)
                            }}
                        >
                            Token
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" color="inherit">{`${Math.round(value)}%`}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <BorderLinearProgress aria-label="progress of theme" variant="determinate" value={value} {...others} />
            </Grid>
            <Grid item>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Typography
                            variant="h6"
                            sx={{
                                color: theme.palette.mode === 'dark' ? theme.palette.dark.light : themesEight(leve, theme)
                            }}
                        >
                            Progress
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" color="inherit">{`${Math.round(value)}%`}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <BorderLinearProgress aria-label="progress of theme" variant="determinate" value={value} {...others} />
            </Grid>
        </Grid>
    );
}

// ==============================|| SIDEBAR - MENU CARD ||============================== //

const MenuCard = () => {
    return (
        <CardStyle>
            <CardContent sx={{ p: 2 }}>
                <List sx={{ p: 0, m: 0 }}>
                    <ListItem alignItems="center" disableGutters sx={{ p: 0 }}>
                        <ListItemText sx={{ mt: 0 }}>
                            <Chip size="small" variant="outlined" label="Pro"></Chip>
                            {/* <Typography variant="subtitle2">升级享受更多权益</Typography> */}
                        </ListItemText>
                        <ListItemText sx={{ mt: 0 }}>
                            <Button
                                size="small"
                                variant="contained"
                                sx={{ boxShadow: 'none' }}
                                color={leve === 'Free' ? 'primary' : leve === 'Plus' ? 'secondary' : 'warning'}
                            >
                                Go Premium
                            </Button>
                        </ListItemText>
                    </ListItem>
                </List>
                <LinearProgressWithLabel value={80} />
            </CardContent>
        </CardStyle>
    );
};

export default memo(MenuCard);
