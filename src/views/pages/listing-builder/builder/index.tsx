import { Button, Card, CardHeader, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { KeyWord } from './components/Keyword';
import { Content } from './components/Content';
import { Affix, Dropdown, MenuProps } from 'antd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { useEffect } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { SettingModal } from './components/SettingModal';
import { COUNTRY_LIST } from '../data';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useListing } from 'contexts/ListingContext';
import { saveListing } from 'api/listing/build';
import { ListingBuilderEnum } from 'utils/enums/listingBuilderEnums';

const ListingBuilder = () => {
    const [delAnchorEl, setDelAnchorEl] = React.useState<null | HTMLElement>(null);
    const delOpen = Boolean(delAnchorEl);
    const [settingOpen, setSettingOpen] = React.useState(false);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const { country, setCountry, uid, version, list } = useListing();

    const onClick: MenuProps['onClick'] = ({ key }) => {
        setCountry({
            key,
            icon: COUNTRY_LIST?.[key]?.icon,
            label: COUNTRY_LIST?.[key]?.label
        });
    };

    const handleSave = async () => {
        const result = list
            .filter((item) => item.type === ListingBuilderEnum.FIVE_DES)
            .reduce((acc: any, obj, index) => {
                acc[index + 1] = obj.value;
                return acc;
            }, {});
        const data = {
            uid,
            version,
            asin: country.key,
            draftConfig: {
                enableAi: true,
                fiveDescNum: list.filter((item) => item.type === ListingBuilderEnum.FIVE_DES)?.length
            },
            title: list.find((item) => item.type === ListingBuilderEnum.TITLE)?.value,
            productDesc: list.find((item) => item.type === ListingBuilderEnum.PRODUCT_DES)?.value,
            searchTerm: list.find((item) => item.type === ListingBuilderEnum.SEARCH_WORD)?.value,
            fiveDesc: result
        };
        const res = await saveListing(data);
    };

    return (
        <Card>
            <CardHeader
                sx={{ padding: 2 }}
                title={'Listing'}
                action={
                    <div className="flex items-center">
                        <div className="w-[100px]">
                            <Dropdown
                                disabled={uid !== ''}
                                menu={{ items: COUNTRY_LIST, onClick }}
                                open={dropdownOpen}
                                onOpenChange={setDropdownOpen}
                                arrow
                                placement={'top'}
                            >
                                <div onClick={(e) => e.preventDefault()} className="cursor-pointer flex items-center font-normal">
                                    {country.icon}
                                    <span className="ml-1 text-sm color-[#606266]">{country.label}</span>
                                    {!uid && (dropdownOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                                </div>
                            </Dropdown>
                        </div>
                        <Button startIcon={<SaveIcon />} color="secondary" size="small" variant="contained" onClick={() => handleSave()}>
                            保存草稿
                        </Button>
                        <Button startIcon={<CloudUploadIcon />} color="secondary" size="small" variant="contained" className="ml-2">
                            同步到亚马逊
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
                <Affix offsetTop={0}>
                    <div className="w-[450px] h-screen">
                        <KeyWord />
                    </div>
                </Affix>
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
