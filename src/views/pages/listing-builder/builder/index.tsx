import { Button, Card, CardHeader, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography, Tabs, Tab, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import KeyWord from './components/Keyword';
import Content from './components/Content';
import { Affix, Dropdown, MenuProps, Spin } from 'antd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { useEffect, useRef } from 'react';
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
import { dispatch, useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useNavigate } from 'react-router-dom';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import axios from 'axios';
import { config } from 'utils/axios/config';
import { getAccessToken } from 'utils/auth';
import { DEFAULT_LIST } from 'views/pages/listing-builder/data';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { openDrawer } from 'store/slices/menu';
import imgLoading from 'assets/images/picture/loading.gif';

const { base_url } = config;

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
    const [isLoading, setIsLoading] = React.useState(true);

    const {
        country,
        setCountry,
        uid,
        version,
        list,
        detail,
        setVersion,
        setUid,
        setList,
        setEnableAi,
        setKeywordHighlight,
        setDetail,
        setItemScore,
        setUpdate,
        listingParam,
        setListingParam,
        enableAi,
        listingBuildType,
        asin,
        setAsin
    } = useListing();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(openDrawer(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => {
            dispatch(openDrawer(true));
        };
    }, []);

    const onClick: MenuProps['onClick'] = ({ key }) => {
        const current = COUNTRY_LIST.find((item: any) => item.key === key);
        setCountry({
            key,
            icon: current?.icon,
            label: current?.label
        });
    };

    useEffect(() => {
        return () => {
            setCountry({
                key: COUNTRY_LIST?.['0']?.key,
                icon: COUNTRY_LIST?.['0']?.icon,
                label: COUNTRY_LIST?.['0']?.label
            });
        };
    }, []);

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
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    close: false
                })
            );
            navigate('/listingBuilderPage');
        }
    };

    useEffect(() => {
        return () => {
            setUid('');
            setVersion(1);
            setList(DEFAULT_LIST);
            setEnableAi(true);
            setKeywordHighlight([]);
            setDetail(null);
            setItemScore({});
            setAsin('');
            setListingParam({});
        };
    }, []);

    const doExport = async () => {
        await axios({
            url: `${base_url}/listing/draft/export`,
            method: 'post',
            data: [detail?.id],
            responseType: 'blob', // 将响应数据视为二进制数据流
            headers: {
                Authorization: 'Bearer ' + getAccessToken()
            }
        })
            .then((response) => {
                // 创建一个blob对象
                const blob = new Blob([response.data], { type: response.headers['content-type'] });

                // 创建一个a标签用于下载
                const downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(blob);
                downloadLink.setAttribute('download', `listing-${new Date().getTime()}.xls`); // 设置下载文件的名称
                document.body.appendChild(downloadLink);

                // 触发点击事件以开始下载
                downloadLink.click();

                // 移除下载链接
                document.body.removeChild(downloadLink);
            })
            .catch((error) => {
                console.error('下载文件时发生错误:', error);
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
            endpoint: country.key,
            draftConfig: {
                ...detail?.draftConfig,
                enableAi,
                fiveDescNum: list.filter((item) => item.type === ListingBuilderEnum.FIVE_DES)?.length,
                aiConfigDTO: listingParam
            },
            title: list.find((item) => item.type === ListingBuilderEnum.TITLE)?.value,
            productDesc: list.find((item) => item.type === ListingBuilderEnum.PRODUCT_DES)?.value,
            searchTerm: list.find((item) => item.type === ListingBuilderEnum.SEARCH_WORD)?.value,
            fiveDesc: result,
            type: listingBuildType,
            asin
        };
        const res = await saveListing(data);
        if (res) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '保存草稿成功',
                    variant: 'alert',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
            if (listingBuildType === 1) {
                navigate(`/listingBuilder?uid=${res.uid}&version=${res.version}`);
            } else {
                navigate(`/listingBuilderOptimize?uid=${res.uid}&version=${res.version}`);
            }
            setVersion(res.version);
            setUid(res.uid);
            setUpdate({});
        }
    };
    function ContentMain() {
        return (
            <Card>
                <CardHeader
                    sx={{ padding: 2 }}
                    title={
                        <div className="flex justify-between items-center ">
                            <Tooltip title={list?.[0]?.value || 'Listing草稿'}>
                                <div className="cursor-pointer xs:flex-wrap xs:w-full">{list?.[0]?.value || 'Listing草稿'}</div>
                            </Tooltip>
                            <div className="flex items-center">
                                <div className="w-[130px] flex items-center">
                                    <Tooltip title={'删除关键词后可重新选择'} placement="top" arrow>
                                        <HelpOutlineIcon className="text-sm mr-1 cursor-pointer" />
                                    </Tooltip>
                                    <Dropdown
                                        disabled={detail?.keywordResume?.length > 0}
                                        menu={{ items: COUNTRY_LIST, onClick }}
                                        open={dropdownOpen}
                                        onOpenChange={setDropdownOpen}
                                        arrow
                                        placement={'top'}
                                    >
                                        <div onClick={(e) => e.preventDefault()} className="cursor-pointer flex items-center font-normal">
                                            {country.icon}
                                            <span className="ml-1 text-sm color-[#606266]">{country.label}</span>
                                            {!detail?.keywordResume?.length && (dropdownOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                                        </div>
                                    </Dropdown>
                                </div>
                                <Button
                                    startIcon={<SaveIcon />}
                                    color="secondary"
                                    size="small"
                                    style={{
                                        width: '100px'
                                    }}
                                    variant="contained"
                                    onClick={() => handleSave()}
                                >
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
                                            setOpen(true);
                                        }}
                                    >
                                        <ListItemIcon>
                                            <DeleteIcon />
                                        </ListItemIcon>
                                        <Typography variant="inherit" noWrap>
                                            删除
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem
                                        disabled={!uid}
                                        onClick={() => {
                                            setDelAnchorEl(null);
                                            doExport();
                                        }}
                                    >
                                        <ListItemIcon>
                                            <CloudDownloadIcon />
                                        </ListItemIcon>
                                        <Typography variant="inherit" noWrap>
                                            导出
                                        </Typography>
                                    </MenuItem>
                                </Menu>
                            </div>
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
                            <div className="w-full h-screen">
                                <KeyWord setIsLoading={setIsLoading} />
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
                            <div className="w-[400px] h-screen">
                                <KeyWord setIsLoading={setIsLoading} />
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
    }
    return isLoading ? (
        <Spin tip="数据分析中..." size={'large'} spinning={isLoading} indicator={<img width={60} src={imgLoading} />}>
            {ContentMain()}
        </Spin>
    ) : (
        ContentMain()
    );
};

export default ListingBuilder;
