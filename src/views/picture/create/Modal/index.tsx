// material-ui
import { Divider, Grid, IconButton, Modal } from '@mui/material';

// project imports
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MainCard from 'ui-component/cards/MainCard';

// assets
import CloseIcon from '@mui/icons-material/Close';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LinkIcon from '@mui/icons-material/Link';
import MuiTooltip from '@mui/material/Tooltip';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { downloadFile } from 'utils/download';
import { useDispatch } from '../../../../store';
import { openSnackbar } from '../../../../store/slices/snackbar';
import { IImageListTypeChildImages } from '../index';

export default function PicModal({
    open,
    setOpen,
    currentIndex,
    setCurrentIndex,
    currentImageList,
    width,
    height,
    engine,
    prompt
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentIndex: number;
    setCurrentIndex: (currentIndex: number) => void;
    currentImageList: IImageListTypeChildImages[];
    width: number;
    height: number;
    engine: string;
    prompt: string;
}) {
    // getModalStyle is not a pure function, we roll the style only on the first render

    const dispatch = useDispatch();

    const handleClose = () => {
        setOpen(false);
    };

    const handlePrev = () => {
        if (currentIndex === 0) {
            return;
        }
        setCurrentIndex(currentIndex - 1);
    };

    const btnDisable = React.useMemo(() => {
        const obj = { preDis: false, nextDis: false };
        if (currentIndex === 0) {
            obj.preDis = true;
        }
        if (currentIndex === currentImageList.length - 1) {
            obj.nextDis = true;
        }
        return obj;
    }, [currentIndex, currentImageList.length]);

    const handleNext = () => {
        const length = currentImageList.length - 1;
        if (currentIndex === length) {
            return;
        }
        setCurrentIndex(currentIndex + 1);
    };

    return (
        <Grid container justifyContent="flex-end">
            <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                <MainCard
                    style={{
                        position: 'absolute',
                        width: '90%',
                        height: '90%',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                    title="图片预览"
                    content={false}
                    secondary={
                        <IconButton onClick={handleClose} size="large" aria-label="close modal">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    <div className="w-full bg-[#f4f6f8] h-full">
                        <div className="grid grid-cols-3 gap-1 p-4 max-h-[90%] min-h-[90%] overflow-auto">
                            <div className="h-full sm:col-span-2 group relative bg-white xs:col-span-3 flex justify-center">
                                <div className="h-full sm:max-w-[500px] flex flex-col w-full justify-around">
                                    <img
                                        className="xs:w-full duration-100 rounded  object-contain"
                                        src={currentImageList?.[currentIndex]?.url}
                                        alt={currentImageList?.[currentIndex]?.uuid}
                                    />
                                    <div className="flex overflow-auto justify-center w-full mt-2">
                                        {currentImageList.map((item) => (
                                            <img className="w-[100px] rounded mx-2" src={item.url} alt={item.uuid} />
                                        ))}
                                    </div>
                                </div>
                                <button
                                    className={`${
                                        btnDisable.preDis ? 'bg-black/20 cursor-not-allowed' : 'bg-black/80 cursor-pointer'
                                    } flex-none w-10 h-10 flex justify-center items-center rounded-md  border-none absolute left-0 top-[48%]`}
                                    onClick={() => handlePrev()}
                                    disabled={btnDisable.preDis}
                                >
                                    <ArrowBackIosNewIcon style={{ color: '#fff' }} />
                                </button>
                                <button
                                    className={`${
                                        btnDisable.nextDis ? 'bg-black/20 cursor-not-allowed' : 'bg-black/80 cursor-pointer'
                                    } flex-none w-10 h-10 flex justify-center items-center rounded-md border-none absolute right-0 top-[48%]`}
                                    onClick={() => handleNext()}
                                >
                                    <ArrowForwardIosIcon style={{ color: '#fff' }} />
                                </button>
                            </div>
                            <div className="h-full sm:col-span-1 p-4 bg-white xs:col-span-3">
                                <div className="flex flex-col mt-3">
                                    <span className="text-lg font-medium">描述:</span>
                                    <span className="text-base">{prompt}</span>
                                </div>
                                <div className="flex flex-col  mt-3">
                                    <span className="text-lg font-medium">模型:</span>
                                    <span className="text-base">{engine}</span>
                                </div>
                                <div className="flex flex-col  mt-3">
                                    <span className="text-lg font-medium">风格:</span>
                                    <span className="text-base">{engine}</span>
                                </div>
                                <div className="flex flex-col  mt-3">
                                    <span className="text-lg font-medium">尺寸:</span>
                                    <span className="text-base">
                                        {width} x {height}
                                    </span>
                                </div>
                                <Divider className="mt-3 mb-3" />
                                <div className={'flex'}>
                                    <div
                                        className="bg-black/50 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer"
                                        onClick={() =>
                                            downloadFile(
                                                currentImageList[currentIndex].url,
                                                `${currentImageList[currentIndex].uuid}.${
                                                    currentImageList[currentIndex].mediaType?.split('/')[1]
                                                }`
                                            )
                                        }
                                    >
                                        <MuiTooltip title="下载" arrow placement="top">
                                            <CloudDownloadIcon style={{ color: '#fff', height: '16px' }} />
                                        </MuiTooltip>
                                    </div>
                                    <div className="bg-black/50 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer ml-2">
                                        <CopyToClipboard
                                            text={currentImageList[currentIndex].url}
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
                                                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                                        transition: 'SlideLeft'
                                                    })
                                                )
                                            }
                                        >
                                            <MuiTooltip title="复制链接" arrow placement="top">
                                                <LinkIcon style={{ color: '#fff', fontSize: '16px' }} />
                                            </MuiTooltip>
                                        </CopyToClipboard>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </MainCard>
            </Modal>
        </Grid>
    );
}
