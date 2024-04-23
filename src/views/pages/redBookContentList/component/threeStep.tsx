import React, { useEffect, useState, useRef, memo } from 'react';
import {
    Avatar,
    Card,
    CollapseProps,
    Divider,
    Space,
    Button,
    Spin,
    Input,
    UploadProps,
    Upload,
    Modal,
    Select,
    Drawer,
    Progress,
    Popover
} from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './threeStep.css';
import 'swiper/css/pagination';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { retryContent, modify } from '../../../../api/redBook/index';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { Pagination } from 'swiper';

import imgLoading from 'assets/images/picture/loading.gif';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Tooltip } from '@mui/material';
import { getAccessToken } from 'utils/auth';
import { PlusOutlined } from '@ant-design/icons';
import Left from '../../batchSmallRedBooks/components/newLeft';
import { useAllDetail } from 'contexts/JWTContext';
import jsCookie from 'js-cookie';
import copy from 'clipboard-copy';

const ThreeStep = ({
    data,
    show,
    pre,
    dataStatus,
    setSataStatus,
    setPre
}: {
    data: any;
    show?: boolean;
    pre: number;
    dataStatus: boolean;
    setSataStatus: (data: boolean) => void;
    setPre: (data: number) => void;
}) => {
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
                        isMain: index === 0
                    }))
                }
            });
            setEditType(false);
            setLoading(false);
            if (res) {
                setTags(res?.executeResult?.copyWriting?.tagList);
                setText(res?.executeResult?.copyWriting?.content);
                setTitle(res?.executeResult?.copyWriting?.title);
                setClaim(res?.claim);
                const imgs = res?.executeResult?.imageList?.map((item: any) => ({
                    uid: item.index,
                    status: 'done',
                    name: item.url,
                    url: item.url,
                    isMain: item.isMain
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
            setTitle(data?.executeResult?.copyWriting?.title);
            setClaim(data?.claim);
            // setImages(data?.pictureContent || []);
            const imgs = data?.executeResult?.imageList?.map((item: any) => ({
                uid: item.index,
                status: 'done',
                name: item.url,
                url: item.url,
                isMain: item.isMain
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
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/image/upload`,
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
                    height: 'calc(100% - 30px)'
                }}
            >
                {/* <Spin spinning={aginLoading}> */}
                <div className="w-full  h-full relative grid grid-cols-3">
                    {!show && (
                        <div
                            className="flex gap-2"
                            style={{
                                position: 'absolute',
                                right: '0',
                                top: '-67px'
                            }}
                        >
                            {/* {jsCookie.get('isClient')&&
                            <Button>加入代发布列表</Button>
                            } */}
                            <Button onClick={doRetry}>重新生成</Button>
                            {!editType ? (
                                <Button type="primary" onClick={() => setEditType(true)} disabled={claim}>
                                    编辑
                                </Button>
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
                    )}
                    <div className="relative h-full overflow-hidden col-span-2">
                        {imageList?.length > 0 &&
                            (editType ? (
                                <Upload {...props}>
                                    <div className=" w-[100px] h-[100px] border border-dashed border-[#d9d9d9] rounded-[5px] bg-[#000]/[0.02] flex justify-center items-center flex-col cursor-pointer">
                                        <PlusOutlined rev={undefined} />
                                        <div style={{ marginTop: 8 }}>上传</div>
                                    </div>
                                </Upload>
                            ) : (
                                <>
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
                                    <div className="h-full">
                                        {imageList.length > 0 && (
                                            <Swiper
                                                onSwiper={(swiper) => setSwiperRef(swiper)}
                                                slidesPerView={1}
                                                spaceBetween={30}
                                                centeredSlides={false}
                                                loop
                                                pagination={{ clickable: true }}
                                                modules={[Pagination]}
                                                className="mySwiper h-full"
                                                autoplay={{
                                                    delay: 2500,
                                                    disableOnInteraction: false
                                                }}
                                            >
                                                {imageList.map((item: any, index) => (
                                                    <SwiperSlide key={index}>
                                                        <img className="w-full h-full object-contain" src={item.url} />
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        )}
                                    </div>
                                </>
                            ))}
                    </div>
                    <div className="h-full overflow-auto col-span-1">
                        {
                            <div className="w-full h-full p-4">
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
                                        </div>
                                        <div>{title}</div>
                                    </div>
                                )}
                                <Divider />
                                <div>
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
                                </div>
                                <div className="max-h-[calc(100%-150px)] ">
                                    {editType ? (
                                        <Input.TextArea
                                            onChange={(e) => setText(e.target.value)}
                                            className="text-base mb-2 whitespace-pre-wrap"
                                            value={text}
                                            rows={16}
                                        />
                                    ) : (
                                        <div className="text-base mb-2 whitespace-pre-wrap select-none">{text}</div>
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
                        }
                    </div>
                    {aginLoading && (
                        <div className="z-[1000] absolute w-full h-full flex justify-center items-center bg-black/50">
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <Progress
                                    type="circle"
                                    percent={Math.floor((data?.progress?.currentStepIndex / data?.progress?.totalStepCount) * 100)}
                                />
                                <Popover content={'执行到第几步/总步数'}>
                                    <div className="font-[500] cursor-pointer">
                                        {data?.progress?.currentStepIndex || '-'}/{data?.progress?.totalStepCount || '-'}
                                    </div>
                                </Popover>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            <Modal style={{ zIndex: 8000 }} open={previewOpen} title={'预览'} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            <Drawer
                width={700}
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
                <div className="mt-[-24px]">
                    <Left
                        detailShow={false}
                        data={data}
                        saveLoading={saveLoading}
                        newSave={async (data: any) => {
                            setSaveLoading(true);
                            setSataStatus(false);
                            await retryContent(data);
                            setSaveLoading(false);
                            setOpen(false);
                            setAginLoading(true);
                            timer.current = setInterval(() => {
                                setPre(Math.random() + Math.random());
                            }, 2000);
                        }}
                        setPlanUid={(uid: any) => {
                            console.log(uid);
                        }}
                    />
                </div>
            </Drawer>
        </div>
    );
};
const prop = (newValue: any, oldValue: any) => {
    return JSON.stringify(newValue.data) === JSON.stringify(oldValue.data) && JSON.stringify(newValue.pre) === JSON.stringify(oldValue.pre);
};

export default memo(ThreeStep, prop);
