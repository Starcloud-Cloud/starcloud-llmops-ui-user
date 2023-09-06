import { Card, CardContent, Box, Typography, Tooltip, Link, Button, Chip, Divider, Switch } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './skillCard.scss';
import { delSkill, modifySkill } from 'api/chat';
import { Confirm } from 'ui-component/Confirm';
import { useState } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

function SkillCard({ data, handleCreate, handleEdit, forceUpdate }: any) {
    console.log(data, ' data');
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
            return 'AI应用';
        }
        if ((data.type === 3 && data.appType === 0) || data.type === 'MYSELF') {
            return '我的应用';
        }
    };

    return (
        <Card
            sx={{
                width: '201px',
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
                <img
                    onClick={() => handleEdit(data)}
                    alt="图片"
                    className="headImg cursor"
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover' }}
                    src={data.images}
                />
            </Box>
            <CardContent
                sx={{
                    px: 2,
                    py: 1,
                    position: 'relative',
                    overflow: 'hidden'
                }}
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
                        sx={{ fontSize: '.8rem', height: '36px' }}
                        onClick={() => handleEdit(data)}
                        className="cursor desc"
                        variant="body2"
                        lineHeight="1.1rem"
                    >
                        {data.description}
                    </Typography>
                </Tooltip>
                <div className="flex justify-end mt-3">
                    <Chip label={handleTag(data)} size={'small'} className="h-[20px]" variant={'outlined'} />
                </div>
            </CardContent>
            <Divider />
            {handleCreate && (
                <div className="mt-[7px] px-1 flex justify-end items-center">
                    <Button size={'small'} color="secondary" onClick={() => handleCreate(data)}>
                        添加
                    </Button>
                </div>
            )}
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
