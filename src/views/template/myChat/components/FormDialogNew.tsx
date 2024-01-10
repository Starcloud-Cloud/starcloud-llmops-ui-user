// material-ui
import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Grid,
    IconButton,
    Modal,
    TextField,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import { getChatTemplate } from 'api/chat';
import { t } from 'hooks/web/useI18n';
import { useEffect, useState } from 'react';
import { dispatch } from 'store';
import { gridSpacing } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';
import Template from './template';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import myChat from 'store/myChat';
import { UpgradeModel } from './upgradeRobotModel';
import userInfoStore from 'store/entitlementAction';
import useUserStore from 'store/user';

// ===============================|| UI DIALOG - FORMS ||=============================== //

export default function FormDialogNew({
    open,
    setOpen,
    handleOk,
    setValue,
    value
}: {
    open: boolean;
    value: string | '';
    setOpen: (open: boolean) => void;
    handleOk: (uid: string) => void;
    setValue: (value: string) => void;
}) {
    const [checked, setChecked] = useState(false);
    const [recommendList, setRecommends] = useState([]);
    const [uid, setUid] = useState('');
    const theme = useTheme();
    const { totalList } = myChat();
    const [botOpen, setBotOpen] = useState(false);
    const { userInfo }: any = userInfoStore();
    const totalNum = userInfo?.levelConfig?.usableBasicBot || 0;

    const { user } = useUserStore();

    const handleClose = () => {
        setOpen(false);
        setChecked(false);
        setValue('');
    };

    useEffect(() => {
        getChatTemplate({ model: 'CHAT' }).then((res) => {
            setRecommends(res);
        });
    }, []);

    return (
        <>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
                <MainCard
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                    title={t('chat.createRobot')}
                    content={false}
                    className="2xl:w-[1322px] xl:w-[900px] xs:w-[350px] sm:w-[476px]"
                    secondary={
                        <IconButton
                            onClick={() => {
                                handleClose();
                                setUid('');
                            }}
                            size="large"
                            aria-label="close modal"
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    <CardContent className="h-[60vh] overflow-auto">
                        <Grid container spacing={gridSpacing} className="w-full flex justify-center pt-[24px] ml-0">
                            <div className={'w-full'}>
                                <TextField
                                    error={checked && !value}
                                    autoFocus
                                    size="small"
                                    id="name"
                                    inputProps={{ maxLength: 20 }}
                                    label={t('chat.name')}
                                    placeholder={t('chat.typeName')}
                                    fullWidth
                                    onChange={(e) => {
                                        setChecked(true);
                                        setValue(e.target.value);
                                    }}
                                />
                                <div className="flex justify-between">
                                    {checked && !value ? (
                                        <div className="text-[#f44336] mt-1">请填写名称</div>
                                    ) : (
                                        <div className="h-[20px]" />
                                    )}
                                    <div className="text-right text-stone-600 mr-1 mt-1">{value?.length || 0}/20</div>
                                </div>
                            </div>
                            <div className="pt-[16px] w-full text-base">选择模版</div>
                            <div className="w-full mt-[8px] flex flex-wrap max-h-[530px] overflow-y-auto">
                                <Box className="mr-[8px] mb-[8px]" onClick={() => setUid('temp_blank')}>
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
                                            borderColor:
                                                theme.palette.mode === 'dark' ? theme.palette.dark.light + 15 : 'rgba(230,230,231,1)',
                                            ':hover': {
                                                boxShadow:
                                                    theme.palette.mode === 'dark'
                                                        ? '0 2px 14px 0 rgb(33 150 243 / 10%)'
                                                        : '0 2px 5px 0 rgb(32 40 45 / 8%)'
                                            }
                                        }}
                                        className={
                                            `xs:w-[289px] sm:w-[203.33px]  hover:border-[#673ab7]` +
                                            (uid === 'temp_blank' ? 'border-solid border-[#673ab7]' : '')
                                        }
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
                                                创建空白机器人
                                            </Typography>
                                            <Typography sx={{ fontSize: '.8rem' }} className="line-clamp-4" variant="body2" component="div">
                                                这是一个空白机器人，适合熟悉配置的用户从头配置一个机器人。
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                                {recommendList.map((item: any, index) => (
                                    <Box className="mr-[8px] mb-[8px]" key={index} onClick={() => setUid(item?.uid)}>
                                        <Template data={item} uid={uid} />
                                    </Box>
                                ))}
                            </div>
                        </Grid>
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Grid container justifyContent="flex-end">
                            <Button
                                variant="contained"
                                type="button"
                                color={'secondary'}
                                onClick={() => {
                                    const count = totalList.filter((v) => Number(v.creator) === Number(user.id)).length;

                                    if (totalNum > -1) {
                                        if (count >= totalNum) {
                                            setBotOpen(true);
                                            return;
                                        }
                                    }
                                    setChecked(true);
                                    if (!value) {
                                        return;
                                    }
                                    handleOk(uid);
                                }}
                            >
                                创建
                            </Button>
                        </Grid>
                    </CardActions>
                </MainCard>
            </Modal>
            {botOpen && (
                <UpgradeModel
                    from="usableBasicBot_0"
                    open={botOpen}
                    handleClose={() => setBotOpen(false)}
                    title={`添加机器人个数(${totalNum})已用完`}
                />
            )}
        </>
    );
}
