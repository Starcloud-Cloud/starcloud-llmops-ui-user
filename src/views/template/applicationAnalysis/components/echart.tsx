import { Grid, Typography } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import Chart, { Props } from 'react-apexcharts';
import { Charts } from 'types/chat';
import { memo } from 'react';

const Echarts = ({ generate, list }: { generate: Charts[]; list: (item: Charts, key?: boolean) => Props }) => {
    return (
        <Grid container spacing={2}>
            {generate?.map((item) => (
                <Grid item md={6} xs={12} key={item.title}>
                    <SubCard sx={{ pb: 0 }}>
                        <Typography variant="h4" gutterBottom>
                            {item.title}
                        </Typography>
                        {item.key ? <Chart {...list(item, true)} /> : <Chart {...list(item)} />}
                    </SubCard>
                </Grid>
            ))}
        </Grid>
    );
};
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return JSON.stringify(prevProps?.generate) === JSON.stringify(nextProps?.generate);
};
export default memo(Echarts, arePropsEqual);
