import { Checkbox, Divider, Button } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Modal, IconButton, CardContent, TextField, CardActions, Grid, Divider as Dividers, Button as Buttons } from '@mui/material';
import { Close } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { useState } from 'react';
const AddLexicon = ({ open, setOpen }: { open: boolean; setOpen: (data: boolean) => void }) => {
    const [lexiconList, setLexiconList] = useState<any[]>([]);
    const optionsWithDisabled = [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange', disabled: false }
    ];
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <MainCard
                style={{
                    position: 'absolute',
                    width: '800px',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    maxHeight: '80%',
                    overflow: 'auto'
                }}
                title="加入关键词库"
                content={false}
                secondary={
                    <IconButton onClick={() => setOpen(false)} size="large" aria-label="close modal">
                        <Close fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <div className="font-600 text-[#000] text-base mb-[14px]">选择关键词词库</div>
                    <Checkbox.Group
                        options={optionsWithDisabled}
                        defaultValue={lexiconList}
                        onChange={(checkedValues: CheckboxValueType[]) => setLexiconList(checkedValues)}
                    />
                    <Divider />
                    <div className="font-600 text-[#000] text-base mb-[14px]">创建新词库</div>
                    <div className="flex items-center">
                        <TextField className="w-[300px]" placeholder="新建词库名称" variant="standard" size="small" color="secondary" />
                        <Button className="ml-[30px]" type="primary">
                            新建
                        </Button>
                    </div>
                </CardContent>
                <Dividers />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Buttons
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            保存
                        </Buttons>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};
export default AddLexicon;
