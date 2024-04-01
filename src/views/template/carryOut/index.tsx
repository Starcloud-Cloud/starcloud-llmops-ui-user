import { Box, Grid, Typography, Divider } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { t } from 'hooks/web/useI18n';
import './index.css';
import Perform from './perform';
import formatDate from 'hooks/useDate';

function CarryOut({
    columns,
    setEditOpen,
    setStep,
    setMaterialType,
    setTitle,
    config,
    changeData,
    loadings,
    isDisables,
    allExecute,
    variableChange,
    promptChange,
    changeanswer,
    isShows,
    changeConfigs
}: any) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    return (
        <Box>
            <Grid container spacing={4}>
                <Grid item lg={12} md={12} sm={12}>
                    <Typography variant="h5" sx={{ fontSize: '1.1rem' }} mb={1}>
                        {config?.description}
                    </Typography>
                    {config && columns?.length > 0 && (
                        <Perform
                            columns={columns}
                            setEditOpen={setEditOpen}
                            setStep={setStep}
                            setMaterialType={setMaterialType}
                            setTitle={setTitle}
                            config={config?.workflowConfig}
                            detaData={config}
                            changeConfigs={changeConfigs}
                            isShows={isShows}
                            changeSon={changeData}
                            loadings={loadings}
                            isDisables={isDisables}
                            changeanswer={changeanswer}
                            isallExecute={allExecute}
                            variableChange={variableChange}
                            promptChange={promptChange}
                            source="market"
                        />
                    )}
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
                            {searchParams.get('type') === 'collect'
                                ? `收藏时间:${formatDate(config?.favoriteTime)}`
                                : `更新时间:${formatDate(config?.updateTime)}`}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
export default CarryOut;
