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
import SmartToyIcon from '@mui/icons-material/SmartToy';
import myChat from 'store/myChat';
import userInfoStore from 'store/entitlementAction';
import useUserStore from 'store/user';
import Template from 'views/template/myChat/components/template';
import { UpgradeModel } from 'views/template/myChat/components/upgradeRobotModel';

// ===============================|| UI DIALOG - FORMS ||=============================== //

export default function TemplateModal({
    open,
    setOpen,
    handleOk
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    handleOk: (uid: string) => void;
}) {
    const [checked, setChecked] = useState(false);
    const [recommendList, setRecommends] = useState([]);
    const [uid, setUid] = useState('');
    const theme = useTheme();
    const { totalList } = myChat();
    const [botOpen, setBotOpen] = useState(false);
    const { userInfo }: any = userInfoStore();
    const { totalNum } = userInfo.benefits.find((v: any) => v.type === 'BOT');
    const { user } = useUserStore();

    const handleClose = () => {
        setOpen(false);
        setChecked(false);
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
                    title={'选择模版'}
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
                            <div className="w-full mt-[8px] flex flex-wrap max-h-[530px] overflow-y-auto">
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
                                    console.log(count, 'count');

                                    if (totalNum > -1) {
                                        if (count >= totalNum) {
                                            setBotOpen(true);
                                            return;
                                        }
                                    }
                                    setChecked(true);
                                    handleOk(uid);
                                }}
                            >
                                确认
                            </Button>
                        </Grid>
                    </CardActions>
                </MainCard>
            </Modal>
            <UpgradeModel open={botOpen} handleClose={() => setBotOpen(false)} title={`添加机器人个数(${totalNum})已用完`} />
        </>
    );
}
