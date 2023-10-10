import { Card, Modal, IconButton, Button, Divider, CardContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import HistoryIcon from '@mui/icons-material/History';
import MainCard from 'ui-component/cards/MainCard';
import { Upload, Image, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { UploadProps } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from 'utils/auth';
import imgLoading from 'assets/images/picture/loading.gif';
import _ from 'lodash-es';
import JSZip from 'jszip';
import SubCard from 'ui-component/cards/SubCard';
import ImageHistory from '../../components/imageHistory';
import ImageDetail from '../../components/detail';
import { upscale } from 'api/picture/images';
import downLoadImages from 'hooks/useDownLoadImage';
const EditBackgroundImage = ({ subTitle }: { subTitle: string }) => {
    const navigate = useNavigate();
    //上传图片
    const [imageList, setImageList] = useState<any[]>([]);
    //抠图完成的图片
    const [sucImageList, setSucImageList] = useState<any[]>([]);
    const suRef = useRef<any[]>([]);
    const [open, setOpen] = useState(false);
    //图片详情
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState<any>({});
    //上传图片
    const { Dragger } = Upload;
    const imageprops: UploadProps = {
        name: 'image',
        showUploadList: false,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/image/upload`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        multiple: true,
        maxCount: 20,
        accept: '.png, .jpg, .webp',
        onChange(info) {
            console.log(info);
            if (info.file.status === 'uploading') {
                if (!open) {
                    setMagnification(2);
                    setOpen(true);
                }
                const newValue = _.cloneDeep(imageList);
                if (newValue.every((value) => value.uid !== info.file.uid)) {
                    newValue.push(info.file);
                    setImageList(newValue);
                }
            } else if (info.file.status === 'done') {
                const newValue = _.cloneDeep(imageList);
                newValue.forEach((value, index) => {
                    if (value.uid === info.file.uid) {
                        newValue.splice(index, 1, info.file);
                        setImageList(newValue);
                    }
                });
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    //放大倍数
    const [magnification, setMagnification] = useState(2);
    //判断放大倍数禁用
    const [diskey, setDiskey] = useState(0);
    const disMagn = (num: number) => {
        return imageList.some((item: any) => item?.response?.data?.width * num * item?.response?.data?.height * num > 4194304);
    };
    useEffect(() => {
        setDiskey(diskey + 1);
    }, [imageList]);
    const handleSave = async () => {
        const sucIndex = suRef.current.length;
        suRef.current.push(...imageList);
        setOpen(false);
        setSucImageList(suRef.current);
        for (let index = 0; index < imageList.length; index++) {
            if (imageList[index].response?.data?.url) {
                showFn(imageList[index], index + sucIndex);
            }
        }
    };
    const showFn = async (item: any, index: number) => {
        const res = await upscale({
            scene: 'IMAGE_UPSCALING',
            appUid: 'UPSCALING_IMAGE',
            imageRequest: {
                initImage: item.response?.data?.url,
                magnification: subTitle === '图片无损放大' ? magnification : 1
            }
        });
        suRef.current.splice(index, 1, res.response);
        setSucImageList(_.cloneDeep(suRef.current));
    };
    useEffect(() => {
        if (!open) {
            setImageList([]);
        }
    }, [open]);
    //批量下载图片
    const batchDownload = () => {
        console.log(sucImageList);
        const zip = new JSZip();
        const imageUrls = sucImageList.map((item) => item.images[0].url);
        // 异步加载图片并添加到压缩包
        const promises = imageUrls.map(async (imageUrl, index) => {
            const response = await fetch(imageUrl);
            const arrayBuffer = await response.arrayBuffer();
            zip.file(`下载${index + 1}.jpg`, arrayBuffer);
        });
        // 等待所有图片添加完成后创建压缩包并下载
        Promise.all(promises)
            .then(() => {
                zip.generateAsync({ type: 'blob' }).then((content) => {
                    const url = window.URL.createObjectURL(content);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'images.zip'; // 设置下载的文件名
                    a.click();
                    window.URL.revokeObjectURL(url);
                });
            })
            .catch((error) => {
                console.error('Error downloading images:', error);
            });
    };
    //生成的历史记录
    const [historyOpen, setHistoryOpen] = useState(false);
    return (
        <Card className="h-full p-[16px]">
            <SubCard
                sx={{ mb: 3 }}
                contentSX={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px !important' }}
            >
                <div>
                    <IconButton onClick={() => navigate('/imageUpscaling')} color="secondary">
                        <KeyboardBackspaceIcon fontSize="small" />
                    </IconButton>
                    <span className="text-[#000c] font-[500]">图片质量提升</span>&nbsp;
                    <span className="text-[#673ab7] font-[500]">- {subTitle}</span>
                </div>
                <div>
                    <Button
                        disabled={sucImageList.length === 0}
                        startIcon={<ArrowCircleDownIcon />}
                        onClick={batchDownload}
                        size="small"
                        variant="contained"
                        color="secondary"
                    >
                        批量下载
                    </Button>
                    {/* <Button
                        startIcon={<HistoryIcon />}
                        onClick={() => setHistoryOpen(true)}
                        sx={{ ml: 1 }}
                        size="small"
                        variant="contained"
                        color="secondary"
                    >
                        历史记录
                    </Button> */}
                </div>
            </SubCard>
            <div className="flex flex-wrap gap-2">
                <Dragger className="w-[240px] h-[240px]" {...imageprops}>
                    <div>
                        <p className="ant-upload-drag-icon">
                            <PlusOutlined rev={undefined} />
                        </p>
                        <p className="ant-upload-text">点击上传或直接将图片拖入区域</p>
                        <p className="ant-upload-hint">仅支持 .jpg/.png/.webp 格式</p>
                    </div>
                </Dragger>
                {sucImageList.map((item, index) => (
                    <div key={index}>
                        {item?.images && item?.images[0].url ? (
                            <div className="min-w-[240px] min-h-[240px] rounded-lg overflow-hidden">
                                <Image
                                    width={240}
                                    height={240}
                                    preview={{
                                        visible: false,
                                        mask: (
                                            <div
                                                className="w-full h-full flex justify-center items-center relative"
                                                onClick={() => {
                                                    setDetailData(item);
                                                    setDetailOpen(true);
                                                }}
                                            >
                                                <EyeOutlined className="text-[20px]" rev={undefined} />
                                                预览
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        downLoadImages(item?.images[0].url, item?.images[0].mediaType.split('/')[1]);
                                                    }}
                                                    className="absolute right-[5px] bottom-[5px] w-[30px] h-[30px] flex justify-center items-center rounded-md bg-[#ccc] border-rou border border-solid border-[#ccc] hover:border-[#673ab7]"
                                                >
                                                    <ArrowCircleDownIcon />
                                                </div>
                                            </div>
                                        )
                                    }}
                                    className="object-cover"
                                    style={{
                                        backgroundImage:
                                            'linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%),linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%)',
                                        backgroundSize: '6px 6px',
                                        backgroundPosition: '0 0,3px 3px'
                                    }}
                                    src={item?.images && item?.images[0].url}
                                    fallback="data:image/png;base64,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"
                                />
                            </div>
                        ) : (
                            <div className="min-w-[240px] min-h-[240px] rounded-lg overflow-hidden relative border border-solid border-[#d9d9d9]">
                                <img className="w-[30px] absolute top-0 bottom-0 left-0 right-0 m-auto" src={imgLoading} alt="" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {detailOpen && <ImageDetail detailOpen={detailOpen} detailData={detailData} handleClose={() => setDetailOpen(false)} />}
            <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
                <MainCard
                    style={{
                        position: 'absolute',
                        width: '800px',
                        top: '10%',
                        left: '50%',
                        transform: 'translate(-50%, 0)',
                        maxHeight: '80%',
                        overflow: 'auto'
                    }}
                    title="上传列表"
                    content={false}
                    secondary={
                        <IconButton onClick={() => setOpen(false)} size="large" aria-label="close modal">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    <CardContent sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <Dragger className="w-[160px] h-[160px]" {...imageprops}>
                            <div className="border-[#673ab7] text-[#673ab7] rounded-lg flex flex-col justify-center items-center cursor-pointer">
                                <PlusOutlined className="text-[20px] mb-[8px]" rev={undefined} />
                                <p>继续上传</p>
                            </div>
                        </Dragger>
                        {imageList.map((item, index) => (
                            <div key={index}>
                                {item.percent === 100 ? (
                                    <div className="min-w-[160px] min-h-[160px] rounded-lg relative overflow-hidden">
                                        <Image
                                            width={160}
                                            height={160}
                                            className="object-cover"
                                            preview={{
                                                visible: false,
                                                mask: (
                                                    <div className="w-full h-full flex justify-center items-center cursor-default">
                                                        <span
                                                            onClick={() => {
                                                                const newValue = _.cloneDeep(imageList);
                                                                newValue.splice(index, 1);
                                                                setImageList(newValue);
                                                            }}
                                                            className="cursor-pointer hover:text-[red]"
                                                        >
                                                            <DeleteOutlined className="text-[20px]" rev={undefined} />
                                                        </span>
                                                    </div>
                                                )
                                            }}
                                            src={item.response?.data?.url}
                                            fallback="data:image/png;base64,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"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-[160px] h-[160px]  rounded-lg relative overflow-hidden  border border-solid border-[#d9d9d9]">
                                        <img className="w-[30px] absolute top-0 bottom-0 left-0 right-0 m-auto" src={imgLoading} alt="" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                    {subTitle === '图片无损放大' && imageList.every((item) => item.response) && (
                        <div className="mb-[8px] flex justify-center items-center">
                            <div className="flex flex-col items-center ">
                                <Radio.Group
                                    key={diskey}
                                    onChange={(e) => {
                                        setMagnification(e.target.value);
                                    }}
                                    value={magnification}
                                >
                                    <Radio.Button disabled={Boolean(disMagn(2))} value={2}>
                                        X2
                                    </Radio.Button>
                                    <Radio.Button disabled={Boolean(disMagn(4))} value={4}>
                                        x4
                                    </Radio.Button>
                                    <Radio.Button disabled={Boolean(disMagn(6))} value={6}>
                                        X6
                                    </Radio.Button>
                                    <Radio.Button disabled={Boolean(disMagn(8))} value={8}>
                                        X8
                                    </Radio.Button>
                                </Radio.Group>
                                <span className="text-[#697586] text-[12px] mt-[8px]">(选择需要放大的倍数)</span>
                            </div>
                        </div>
                    )}
                    <Divider />
                    <div className="flex justify-between px-[16px] items-center py-[16px]">
                        <div>
                            <div className="font-bold text-sm leading-5">已上传{imageList.length}/20张</div>
                            <div className="text-sm leading-4">支持多张图片同时上传，仅支持 JPG/PNG/WEBP 格式图片</div>
                        </div>
                        <div>
                            <Button onClick={handleSave} className="ml-[8px]" size="small" color="secondary" variant="contained">
                                {subTitle === '图片无损放大' ? '无损放大' : '提升质量'}
                            </Button>
                        </div>
                    </div>
                </MainCard>
            </Modal>
            {historyOpen && <ImageHistory open={historyOpen} handleClose={() => setHistoryOpen(false)} />}
        </Card>
    );
};
export default EditBackgroundImage;
