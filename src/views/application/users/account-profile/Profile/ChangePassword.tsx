// material-ui
import { Button, Grid, TextField, useTheme } from '@mui/material';
import { useState } from 'react';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { updateUserPassword } from 'api/system/user/profile';
import { openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';
import { t } from 'hooks/web/useI18n';

// ==============================|| PROFILE 1 - CHANGE PASSWORD ||============================== //

const ChangePassword = () => {
    const theme = useTheme();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const clearFields = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: t('2profile.password.diffPwd'),
                    variant: 'alert',
                    alert: {
                        color: 'warning'
                    },
                    close: false
                })
            );
            return;
        }

        const res = await updateUserPassword(oldPassword, newPassword);
        if (res) {
            dispatch(
                openSnackbar({
                    open: true,
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
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

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <SubCard title={t('2profile.password.changepassword')}>
                    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <Grid container spacing={gridSpacing} sx={{ mb: 1.75 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    type="password"
                                    id="outlined-basic7"
                                    fullWidth
                                    label={t('2profile.password.currentpassword')}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={gridSpacing} sx={{ mb: 1.75 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    type="password"
                                    id="outlined-basic8"
                                    fullWidth
                                    label={t('2profile.password.newpassword')}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    type="password"
                                    id="outlined-basic9"
                                    fullWidth
                                    label={t('2profile.password.confirmpassword')}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid spacing={2} container justifyContent="flex-end" sx={{ mt: 3 }}>
                            <Grid item>
                                <AnimateButton>
                                    <Button variant="contained" type="submit">
                                        {t('2profile.password.changepassword')}
                                    </Button>
                                </AnimateButton>
                            </Grid>
                            <Grid item>
                                <Button sx={{ color: theme.palette.error.main }} onClick={clearFields}>
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

export default ChangePassword;
