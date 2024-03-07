import {
    Box,
    Dialog,
    Typography,
    DialogContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    DialogActions,
    Button,
    FormControlLabel,
    DialogTitle,
    IconButton,
    Switch
} from '@mui/material';
import { Close, Add } from '@mui/icons-material';
import { t } from 'hooks/web/useI18n';
import { useEffect, useState } from 'react';
import _ from 'lodash-es';
function BootstrapDialogTitle(props: any) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, px: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                >
                    <Close />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}
const VariableModal = ({
    title,
    open,
    setOpen,
    itemData,
    saveContent
}: {
    title: string;
    open: boolean;
    setOpen: (data: boolean) => void;
    itemData: any;
    saveContent: (data: any) => void;
}) => {
    const typeList = [
        { label: t('myApp.input'), value: 'INPUT' },
        { label: t('myApp.textarea'), value: 'TEXTAREA' },
        { label: t('myApp.select'), value: 'SELECT' }
    ];
    const [options, setOptions] = useState<any[]>([]);
    //必填
    const handleChange = (e: any) => {
        setContent({
            ...content,
            [e.target.name]: e.target.value
        });
    };
    const optionChange = (e: any, index: number) => {
        const newList = _.cloneDeep(options);
        newList[index] = {
            ...newList[index],
            [e.target.name]: e.target.value
        };
        setOptions(newList);
    };
    const [content, setContent] = useState<any>({
        style: 'INPUT'
    });
    const [fieldOpen, setFidldOpen] = useState(false);
    const [labelOpen, setLabelOpen] = useState(false);
    const addVariable = () => {
        setOptions([
            ...options,
            {
                label: 'lable',
                value: 'value'
            }
        ]);
    };
    useEffect(() => {
        if (title === '编辑变量') {
            setContent(itemData);
            setOptions(itemData.options);
        }
    }, []);
    const handleSave = () => {
        if (!content.field || !content.label) {
            setFidldOpen(true);
            setLabelOpen(true);
            return false;
        }

        if (/^[A-Z0-9_\-]+$/.test(content.field)) {
            saveContent({
                ...content,
                style: content.style || 'INPUT',
                options: content.style === 'SELECT' ? options : []
            });
        }
    };
    return (
        <Dialog onClose={() => setOpen(false)} aria-labelledby="customized-dialog-title" open={open}>
            <BootstrapDialogTitle id="customized-dialog-title" onClose={() => setOpen(false)}>
                <Typography fontSize="1.25rem" fontWeight={600}>
                    {title}
                </Typography>
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <TextField
                    fullWidth
                    id="field"
                    name="field"
                    required
                    label={t('myApp.field')}
                    color="secondary"
                    size="small"
                    value={content.field}
                    onChange={(e) => {
                        handleChange(e), setFidldOpen(true);
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={(fieldOpen && !content.field) || (fieldOpen && !/^[A-Z0-9_\-]+$/.test(content.field))}
                    helperText={
                        (fieldOpen && !content.field) || (fieldOpen && !/^[A-Z0-9_\-]+$/.test(content.field))
                            ? `${t('myApp.field')}必填并只能填写大写字母 数字 _ -`
                            : ''
                    }
                />
                <TextField
                    fullWidth
                    id="label"
                    name="label"
                    sx={{ mt: 2 }}
                    required
                    label={t('myApp.name')}
                    color="secondary"
                    size="small"
                    value={content.label}
                    onChange={(e) => {
                        handleChange(e), setLabelOpen(true);
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={labelOpen && !content.label}
                    helperText={labelOpen && !content.label ? `${t('myApp.name')}必填` : ''}
                />
                <TextField
                    fullWidth
                    id="defaultValue"
                    name="defaultValue"
                    sx={{ mt: 2 }}
                    label={t('myApp.value')}
                    color="secondary"
                    size="small"
                    value={content.defaultValue}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    id="description"
                    name="description"
                    sx={{ mt: 2 }}
                    label={t('myApp.desc')}
                    color="secondary"
                    size="small"
                    value={content.description}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
                <FormControl color="secondary" size="small" fullWidth sx={{ mt: 2 }}>
                    <InputLabel>{t('myApp.type')}</InputLabel>
                    <Select onChange={handleChange} name="style" value={content.style} label={t('myApp.type')}>
                        {typeList.map((el: any) => (
                            <MenuItem key={el.value} value={el.value}>
                                {el.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {content.style === 'SELECT' && (
                    <Box>
                        {options.map((item, vIndex: number) => (
                            <Box key={vIndex} mt={2}>
                                <TextField
                                    name="label"
                                    label="label"
                                    color="secondary"
                                    size="small"
                                    value={item.label}
                                    onChange={(e) => optionChange(e, vIndex)}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <span style={{ display: 'inline-block', margin: '20px 10px 0 10px' }}>—</span>
                                <TextField
                                    name="value"
                                    label="value"
                                    color="secondary"
                                    size="small"
                                    value={item.value}
                                    onChange={(e) => optionChange(e, vIndex)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                        ))}
                        <br />
                        <Button color="secondary" size="small" variant="outlined" startIcon={<Add />} onClick={addVariable}>
                            {t('myApp.addOption')}
                        </Button>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button disabled={itemData?.group === 'SYSTEM'} color="secondary" onClick={handleSave}>
                    {t('myApp.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default VariableModal;
