import { Box, Chip, Grid, Link, Tooltip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import marketStore from 'store/market';
import { Item } from 'types/template';
import SubCard from 'ui-component/cards/SubCard';
import './textnoWarp.scss';
function MyselfTemplate({ appList }: { appList: Item[] }) {
    const navigate = useNavigate();
    const { categoryList } = marketStore();
    return (
        <Grid container spacing={2}>
            {appList?.map((data) => (
                <Grid key={data.uid} item xs={12} md={6} lg={4}>
                    <SubCard sx={{ height: 150, cursor: 'pointer' }}>
                        <Box
                            onClick={() => {
                                navigate('/createApp?uid=' + data?.uid);
                            }}
                            display="flex"
                            alignItems="center"
                        >
                            {data?.icon && (
                                <img
                                    style={{ width: '60px' }}
                                    src={require('../../../../assets/images/category/' + data.icon + '.svg')}
                                    alt="icon"
                                />
                            )}
                            <Box overflow="hidden" marginLeft="20px">
                                <Tooltip title={data.name}>
                                    <Typography variant="h3" noWrap mb={0.5}>
                                        {data?.name}
                                    </Typography>
                                </Tooltip>
                                <Tooltip title={data.description}>
                                    <Typography noWrap variant="body2">
                                        {data?.description}
                                    </Typography>
                                </Tooltip>
                                <Box fontSize={12}>
                                    {data?.categories.map((el) => (
                                        <Link color="secondary" key={el} href="#" fontSize={12} mr={0.5}>
                                            #{categoryList?.find((i: { code: string }) => i.code === el)?.name}
                                        </Link>
                                    ))}
                                </Box>
                                <Box fontSize={14} mt={0.5}>
                                    {data?.tags.map((el) => (
                                        <Chip key={el} label={el} size="small" variant="outlined" />
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </SubCard>
                </Grid>
            ))}
        </Grid>
    );
}

export default MyselfTemplate;
