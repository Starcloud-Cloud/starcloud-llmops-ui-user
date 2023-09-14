import { Card, CardContent, Box, Typography, Tooltip, Link, Button, Chip, Divider, Switch, Icon } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './skillCard.scss';
import { delSkill, modifySkill } from 'api/chat';
import { Confirm } from 'ui-component/Confirm';
import { useState } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import workflow from 'assets/images/chat/workflow.svg';
import { Tag } from 'antd';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { handleIcon } from './SkillWorkflowCard';

function SkillCard({ data, handleCreate, handleEdit, forceUpdate, workflowList }: any) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleAble = () => {
        const values: any = {
            uid: data.uid,
            type: data.type,
            appConfigId: data.appConfigId,
            disabled: !data.disabled
        };
        if (data.type === 5) {
            values.systemHandlerSkillDTO = {
                name: data.name,
                desc: data.description,
                copyWriting: data.copyWriting,
                code: data.code,
                icon: data.images
            };
        }
        if (data.type === 3) {
            values.appWorkflowSkillDTO = {
                name: data.name,
                desc: data.description,
                copyWriting: data.copyWriting,
                skillAppUid: data.skillAppUid,
                icon: data.images,
                appType: data?.appType,
                defaultPromptDesc: data.defaultPromptDesc
            };
        }

        modifySkill(values).then((res: any) => {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '修改成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
            forceUpdate();
        });
    };

    const handleDelete = () => {
        delSkill(data.uid).then((res) => {
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
            forceUpdate();
        });
    };

    const handleTag = (data: any) => {
        if (data.type === 5 || data.type === 'system') {
            return '系统';
        }
        if ((data.type === 3 && data.appType === 1) || data.type === 'market') {
            return '应用市场';
        }
        if ((data.type === 3 && data.appType === 0) || data.type === 'MYSELF') {
            return '我的应用';
        }
    };

    const handleDisabled = (data: any) => {
        // 系统的通过这个判断 // TODO别的后面再加
        if (data.type === 'system') {
            const codeList = workflowList.map((v: any) => v.code);
            return codeList.includes(data.code);
        }
    };

    return (
        <Card
            sx={{
                aspectRatio: '186 / 235',
                overflow: 'hidden',
                border: '1px solid',
                position: 'relative',
                borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 15 : 'rgba(230,230,231,1)',
                ':hover': {
                    boxShadow: theme.palette.mode === 'dark' ? '0 2px 14px 0 rgb(33 150 243 / 10%)' : '0 2px 5px 0 rgb(32 40 45 / 8%)'
                }
            }}
        >
            <Box sx={{ aspectRatio: '186 / 80', overflow: 'hidden' }}>
                {handleIcon(data.images, 'w-[100%] h-[100%]') || (
                    <img
                        onClick={() => handleEdit(data)}
                        alt="图片"
                        className="headImg cursor"
                        width="100%"
                        height="100%"
                        style={{ objectFit: 'cover' }}
                        src={data.images || workflow}
                    />
                )}
                {/* )} */}
            </Box>
            <CardContent
                sx={{
                    px: 2,
                    pt: 1,
                    position: 'relative',
                    overflow: 'hidden'
                }}
                className="pb-[18px]"
            >
                <Tooltip disableInteractive title={data.name}>
                    <Typography
                        onClick={() => handleEdit(data)}
                        className="skillCard active cursor"
                        gutterBottom
                        variant="h3"
                        sx={{ fontSize: '1.1rem' }}
                        component="div"
                        my={1}
                    >
                        {data.name}
                    </Typography>
                </Tooltip>
                <Tooltip disableInteractive title={data.description}>
                    <Typography
                        sx={{ fontSize: '.8rem', height: '50px' }}
                        onClick={() => handleEdit(data)}
                        // className="cursor desc"
                        className="cursor-pointer line-clamp-3"
                        variant="body2"
                        lineHeight="1.1rem"
                    >
                        {data.description}
                    </Typography>
                </Tooltip>
            </CardContent>
            <div className="absolute bottom-[46px] right-[4px]">
                {data.usage && (
                    <Tooltip
                        title={
                            <div>
                                <div>使用示例</div>
                                <div className="whitespace-pre-line">{data.usage}</div>
                            </div>
                        }
                        placement="top"
                    >
                        <div className="flex items-center cursor-pointer">
                            <span className="text-sm">使用</span>
                            <HelpOutlineIcon className="text-base cursor-pointer" />
                        </div>
                    </Tooltip>
                )}
            </div>

            <div className="py-[8px] px-1 flex justify-between items-center absolute bottom-0 w-full border-t-[1px] border-solid border-[#e3e8ef]">
                <Chip label={handleTag(data)} size={'small'} className="h-[20px]" variant={'outlined'} />
                <Button
                    className="!py-[2px] !min-w-[45px] !px-[5px] leading-5"
                    variant="contained"
                    size={'small'}
                    color="secondary"
                    disabled={handleDisabled(data)}
                    onClick={() => handleCreate(data)}
                >
                    添加
                </Button>
            </div>
            {handleEdit && (
                <div className="mt-[7px] px-1 flex justify-between items-center">
                    <div>
                        <span className="text-sm">{data.disabled ? '关闭' : '开启'}</span>
                        <Switch color={'secondary'} size={'small'} checked={!data.disabled} onClick={handleAble} />
                    </div>
                    <Button size={'small'} color="secondary" onClick={() => setOpen(true)}>
                        删除
                    </Button>
                </div>
            )}
            <Confirm open={open} handleClose={() => setOpen(false)} handleOk={handleDelete} />
        </Card>
    );
}

export default SkillCard;
