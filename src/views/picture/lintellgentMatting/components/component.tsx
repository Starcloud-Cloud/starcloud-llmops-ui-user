import { Grid, Card, Modal, IconButton, DialogActions, Button, Typography, Divider, CardContent, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import HistoryIcon from '@mui/icons-material/History';
import MainCard from 'ui-component/cards/MainCard';
import { ColorPicker, Radio, InputNumber, Upload, Progress, Image } from 'antd';
import type { UploadProps } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from 'utils/auth';
import imgLoading from 'assets/images/picture/loading.gif';
import _ from 'lodash-es';
import SubCard from 'ui-component/cards/SubCard';
import ImageDetail from '../../components/detail';
import downLoadImages from 'hooks/useDownLoadImage';
import { useAllDetail } from 'contexts/JWTContext';
import { downAllImages } from 'hooks/useDownLoadImage';
import { formatNumber } from 'hooks/useDate';
import { PermissionUpgradeModal } from 'views/template/myChat/createChat/components/modal/permissionUpgradeModal';
const EditBackgroundImage = ({ subTitle, scene, appUid, save }: { subTitle: string; scene: string; appUid: string; save: any }) => {
    const [color, setColor] = useState<Color | string>('#fff');
    const [value, setValue] = useState(0);
    const [scale, setScale] = useState<number | null>(100);
    const navigate = useNavigate();
    const allDetail = useAllDetail();
    //上传图片
    const [imageList, setImageList] = useState<any[]>([]);
    //抠图完成的图片
    const [sucImageList, setSucImageList] = useState<any[]>([]);
    const suRef = useRef<any[]>([]);
    const [open, setOpen] = useState(false);
    //图片详情
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState<any>({});
    const [openToken, setOpenToken] = useState(false);
    const [from, setFrom] = useState('');

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
    const handleSave = () => {
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
        try {
            const res = await save({
                scene,
                appUid,
                imageRequest: {
                    imageUrl: item.response?.data?.url
                }
            });
            suRef.current.splice(index, 1, res.response);
            setSucImageList(_.cloneDeep(suRef.current));
            allDetail?.setPre(allDetail?.pre + 1);
        } catch (err: any) {
            if (err?.code === 2004008004) {
                setFrom(`${err?.scene}_${err?.bizUid}`);
                setOpenToken(true);
            }
            suRef.current.splice(index, 1, { images: [{ url: 'error' }] });
            setSucImageList(_.cloneDeep(suRef.current));
            allDetail?.setPre(allDetail?.pre + 1);
        }
    };
    useEffect(() => {
        if (!open) {
            setImageList([]);
        }
    }, [open]);
    //批量下载图片
    const batchDownload = () => {
        const imageUrls = sucImageList
            .map((item, index: number) => {
                if (item?.images[0]?.url && item?.images[0]?.url !== 'error') {
                    return {
                        url: item.images[0].url,
                        uuid: item.fromScene,
                        time: formatNumber(
                            detailData?.finishTime + index * 1000
                                ? detailData?.finishTime + index * 1000
                                : new Date().getTime() + index * 1000
                        ),
                        type: item.images[0].mediaType?.split('/')[1]
                    };
                }
            })
            .filter((value) => value !== undefined);
        console.log(imageUrls);

        downAllImages(imageUrls);
    };
    return (
        <Card className="h-full p-[16px]">
            <SubCard
                sx={{ mb: 3 }}
                contentSX={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px !important' }}
            >
                <div>
                    <IconButton onClick={() => navigate('/imageMatting')} color="secondary">
                        <KeyboardBackspaceIcon fontSize="small" />
                    </IconButton>
                    <span className="text-[#000c] font-[500]">智能抠图</span>&nbsp;
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
                    <Button
                        startIcon={<HistoryIcon />}
                        onClick={() => navigate('/imageHistory?scene=' + scene)}
                        sx={{ ml: 1 }}
                        size="small"
                        variant="contained"
                        color="secondary"
                    >
                        历史记录
                    </Button>
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
                                        mask: item?.images && item?.images[0].url !== 'error' && (
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
                                                        downLoadImages(
                                                            item?.images[0].url,
                                                            item?.images[0].mediaType.split('/')[1],
                                                            item?.fromScene,
                                                            formatNumber(item?.finishTime ? item?.finishTime : new Date().getTime())
                                                        );
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
                                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
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
                    <Divider />
                    <div className="flex justify-between px-[16px] items-center py-[16px]">
                        <div>
                            <div className="font-bold text-sm leading-5">已上传{imageList.length}/20张</div>
                            <div className="text-sm leading-4">支持多张图片同时上传，仅支持 JPG/PNG/WEBP 格式图片</div>
                        </div>
                        <div>
                            <Button onClick={handleSave} className="ml-[8px]" size="small" color="secondary" variant="contained">
                                抠图
                                <span className="text-xs opacity-50">
                                    （消耗{imageList.filter((item: any) => item.response?.data?.url).length * 6}点作图）
                                </span>
                            </Button>
                        </div>
                    </div>
                </MainCard>
            </Modal>
            <PermissionUpgradeModal
                open={openToken}
                handleClose={() => setOpenToken(false)}
                title={'当前图片数不足，升级会员，立享五折优惠！'}
                from={from}
            />
        </Card>
        // <div>
        //     <Grid container spacing={2}>
        //         <Grid item md={3}>
        //             <Card sx={{ height: '100vh', p: 2 }}>
        //                 <Typography mb={2} variant="h5">
        //                     背景选择
        //                 </Typography>
        //                 <div className="flex flex-wrap gap-2">
        //                     <div
        //                         className="w-[24px] h-[24px] bg-transparent rounded-full shadow-[inset_0_0_0_1px_rgba(34,37,71,0.15)] overflow-hidden cursor-pointer"
        //                         style={{ backgroundImage: `url(${transparent})`, backgroundSize: '12px' }}
        //                     ></div>
        //                     <div className="w-[24px] h-[24px] bg-transparent rounded-full shadow-[inset_0_0_0_1px_rgba(34,37,71,0.15)] overflow-hidden bg-[#000000] cursor-pointer"></div>
        //                     <div className="w-[24px] h-[24px] bg-transparent rounded-full shadow-[inset_0_0_0_1px_rgba(34,37,71,0.15)] overflow-hidden bg-[#ffffff] cursor-pointer"></div>
        //                     <ColorPicker value={color} onChange={setColor}>
        //                         <div
        //                             className="w-[24px] h-[24px] bg-transparent rounded-full shadow-[inset_0_0_0_1px_rgba(34,37,71,0.15)] overflow-hidden cursor-pointer"
        //                             style={{
        //                                 background:
        //                                     'conic-gradient(from 180deg at 50% 50%,rgb(255,0,0) 0deg,rgb(255,234,0) 61.87deg,rgba(128,255,0,.824) 118.12deg,rgb(0,255,255) 180deg,rgb(0,0,255) 243.75deg,rgb(255,0,255) 303.75deg,rgb(255,0,0) 360deg)'
        //                             }}
        //                         ></div>
        //                     </ColorPicker>
        //                 </div>
        //                 <Divider sx={{ my: 4 }} />
        //                 <Typography mb={2} variant="h4">
        //                     裁剪方式
        //                 </Typography>
        //                 <Radio.Group disabled onChange={(e) => setValue(e.target.value)} value={value}>
        //                     <Radio value={0}>原图</Radio>
        //                     <Radio value={1}>1:1</Radio>
        //                 </Radio.Group>
        //                 {/* <Typography my={2} variant="h4">
        //             主体占比
        //         </Typography>
        //         <InputNumber
        //             defaultValue={100}
        //             min={0}
        //             max={100}
        //             value={scale}
        //             formatter={(value) => `${value}%`}
        //             onChange={(value: number | null) => setScale(value)}
        //         /> */}
        //             </Card>
        //         </Grid>
        //         <Grid item md={9}>
        //             {imageList.length > 0 ? (
        //                 <div className="flex flex-wrap gap-2">
        //                     <Dragger className="w-[240px] h-[240px]" {...props}>
        //                         <div>
        //                             <p className="ant-upload-drag-icon">
        //                                 <PlusOutlined rev={undefined} />
        //                             </p>
        //                             <p className="ant-upload-text">点击上传或直接将图片拖入区域</p>
        //                             <p className="ant-upload-hint">仅支持 .jpg/.png/.webp 格式</p>
        //                         </div>
        //                     </Dragger>
        //                     {imageList.map((item, index) => (
        //                         <div
        //                             key={index}
        //                             className="w-[240px] h-[240px] rounded-lg overflow-hidden relative border border-solid border-[#d9d9d9]"
        //                         >
        //                             <Image
        //                                 width="100%"
        //                                 className="object-cover	"
        //                                 src={'data:image/jpeg;base64,' + item.response?.data.binary}
        //                                 fallback="data:image/png;base64,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"
        //                             />
        //                             {item.percent !== 100 && (
        //                                 <div className="absolute bg-[#e5e7eb] left-0 top-0 w-full h-full opacity-70 flex items-center justify-center">
        //                                     <Progress type="circle" percent={item.percent} />
        //                                 </div>
        //                             )}
        //                         </div>
        //                     ))}
        //                 </div>
        //             ) : (
        //                 <div className="flex justify-center h-full items-center">
        //                     <Dragger className="w-[300px] h-[180px]" {...props}>
        //                         <div>
        //                             <p className="ant-upload-drag-icon">
        //                                 <PlusOutlined rev={undefined} />
        //                             </p>
        //                             <p className="ant-upload-text">点击上传或直接将图片拖入区域</p>
        //                             <p className="ant-upload-hint">仅支持 .jpg/.png/.webp 格式</p>
        //                         </div>
        //                     </Dragger>
        //                 </div>
        //             )}
        //         </Grid>
        //     </Grid>
        // </div>
    );
};
export default EditBackgroundImage;
