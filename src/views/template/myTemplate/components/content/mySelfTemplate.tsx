import { Typography, Link, Chip, Box, Grid, Tooltip } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import { Item } from 'types/template';
import { useNavigate } from 'react-router-dom';
import marketStore from 'store/market';
import './textnoWarp.scss';
import formatDate from 'hooks/useDate';
function MyselfTemplate({ appList }: { appList: Item[] }) {
    const navigate = useNavigate();
    const { categoryList } = marketStore();
    return (
        <Grid container spacing={2}>
            {appList?.map((data) => (
                <Grid key={data.uid} item xs={12} md={12} lg={6}>
                    <SubCard sx={{ cursor: 'pointer' }} contentSX={{ p: '16px !important' }}>
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
                            <Box width="100%" overflow="hidden" marginLeft="20px" position="relative">
                                <Tooltip title={data.name}>
                                    <Typography variant="h3" noWrap mb={1}>
                                        {data?.name}
                                    </Typography>
                                </Tooltip>
                                <Tooltip title={data.description}>
                                    <Typography className="desc" variant="body2" height="35px" lineHeight="1.2rem">
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
                                        <Chip sx={{ mr: 0.5 }} key={el} label={el} size="small" variant="outlined" />
                                    ))}
                                </Box>
                                <Tooltip placement="top" title="修改时间">
                                    <Typography fontWeight={500} position="absolute" top={0} right={0} fontSize="12px">
                                        {formatDate(data?.updateTime)}
                                    </Typography>
                                </Tooltip>
                                <Tooltip placement="top" title="创建者">
                                    <Typography fontWeight={500} position="absolute" bottom={0} right={0} fontSize="12px">
                                        {data.creator}
                                    </Typography>
                                </Tooltip>
                            </Box>
                        </Box>
                    </SubCard>
                </Grid>
            ))}
        </Grid>
    );
}

export default MyselfTemplate;
