import { Typography, Link, Chip, Box, Grid } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import { Item } from 'types/template';
import { useNavigate } from 'react-router-dom';
import './textnoWarp.css';
function MyselfTemplate({ appList }: { appList: Item[] }) {
    const navigate = useNavigate();
    return (
        <Grid container spacing={2}>
            {appList?.map((data) => (
                <Grid item xs={12} md={6} lg={4}>
                    <SubCard key={data.uid} sx={{ height: 150, cursor: 'pointer' }}>
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
                                    src={require('../../../../../assets/images/category/' + data.icon + '.svg')}
                                    alt="icon"
                                />
                            )}
                            <Box overflow="hidden" marginLeft="20px">
                                <Typography variant="h3" noWrap width="100%" mb={0.5}>
                                    {data?.name}
                                </Typography>
                                <div className="textnoWarp">{data?.description} </div>
                                <Box fontSize={12}>
                                    {data?.categories.map((el) => (
                                        <Link key={el} href="#" fontSize={14} mr={0.5}>
                                            {el}
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
