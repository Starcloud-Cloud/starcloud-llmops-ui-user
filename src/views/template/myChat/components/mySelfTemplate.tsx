import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, Grid, Tooltip, Typography } from '@mui/material';
import { createChat } from 'api/chat';
import { t } from 'hooks/web/useI18n';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import marketStore from 'store/market';
import { Item } from 'types/template';
import SubCard from 'ui-component/cards/SubCard';
import FormDialogNew from './FormDialogNew';
import './textnoWarp.scss';
function MyselfTemplate({ appList }: { appList: Item[] }) {
    const navigate = useNavigate();
    const { categoryList } = marketStore();
    const [openNew, setOpenNew] = useState(false);
    const [robotName, setRobotName] = useState('');

    const handleCreateNew = async (uid: string) => {
        const res = await createChat({ robotName: robotName, uid });
        setOpenNew(false);
        navigate(`/createChat?appId=${res}`);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <SubCard sx={{ height: 150, cursor: 'pointer' }}>
                    <Box onClick={() => setOpenNew(true)} display="flex" alignItems="center">
                        <AddCircleIcon className="text-[80px]" />
                        <Box overflow="hidden" marginLeft="20px" className="flex h-[100px] flex-col justify-around">
                            <Typography variant="h3" noWrap mb={0.5} className="text-[#0009]">
                                {t('chat.createRobot')}
                            </Typography>
                        </Box>
                    </Box>
                </SubCard>
            </Grid>
            {appList?.map((data) => (
                <>
                    <Grid key={data.uid} item xs={12} md={6}>
                        <SubCard sx={{ height: 150, cursor: 'pointer' }}>
                            <Box
                                onClick={() => {
                                    navigate('/createChat?appId=' + data?.uid);
                                }}
                                display="flex"
                                alignItems="center"
                            >
                                {data?.icon && (
                                    <img
                                        className="object-cover rounded-full w-[100px] h-[100px] outline outline-1  outline-offset-2 outline-[#6839b7]"
                                        src={require('../../../../assets/images/category/' + data.icon + '.svg')}
                                        alt="icon"
                                    />
                                )}
                                <Box overflow="hidden" marginLeft="20px" className="flex h-[100px] flex-col justify-around">
                                    <Tooltip title={data.name}>
                                        <Typography variant="h3" noWrap mb={0.5} className="text-[#0009]">
                                            {data?.name}
                                        </Typography>
                                    </Tooltip>
                                    <Typography
                                        sx={{ fontSize: '.8rem', lineHeight: '1.2rem' }}
                                        className="cursor desc"
                                        variant="body2"
                                        component="div"
                                        lineHeight={1.2}
                                    >
                                        {data.description}
                                    </Typography>
                                    {/* <Tooltip title={data.description}>
                                    <Typography noWrap variant="body2">
                                        {data?.description}
                                    </Typography>
                                </Tooltip> */}
                                    {/* <Box fontSize={12}>
                                    {data?.categories.map((el) => (
                                        <Link color="secondary" key={el} href="#" fontSize={12} mr={0.5}>
                                            #{categoryList?.find((i: { code: string }) => i.code === el)?.name}
                                        </Link>
                                    ))}
                                </Box> */}
                                    {/* <Box fontSize={14} mt={0.5}>
                                    {data?.tags.map((el) => (
                                        <Chip key={el} label={el} size="small" variant="outlined" />
                                    ))}
                                </Box> */}
                                </Box>
                            </Box>
                        </SubCard>
                    </Grid>
                </>
            ))}
            <FormDialogNew
                open={openNew}
                setOpen={() => setOpenNew(false)}
                handleOk={handleCreateNew}
                setValue={setRobotName}
                value={robotName}
            />
        </Grid>
    );
}

export default MyselfTemplate;
