import {
    Button,
    CardActions,
    CardContent,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    Modal,
    Tab,
    Tabs,
    TextField
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { TabPanel } from 'views/template/myChat/createChat';
import { addKey, getListingDict, importDict, saveListing } from 'api/listing/build';
import { useListing } from 'contexts/ListingContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Drawer } from 'antd';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ListingBuilderEnum } from 'utils/enums/listingBuilderEnums';

type IAddKeywordModalProps = {
    open: boolean;
    handleClose: () => void;
};

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

/**
 * 添加导入关键词弹窗
 */
export const AddKeywordModal = ({ open, handleClose }: IAddKeywordModalProps) => {
    const [tab, setTab] = useState(0);
    const [keyWord, setKeyWord] = useState<string>('');
    const [dictList, setDictList] = useState([]);
    const [checked, setChecked] = useState<any[]>([]);
    const { uid, setVersion, setUid, country, version, setUpdate, detail, list, listingParam, enableAi, listingBuildType } = useListing();
    const navigate = useNavigate();

    // 添加关键词
    const handleOk = async () => {
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
                enableAi,
                fiveDescNum: list.filter((item) => item.type === ListingBuilderEnum.FIVE_DES)?.length,
                aiConfigDTO: listingParam
            },
            title: list.find((item) => item.type === ListingBuilderEnum.TITLE)?.value,
            productDesc: list.find((item) => item.type === ListingBuilderEnum.PRODUCT_DES)?.value,
            searchTerm: list.find((item) => item.type === ListingBuilderEnum.SEARCH_WORD)?.value,
            fiveDesc: result,
            type: listingBuildType
        };

        if (tab === 0) {
            const lines = keyWord.split('\n');
            if (uid) {
                // 如果站点一样就就新增
                if (detail.endpoint === country.key) {
                    // const res = await addKey({ uid, version, addKey: lines });
                    // if (res) {
                    //     handleClose();
                    //     setUpdate({ type: 1 });
                    // }
                    const res = await saveListing({ ...data, keys: lines });
                    if (res) {
                        if (listingBuildType === 1) {
                            navigate(`/listingBuilder?uid=${res.uid}&version=${res.version}`);
                        } else {
                            navigate(`/listingBuilderOptimize?uid=${res.uid}&version=${res.version}`);
                        }
                        setVersion(res.version);
                        setUid(res.uid);
                        handleClose();
                        setUpdate({});
                    }
                } else {
                    // 修改了站点所属
                    const res = await saveListing({ ...data, keys: lines });
                    if (res) {
                        if (listingBuildType === 1) {
                            navigate(`/listingBuilder?uid=${res.uid}&version=${res.version}`);
                        } else {
                            navigate(`/listingBuilderOptimize?uid=${res.uid}&version=${res.version}`);
                        }
                        setVersion(res.version);
                        setUid(res.uid);
                        handleClose();
                        setUpdate({});
                    }
                }
            } else {
                const res = await saveListing({ ...data, keys: lines });
                if (listingBuildType === 1) {
                    navigate(`/listingBuilder?uid=${res.uid}&version=${res.version}`);
                } else {
                    navigate(`/listingBuilderOptimize?uid=${res.uid}&version=${res.version}`);
                }
                setVersion(res.version);
                setUid(res.uid);
                handleClose();
                // 路由变了 会自动请求详情接口，不用手动触发
            }
        } else {
            const res = await importDict({
                ...data,
                dictUid: checked
            });
            if (res) {
                if (res) {
                    setVersion(res.version);
                    setUid(res.uid);
                    handleClose();
                    if (uid) {
                        // 更新
                        setUpdate({});
                    }
                    if (listingBuildType === 1) {
                        navigate(`/listingBuilder?uid=${res.uid}&version=${res.version}`);
                    } else {
                        navigate(`/listingBuilderOptimize?uid=${res.uid}&version=${res.version}`);
                    }
                }
            }
        }
    };

    useEffect(() => {
        // TODO 条数
        getListingDict({ pageNo: 1, pageSize: 100, endpoint: country.key }).then((res) => {
            setDictList(res.list);
        });
    }, [country]);

    const handleChange = (e: any) => {
        const copyChecked = [...checked];
        const index = checked.findIndex((item) => item === e.target.value);
        if (index > -1) {
            copyChecked.splice(index, 1);
        } else {
            copyChecked.push(e.target.value);
        }
        setChecked(copyChecked);
    };

    return (
        <Drawer
            placement="left"
            closable={false}
            onClose={handleClose}
            open={open}
            getContainer={false}
            bodyStyle={{ padding: '0 4px' }}
            maskClosable={false}
        >
            <div className="absolute right-1 top-1 z-10">
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon className="cursor-pointer" />
                </IconButton>
            </div>
            <CardContent
                sx={{
                    p: 1
                }}
            >
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
                    <div className="h-[390px]">
                        <TextField
                            multiline
                            rows={11}
                            label={'关键词'}
                            InputLabelProps={{ shrink: true }}
                            placeholder={`请输入关键词，一行一个词组
最多2000个关键词
超过则系统自动截取前2000`}
                            className="w-full"
                            onChange={(e) => {
                                const value = e.target.value;
                                const trimmedText = value.replace(/^[^\S\r\n]+|[^\S\r\n]+$/gm, '');

                                const formattedText = trimmedText.replace(/\s+/g, ' ');
                                console.log('🚀 ~ file: index.tsx:212 ~ AddKeywordModal ~ formattedText:', formattedText);

                                setKeyWord(formattedText);
                            }}
                        />
                    </div>
                    <div className="flex items-center mt-4">
                        <HelpOutlineIcon className="text-base mr-1 text-[#999]" />
                        <span className="text-[#999]">
                            不知道关键词如何来？可使用<a href="/termSearch">拓展流量词</a>
                        </span>
                    </div>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <div className="h-[390px] overflow-y-auto">
                        <div className="text-base font-semibold">选择词库</div>
                        {dictList.length > 0 ? (
                            dictList.map((item: any, index) => (
                                <FormGroup key={index}>
                                    <FormControlLabel
                                        control={<Checkbox value={item.uid} onChange={(e) => handleChange(e)} />}
                                        label={
                                            <div className="flex items-center">
                                                {country.icon}
                                                <span className="pl-1">{`${item.name}(${item.count})`} </span>
                                            </div>
                                        }
                                    />
                                </FormGroup>
                            ))
                        ) : (
                            <div className="flex items-center mt-4">
                                <HelpOutlineIcon className="text-base mr-1 s text-[#999]" />
                                <span className="text-[#999]"> 还没有关键词词库？ 创建关键词词库，方便维护自己的关键词</span>
                            </div>
                        )}
                    </div>
                </TabPanel>
            </CardContent>
            <Divider />
            <CardActions>
                <Grid container justifyContent="flex-end">
                    <Button variant="contained" type="button" color="secondary" onClick={handleOk}>
                        确认
                    </Button>
                </Grid>
            </CardActions>
        </Drawer>
    );
};
