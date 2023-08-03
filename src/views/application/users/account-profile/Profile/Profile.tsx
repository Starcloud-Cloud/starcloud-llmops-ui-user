// material-ui
import { TextField, Button, Grid } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// ==============================|| PROFILE 1 - PROFILE ||============================== //

const Profile = () => {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <SubCard title="Social Information">
                    <form noValidate autoComplete="off">
                        <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: 1.25 }}>
                            <Grid item>
                                <FacebookIcon />
                            </Grid>
                            <Grid item>
                                <AnimateButton>
                                    <Button variant="contained" size="small" color="secondary">
                                        Connect
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: 1.25 }}>
                            <Grid item>
                                <TwitterIcon />
                            </Grid>
                            <Grid item xs zeroMinWidth>
                                <TextField fullWidth label="Twitter Profile Url" />
                            </Grid>
                            <Grid item>
                                <AnimateButton>
                                    <Button variant="contained" size="small" color="secondary">
                                        Connect
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" spacing={gridSpacing}>
                            <Grid item>
                                <LinkedInIcon />
                            </Grid>
                            <Grid item xs zeroMinWidth>
                                <TextField fullWidth label="LinkedIn Profile Url" />
                            </Grid>
                            <Grid item>
                                <AnimateButton>
                                    <Button variant="contained" size="small" color="secondary">
                                        Connect
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                </SubCard>
            </Grid>
        </Grid>
    );
};

export default Profile;
