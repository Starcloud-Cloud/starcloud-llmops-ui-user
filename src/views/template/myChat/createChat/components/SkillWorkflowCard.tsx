import {
    Card,
    CardContent,
    Box,
    Typography,
    Tooltip,
    Link,
    Button,
    Chip,
    Divider,
    Switch,
    Grid,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './skillCard.scss';
import { delSkill, modifySkill } from 'api/chat';
import { Confirm } from 'ui-component/Confirm';
import { useState } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';

function SkillWorkflowCard({ data, handleEdit, forceUpdate }: any) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<Element | ((element: Element) => Element) | null | undefined>(null);

    const handleClickSort = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
        event?.stopPropagation();
        setAnchorEl(event?.currentTarget);
    };

    const handleCloseSort = () => {
        setAnchorEl(null);
    };

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
            setAnchorEl(null);
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
            <Box
                sx={{
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                    marginTop: '16px',
                    justifyContent: 'space-between'
                }}
            >
                <div className="flex justify-center items-center">
                    <img
                        alt="图片"
                        className="headImg cursor"
                        width="16px"
                        height="16px"
                        style={{ objectFit: 'cover', borderRadius: '100%', marginRight: '4px' }}
                        src={data.images}
                    />
                    <Tooltip disableInteractive title={data.name}>
                        <Typography
                            className="line-clamp-1 cursor-pointer"
                            gutterBottom
                            variant="h3"
                            sx={{ fontSize: '1.1rem' }}
                            component="div"
                            my={1}
                            onClick={() => {
                                handleEdit(data);
                            }}
                        >
                            {data.name}
                        </Typography>
                    </Tooltip>
                </div>
                <Grid item className="!pl-0">
                    <IconButton
                        onClick={(e) => {
                            handleClickSort(e);
                        }}
                        sx={{
                            padding: '4px'
                        }}
                        size="large"
                        aria-label="chat user details change"
                    >
                        <MoreHorizTwoToneIcon />
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={() => {
                            handleCloseSort();
                        }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                    >
                        <MenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(true);
                            }}
                        >
                            <DeleteIcon className="text-base" />
                            <span className="text-base ml-3">删除</span>
                        </MenuItem>
                    </Menu>
                </Grid>
            </Box>
            <CardContent
                sx={{
                    px: 2,
                    py: 1,
                    position: 'relative',
                    overflow: 'hidden'
                }}
                onClick={() => {
                    handleEdit(data);
                }}
            >
                <Tooltip disableInteractive title={data.description}>
                    <Typography
                        sx={{ fontSize: '.8rem', height: '52px' }}
                        className="line-clamp-3 cursor-pointer"
                        variant="body2"
                        lineHeight="1.1rem"
                    >
                        {data.description}
                    </Typography>
                </Tooltip>
            </CardContent>
            <div className="absolute bottom-1 w-full">
                <div className="flex justify-end mb-3 mr-4">
                    <Chip label={handleTag(data)} size={'small'} className="h-[20px]" variant={'outlined'} />
                </div>
                <Divider />
                <div className="mt-[3px] px-1 flex justify-end items-center">
                    <div>
                        <span className="text-sm">{data.disabled ? '关闭' : '开启'}</span>
                        <Switch
                            color={'secondary'}
                            checked={!data.disabled}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAble();
                            }}
                        />
                    </div>
                </div>
            </div>
            <Confirm
                open={open}
                handleClose={() => {
                    setOpen(false);
                    setAnchorEl(null);
                }}
                handleOk={handleDelete}
            />
        </Card>
    );
}

export default SkillWorkflowCard;
