import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Box, Grid, Tooltip, Typography } from '@mui/material';
import { createChat, deleteApp } from 'api/chat';
import { t } from 'hooks/web/useI18n';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import marketStore from 'store/market';
import { Item } from 'types/template';
import { Confirm } from 'ui-component/Confirm';
import SubCard from 'ui-component/cards/SubCard';
import FormDialogNew from './FormDialogNew';
import './textnoWarp.scss';
function MyselfTemplate({ appList, setUpdate }: { appList: Item[]; setUpdate: (pre: any) => any }) {
    const navigate = useNavigate();
    const { categoryList } = marketStore();
    const [openNew, setOpenNew] = useState(false);
    const [robotName, setRobotName] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentUid, setCurrentUid] = useState('');

    const handleDelete = async () => {
        const res = await deleteApp(currentUid);
        setUpdate((pre: any) => pre + 1);
        setDialogOpen(false);
        setCurrentUid('');
    };

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
                        <Box overflow="hidden" marginLeft="20px" className="flex h-[100px] flex-col">
                            <Typography variant="h3" noWrap mb={0.5} className="text-[#0009]">
                                {t('chat.createRobot')}
                            </Typography>
                            <Typography
                                sx={{ fontSize: '.8rem', lineHeight: '1.2rem' }}
                                className="cursor desc"
                                variant="body2"
                                component="div"
                                lineHeight={1.2}
                            >
                                快速创建一个属于自己的机器人🤖️！
                            </Typography>
                        </Box>
                    </Box>
                </SubCard>
            </Grid>
            {appList?.map((data: any) => (
                <>
                    <Grid key={data.uid} item xs={12} md={6} className="relative">
                        <SubCard sx={{ height: 150, cursor: 'pointer' }}>
                            <Box
                                onClick={() => {
                                    navigate('/createChat?appId=' + data?.uid);
                                }}
                                display="flex"
                                alignItems="center"
                            >
                                <img
                                    className="object-cover rounded-full w-[100px] h-[100px] outline outline-1  outline-offset-2 outline-[#6839b7]"
                                    src={data?.images?.[0]}
                                    alt="icon"
                                />
                                <Box overflow="hidden" marginLeft="20px" className="flex h-[100px] flex-col">
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
                                    <div className="flex justify-end absolute bottom-3 left-[155px]">
                                        <div className="flex items-center text-[#666] text-xs hover:text-[#6839b7]">
                                            <ModeEditIcon className=" text-xs" />
                                            <span>编辑</span>
                                        </div>
                                        <div
                                            className="flex items-center text-[#666] ml-3 text-xs hover:text-[#6839b7]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDialogOpen(true);
                                                setCurrentUid(data.uid);
                                            }}
                                        >
                                            <DeleteIcon className="text-xs" />
                                            <span>删除</span>
                                        </div>
                                    </div>
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
            {/* <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">提醒</DialogTitle>
                <DialogContent>
                    <div className="text-lg w-[240px]">确认删除该机器人？</div>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={() => handleDelete()} color="primary">
                        确认
                    </Button>
                </DialogActions>
            </Dialog> */}
            <Confirm
                handleOk={() => handleDelete()}
                open={dialogOpen}
                handleClose={() => {
                    setDialogOpen(false);
                    setCurrentUid('');
                }}
                title="提醒"
                content="确认删除该机器人？"
            />
        </Grid>
    );
}

export default MyselfTemplate;
