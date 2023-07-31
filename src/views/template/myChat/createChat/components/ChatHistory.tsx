import React from 'react';

// material-ui
import { Card, CardContent, Grid, Theme, Typography } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import { UserProfile } from 'types/user-profile';
import { IHistory } from './Chat';
import { LoadingDot } from 'ui-component/LoadingDot';

// ==============================|| CHAT MESSAGE HISTORY ||============================== //

interface ChartHistoryProps {
    data: IHistory[];
    theme: Theme;
    user: UserProfile;
}

const ChatHistory = ({ data, theme, user }: ChartHistoryProps) => (
    <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
            {data.map((history, index) => (
                <React.Fragment key={index}>
                    {history.type === 1 ? (
                        <Grid item xs={12} className="mt-3">
                            <Grid container spacing={gridSpacing}>
                                <div className="w-full flex">
                                    <div className="w-full">
                                        <Grid item xs={12}>
                                            <Grid item xs={12}>
                                                <Typography
                                                    align="right"
                                                    variant="subtitle2"
                                                    color={theme.palette.mode === 'dark' ? 'dark.900' : ''}
                                                >
                                                    {history.time}
                                                </Typography>
                                            </Grid>
                                            <Card
                                                sx={{
                                                    display: 'inline-block',
                                                    float: 'right',
                                                    bgcolor: theme.palette.mode === 'dark' ? 'grey.600' : theme.palette.primary.light
                                                }}
                                            >
                                                <CardContent sx={{ p: 2, pb: '16px !important', width: 'fit-content', ml: 'auto' }}>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={12}>
                                                            <Typography
                                                                variant="body2"
                                                                color={theme.palette.mode === 'dark' ? 'dark.900' : ''}
                                                            >
                                                                {history.text}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </div>
                                    <img
                                        className="w-[50px] h-[50px] rounded-xl ml-2"
                                        src="https://afu-1255830993.cos.ap-shanghai.myqcloud.com/chato_image/avater_208/ceeb3af9785ac20c3adad8c4cdd00d3e.png"
                                        alt=""
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid item xs={12}>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12} sm={7} className="flex">
                                    <img
                                        className="w-[50px] h-[50px] rounded-xl mr-2"
                                        src="https://afu-1255830993.cos.ap-shanghai.myqcloud.com/chato_image/avater_208/ceeb3af9785ac20c3adad8c4cdd00d3e.png"
                                        alt=""
                                    />
                                    <div>
                                        <Grid item xs={12}>
                                            <Typography align="left" variant="subtitle2">
                                                {history.time}
                                            </Typography>
                                        </Grid>
                                        <Card
                                            sx={{
                                                display: 'inline-block',
                                                background:
                                                    theme.palette.mode === 'dark' ? theme.palette.dark[900] : theme.palette.secondary.light
                                            }}
                                        >
                                            <CardContent sx={{ p: 2, pb: '16px !important' }}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12}>
                                                        {/*<Typography variant="body2">{history.text}</Typography>*/}
                                                        <LoadingDot />
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </React.Fragment>
            ))}
        </Grid>
    </Grid>
);

export default ChatHistory;