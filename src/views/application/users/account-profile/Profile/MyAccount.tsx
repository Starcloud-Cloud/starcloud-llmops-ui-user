import { useState } from 'react';

// material-ui
import { Button, Grid, MenuItem, TextField } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

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

const MyAccount = () => {
    const [currency, setCurrency] = useState('man');
    const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrency(event.target.value);
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
                                    label="用户昵称"
                                    // helperText="Your Profile URL: https://pc.com/Ashoka_Tano_16"
                                    defaultValue="芋道源码"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField id="outlined-basic6" fullWidth label="手机号码" defaultValue="15612345678" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField id="outlined-basic6" fullWidth label="用户邮箱" defaultValue="aoteman@126.com" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="outlined-select-gender"
                                    select
                                    fullWidth
                                    label="性别"
                                    value={currency}
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
                    </form>
                </SubCard>
            </Grid>
            <Grid item xs={12} sx={{ mt: 3 }}>
                <Grid spacing={2} container justifyContent="flex-end">
                    <Grid item>
                        <AnimateButton>
                            <Button variant="contained">更新</Button>
                        </AnimateButton>
                    </Grid>
                    <Grid item>
                        <AnimateButton>
                            <Button variant="contained">重置</Button>
                        </AnimateButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default MyAccount;
