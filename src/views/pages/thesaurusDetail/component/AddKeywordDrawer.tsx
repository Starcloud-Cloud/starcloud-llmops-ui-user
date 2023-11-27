import { Button, CardActions, CardContent, Divider, Grid, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { Drawer } from 'antd';
import { addKeyword } from 'api/listing/thesaurus';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

type IAddKeywordModalProps = {
    open: boolean;
    handleClose: () => void;
    uid: string;
    forceUpdate: (update: any) => void;
};

/**
 * 添加导入关键词弹窗
 */
export const AddKeywordDrawer = ({ open, handleClose, uid, forceUpdate }: IAddKeywordModalProps) => {
    const [keyWord, setKeyWord] = useState<string>('');

    // 添加关键词
    const handleOk = async () => {
        const lines = keyWord.split('\n');
        const res = await addKeyword({ uid, data: lines });
        if (res) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '操作成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
            handleClose();
            forceUpdate({});
        }
    };

    return (
        <Drawer placement="right" closable={false} onClose={handleClose} open={open} getContainer={false} maskClosable={false}>
            <div className="absolute right-1 top-1 z-10">
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon className="cursor-pointer" />
                </IconButton>
            </div>
            <CardContent
                sx={{
                    p: 1
                }}
            >
                <div className="h-[390px]">
                    <TextField
                        multiline
                        rows={11}
                        label={'关键词'}
                        InputLabelProps={{ shrink: true }}
                        value={keyWord}
                        placeholder={`一行一组关键词，如：
flashlight
led flashlight
mini led flashlight`}
                        className="w-full"
                        onChange={(e) => {
                            const text = e.target.value;
                            // 匹配开头和结尾的标点符号
                            const regex = /^[^\w\s]+|[^\w\s]+$/g;

                            // 将文本分成多行
                            const lines = text.split('\n');

                            // 去掉每行开头和结尾的标点符号，并确保单词之间只有一个空格
                            const cleanedLines = lines.map((line) => line.replace(regex, '').replace(/\s+/g, ' '));

                            const cleanedText = cleanedLines.join('\n');
                            setKeyWord(cleanedText);
                        }}
                    />
                </div>
            </CardContent>
            <Divider />
            <CardActions>
                <Grid container justifyContent="flex-end">
                    <Button variant="contained" type="button" color="secondary" onClick={handleOk}>
                        确认
                    </Button>
                </Grid>
            </CardActions>
        </Drawer>
    );
};
