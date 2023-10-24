import { Button } from '@mui/material';
import React from 'react';
import { AddKeywordModal } from '../AddKeyworkModal';
import AddIcon from '@mui/icons-material/Add';
import { KeywordList } from './KeywordList';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import { useListing } from 'contexts/ListingContext';
import { delKey } from 'api/listing/build';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

export const KeyWord = () => {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<any[]>([]);
    const { detail, setUpdate } = useListing();

    const handleClose = () => {
        setOpen(false);
    };

    const handleDel = async () => {
        const res = await delKey(selected);
        if (res) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '删除成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
            setUpdate({});
        }
    };

    return (
        <div className="h-full p-3 bg-white">
            <div className="text-lg font-bold py-1">关键词</div>
            <div className="flex justify-between">
                <Button
                    startIcon={<AddIcon />}
                    color="secondary"
                    size="small"
                    variant="contained"
                    className="ml-2"
                    onClick={() => setOpen(true)}
                >
                    增加关键词
                </Button>
            </div>
            <div className={'flex justify-between items-center'}>
                <div className={'flex items-center'}>
                    <span className={'mr-3'}>
                        总共{detail?.keywordResume?.length}个词/选中{selected?.length}个词
                    </span>
                    <Button variant={'text'} color={'secondary'} startIcon={<VisibilityOffIcon />}>
                        隐藏已使用
                    </Button>
                </div>
                <Button variant={'text'} color={'secondary'} startIcon={<DeleteIcon />} onClick={() => handleDel()}>
                    删除
                </Button>
            </div>
            <div className="mt-3">
                <KeywordList selected={selected} setSelected={setSelected} />
            </div>
            <AddKeywordModal open={open} handleClose={handleClose} />
        </div>
    );
};
