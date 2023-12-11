import { useEffect, useState } from 'react';

// material-ui
import { Button, Grid, MenuItem, TextField, useTheme } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { ProfileVO, updateUserProfile } from 'api/system/user/profile';
import { openSnackbar } from 'store/slices/snackbar';
import { t } from 'hooks/web/useI18n';
import { dispatch } from 'store';
import Phone from 'ui-component/login/phone';

interface MyAccountProps {
    userProfile: ProfileVO | null;
}
// select options
const currencies = [
    {
        value: 'man',
        label: '男'
    },
    {
        value: 'woman',
        label: '女'
    }
];

// ==============================|| PROFILE 1 - MY ACCOUNT ||============================== //

const MyAccount = ({ userProfile, forceUpdate }: MyAccountProps & { forceUpdate: () => void }) => {
    const initialSex = userProfile?.sex === 1 ? 'man' : 'woman';
    const [sex, setSex] = useState(initialSex);
    const [username, setUsername] = useState(userProfile?.username || '');
    const [nickname, setNickname] = useState(userProfile?.nickname || '');
    const [mobile, setMobile] = useState(userProfile?.mobile || '');
    const [email, setEmail] = useState(userProfile?.email || '');
    const theme = useTheme();

    useEffect(() => {
        handleReset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userProfile]);

    const handleReset = () => {
        setSex(userProfile?.sex === 1 ? 'man' : 'woman');
        setUsername(userProfile?.username || '');
        setNickname(userProfile?.nickname || '');
        setMobile(userProfile?.mobile || '');
        setEmail(userProfile?.email || '');
    };

    const handleUpdate = async () => {
        const res = await updateUserProfile({
            username,
            nickname,
            email,
            mobile,
            sex: sex === 'man' ? 1 : 0
        });
        if (res) {
            forceUpdate();
            dispatch(
                openSnackbar({
                    open: true,
                    message: t('sys.app.updatesuccess'),
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
        }
    };

    const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSex(event.target.value);
    };
    //手机号
    const [phoneOpne, setPhoneOpen] = useState(false);
    return (
        <Grid container spacing={gridSpacing}>
            {phoneOpne && (
                <Phone
                    onClose={() => setPhoneOpen(false)}
                    phoneOpne={phoneOpne}
                    title="修改手机号"
                    submitText="修改"
                    emits={() => {
                        forceUpdate();
                        setPhoneOpen(false);
                    }}
                />
            )}
            <Grid item xs={12}>
                <SubCard title={t('2profile.user.general')}>
                    <form noValidate autoComplete="off">
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="outlined-basic5"
                                    fullWidth
                                    label={t('2profile.user.username')}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="outlined-basic5"
                                    fullWidth
                                    label={t('2profile.user.nickname')}
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="outlined-basic6"
                                    fullWidth
                                    label={t('2profile.user.mobile')}
                                    value={mobile}
                                    // onClick={() => {
                                    //     setPhoneOpen(true);
                                    // }}
                                    onChange={(e) => setMobile(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="outlined-basic7"
                                    fullWidth
                                    label={t('2profile.user.email')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="outlined-select-gender"
                                    select
                                    fullWidth
                                    label={t('2profile.user.sex')}
                                    value={sex}
                                    onChange={handleChange1}
                                >
                                    {currencies.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid spacing={2} container justifyContent="flex-end" sx={{ mt: 3 }}>
                            <Grid item>
                                <AnimateButton>
                                    <Button variant="contained" onClick={handleUpdate}>
                                        {t('sys.app.update')}
                                    </Button>
                                </AnimateButton>
                            </Grid>
                            <Grid item>
                                <Button sx={{ color: theme.palette.error.main }} onClick={handleReset}>
                                    {t('sys.app.reset')}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </SubCard>
            </Grid>
        </Grid>
    );
};

export default MyAccount;
