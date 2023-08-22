import { Button, Drawer, TextField, Accordion, AccordionSummary, Typography, AccordionDetails, Tooltip } from '@mui/material';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Popconfirm, ConfigProvider } from 'antd';
import React, { useEffect, useRef } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { channelUpload, channelDelete } from 'api/template';
import './SiteDrawerCode.scss';
import { openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';
import _ from 'lodash-es';

const WeChatDrawer = ({
    open,
    codeList,
    setOpen,
    getUpdateBtn
}: {
    open: boolean;
    codeList: any[];
    setOpen: (open: boolean) => void;
    getUpdateBtn: () => void;
}) => {
    const onClose = () => setOpen(false);
    const [expanded, setExpanded] = React.useState<number | false>(false);
    const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    const codeRef: any = useRef(null);
    useEffect(() => {
        codeRef.current = _.cloneDeep(codeList);
    }, [codeList]);
    //删除
    const handleDel = async (data: any) => {
        const { uid } = data;
        await channelDelete({ uid });
        getUpdateBtn();
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
    };

    return (
        <Drawer anchor="right" open={open} sx={{ '& .MuiDrawer-paper': { overflow: 'hidden' } }} onClose={onClose}>
            <div className="bg-[#f4f6f8] w-[350px] md:w-[600px] flex items-center justify-center">
                <div className="m-[10px] bg-[#fff] h-[calc(100vh-20px)] w-[100%] rounded-lg p-[20px] overflow-auto">
                    <div className="text-lg">我的微信群</div>
                    {codeList?.map((item: any, index: number) => (
                        <Accordion key={index} expanded={expanded === index} onChange={handleChange(index)}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontSize="14px" fontWeight="500">
                                    微信群{index + 1}：{item.name}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="mt-5">
                                    <TextField
                                        InputLabelProps={{ shrink: true }}
                                        color="secondary"
                                        name="name"
                                        label={'微信群名称'}
                                        placeholder={'请输入微信群名称'}
                                        disabled
                                        fullWidth
                                        value={item.name}
                                    />
                                    <div className="text-base mt-5" style={{ display: 'flex', alignItems: 'center' }}>
                                        <Tooltip placement="top" title="在企业微信群中@机器人 并回复复制的内容">
                                            <ErrorOutlineIcon fontSize="small" />
                                        </Tooltip>
                                        绑定应用:{item.mediumUid}
                                        <CopyToClipboard
                                            text={`绑定应用:${item.mediumUid}`}
                                            onCopy={() =>
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: '复制成功',
                                                        variant: 'alert',
                                                        alert: {
                                                            color: 'success'
                                                        },
                                                        close: false,
                                                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                                        transition: 'SlideLeft'
                                                    })
                                                )
                                            }
                                        >
                                            <span className="text-[#5e35b1] cursor-pointer text-base ml-3">复制</span>
                                        </CopyToClipboard>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <ConfigProvider
                                            theme={{
                                                components: {
                                                    Popconfirm: {
                                                        zIndexPopup: 9999
                                                    }
                                                }
                                            }}
                                        >
                                            <Popconfirm
                                                placement="top"
                                                title="请再次确认是否删除"
                                                onConfirm={() => {
                                                    handleDel(item);
                                                }}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button color={'error'} size={'small'} variant="contained">
                                                    删除
                                                </Button>
                                            </Popconfirm>
                                        </ConfigProvider>
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </div>
        </Drawer>
    );
};
export default WeChatDrawer;
