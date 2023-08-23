import { Button, Box, Drawer, TextField, Accordion, AccordionSummary, Typography, AccordionDetails, Tooltip } from '@mui/material';
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
    const [expanded, setExpanded] = React.useState<number | false>(0);
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
                                <Typography fontSize="16px" fontWeight="500">
                                    微信群
                                    {index + 1}：{item.config?.groupName && <span>{item.config?.groupName}</span>}
                                    {!item.config?.groupName && <span style={{ color: '#9da3af' }}>未绑定</span>}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                    <div className="text-base" style={{ display: 'flex', alignItems: 'center' }}>
                                        机器人微信号：{item.config?.robotName}
                                        <Typography color="error">（同意帐号的好友申请，并增加为好友）</Typography>
                                    </div>
                                    <div className="text-base mt-2" style={{ display: 'flex', alignItems: 'center' }}>
                                        群名称：
                                        <Typography>{item.config?.groupName}</Typography>
                                    </div>
                                    <div className="text-base mt-2" style={{ display: 'flex', alignItems: 'center' }}>
                                        绑定状态：
                                        {item.config?.isBind && <span>已绑定</span>}
                                        {!item.config?.isBind && <span style={{ color: '#9da3af' }}>未绑定</span>}
                                    </div>
                                    <div className="text-base mt-2" style={{ display: 'flex', alignItems: 'center' }}>
                                        绑定码：
                                        <Typography>{item.config?.groupRemark}</Typography>
                                        <CopyToClipboard
                                            text={item.config?.groupRemark}
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
                                    <div className="text-base mt-5" style={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
                                        邀请机器人
                                        <Typography fontSize="1rem" fontWeight={500} color="error">
                                            {item.config?.robotName}
                                        </Typography>
                                        进群，并@机器人输入
                                        <Typography fontSize="1rem" fontWeight={500} color="error">
                                            {item.config?.groupRemark}
                                        </Typography>
                                        并发送。
                                    </div>
                                    <div className="flex items-center mt-5 justify-end">
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
