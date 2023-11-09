import { Modal, IconButton, CardContent, Box, Card, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MainCard from 'ui-component/cards/MainCard';
import Template from 'views/template/myChat/components/template';
import { useNavigate } from 'react-router-dom';
const AddModal = ({ open, templateList, setOpen }: { open: boolean; templateList: any[]; setOpen: (data: boolean) => void }) => {
    const navigate = useNavigate();
    return (
        <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
            <MainCard
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title={'创建'}
                content={false}
                className="sm:w-[700px] xs:w-[300px]"
                secondary={
                    <IconButton onClick={() => setOpen(false)} size="large" aria-label="close modal">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <div className="pt-[16px] w-full text-base">选择模版</div>
                    <div className="w-full mt-[8px] flex flex-wrap max-h-[530px] overflow-y-auto">
                        <Box className="mr-[8px] mb-[8px]" onClick={() => navigate('/batchSmallRedBook')}>
                            <Card
                                sx={{
                                    aspectRatio: '186 / 235',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    border: '1px solid',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    itemAlign: 'center',
                                    cursor: 'pointer',
                                    borderColor: 'rgba(230,230,231,1)',
                                    ':hover': {
                                        boxShadow: '0 2px 5px 0 rgb(32 40 45 / 8%)'
                                    }
                                }}
                                className={`xs:w-[289px] sm:w-[203.33px]  hover:border-[#673ab7]`}
                            >
                                <Box sx={{ textAlign: 'center', marginTop: '15px' }}>
                                    <SmartToyIcon className="object-cover rounded-full w-[100px] h-[100px] outline outline-1  outline-offset-2 outline-[#6839b7]" />
                                </Box>
                                <CardContent
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        position: 'relative'
                                    }}
                                >
                                    <Typography
                                        className="textnoWarp active cursor"
                                        gutterBottom
                                        variant="h3"
                                        sx={{ fontSize: '1.1rem', color: '#0009', textAlign: 'center' }}
                                        component="div"
                                        my={1}
                                    >
                                        创建空白模板
                                    </Typography>
                                    <Typography sx={{ fontSize: '.8rem' }} className="line-clamp-4" variant="body2" component="div">
                                        这是一个空白模板，适合熟悉配置的用户从头配置一个模板。
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                        {templateList.map((item: any, index: number) => (
                            <Box
                                className="mr-[8px] mb-[8px]"
                                key={index}
                                onClick={() => {
                                    navigate('/batchSmallRedBook?template=' + index);
                                }}
                            >
                                <Template data={item} />
                            </Box>
                        ))}
                    </div>
                </CardContent>
            </MainCard>
        </Modal>
    );
};
export default AddModal;
