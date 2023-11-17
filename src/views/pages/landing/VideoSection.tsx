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
                            <Typography className="text-center" variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' }, mb: 2 }}>
                                3分钟了解魔法AI
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
                                    autoPlay
                                    className="cursor-pointer"
                                    style={{
                                        borderRadius: '12px',
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'fill'
                                    }}
                                    src={
                                        'https://outin-8f077b286e5d11ee8a1600163e32a995.oss-cn-shanghai.aliyuncs.com/720ef0a0850071ee9bf55017f0e90102/90ec370018a39698ec84cec14d716954-ld.mp4?Expires=1700213024&OSSAccessKeyId=LTAIxSaOfEzCnBOj&Signature=Yx9bPhy2wcU9dQyfJ%2FHDyUAs40s%3D'
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
