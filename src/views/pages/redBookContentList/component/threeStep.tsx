import React, { useEffect, useState, useRef, memo } from 'react';
import {
    Avatar,
    Card,
    Divider,
    Space,
    Button,
    Input,
    UploadProps,
    Upload,
    Modal,
    Select,
    Drawer,
    Progress,
    Popover,
    QRCode,
    Form,
    Image,
    Tooltip,
    Carousel
} from 'antd';
import { PlusOutlined, LoadingOutlined, SwapOutlined, CloudUploadOutlined, SearchOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'swiper/css';
import './threeStep.css';
import 'swiper/css/pagination';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { modify } from '../../../../api/redBook/index';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { Pagination } from 'swiper';

import { getAccessToken } from 'utils/auth';
import { useAllDetail } from 'contexts/JWTContext';
import copy from 'clipboard-copy';
import JSZip from 'jszip';
import { origin_url } from 'utils/axios/config';
import SensitiveWords from 'views/sensitiveWords/index';
import Left from '../../batchSmallRedBooks/components/newLeft';
import { retryContent } from 'api/redBook';
import { getMaterialTitle } from 'api/redBook/material';
import { EditType } from '../../../materialLibrary/detail';
import { PicImagePick } from 'ui-component/PicImagePick';
import ReTryExe from '../../batchSmallRedBooks/components/retryExe';
import VideoModal from './videoModal';
import _ from 'lodash-es';
import H5Modal from './h5Modal';

const ThreeStep = ({
    data,
    show,
    qrCodeShow,
    pre,
    isFlag,
    exeDetail,
    dataStatus,
    setSataStatus,
    setPre,
    businessUid
}: {
    data: any;
    show?: boolean;
    qrCodeShow?: boolean;
    isFlag?: boolean;
    pre: number;
    exeDetail: boolean;
    dataStatus: boolean;
    setSataStatus: (data: boolean) => void;
    setPre: (data: number) => void;
    businessUid: string;
}) => {
    const Option = Select.Option;
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const [title, setTitle] = React.useState<string>('');
    const [text, setText] = React.useState<string>('');
    const [tags, setTags] = React.useState<any>([]);
    // const [images, setImages] = React.useState<any[]>([]);
    const [swiperRef, setSwiperRef] = React.useState<any>(null);
    const [imageList, setImageList] = React.useState([]);

    const [editType, setEditType] = React.useState(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = React.useState(false);
    const [previewImage, setPreviewImage] = React.useState('');
    const [claim, setClaim] = React.useState(true);
    const all_detail = useAllDetail();

    const handleChange = (value: any) => {
        setTags(value);
    };

    const handleModify = async () => {
        setLoading(true);
        try {
            const res = await modify({
                uid: data.uid,
                executeResult: {
                    copyWriting: { content: text, tagList: tags, title },
                    imageList: imageList.map((item: any, index) => ({
                        index: index + 1,
                        url: item.url,
                        isMain: index === 0,
                        code: item.code,
                        imageUrl: item.url
                    }))
                }
            });
            setEditType(false);
            setLoading(false);
            setPre(Math.random() + Math.random());
            if (res) {
                setTags(res?.executeResult?.copyWriting?.tagList);
                setText(res?.executeResult?.copyWriting?.content);
                const newTitle = res?.executeResult?.copyWriting?.title.replace(/\n/g, ' ');
                setTitle(newTitle);
                setClaim(res?.claim);
                const imgs = res?.executeResult?.imageList?.map((item: any) => ({
                    uid: item.index,
                    status: 'done',
                    name: item.url,
                    url: item.url,
                    isMain: item.isMain,
                    code: item.code
                }));
                setImageList(imgs);
            }
            dispatch(
                openSnackbar({
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    open: true,
                    message: '操作成功',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
        } catch (e) {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data) {
            setTags(data?.executeResult?.copyWriting?.tagList);
            setText(data?.executeResult?.copyWriting?.content);
            const newTitle = data?.executeResult?.copyWriting?.title.replace(/\n/g, ' ') || '';
            setTitle(newTitle);
            setClaim(data?.claim);
            // setImages(data?.pictureContent || []);
            const imgs = data?.executeResult?.imageList?.map((item: any) => ({
                uid: item.index,
                status: 'done',
                name: item.url,
                url: item.url,
                isMain: item.isMain,
                code: item.code
            }));
            setImageList(imgs);
        }
    }, [data]);

    const doRetry = async () => {
        setOpen(true);
    };
    useEffect(() => {
        return () => {
            clearInterval(timer.current);
        };
    }, []);
    useEffect(() => {
        if (dataStatus) {
            clearInterval(timer.current);
            setAginLoading(false);
        }
    }, [dataStatus]);
    const props: UploadProps = {
        name: 'image',
        multiple: true,
        listType: 'picture-card',
        defaultFileList: imageList,
        showUploadList: {
            showPreviewIcon: false
        },
        action: `${origin_url}${process.env.REACT_APP_API_URL}/llm/image/upload`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        maxCount: 500,
        onChange(info: any) {
            const list = info.fileList.map((item: any) => {
                if (item?.response) {
                    return {
                        uid: item?.response?.data?.uuid,
                        status: 'done',
                        name: item?.response?.data?.name,
                        url: item?.response?.data?.url,
                        isMain: false
                    };
                } else {
                    return item;
                }
            });
            console.log(list?.map((item: any) => item?.url));

            setImageList(list);
        },
        onPreview: (file: any) => {
            setPreviewImage(file.url);
            setPreviewOpen(true);
        }
    };
    //重新生成
    const [open, setOpen] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [aginLoading, setAginLoading] = useState(false);
    const timer = useRef<any>(null);

    //下载图片
    const [downLoading, setDownLoading] = useState(false);
    const downLoadImage = () => {
        setDownLoading(true);
        const zip = new JSZip();
        let promises: any = [];
        let promises1: any = [];
        let promises2: any = [];
        promises = imageList.map(async (imageUrl: any, index: number) => {
            const response = await fetch(imageUrl.url);
            const arrayBuffer = await response.arrayBuffer();

            zip.file('image' + (index + 1) + `.${imageUrl?.url?.split('.')[imageUrl?.url?.split('.')?.length - 1]}`, arrayBuffer);

            zip.file(title + '.txt', text);
        });
        if (data?.executeResult?.video?.completeVideoUrl) {
            promises1 = [0]?.map(async (imageUrl: any, index: number) => {
                const response = await fetch(data?.executeResult?.video?.completeVideoUrl);
                const arrayBuffer = await response.arrayBuffer();
                zip.file(`video.mp4`, arrayBuffer);
                zip.file(title + '.txt', text);
            });
        }
        if (data?.executeResult?.video?.videoList?.length > 0) {
            promises2 = data?.executeResult?.video?.videoList?.map(async (imageUrl: any, index: number) => {
                const response = await fetch(imageUrl.videoUrl);
                const arrayBuffer = await response.arrayBuffer();
                zip.file('video' + (index + 1) + `.mp4`, arrayBuffer);
                zip.file(title + '.txt', text);
            });
        }
        Promise.all([Promise.all(promises), Promise.all(promises1), Promise.all(promises2)])
            .then(() => {
                setDownLoading(false);
                zip.generateAsync({ type: 'blob' }).then((content: any) => {
                    const url = window.URL.createObjectURL(content);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = title + '.zip'; // 设置下载的文件名
                    a.click();
                    window.URL.revokeObjectURL(url);
                });
            })
            .catch((error) => {
                setDownLoading(false);
                console.error('Error downloading images:', error);
            });
    };

    //扫码发布
    const [publishOpen, setPublishOpen] = useState(false);

    //敏感词监测
    const [wordsOpen, setWordsOpen] = useState(false);
    const [wordsValue, setWordsValue] = useState('');

    //新版重新生成 leng=1
    const [form] = Form.useForm();
    const [retryExeIsShow, setRetryExeisShow] = useState(false);
    const [columns, setColumns] = useState<any[]>([]);
    const reTryExe = async (da: string) => {
        const newData = _.cloneDeep(data);
        newData.executeParam.appInformation.workflowConfig.steps
            .find((item: any) => item?.flowStep.handler === 'MaterialActionHandler')
            .variable.variables.find((item: any) => item.field === 'MATERIAL_LIST').value = da;
        try {
            setSaveLoading(true);
            setSataStatus(false);
            await retryContent(newData);
            setRetryExeisShow(false);
            setReOpen(false);
            setSaveLoading(false);
            setOpen(false);
            setAginLoading(true);
            timer.current = setInterval(() => {
                setPre(Math.random() + Math.random());
            }, 2000);
        } catch (err) {
            setSaveLoading(false);
        }
    };
    useEffect(() => {
        if (query.get('uid')) {
            getMaterialTitle({ appUid: query.get('uid') }).then((res) => {
                setColumns(res.tableMeta);
            });
        }
    }, []);
    //上传图片单独编辑
    const [field, setField] = useState('');
    const [loadingList, setLoadingList] = useState<any[]>([]);
    const [canUpload, setCanUpload] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    //新版重新生成 leng>2
    const [reOpen, setReOpen] = useState(false);
    const [reTableData, setRetableData] = useState<any[]>([]);

    const [videoOpen, setVideoOpen] = useState(false);
    const [openVideoMode, setOpenVideoMode] = useState(false);
    const [quickConfiguration, setQuickConfiguration] = useState<any>(null);
    const [templateList, setTemplateList] = useState<any[]>([]);
    useEffect(() => {
        const newData = data?.executeParam?.appInformation?.workflowConfig?.steps
            ?.find((item: any) => item?.flowStep?.handler === 'PosterActionHandler')
            ?.variable?.variables?.find((item: any) => item?.field === 'POSTER_STYLE')?.value;

        if (newData) {
            const template = JSON.parse(newData);
            const obj: any = {};
            setOpenVideoMode(template.templateList.some((item: any) => item.openVideoMode));
            setTemplateList(template.templateList);
            template.templateList.map((item: any) => {
                if (item.quickConfiguration) {
                    const newItem = JSON.parse(item.quickConfiguration);
                    for (let key in newItem) {
                        if (newItem[key] === true && obj[key] === undefined) {
                            obj[key] = newItem[key];
                        }
                    }
                }
            });
            setQuickConfiguration(obj);
        } else {
            setQuickConfiguration({
                isRepeatEnable: false,
                isRepeatRole: false,
                isSoundEffect: false,
                isVoiceRole: false,
                isSubtitles: false
            });
        }
    }, [data]);
    useEffect(() => {
        if (
            data?.executeResult?.video?.completeVideoUrl ||
            data?.executeResult?.video?.videoList?.filter((item: any) => item.videoUrl).length > 0
        ) {
            setIsVideo(true);
        }
    }, [data]);
    const [isVideo, setIsVideo] = useState(false);
    //h5页面
    const [h5Open, setH5Open] = useState(false);

    return (
        <div
            className="h-full"
            style={{
                position: 'relative'
                // background: token.colorFillAlter,
                // border: `1px solid ${token.colorBorderSecondary}`,
                // borderRadius: token.borderRadiusLG
            }}
        >
            <Card
                className="h-full"
                // title="小红书生成"
                bodyStyle={{
                    // height: 'calc(100% - 30px)'
                    height: '100%',
                    padding: 0
                }}
            >
                {/* <Spin spinning={aginLoading}> */}
                <div className="w-full h-full relative grid grid-cols-3">
                    {qrCodeShow && (
                        <div
                            className="flex gap-2"
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '-42px'
                            }}
                        >
                            <Button
                                type="primary"
                                onClick={() => {
                                    setPublishOpen(true);
                                }}
                            >
                                扫码发布
                            </Button>
                        </div>
                    )}
                    {!show && !exeDetail && !isFlag && (
                        <div
                            className="flex gap-2 w-[calc(100%-100px)] justify-between"
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '-42px'
                            }}
                        >
                            {/* {jsCookie.get('isClient')&&
                            <Button>加入代发布列表</Button>
                            } */}
                            <div>
                                {data?.executeResult?.video && (
                                    <Button onClick={() => setIsVideo(!isVideo)} type="primary" icon={<SwapOutlined />}>
                                        图文｜视频
                                    </Button>
                                )}
                            </div>

                            <div>
                                {!editType ? (
                                    <div className="flex items-center">
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                setPublishOpen(true);
                                            }}
                                        >
                                            扫码发布
                                        </Button>
                                        <Button className="ml-2" type="primary" loading={downLoading} onClick={() => downLoadImage()}>
                                            打包下载
                                        </Button>
                                        <Divider type="vertical" />
                                        <Button
                                            onClick={() => {
                                                setWordsValue(text);
                                                setWordsOpen(true);
                                                setEditType(true);
                                            }}
                                            type="primary"
                                        >
                                            违禁词检测
                                        </Button>
                                        <Button
                                            className="mx-2"
                                            type="primary"
                                            onClick={() => {
                                                const newList = JSON.parse(
                                                    data?.executeParam?.appInformation?.workflowConfig?.steps
                                                        ?.find((item: any) => item?.flowStep?.handler === 'MaterialActionHandler')
                                                        ?.variable?.variables?.find((item: any) => item?.field === 'MATERIAL_LIST')
                                                        ?.value || '[]'
                                                );
                                                if (newList.length === 1) {
                                                    form.setFieldsValue(newList[0]);
                                                    setRetryExeisShow(true);
                                                } else {
                                                    setReOpen(true);
                                                    setRetableData(newList);
                                                }
                                            }}
                                            // onClick={doRetry}
                                        >
                                            编辑图片
                                        </Button>
                                        <Button type="primary" onClick={() => setEditType(true)} disabled={claim}>
                                            编辑笔记
                                        </Button>
                                        {openVideoMode && (
                                            <Button className="ml-2" type="primary" onClick={() => setVideoOpen(true)}>
                                                视频生成
                                            </Button>
                                        )}
                                        {isVideo && (
                                            <Button className="ml-2" type="primary" onClick={() => setH5Open(true)}>
                                                H5页面
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <Space>
                                        <Button type="primary" onClick={handleModify}>
                                            保存
                                        </Button>
                                        <Button type="default" onClick={() => setEditType(false)}>
                                            取消
                                        </Button>
                                    </Space>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="relative h-full overflow-hidden col-span-2">
                        {imageList?.length > 0 &&
                            (editType ? (
                                <Upload {...props}>
                                    <div className=" w-[100px] h-[100px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer">
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>上传</div>
                                    </div>
                                </Upload>
                            ) : (
                                <>
                                    {((isVideo &&
                                        !data?.executeResult?.video?.completeVideoUrl &&
                                        data?.executeResult?.video?.videoList?.filter((item: any) => item.videoUrl).length > 1) ||
                                        (!isVideo && imageList?.length > 1)) && (
                                        <div className="flex justify-between absolute top-[46%] w-full z-10">
                                            <Button
                                                icon={<KeyboardBackspaceIcon />}
                                                shape="circle"
                                                onClick={() => {
                                                    console.log(swiperRef, 'swiperRef');
                                                    swiperRef?.slidePrev();
                                                }}
                                            />
                                            <Button
                                                style={{ marginLeft: '10px' }}
                                                icon={<ArrowForwardIcon />}
                                                shape="circle"
                                                onClick={() => {
                                                    swiperRef?.slideNext();
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="h-full">
                                        <Swiper
                                            onSwiper={(swiper) => {
                                                setSwiperRef(swiper);
                                            }}
                                            slidesPerView={1}
                                            // spaceBetween={30}
                                            centeredSlides={false}
                                            loop
                                            pagination={{
                                                clickable: !isVideo ? true : false
                                            }}
                                            modules={[Pagination]}
                                            className="mySwiper h-full"
                                            autoplay={{
                                                delay: 2500,
                                                disableOnInteraction: false
                                            }}
                                        >
                                            {!isVideo ? (
                                                imageList?.map((item: any, index) => (
                                                    <SwiperSlide key={index}>
                                                        <img className="w-full h-full object-contain bg-[#f8f8f8]" src={item.url} />
                                                    </SwiperSlide>
                                                ))
                                            ) : data?.executeResult?.video?.completeVideoUrl ? (
                                                <SwiperSlide>
                                                    <div className="w-full h-full flex items-center">
                                                        <video
                                                            id={`player`}
                                                            src={data?.executeResult?.video?.completeVideoUrl}
                                                            controls
                                                            width={'100%'}
                                                            className="max-h-[100%] z-[1]"
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            ) : (
                                                data?.executeResult?.video?.videoList &&
                                                data?.executeResult?.video?.videoList?.filter((item: any) => item.videoUrl).length > 0 &&
                                                data?.executeResult?.video?.videoList
                                                    ?.filter((item: any) => item.videoUrl)
                                                    .map((item: any, index: number) => (
                                                        <SwiperSlide key={index}>
                                                            <div className="w-full h-full flex items-center">
                                                                <video
                                                                    id={`player-${index}`}
                                                                    src={item?.videoUrl}
                                                                    controls
                                                                    width={'100%'}
                                                                    className="max-h-[100%] z-[1]"
                                                                />
                                                            </div>
                                                        </SwiperSlide>
                                                    ))
                                            )}
                                        </Swiper>
                                    </div>
                                </>
                            ))}
                    </div>
                    <div className="h-full overflow-auto col-span-1">
                        {retryExeIsShow ? (
                            <div className="w-full h-full relative">
                                <div className="h-full !pb-[32px] overflow-y-auto p-4">
                                    <div className="text-xs text-black/50 mb-4">
                                        <span className="font-bold">Tips:</span>
                                        修改笔记所用素材后，可点击重新生成
                                    </div>
                                    <Form form={form} layout="vertical">
                                        {columns?.map((item, index) => (
                                            <Form.Item
                                                key={item.columnCode}
                                                label={item.columnName}
                                                name={item.columnCode}
                                                rules={
                                                    item?.isRequired
                                                        ? [{ required: true, message: item.columnName + '是必填项' }]
                                                        : undefined
                                                }
                                            >
                                                {item.columnType === EditType.Image ? (
                                                    <Upload
                                                        name="image"
                                                        disabled={!canUpload}
                                                        showUploadList={false}
                                                        listType="picture-card"
                                                        action={`${origin_url}${process.env.REACT_APP_API_URL}/llm/creative/plan/uploadImage`}
                                                        headers={{ Authorization: 'Bearer ' + getAccessToken() }}
                                                        onChange={(info) => {
                                                            if (info?.file?.status === 'uploading' && !loadingList[index]) {
                                                                const newList = _.cloneDeep(loadingList);
                                                                newList[index] = true;
                                                                setLoadingList(newList);
                                                                form.setFieldValue(item.columnCode, undefined);
                                                                return;
                                                            }
                                                            if (info?.file?.status === 'done') {
                                                                form.setFieldValue(item.columnCode, info?.file?.response?.data?.url);
                                                                const newList = _.cloneDeep(loadingList);
                                                                newList[index] = false;
                                                                setLoadingList(newList);
                                                            }
                                                        }}
                                                    >
                                                        <Form.Item
                                                            className="!mb-0"
                                                            shouldUpdate={(prevValues, currentValues) =>
                                                                prevValues[item.columnCode] !== currentValues[item.columnCode]
                                                            }
                                                        >
                                                            {({ getFieldValue }) => {
                                                                const firstInputValue = getFieldValue(item.columnCode);
                                                                return firstInputValue && !loadingList[index] ? (
                                                                    <div className="relative">
                                                                        <div className="relative">
                                                                            <Image
                                                                                onMouseEnter={() => setCanUpload(false)}
                                                                                onClick={(e) => e.stopPropagation()}
                                                                                width={82}
                                                                                height={82}
                                                                                // preview={false}
                                                                                src={
                                                                                    form.getFieldValue(item.columnCode) +
                                                                                    '?x-oss-process=image/resize,w_100/quality,q_80'
                                                                                }
                                                                            />
                                                                            {/* <div
                                                                            className="absolute z-[1] cursor-pointer inset-0 bg-[rgba(0, 0, 0, 0.5)] flex justify-center items-center text-white opacity-0 hover:opacity-100"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setPreviewOpen(true);
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                <EyeOutlined />
                                                                                预览
                                                                            </div>
                                                                        </div> */}
                                                                        </div>
                                                                        <div className="bottom-0 z-[1] absolute w-full h-[20px] hover:bg-black/30 flex justify-center items-center bg-[rgba(0,0,0,.4)]">
                                                                            <Tooltip title="上传">
                                                                                <div
                                                                                    className="flex-1 flex justify-center"
                                                                                    onMouseEnter={() => setCanUpload(true)}
                                                                                    onMouseLeave={() => setCanUpload(false)}
                                                                                >
                                                                                    <CloudUploadOutlined className="text-white/60 hover:text-white" />
                                                                                </div>
                                                                            </Tooltip>
                                                                            <Tooltip title="搜索">
                                                                                <div
                                                                                    className="flex-1 flex justify-center !cursor-pointer"
                                                                                    onClick={(e) => {
                                                                                        setField(item.columnCode);
                                                                                        setIsModalOpen(true);
                                                                                        e.stopPropagation();
                                                                                    }}
                                                                                >
                                                                                    <SearchOutlined className="text-white/60 hover:text-white" />
                                                                                </div>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        className=" w-[80px] h-[80px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer relative"
                                                                        onMouseEnter={() => setCanUpload(true)}
                                                                    >
                                                                        {!loadingList[index] ? <PlusOutlined /> : <LoadingOutlined />}
                                                                        <div style={{ marginTop: 8 }}>Upload</div>
                                                                        <Tooltip title="搜索">
                                                                            <div
                                                                                className="bottom-0 z-[1] absolute w-full h-[20px] hover:bg-black/30 flex justify-center items-center bg-[rgba(0,0,0,.5)]"
                                                                                onClick={(e) => {
                                                                                    setField(item.columnCode);
                                                                                    setIsModalOpen(true);
                                                                                    e.stopPropagation();
                                                                                }}
                                                                            >
                                                                                <SearchOutlined className="text-white/80 hover:text-white" />
                                                                            </div>
                                                                        </Tooltip>
                                                                    </div>
                                                                );
                                                            }}
                                                        </Form.Item>
                                                    </Upload>
                                                ) : (
                                                    <Input.TextArea autoSize={{ minRows: 3, maxRows: 8 }} />
                                                )}
                                            </Form.Item>
                                        ))}
                                    </Form>
                                </div>
                                <div className="z-[1] w-full px-4 absolute bottom-0 left-0 ">
                                    <Button
                                        loading={saveLoading}
                                        onClick={async () => {
                                            const result = await form.validateFields();
                                            reTryExe(JSON.stringify([result]));
                                        }}
                                        className="w-full"
                                        type="primary"
                                    >
                                        重新生成
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full p-4 !pl-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Avatar />
                                        <span className="text-[rgba(51,51,51,0.8)] text-base ml-2"> {all_detail?.allDetail?.nickname}</span>
                                    </div>
                                    <div
                                        className="bg-[#ff2e4d] text-white text-base w-[96px] font-semibold px-6 h-[40px] cursor-pointer rounded-2xl text-center"
                                        style={{ lineHeight: '40px' }}
                                    >
                                        关注
                                    </div>
                                </div>
                                {editType ? (
                                    <Input
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="font-semibold text-lg mb-2 mt-8 whitespace-pre-wrap"
                                        value={title}
                                    />
                                ) : (
                                    <div className="font-semibold text-lg mb-2 mt-8 whitespace-pre-wrap select-none">
                                        <div>
                                            {!exeDetail && (
                                                <Space>
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        onClick={() => {
                                                            copy(title);
                                                            dispatch(
                                                                openSnackbar({
                                                                    open: true,
                                                                    message: '复制成功',
                                                                    variant: 'alert',
                                                                    alert: {
                                                                        color: 'success'
                                                                    },
                                                                    close: false,
                                                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                                    transition: 'SlideLeft'
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        复制标题
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        onClick={() => {
                                                            copy(`${title}${text}${tags}`);
                                                            dispatch(
                                                                openSnackbar({
                                                                    open: true,
                                                                    message: '复制成功',
                                                                    variant: 'alert',
                                                                    alert: {
                                                                        color: 'success'
                                                                    },
                                                                    close: false,
                                                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                                    transition: 'SlideLeft'
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        复制全部
                                                    </Button>
                                                </Space>
                                            )}
                                        </div>
                                        <div>{title}</div>
                                    </div>
                                )}
                                <Divider style={{ margin: '2px 0' }} />
                                <div className="max-h-[calc(100%-150px)] mt-2">
                                    {editType ? (
                                        <>
                                            <div className="flex justify-end mb-2">
                                                <Button
                                                    onClick={() => {
                                                        setWordsValue(text);
                                                        setWordsOpen(true);
                                                    }}
                                                    type="primary"
                                                    size="small"
                                                >
                                                    违禁词检测
                                                </Button>
                                            </div>
                                            <Input.TextArea
                                                onChange={(e) => setText(e.target.value)}
                                                className="text-base mb-2 whitespace-pre-wrap"
                                                value={text}
                                                rows={16}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            {!exeDetail && (
                                                <Space>
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        onClick={() => {
                                                            copy(text);
                                                            dispatch(
                                                                openSnackbar({
                                                                    open: true,
                                                                    message: '复制成功',
                                                                    variant: 'alert',
                                                                    alert: {
                                                                        color: 'success'
                                                                    },
                                                                    close: false,
                                                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                                    transition: 'SlideLeft'
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        复制内容
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        onClick={() => {
                                                            copy(`${tags}`);
                                                            dispatch(
                                                                openSnackbar({
                                                                    open: true,
                                                                    message: '复制成功',
                                                                    variant: 'alert',
                                                                    alert: {
                                                                        color: 'success'
                                                                    },
                                                                    close: false,
                                                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                                    transition: 'SlideLeft'
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        复制标签
                                                    </Button>
                                                </Space>
                                            )}
                                            <div className="text-base mb-2 whitespace-pre-wrap select-none">{text}</div>
                                        </>
                                    )}
                                    {editType ? (
                                        <div className="flex gap-4 flex-wrap text-lg">
                                            {/* {data?.executeResult?.copyWriting?.tagList?.map((item: string) => (
                                                <span key={item} className="text-[#13386c] cursor-pointer">
                                                    #{item}
                                                </span>
                                            ))} */}
                                            <Select
                                                mode="tags"
                                                style={{ width: '100%' }}
                                                placeholder="标签"
                                                value={tags}
                                                onChange={handleChange}
                                                options={[]}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex gap-4 flex-wrap text-lg">
                                            {tags?.map((item: string) => (
                                                <span key={item} className="text-[#13386c]">
                                                    #{item}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    {aginLoading && (
                        <div className="z-[1000] absolute w-full h-full flex justify-center items-center bg-black/50">
                            <div className="flex flex-col gap-2 justify-center items-center bg-white w-[200px] h-[200px] rounded-lg">
                                <>
                                    <Progress
                                        type="circle"
                                        percent={Math.floor((data?.progress?.successStepCount / data?.progress?.totalStepCount) * 100)}
                                    />
                                    {data?.progress && (
                                        <Popover content={'执行到第几步/总步数'}>
                                            <div className="font-[500] cursor-pointer">
                                                {data?.progress?.successStepCount || '-'}/{data?.progress?.totalStepCount || '-'}
                                            </div>
                                        </Popover>
                                    )}
                                </>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
            <Modal style={{ zIndex: 8000 }} open={previewOpen} title={'预览'} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            <Modal open={publishOpen} title={'小红书发布'} footer={null} onCancel={() => setPublishOpen(false)} closable={false}>
                <div className="w-full flex justify-center items-center flex-col gap-2">
                    <QRCode
                        value={
                            isVideo
                                ? `${process.env.REACT_APP_SHARE_URL}/shareVideo?uid=${data?.uid}&type=video`
                                : `${process.env.REACT_APP_SHARE_URL}/share?uid=${data?.uid}&type=image}`
                        }
                    />
                    <div className="flex flex-col items-center">
                        <div
                            onClick={() => {
                                if (isVideo) {
                                    window.open(`${process.env.REACT_APP_SHARE_URL}/shareVideo?uid=${data?.uid}&type=video`);
                                } else {
                                    window.open(`${process.env.REACT_APP_SHARE_URL}/share?uid=${data?.uid}&type=$image`);
                                }
                            }}
                            className="text-md underline cursor-pointer text-[#673ab7]"
                        >
                            查看效果
                        </div>
                        <div className="text-md text-[#000000a6]">安卓：仅支持手机浏览器扫码</div>
                        <div className="text-md text-[#000000a6]">苹果：支持微信/手机浏览器扫码</div>
                        <div className="text-md text-[#000000a6]">注意：小红书需更新到最新版本</div>
                    </div>
                </div>
            </Modal>
            <Modal width={'80%'} open={wordsOpen} title={'违禁词检测'} footer={null} onCancel={() => setWordsOpen(false)}>
                <SensitiveWords
                    wordsOpen={wordsOpen}
                    wordsValues={wordsValue}
                    updateNote={(data) => {
                        setText(data);
                        setWordsOpen(false);
                    }}
                />
            </Modal>
            <Drawer
                width={500}
                // style={{ zIndex: 9999 }}
                style={{ transform: 'none !important' }}
                rootStyle={{
                    transform: 'none !important'
                }}
                open={open}
                title={'重新生成'}
                footer={null}
                getContainer={false}
                onClose={() => setOpen(false)}
            >
                <div className="mt-[-24px] h-[calc(100%+24px)]">
                    <Left
                        detailShow={false}
                        data={data}
                        saveLoading={saveLoading}
                        newSave={async (data: any) => {
                            try {
                                setSaveLoading(true);
                                setSataStatus(false);
                                await retryContent(data);
                                setSaveLoading(false);
                                setOpen(false);
                                setAginLoading(true);
                                timer.current = setInterval(() => {
                                    setPre(Math.random() + Math.random());
                                }, 2000);
                            } catch (err) {
                                setSaveLoading(false);
                            }
                        }}
                        setPlanUid={(uid: any) => {
                            console.log(uid);
                        }}
                    />
                </div>
            </Drawer>
            <Modal
                zIndex={1000}
                width={'60%'}
                title={
                    <div className="flex items-end gap-2">
                        <div>重新生成</div>
                        <div className="text-xs text-black/50 font-[400]">修改笔记所用素材后，可点击重新生成</div>
                    </div>
                }
                open={reOpen}
                onCancel={() => setReOpen(false)}
                footer={
                    <div className="flex justify-end">
                        <Button
                            loading={saveLoading}
                            type="primary"
                            onClick={() => {
                                reTryExe(JSON.stringify(reTableData));
                            }}
                        >
                            重新生成
                        </Button>
                    </div>
                }
            >
                <ReTryExe
                    tableData={reTableData}
                    formOk={(data, index) => {
                        const newList = _.cloneDeep(reTableData);
                        newList[index] = data;
                        setRetableData(newList);
                    }}
                />
            </Modal>
            <VideoModal
                videoOpen={videoOpen}
                setVideoOpen={setVideoOpen}
                businessUid={businessUid}
                title={data?.executeResult?.copyWriting?.title}
                quickConfiguration={quickConfiguration}
                quickValue={data?.executeParam?.quickConfiguration ? JSON.parse(data?.executeParam?.quickConfiguration) : null}
                templateList={templateList}
                imageList={data?.executeResult?.imageList}
                video={data?.executeResult?.video}
                getDetail={() => {
                    setPre(Math.random() + Math.random());
                }}
            />
            {isModalOpen && (
                <PicImagePick
                    isrery={true}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    setSelectImg={(data) => {
                        form.setFieldValue(field, data?.largeImageURL);
                    }}
                    columns={columns}
                />
            )}
            <H5Modal
                open={h5Open}
                setOpen={setH5Open}
                uid={businessUid}
                title={data?.executeResult?.copyWriting?.title}
                columns={columns}
            />
        </div>
    );
};
const prop = (newValue: any, oldValue: any) => {
    return JSON.stringify(newValue.data) === JSON.stringify(oldValue.data) && JSON.stringify(newValue.pre) === JSON.stringify(oldValue.pre);
};

export default memo(ThreeStep, prop);
