import { Box, Grid, Typography, Divider } from '@mui/material';
import { t } from 'hooks/web/useI18n';
import './index.css';
import Perform from './perform';
import formatDate from 'hooks/useDate';

function CarryOut({ config, changeData, loadings, allExecute, variableChange, promptChange }: any) {
    return (
        <Box>
            <Grid container spacing={4}>
                <Grid item lg={12} md={12} sm={12}>
                    <Typography variant="h5" sx={{ fontSize: '1.1rem' }} mb={1}>
                        {config?.description}
                    </Typography>
                    <Perform
                        config={config?.workflowConfig}
                        changeSon={changeData}
                        loadings={loadings}
                        isallExecute={allExecute}
                        variableChange={variableChange}
                        promptChange={promptChange}
                        source="market"
                    />
                    <Box sx={{ px: 2 }}>
                        <Divider sx={{ mb: 2 }} />
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                width: 'fit-content',
                                bgcolor: 'background.paper',
                                color: 'text.secondary',
                                '& svg': {
                                    m: 1.5
                                },
                                '& hr': {
                                    mx: 0.5
                                }
                            }}
                        >
                            {t('market.version')}:{config?.version}
                            {/* <Divider orientation="vertical" flexItem /> */}
                            {/* {t('market.plugLevel')}:2 */}
                            {/* <Divider orientation="vertical" flexItem /> */}
                            {/* {t('market.plugVersion')}:3 */}
                            <Divider orientation="vertical" flexItem />
                            {t('generate.createTime')}:{formatDate(config?.createTime)}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
export default CarryOut;
