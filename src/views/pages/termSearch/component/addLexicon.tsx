import { Checkbox, Divider, Button } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Modal, IconButton, CardContent, TextField, CardActions, Grid, Divider as Dividers, Button as Buttons } from '@mui/material';
import { Close } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { useState, useEffect } from 'react';
import { dictPage, dictAdd, dictCreate } from 'api/listing/termSerch';
const AddLexicon = ({
    open,
    queryAsin,
    selectedRowKeys,
    setOpen
}: {
    open: boolean;
    queryAsin: any;
    selectedRowKeys: any;
    setOpen: (data: boolean) => void;
}) => {
    //选中的值
    const [lexiconList, setLexiconList] = useState<any[]>([]);
    //词库列表
    const [lexiconItem, setLexiconItem] = useState<any[]>([]);
    const addlexicon = async () => {
        await dictCreate({
            name: value,
            endpoint:
                queryAsin.market === 1
                    ? 'US'
                    : queryAsin.market === 6
                    ? 'JP'
                    : queryAsin.market === 3
                    ? 'UK'
                    : queryAsin.market === 4
                    ? 'DE'
                    : queryAsin.market === 5
                    ? 'FR'
                    : queryAsin.market === 35691
                    ? 'IT'
                    : queryAsin.market === 44551
                    ? 'ES'
                    : queryAsin.market === 7
                    ? 'CA'
                    : 'IN'
        });
        getList();
    };
    const [value, setValue] = useState('');
    const getList = () => {
        dictPage({
            pageNo: 1,
            pageSize: 100
        }).then((res) => {
            setLexiconItem(res.list);
        });
    };
    useEffect(() => {
        getList();
    }, []);
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
                        options={lexiconItem}
                        defaultValue={lexiconList}
                        onChange={(checkedValues: CheckboxValueType[]) => setLexiconList(checkedValues)}
                    />
                    <Divider />
                    <div className="font-600 text-[#000] text-base mb-[14px]">创建新词库</div>
                    <div className="flex items-center">
                        <TextField
                            value={value}
                            onChange={(e: any) => {
                                setValue(e.target.value);
                            }}
                            className="w-[300px]"
                            placeholder="新建词库名称"
                            variant="standard"
                            size="small"
                            color="secondary"
                        />
                        <Button
                            onClick={() => {
                                addlexicon();
                            }}
                            disabled={!value}
                            className="ml-[30px]"
                            type="primary"
                        >
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
                                // dictAdd();
                                setOpen(false);
                            }}
                        >
                            已确认，提交吧！
                        </Buttons>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
};
export default AddLexicon;
