// material-ui
import { useTheme } from '@mui/material/styles';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, PaletteMode } from '@mui/material';

// project imports
import useConfig from 'hooks/useConfig';
import SubCard from 'ui-component/cards/SubCard';

const Layout = () => {
    const theme = useTheme();
    const { navType, onChangeMenuType } = useConfig();

    return (
        <SubCard title="Layout">
            <FormControl component="fieldset">
                <FormLabel component="legend">Mode</FormLabel>
                <RadioGroup
                    row
                    aria-label="layout"
                    value={navType}
                    onChange={(e) => onChangeMenuType(e.target.value as PaletteMode)}
                    name="row-radio-buttons-group"
                >
                    <FormControlLabel
                        value="light"
                        control={<Radio />}
                        label="Light"
                        sx={{
                            '& .MuiSvgIcon-root': { fontSize: 28 },
                            '& .MuiFormControlLabel-label': { color: theme.palette.grey[900] }
                        }}
                    />
                    <FormControlLabel
                        value="dark"
                        control={<Radio />}
                        label="Dark"
                        sx={{
                            '& .MuiSvgIcon-root': { fontSize: 28 },
                            '& .MuiFormControlLabel-label': { color: theme.palette.grey[900] }
                        }}
                    />
                </RadioGroup>
            </FormControl>
        </SubCard>
    );
};

export default Layout;
