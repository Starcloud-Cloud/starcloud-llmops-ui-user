// material-ui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Typography } from '@mui/material';

import { useEffect } from 'react';

// ==============================|| LANDING - CUSTOMIZE ||============================== //

const VideoSection = () => {
    const theme = useTheme();

    return (
        <Container
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={12} md={12}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <Typography
                                className="text-center cursor-pointer"
                                variant="h3"
                                sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' }, mb: 2 }}
                            >
                                <span
                                    onClick={() => {
                                        window.scrollTo(0, window.innerHeight - 250);
                                    }}
                                >
                                    1分钟了解魔法通告
                                </span>
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <div className="relative">
                                {/* <svg
                                    className="absolute inset-0"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="1565"
                                    width="128"
                                    height="128"
                                >
                                    <path
                                        d="M374.272 333.312v355.328c0 30.208 20.992 40.448 45.568 26.112l288.768-175.104c25.088-15.872 25.088-40.448 0-54.784L419.84 309.76c-7.68-5.12-14.336-6.656-20.992-6.656-14.336-2.56-24.576 9.216-24.576 30.208zM1024 512c0 282.624-229.376 512-512 512S0 794.624 0 512 229.376 0 512 0s512 229.376 512 512z"
                                        p-id="1566"
                                        fill="#8a8a8a"
                                    ></path>
                                </svg> */}
                                <video
                                    controls
                                    // autoPlay
                                    className="cursor-pointer"
                                    style={{
                                        borderRadius: '12px',
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'fill'
                                    }}
                                    src={
                                        'https://mofaai-others.oss-cn-hangzhou.aliyuncs.com/mofaai_web/%E9%AD%94%E6%B3%95ai%E5%AE%A3%E4%BC%A0%E7%89%87.mp4'
                                    }
                                />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default VideoSection;
