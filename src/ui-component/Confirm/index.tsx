import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, useTheme } from '@mui/material';

type ConfirmProps = {
    open: boolean;
    handleClose: () => void;
    handleOk: () => void;
    title?: string;
    content?: string;
};

/**
 * 确认弹窗
 * @param param0
 * @returns
 */
export const Confirm = ({ open, handleClose, handleOk, title = '提示', content = '确认该操作?' }: ConfirmProps) => {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{ p: 3 }}
        >
            {open && (
                <div className="min-w-[275px]">
                    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Typography variant="body2" component="span">
                                {content}
                            </Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ pr: 2.5 }}>
                        <Button
                            sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                            onClick={handleClose}
                            color="secondary"
                        >
                            取消
                        </Button>
                        <Button variant="contained" size="small" onClick={handleOk} autoFocus>
                            确认
                        </Button>
                    </DialogActions>
                </div>
            )}
        </Dialog>
    );
};
