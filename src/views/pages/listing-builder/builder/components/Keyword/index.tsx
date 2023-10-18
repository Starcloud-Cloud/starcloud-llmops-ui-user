import { Button } from '@mui/material';
import React from 'react';
import { AddKeywordModal } from '../AddKeyworkModal';
import AddIcon from '@mui/icons-material/Add';
import { KeywordList } from './KeywordList';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';

export const KeyWord = () => {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
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
                    <span className={'mr-3'}>总共N个词/选中N个词</span>
                    <Button variant={'text'} color={'secondary'} startIcon={<VisibilityOffIcon />}>
                        隐藏已使用
                    </Button>
                </div>
                <Button variant={'text'} color={'secondary'} startIcon={<DeleteIcon />}>
                    删除
                </Button>
            </div>
            <div className="mt-3">
                <KeywordList />
            </div>
            <AddKeywordModal open={open} handleClose={handleClose} />
        </div>
    );
};
