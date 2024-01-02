import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import TwoWheelerTwoToneIcon from '@mui/icons-material/TwoWheelerTwoTone';
import AirportShuttleTwoToneIcon from '@mui/icons-material/AirportShuttleTwoTone';
import DirectionsBoatTwoToneIcon from '@mui/icons-material/DirectionsBoatTwoTone';
import { FaArrowRight, FaMinus } from 'react-icons/fa';

const plans = [
    {
        active: false,
        icon: <TwoWheelerTwoToneIcon fontSize="large" color="inherit" />,
        title: 'STARTER',
        pay: 'JOIN',
        price: 59,
        permission: [0, 1]
    },
    {
        active: true,
        icon: <AirportShuttleTwoToneIcon fontSize="large" />,
        title: 'PREMIUM',
        pay: 'TRY PREMIUM',
        price: 89,
        permission: [0, 1, 2, 3]
    },
    {
        active: false,
        icon: <DirectionsBoatTwoToneIcon fontSize="large" />,
        title: 'ENTERPRISE',
        pay: 'JOIN',
        price: 99,
        permission: [0, 1, 2, 3, 5]
    }
];

const planList = [
    'One End Product', // 0
    'No attribution required', // 1
    'TypeScript', // 2
    'Figma Design Resources', // 3
    'Create Multiple Products', // 4
    'Create a SaaS Project', // 5
    'Resale Product', // 6
    'Separate sale of our UI Elements?' // 7
];

// ===============================|| PRICING - PRICE 1 ||=============================== //

const Price1 = () => {
    const theme = useTheme();
    return (
        <Grid container spacing={gridSpacing}>
            {plans.map((plan, index) => {
                // const darkBorder = theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary[200] + 75;
                return (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={index}
                        sx={{
                            '.MuiCardContent-root': {
                                pt: 0
                            }
                        }}
                    >
                        <MainCard
                            boxShadow
                            sx={{
                                pt: 1.75,
                                overflow: 'visible',
                                backgroundColor: index % 2 === 0 ? '#fff' : '#000',
                                color: index % 2 === 0 ? '#000' : '#fff'
                            }}
                        >
                            <Grid
                                container
                                textAlign="center"
                                spacing={gridSpacing}
                                sx={{
                                    width: '100%',

                                    margin: 0,
                                    '.MuiCardContent-root': { pt: 0 },
                                    '> .MuiGrid-item:last-child': {
                                        p: '1rem 0'
                                    }
                                }}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    sx={{
                                        position: 'relative',
                                        '.MuiGrid-item': {
                                            width: '100%'
                                        },
                                        '.MuiCardContent-root': { pt: 0 }
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontSize: '1.5625rem',
                                            fontWeight: 500,
                                            p: '1rem 5rem',
                                            position: 'absolute',
                                            color: index % 2 === 0 ? '#000' : '#fff',
                                            background: index % 2 === 0 ? '#f0f2f5' : '#1A73E8',
                                            borderRadius: '10rem',
                                            top: '-50%', // 将 Typography 组件向上移动一半的高度
                                            left: '50%', // 将 Typography 组件向右移动一半的宽度
                                            transformOrigin: 'center', // 以中心为原点缩放
                                            transform: 'translate(-50%, -50%) scale(0.4)' // 将 Typography 组件的中心放置在父元素的中心，并缩小到0.3倍大小
                                        }}
                                    >
                                        {plan.title}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography
                                        component="div"
                                        variant="body2"
                                        sx={{
                                            color: index % 2 === 0 ? '#000' : '#fff',
                                            fontSize: '2.1875rem',
                                            fontWeight: 700,
                                            '& > span': {
                                                fontSize: '1.25rem',
                                                fontWeight: 500,
                                                color: index % 2 === 0 ? '#000' : '#fff'
                                            }
                                        }}
                                    >
                                        <sup style={{ fontSize: '1rem', color: index % 2 === 0 ? '#000' : '#fff' }}>$</sup>
                                        {plan.price}
                                        <span>/mo</span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <List
                                        sx={{
                                            m: 0,
                                            p: 0,
                                            '&> li': {
                                                px: 0,
                                                py: 0.625,
                                                '& svg': {
                                                    fill: theme.palette.success.dark
                                                }
                                            }
                                        }}
                                        component="ul"
                                    >
                                        {planList.map((list, i) => (
                                            <React.Fragment key={i}>
                                                <ListItem>
                                                    <ListItemIcon>
                                                        {plan.permission.includes(i) ? (
                                                            <CheckTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                        ) : (
                                                            <FaMinus />
                                                        )}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={list}
                                                        sx={{
                                                            '> span': { color: index % 2 === 0 ? '#000 !important' : '#fff !important' }
                                                        }}
                                                    />
                                                </ListItem>
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sx={{
                                        position: 'relative',
                                        pb: '2rem',
                                        '.MuiGrid-item': {
                                            p: '2rem 0'
                                        }
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? '#000' : '#1A73E8',
                                            width: '100%',
                                            p: '0.5rem 2rem',
                                            boxShadow: 'none',
                                            ':hover': {
                                                backgroundColor: index % 2 === 0 ? '#000' : '#1A73E8',
                                                boxShadow: index % 2 === 0 ? '#000' : '#1A73E8'
                                            }
                                        }}
                                    >
                                        {plan.pay} <FaArrowRight style={{ paddingLeft: '0.5rem' }} size="1.2rem" />
                                    </Button>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default Price1;
