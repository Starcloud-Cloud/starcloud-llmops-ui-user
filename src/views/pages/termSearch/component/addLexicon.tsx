import { Radio, Divider, Button } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { Modal, IconButton, CardContent, TextField, CardActions, Grid, Divider as Dividers, Button as Buttons } from '@mui/material';
import { Close } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { useState, useEffect } from 'react';
import { dictPage, dictAdd, dictCreate } from 'api/listing/termSerch';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
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
    const [lexiconList, setLexiconList] = useState<any>(null);
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
        setValue('');
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
    const nation = (type: string) => {
        switch (type) {
            case 'US':
                return '🇺🇸';
            case 'JP':
                return '🇯🇵';
            case 'UK':
                return '🇬🇧';
            case 'DE':
                return '🇩🇪';
            case 'FR':
                return '🇫🇷';
            case 'IT':
                return '🇮🇹';
            case 'ES':
                return '🇪🇸';
            case 'CA':
                return '🇨🇦';
            case 'IN':
                return '🇮🇳';
        }
    };
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
                    <Radio.Group onChange={(e) => setLexiconList(e.target.value)}>
                        {lexiconItem.map((item) => (
                            <Radio key={item.uid} value={item.uid}>
                                <div className="flex items-center">
                                    {nation(item.endpoint)} {item.name}
                                </div>
                            </Radio>
                        ))}
                    </Radio.Group>
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
                            disabled={!lexiconList}
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                console.log(lexiconList);
                                console.log(selectedRowKeys);
                                dictAdd(lexiconList, selectedRowKeys).then((res) => {
                                    setOpen(false);
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: '添加成功',
                                            variant: 'alert',
                                            alert: {
                                                color: 'success'
                                            },
                                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                            close: false
                                        })
                                    );
                                });
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
