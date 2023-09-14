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
    // Switch,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Icon
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './skillCard.scss';
import { delSkill, modifySkill } from 'api/chat';
import { Confirm } from 'ui-component/Confirm';
import { useEffect, useState } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import workflow from 'assets/images/chat/workflow.svg';
import { Switch } from 'antd';
import useUserStore from 'store/user';
import { SkillUpgradeOnline } from './modal/skillUpgradeOnline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { FindInPage, FiberNew, ImageSearch, AddPhotoAlternate } from '@mui/icons-material';

export const handleIcon = (name: string, className?: string) => {
    switch (name) {
        case 'FindInPage':
            return <FindInPage className={className} />;
        case 'FiberNew':
            return <FiberNew className={className} />;
        case 'ImageSearch':
            return <ImageSearch className={className} />;
        case 'AddPhotoAlternate':
            return <AddPhotoAlternate className={className} />;
        default:
            return null; // 可以选择返回空或其他默认的图标
    }
};

function SkillWorkflowCard({ data, handleEdit, forceUpdate }: any) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<Element | ((element: Element) => Element) | null | undefined>(null);
    const [skillUpgradeOnline, setSkillUpgradeOnline] = useState(false);
    const [currenSwitch, setCurrentSwitch] = useState(true);

    useEffect(() => {
        setCurrentSwitch(data.disabled);
    }, [data.disabled]);

    const permissions = useUserStore((state) => state.permissions);

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
            return '应用市场';
        }
        if ((data.type === 3 && data.appType === 0) || data.type === 'MYSELF') {
            return '我的应用';
        }
    };

    return (
        <>
            <Card
                sx={{
                    aspectRatio: '186 / 235',
                    overflow: 'hidden',
                    border: '1px solid',
                    position: 'relative',
                    maxWidth: '203px',
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
                        {handleIcon(data.images, 'w-[16px] h-[16px]') || (
                            <img
                                alt="图片"
                                className="headImg cursor rounded"
                                width="16px"
                                height="16px"
                                style={{ objectFit: 'cover', marginRight: '4px' }}
                                src={data.images || workflow}
                            />
                        )}
                        <Tooltip disableInteractive title={data.name}>
                            <Typography
                                className={`${data.type === 5 || data.type === 'system' ? 'line-clamp-1' : 'cursor-pointer line-clamp-1'}`}
                                gutterBottom
                                variant="h3"
                                sx={{ fontSize: '1.1rem' }}
                                component="div"
                                my={1}
                                onClick={() => {
                                    if (data.type === 5 || data.type === 'system') {
                                        return;
                                    }
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
                        if (data.type === 5 || data.type === 'system') {
                            return;
                        }
                        handleEdit(data);
                    }}
                >
                    <Tooltip disableInteractive title={data.description}>
                        <Typography
                            sx={{ fontSize: '.8rem' }}
                            className={`${data.type === 5 || data.type === 'system' ? 'line-clamp-5' : 'cursor-pointer line-clamp-5'}`}
                            variant="body2"
                            lineHeight="1.1rem"
                        >
                            {data.description}
                        </Typography>
                    </Tooltip>
                </CardContent>
                <div className="absolute bottom-[45px] right-[4px]">
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
                <div className="absolute bottom-1 w-full">
                    <Divider />
                    <div className="mt-[3px] px-1 flex justify-between items-center py-1">
                        <div className="flex justify-end">
                            <Chip label={handleTag(data)} size={'small'} className="flex items-end" variant={'outlined'} />
                        </div>
                        <div>
                            <Switch
                                checked={!currenSwitch}
                                checkedChildren="开"
                                unCheckedChildren="关"
                                onChange={(v, e) => {
                                    e.stopPropagation();
                                    if (v && !permissions.includes('chat:config:skills')) {
                                        setSkillUpgradeOnline(true);
                                        return;
                                    }
                                    setCurrentSwitch(!currenSwitch);
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
            <SkillUpgradeOnline open={skillUpgradeOnline} handleClose={() => setSkillUpgradeOnline(false)} />
        </>
    );
}

export default SkillWorkflowCard;
