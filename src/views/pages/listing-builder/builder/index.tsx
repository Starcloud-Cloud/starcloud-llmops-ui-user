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
import SvgIcon from '@mui/material/SvgIcon';
import { COUNTRY_LIST } from '../data';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ListingBuilder = () => {
    const [delAnchorEl, setDelAnchorEl] = React.useState<null | HTMLElement>(null);
    const delOpen = Boolean(delAnchorEl);
    const [settingOpen, setSettingOpen] = React.useState(false);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [country, setCountry] = React.useState({
        icon: COUNTRY_LIST?.['0']?.icon,
        label: COUNTRY_LIST?.['0']?.label
    });

    const onClick: MenuProps['onClick'] = ({ key }) => {
        setCountry({
            icon: COUNTRY_LIST?.[key]?.icon,
            label: COUNTRY_LIST?.[key]?.label
        });
    };

    return (
        <Card className="h-full">
            <CardHeader
                sx={{ padding: 2 }}
                title={
                    <div className="w-[100px]">
                        <Dropdown
                            menu={{ items: COUNTRY_LIST, onClick }}
                            open={dropdownOpen}
                            onOpenChange={setDropdownOpen}
                            arrow
                            placement={'top'}
                        >
                            <div onClick={(e) => e.preventDefault()} className="cursor-pointer flex items-center font-normal">
                                {country.icon}
                                <span className="ml-1 text-sm color-[#606266]">{country.label}</span>
                                {dropdownOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </div>
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
                            <MenuItem
                                onClick={() => {
                                    setDelAnchorEl(null);
                                }}
                            >
                                <ListItemIcon>
                                    <DeleteIcon />
                                </ListItemIcon>
                                <Typography variant="inherit" noWrap>
                                    删除
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </div>
                }
            />
            <Divider />
            <div className="flex bg-[#f4f6f8] h-full">
                <div className="w-[450px] h-full">
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
