import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import { favoriteCollect, favoriteCancel } from 'api/template/collect';
import './textnoWarp.scss';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useEffect, useState } from 'react';
const MarketTemplate = ({ like, data, handleDetail, type }: any) => {
    const getImage = (active: string) => {
        let image;
        try {
            image = require('../../../../../assets/images/category/' + active + '.svg');
        } catch (_) {
            image =
                'data:image/png;base64,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';
        }
        return image;
    };
    const [active, setActive] = useState(false);
    const [marketActive, setMarketActive] = useState(false);
    useEffect(() => {
        if (data.isFavorite) {
            setMarketActive(true);
        }
    }, []);
    return type === 'APP' ? (
        <div
            className="group rounded-[12px] shadow-md border border-solid border-[transparent] hover:border-[#CECAD5] cursor-pointer bg-white relative p-4"
            style={{
                height: '185px'
            }}
            onClick={() => handleDetail(data)}
        >
            <div className="flex gap-2 justify-start items-center">
                <div className=" p-1 rounded-md border border-solid border-slate-200 flex justify-center items-center">
                    <img className="w-[16px] h-[16px]" src={getImage(data?.icon)} />
                </div>
                <div className="text-[#545454] text-[16px] font-bold line-clamp-2">{data.name}</div>
            </div>
            <div className="mt-4 text-xs text-[#808080] line-clamp-3">{data.description}</div>
            <div className="absolute left-[16px] bottom-[16px]">
                {like === 'market' &&
                    (marketActive ? (
                        <div
                            onClick={(e) => {
                                favoriteCancel({ marketUid: data.uid }).then((res) => {
                                    if (res) {
                                        setMarketActive(false);
                                        dispatch(
                                            openSnackbar({
                                                open: true,
                                                message: '取消收藏成功',
                                                variant: 'alert',
                                                alert: {
                                                    color: 'success'
                                                },
                                                close: false
                                            })
                                        );
                                    }
                                });
                                e.stopPropagation();
                            }}
                        >
                            <GradeIcon sx={{ color: '#ecc94b99' }} fontSize="small" />
                        </div>
                    ) : (
                        <div
                            onClick={(e) => {
                                favoriteCollect({ marketUid: data.uid }).then((res) => {
                                    if (res) {
                                        setMarketActive(true);
                                        dispatch(
                                            openSnackbar({
                                                open: true,
                                                message: '收藏成功',
                                                variant: 'alert',
                                                alert: {
                                                    color: 'success'
                                                },
                                                close: false
                                            })
                                        );
                                    }
                                });

                                e.stopPropagation();
                            }}
                        >
                            <GradeOutlinedIcon sx={{ color: '#0003' }} fontSize="small" />
                        </div>
                    ))}
                {like === 'collect' &&
                    (active ? (
                        <div
                            onClick={(e) => {
                                favoriteCollect({ marketUid: data.uid }).then((res) => {
                                    if (res) {
                                        dispatch(
                                            openSnackbar({
                                                open: true,
                                                message: '收藏成功',
                                                variant: 'alert',
                                                alert: {
                                                    color: 'success'
                                                },
                                                close: false
                                            })
                                        );
                                    }
                                });
                                setActive(false);
                                e.stopPropagation();
                            }}
                            className="absolute left-[16px] bottom-[11px]"
                        >
                            <GradeOutlinedIcon sx={{ color: '#0003' }} fontSize="small" />
                        </div>
                    ) : (
                        <div
                            onClick={(e) => {
                                favoriteCancel({ marketUid: data.uid }).then((res) => {
                                    if (res) {
                                        dispatch(
                                            openSnackbar({
                                                open: true,
                                                message: '取消收藏成功',
                                                variant: 'alert',
                                                alert: {
                                                    color: 'success'
                                                },
                                                close: false
                                            })
                                        );
                                    }
                                });
                                setActive(true);
                                e.stopPropagation();
                            }}
                            className="absolute left-[16px] bottom-[11px]"
                        >
                            <GradeIcon sx={{ color: '#ecc94b99' }} fontSize="small" />
                        </div>
                    ))}
            </div>
            <div className="absolute right-[16px] bottom-[16px] w-7 h-7 rounded-full bg-[#673ab7] hidden group-hover:block">
                <div className="w-full h-full flex justify-center items-center">
                    <ArrowForwardIcon fontSize="small" sx={{ color: '#fff' }} />
                </div>
            </div>
        </div>
    ) : (
        <div
            className="overflow-hidden group rounded-[12px] shadow-md cursor-pointer bg-white relative p-4 !bg-cover"
            style={{
                aspectRatio: '.75',
                background:
                    data?.images && data?.images[0]
                        ? `url(${data?.images[0]})`
                        : 'url(https://p8.itc.cn/q_70/images03/20230904/6b9e1ed6da8a434983fdd664d27e0d0a.jpeg)'
            }}
            onClick={() => handleDetail(data)}
        >
            <div className="absolute bottom-0 right-0 w-full aspect-[1.5] bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.8))]">
                <div className="flex gap-2 justify-start items-center absolute left-[16px] bottom-[40px]">
                    <div className="z-1 p-1 rounded-md border border-solid border-slate-200 flex justify-center items-center">
                        <img className="w-[16px] h-[16px]" src={getImage(data?.icon)} />
                    </div>
                    <div className="text-white text-[16px] font-bold line-clamp-2">{data.name}</div>
                </div>
                <div className="absolute left-[16px] bottom-[8px]">
                    {like === 'market' &&
                        (marketActive ? (
                            <div
                                onClick={(e) => {
                                    favoriteCancel({ marketUid: data.uid }).then((res) => {
                                        if (res) {
                                            setMarketActive(false);
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: '取消收藏成功',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'success'
                                                    },
                                                    close: false
                                                })
                                            );
                                        }
                                    });
                                    e.stopPropagation();
                                }}
                            >
                                <GradeIcon sx={{ color: '#ecc94b99' }} fontSize="small" />
                            </div>
                        ) : (
                            <div
                                onClick={(e) => {
                                    favoriteCollect({ marketUid: data.uid }).then((res) => {
                                        if (res) {
                                            setMarketActive(true);
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: '收藏成功',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'success'
                                                    },
                                                    close: false
                                                })
                                            );
                                        }
                                    });

                                    e.stopPropagation();
                                }}
                            >
                                <GradeOutlinedIcon sx={{ color: '#fff' }} fontSize="small" />
                            </div>
                        ))}
                    {like === 'collect' &&
                        (active ? (
                            <div
                                onClick={(e) => {
                                    favoriteCollect({ marketUid: data.uid }).then((res) => {
                                        if (res) {
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: '收藏成功',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'success'
                                                    },
                                                    close: false
                                                })
                                            );
                                        }
                                    });
                                    setActive(false);
                                    e.stopPropagation();
                                }}
                                className="absolute left-[16px] bottom-[11px]"
                            >
                                <GradeOutlinedIcon sx={{ color: '#0003' }} fontSize="small" />
                            </div>
                        ) : (
                            <div
                                onClick={(e) => {
                                    favoriteCancel({ marketUid: data.uid }).then((res) => {
                                        if (res) {
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: '取消收藏成功',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'success'
                                                    },
                                                    close: false
                                                })
                                            );
                                        }
                                    });
                                    setActive(true);
                                    e.stopPropagation();
                                }}
                                className="absolute left-[16px] bottom-[11px]"
                            >
                                <GradeIcon sx={{ color: '#ecc94b99' }} fontSize="small" />
                            </div>
                        ))}
                </div>
            </div>
            <div className="absolute right-[16px] bottom-[16px] w-7 h-7 rounded-full bg-[#673ab7] hidden group-hover:block">
                <div className="w-full h-full flex justify-center items-center">
                    <ArrowForwardIcon fontSize="small" sx={{ color: '#fff' }} />
                </div>
            </div>
        </div>
    );
};
export default MarketTemplate;
