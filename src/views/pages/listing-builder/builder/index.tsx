import { Button, Card, CardHeader, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { KeyWord } from './components/Keyword';
import { Content } from './components/Content';
import { Dropdown, MenuProps } from 'antd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { SettingModal } from './components/SettingModal';

const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                1st menu item
            </a>
        )
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                2nd menu item (disabled)
            </a>
        ),
        disabled: true
    },
    {
        key: '3',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                3rd menu item (disabled)
            </a>
        ),
        disabled: true
    },
    {
        key: '4',
        danger: true,
        label: 'a danger item'
    }
];

const ListingBuilder = () => {
    const [delAnchorEl, setDelAnchorEl] = React.useState<null | HTMLElement>(null);
    const delOpen = Boolean(delAnchorEl);
    const [settingOpen, setSettingOpen] = React.useState(false);

    return (
        <Card className="h-full">
            <CardHeader
                sx={{ padding: 2 }}
                title={
                    <div>
                        <Dropdown menu={{ items }}>
                            <a onClick={(e) => e.preventDefault()}>中国</a>
                        </Dropdown>
                    </div>
                }
                action={
                    <div>
                        <Button startIcon={<SaveIcon />} color="secondary" size="small" variant="contained">
                            保存
                        </Button>
                        <Button startIcon={<CloudUploadIcon />} color="secondary" size="small" variant="contained" className="ml-2">
                            同步
                        </Button>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-haspopup="true"
                            className="ml-1"
                            onClick={(e) => {
                                setDelAnchorEl(e.currentTarget);
                            }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="del-menu"
                            MenuListProps={{
                                'aria-labelledby': 'del-button'
                            }}
                            anchorEl={delAnchorEl}
                            open={delOpen}
                            onClose={() => {
                                setDelAnchorEl(null);
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    setDelAnchorEl(null);
                                    setSettingOpen(true);
                                }}
                            >
                                <ListItemIcon>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <Typography variant="inherit" noWrap>
                                    设置
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </div>
                }
            />
            <Divider />
            <div className="flex bg-[#f4f6f8] h-full">
                <div className="w-[400px] h-full">
                    <KeyWord />
                </div>
                <div className="flex-1 h-full ml-2">
                    <Content />
                </div>
            </div>
            <SettingModal
                open={settingOpen}
                handleClose={() => {
                    setSettingOpen(false);
                }}
            />
        </Card>
    );
};

export default ListingBuilder;
