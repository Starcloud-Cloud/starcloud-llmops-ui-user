import { useEffect, useState } from 'react';

// material-ui
import { Button, Grid, MenuItem, TextField, useTheme } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { ProfileVO, updateUserProfile } from 'api/system/user/profile';

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

const MyAccount = ({ userProfile }: MyAccountProps) => {
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
        setNickname(userProfile?.nickname || '');
        setMobile(userProfile?.mobile || '');
        setEmail(userProfile?.email || '');
    };

    const handleUpdate = () => {
        updateUserProfile({
            username,
            nickname,
            email,
            mobile,
            sex: sex === 'man' ? 1 : 0
        });
    };

    const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSex(event.target.value);
    };
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <SubCard title="General Settings">
                    <form noValidate autoComplete="off">
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="outlined-basic5"
                                    fullWidth
                                    label="用户名称"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="outlined-basic5"
                                    fullWidth
                                    label="用户昵称"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="outlined-basic6"
                                    fullWidth
                                    label="手机号码"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="outlined-basic7"
                                    fullWidth
                                    label="用户邮箱"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField id="outlined-select-gender" select fullWidth label="性别" value={sex} onChange={handleChange1}>
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
                                        更新
                                    </Button>
                                </AnimateButton>
                            </Grid>
                            <Grid item>
                                <Button sx={{ color: theme.palette.error.main }} onClick={handleReset}>
                                    Clear
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
