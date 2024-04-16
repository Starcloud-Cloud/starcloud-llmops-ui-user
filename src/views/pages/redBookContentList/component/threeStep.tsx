import { Avatar, Card, CollapseProps, Divider, Space, Button, Spin, Input, UploadProps, Upload, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
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

export const ThreeStep = ({ data, show }: { data: any; show?: boolean }) => {
    const [title, setTitle] = React.useState<string>('');
    const [text, setText] = React.useState<string>('');
    // const [images, setImages] = React.useState<any[]>([]);
    const [swiperRef, setSwiperRef] = React.useState<any>(null);
    const [imageList, setImageList] = React.useState([]);

    const [editType, setEditType] = React.useState(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = React.useState(false);
    const [previewImage, setPreviewImage] = React.useState('');
    const [claim, setClaim] = React.useState(true);

    const handleModify = async () => {
        setLoading(true);
        try {
            const res = await modify({
                planUid: data.planUid,
                businessUid: data.businessUid,
                copyWritingTitle: title,
                copyWritingContent: text,
                pictureContent: imageList.map((item: any, index) => ({
                    index: index + 1,
                    url: item.url,
                    isMain: index === 0
                }))
            });
            setEditType(false);
            setLoading(false);
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
        return;
        const res = await retryContent(data.businessUid);
        if (res) {
            setText(res.copyWritingContent);
            setTitle(res.copyWritingTitle);

            const imgs = res?.pictureContent.map((item: any) => ({
                uid: item.index,
                status: 'done',
                name: item.url,
                url: item.url,
                isMain: item.isMain
            }));
            setImageList(imgs);
        }
    };

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

    return (
        <div className="h-full">
            <Card
                className="h-full"
                title="小红书生成"
                bodyStyle={{
                    height: 'calc(100% - 30px)',
                    overflow: 'hidden'
                }}
                extra={
                    !show && (
                        <>
                            <Button onClick={doRetry}>重新生成</Button>
                            <Divider type="vertical" />
                            {!editType ? (
                                <Button type="primary" onClick={() => setEditType(true)} disabled={claim}>
                                    编辑
                                </Button>
                            ) : (
                                <Button type="primary" onClick={handleModify}>
                                    保存
                                </Button>
                            )}
                        </>
                    )
                }
            >
                <div className="w-full grid grid-cols-3 h-full">
                    <div className="col-span-2 relative h-full overflow-hidden">
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
                    <div className="col-span-1 h-full overflow-auto">
                        {
                            <div className="w-full h-full p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Avatar />

                                        <span className="text-[rgba(51,51,51,0.8)] text-base ml-2">不沾果酱</span>
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
                                    <CopyToClipboard
                                        text={title}
                                        onCopy={() =>
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
                                            )
                                        }
                                    >
                                        <Tooltip title="点击复制">
                                            <div className="font-semibold text-lg mb-2 mt-8 whitespace-pre-wrap cursor-pointer select-none">
                                                {title}
                                            </div>
                                        </Tooltip>
                                    </CopyToClipboard>
                                )}
                                <Divider />
                                <div className="max-h-[calc(100%-150px)] ">
                                    {editType ? (
                                        <Input.TextArea
                                            onChange={(e) => setText(e.target.value)}
                                            className="text-base mb-2 whitespace-pre-wrap"
                                            value={text}
                                            rows={16}
                                        />
                                    ) : (
                                        <CopyToClipboard
                                            text={text}
                                            onCopy={() =>
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
                                                )
                                            }
                                        >
                                            <Tooltip title="点击复制">
                                                <div className="text-base mb-2 whitespace-pre-wrap cursor-pointer select-none">{text}</div>
                                            </Tooltip>
                                        </CopyToClipboard>
                                    )}
                                    <div className="flex gap-4 flex-wrap text-lg">
                                        {data?.executeResult?.copyWriting?.tagList?.map((item: string) => (
                                            <span key={item} className="text-[#13386c] cursor-pointer">
                                                #{item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </Card>

            <Modal style={{ zIndex: 8000 }} open={previewOpen} title={'预览'} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            <Modal style={{ zIndex: 9999 }} open={open} title={'重新生成'} footer={null} onCancel={() => setOpen(false)}>
                <Left
                    detailShow={false}
                    data={data}
                    newSave={(data: any) => {
                        console.log(data);
                    }}
                    setPlanUid={(uid: any) => {
                        console.log(uid);
                    }}
                />
            </Modal>
        </div>
    );
};
