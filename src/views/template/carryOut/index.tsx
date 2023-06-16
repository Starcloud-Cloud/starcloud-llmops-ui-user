import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Box, Grid, Typography } from '@mui/material';

import './index.css';
import Perform from './perform';

function CarryOut({ config, example }: { config: any; example: string }) {
    return (
        <Box>
            <Grid container spacing={4}>
                <Grid item lg={7} md={7} sm={7}>
                    <Typography variant="h5" my={2}>
                        {config.description}
                    </Typography>
                    <Perform config={config} />
                </Grid>
                <Grid item lg={5} md={5} sm={5}>
                    <ReactMarkdown children={example} remarkPlugins={[remarkGfm]} />
                </Grid>
            </Grid>
        </Box>
    );
}
export default CarryOut;
