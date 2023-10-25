import { Button, Card, CardHeader, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography, Tabs, Tab } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { KeyWord } from './components/Keyword';
import { Content } from './components/Content';
import { Affix, Dropdown, MenuProps } from 'antd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { SettingModal } from './components/SettingModal';
import { COUNTRY_LIST } from '../data';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useListing } from 'contexts/ListingContext';
import { delListing, saveListing } from 'api/listing/build';
import { ListingBuilderEnum } from 'utils/enums/listingBuilderEnums';
import { isMobile } from 'react-device-detect';
import { TabPanel } from 'views/template/myChat/createChat';
import { Confirm } from 'ui-component/Confirm';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useNavigate } from 'react-router-dom';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

const ListingBuilder = () => {
    const [delAnchorEl, setDelAnchorEl] = React.useState<null | HTMLElement>(null);
    const delOpen = Boolean(delAnchorEl);
    const [settingOpen, setSettingOpen] = React.useState(false);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [tab, setTab] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const { country, setCountry, uid, version, list } = useListing();
    const navigate = useNavigate();

    const onClick: MenuProps['onClick'] = ({ key }) => {
        setCountry({
            key,
            icon: COUNTRY_LIST?.[key]?.icon,
            label: COUNTRY_LIST?.[key]?.label
        });
    };

    const handleDel = async () => {
        const res = await delListing([version]);
        if (res) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '操作成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
            navigate('/chatMarket');
        }
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
            endpoint: country.key,
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
                title={list?.[0]?.value || 'Listing草稿'}
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
                        {/* <Button startIcon={<CloudUploadIcon />} color="secondary" size="small" variant="contained" className="ml-2">
                            同步到亚马逊
                        </Button> */}
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
                                disabled={!uid}
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
            {isMobile ? (
                <>
                    <Tabs
                        value={tab}
                        onChange={(e, v) => {
                            setTab(v);
                        }}
                        aria-label="basic tabs example"
                    >
                        <Tab label="新增" {...a11yProps(0)} />
                        <Tab label="导入" {...a11yProps(1)} />
                    </Tabs>
                    <TabPanel value={tab} index={0}>
                        <div className="w-[450px] h-screen">
                            <KeyWord />
                        </div>
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <div className="flex-1 h-full ml-2">
                            <Content />
                        </div>
                    </TabPanel>
                </>
            ) : (
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
            )}
            <SettingModal
                open={settingOpen}
                handleClose={() => {
                    setSettingOpen(false);
                }}
            />
            <Confirm
                open={open}
                handleClose={() => {
                    setOpen(false);
                }}
                handleOk={handleDel}
            />
        </Card>
    );
};

export default ListingBuilder;
