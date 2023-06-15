import Grid from '@mui/material/Grid';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

import './textnoWarp.css';
function MyselfTemplate() {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6} xl={4}>
                <Card sx={{ height: 150 }}>
                    <Box display="flex" alignItems="center" p={2}>
                        <ChevronRight sx={{ fontSize: '80px' }} />
                        <Box overflow="hidden">
                            <Typography variant="h3" noWrap width="100%" mb={0.5}>
                                我是标题我是标题我是标题我是标题我是标题我是标题
                            </Typography>
                            <div className="textnoWarp">
                                我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述
                            </div>
                            <Box fontSize={12}>
                                <Link href="#" fontSize={14} mr={0.5}>
                                    #Blog
                                </Link>
                                <Link href="#" fontSize={14}>
                                    #Blog
                                </Link>
                            </Box>
                            <Box fontSize={14} mt={0.5}>
                                <Chip label="Article" size="small" variant="outlined" />
                                <Chip label="Blog" size="small" variant="outlined" />
                            </Box>
                        </Box>
                    </Box>
                </Card>
            </Grid>
        </Grid>
    );
}

export default MyselfTemplate;
