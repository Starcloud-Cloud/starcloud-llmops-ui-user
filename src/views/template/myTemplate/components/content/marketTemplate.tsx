import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import { favoriteCollect, favoriteCancel, getMarketUid } from 'api/template/collect';
import './textnoWarp.scss';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useEffect, useState } from 'react';
import bgImg from 'assets/images/picture/bgImg.png';
import dayjs from 'dayjs';
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
const MarketTemplate = ({ like, data, handleDetail, type, scene, isTitle }: any) => {
    const navigate = useNavigate();
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
            {scene !== 'template' && (
                <div className="text-xs text-black/50 absolute bottom-4 left-0 w-full px-4 flex justify-between gap-4">
                    <Tooltip title="创建者">
                        <div>{data.creatorName}</div>
                    </Tooltip>
                    <Tooltip title="更新时间">
                        <div>{data.updateTime && dayjs(data.updateTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                    </Tooltip>
                </div>
            )}
            {scene !== 'template' && data?.publishUid && (
                <Tooltip title="已发布到应用市场，点击查看">
                    <div
                        className="text-xs text-[#673ab7] absolute top-2 right-2"
                        onClick={async (e) => {
                            const result = await getMarketUid(data.publishUid);
                            navigate('/batchSmallRedBook?appUid=' + result);
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        已发布
                    </div>
                </Tooltip>
            )}
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
                                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
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
                                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
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
                                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
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
                                                anchorOrigin: { vertical: 'top', horizontal: 'center' },
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
            className="w-full aspect-[.75] overflow-hidden group rounded-[12px] cursor-pointer bg-white relative p-4 !bg-cover hover:shadow-lg"
            style={{
                aspectRatio: '.75',
                background:
                    type === 'STYLE'
                        ? `url(${data?.style?.templateList[0]?.example}?x-oss-process=image/resize,w_340/quality,q_80),url(${bgImg}?x-oss-process=image/resize,w_340/quality,q_80)`
                        : data?.images && data?.images[0]
                        ? `url(${data?.images[0]}?x-oss-process=image/resize,w_340/quality,q_80),url(${bgImg}?x-oss-process=image/resize,w_340/quality,q_80)`
                        : `url(${bgImg}?x-oss-process=image/resize,w_340/quality,q_80)`
            }}
            onClick={() => handleDetail(data)}
        >
            <div className="bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.8))] absolute bottom-0 right-0 w-full aspect-[2]">
                <div className="flex gap-2 justify-start items-center absolute left-[16px] bottom-[40px]">
                    {/* <div className="z-1 p-1 rounded-md border border-solid border-slate-200 flex justify-center items-center">
                        <img className="w-[16px] h-[16px]" src={getImage(data?.icon)} />
                    </div> */}
                    {!isTitle && <div className="text-white text-[16px] font-bold line-clamp-2">{data.name}</div>}
                </div>
                <div className="absolute right-[16px] bottom-[8px] flex justify-end items-center gap-2 w-[calc(100%-32px)] overflow-x-auto whitespace-nowrap">
                    {data.pluginList && data.pluginList?.length > 0 && (
                        <div className="text-xs bg-[#673ab7] text-white font-bold py-1 px-2 flex items-center rounded-md">
                            <svg
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="11574"
                                width="12"
                                height="12"
                            >
                                <path
                                    d="M626.504285 375.563329a26.383253 26.383253 0 0 1-25.98523-26.724415c0-73.918596-58.338831-134.020101-129.983009-134.020101a26.383253 26.383253 0 0 1-25.985229-26.724416c0-14.783719 11.656394-26.838136 25.985229-26.838136 71.644178 0 129.983008-60.101505 129.983009-133.963241 0-14.783719 11.656394-26.781276 25.98523-26.781276 14.385696 0 25.98523 11.997557 25.985229 26.781276 0 73.861736 58.338831 133.963241 129.983009 133.963241 14.328836 0 25.98523 11.997557 25.985229 26.781276s-11.656394 26.781276-25.985229 26.781276c-71.644178 0-129.983008 60.158365-129.983009 133.96324 0 14.783719-11.599534 26.781276-25.985229 26.781276zM564.185222 188.037537c25.473485 15.920928 46.966739 37.925926 62.319063 64.252318 15.352324-26.269532 36.845577-48.33139 62.375923-64.252318a186.729746 186.729746 0 0 1-62.375923-64.252318c-15.352324 26.269532-36.788717 48.38825-62.319063 64.252318zM106.629111 536.307846a26.383253 26.383253 0 0 1-25.98523-26.724415 26.383253 26.383253 0 0 0-25.985229-26.838137A26.383253 26.383253 0 0 1 28.673422 455.964018c0-14.783719 11.656394-26.781276 25.98523-26.781276a26.383253 26.383253 0 0 0 25.985229-26.838137c0-14.783719 11.656394-26.724416 25.98523-26.724415 14.385696 0 26.04209 11.940696 26.04209 26.724415s11.599534 26.838136 25.98523 26.838137c14.328836 0 25.98523 11.940696 25.985229 26.724416s-11.656394 26.838136-25.985229 26.838136a26.383253 26.383253 0 0 0-25.98523 26.781276c0 14.783719-11.656394 26.781276-26.04209 26.781276zM972.102152 854.555833l-550.40924-567.239935a76.420456 76.420456 0 0 0-110.309289 0l-30.420346 31.443833c-14.726859 15.124882-22.744183 35.253484-22.744183 56.860459 0 21.493253 8.074185 41.621856 22.744183 56.860459l550.35238 567.183075a76.420456 76.420456 0 0 0 110.309289 0l30.477206-31.443834c14.669998-15.124882 22.744183-35.253484 22.744184-56.860459 0-21.493253-8.131046-41.678716-22.744184-56.860458zM342.656875 334.73752a25.587206 25.587206 0 0 1 36.788717 0l74.771503 77.102782-53.27825 50.605808L326.053621 385.400189a27.406741 27.406741 0 0 1 0-37.869066l16.489533-12.736742z m567.012494 617.618302a25.416625 25.416625 0 0 1-36.674996 0L434.259074 500.201455l54.017436-50.890111 438.735299 452.211228a27.406741 27.406741 0 0 1 0 37.869066l-17.34244 12.964184zM210.62689 268.438225a26.383253 26.383253 0 0 1-25.98523-26.838136c0-44.294297-34.969182-80.343828-78.012549-80.343828a26.383253 26.383253 0 0 1-25.98523-26.781276c0-14.783719 11.656394-26.781276 25.98523-26.781276 43.043367 0 78.012549-36.106391 78.012549-80.400689 0-14.783719 11.656394-26.781276 25.98523-26.781276s25.98523 11.997557 25.98523 26.781276c0 44.351158 34.969182 80.400689 78.012549 80.400689 14.328836 0 25.98523 11.940696 25.985229 26.724415s-11.656394 26.838136-25.985229 26.838137c-43.043367 0-78.012549 36.049531-78.012549 80.343828 0 14.783719-11.656394 26.838136-25.98523 26.838136z m-26.098951-133.96324c9.89372 7.676162 18.65023 16.716975 26.098951 26.894997a134.190682 134.190682 0 0 1 26.09895-26.894997 134.190682 134.190682 0 0 1-26.09895-26.894997 134.190682 134.190682 0 0 1-26.098951 26.894997zM210.62689 804.234327a26.383253 26.383253 0 0 1-25.98523-26.781276c0-44.351158-34.969182-80.400689-78.012549-80.400688a26.383253 26.383253 0 0 1-25.98523-26.724416c0-14.783719 11.656394-26.838136 25.98523-26.838136 43.043367 0 78.012549-36.049531 78.012549-80.400689 0-14.783719 11.656394-26.724416 25.98523-26.724415s25.98523 11.940696 25.98523 26.724415c0 44.351158 34.969182 80.400689 78.012549 80.400689 14.328836 0 25.98523 11.997557 25.985229 26.781276s-11.656394 26.781276-25.985229 26.781276c-43.043367 0-78.012549 36.049531-78.012549 80.400688 0 14.783719-11.656394 26.781276-25.98523 26.781276z m-26.098951-133.96324c9.89372 7.676162 18.65023 16.716975 26.098951 26.894997a134.190682 134.190682 0 0 1 26.09895-26.894997 134.190682 134.190682 0 0 1-26.09895-26.894997 134.190682 134.190682 0 0 1-26.098951 26.894997z"
                                    fill="#fff"
                                    p-id="11575"
                                ></path>
                            </svg>
                            <span className="group-hover:block hidden">智能生成</span>
                        </div>
                    )}
                    {(data.openVideoMode || data?.style?.openVideoMode) && (
                        <div className="text-xs bg-[#673ab7] text-white font-bold py-1 px-2 flex items-center gap-1 rounded-md">
                            <svg
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="9767"
                                width="12"
                                height="12"
                            >
                                <path
                                    d="M692.544 196.8h127.232a165.76 165.76 0 0 1 167.104 164.48v476.16a165.76 165.76 0 0 1-167.04 164.48H204.16a165.76 165.76 0 0 1-167.04-164.416V361.28a165.76 165.76 0 0 1 167.04-164.48h122.624L261.056 74.432a34.432 34.432 0 0 1 16.576-45.952 35.456 35.456 0 0 1 45.632 13.888l83.2 154.688h206.528l83.2-154.816A35.392 35.392 0 0 1 743.04 25.6a34.432 34.432 0 0 1 15.296 49.024l-65.792 122.112zM204.16 265.984a96 96 0 0 0-96.704 95.296v476.16a96 96 0 0 0 96.704 95.232h615.68a96 96 0 0 0 96.704-95.232v-476.16a96 96 0 0 0-96.704-95.296H204.16z m161.728 198.4v287.296a56.704 56.704 0 0 0 57.152 56.256 57.984 57.984 0 0 0 29.44-8l243.2-143.616a55.808 55.808 0 0 0 0-96.512l-243.2-143.616a57.6 57.6 0 0 0-78.464 19.2 55.616 55.616 0 0 0-8.128 28.992z m274.56 143.616l-204.288 120.64v-241.28z"
                                    fill="#fff"
                                    p-id="9768"
                                ></path>
                            </svg>
                            <span className="group-hover:block hidden">视频生成</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="group-hover:block hidden absolute right-[8px] top-[8px]">
                <div className=" bg-black/50 w-[25px] h-[25px] flex justify-center items-center rounded-md">
                    {like === 'market' &&
                        (marketActive ? (
                            <GradeIcon
                                onClick={(e) => {
                                    favoriteCancel({
                                        marketUid: data.uid,
                                        type: type === 'STYLE' ? 'TEMPLATE_MARKET' : 'APP_MARKET',
                                        styleUid: type === 'STYLE' ? data.style?.uuid : undefined
                                    }).then((res) => {
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
                                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                    close: false
                                                })
                                            );
                                        }
                                    });
                                    e.stopPropagation();
                                }}
                                sx={{ color: '#ecc94b99' }}
                                fontSize="small"
                            />
                        ) : (
                            <GradeOutlinedIcon
                                onClick={(e) => {
                                    favoriteCollect({
                                        marketUid: data.uid,
                                        type: type === 'STYLE' ? 'TEMPLATE_MARKET' : 'APP_MARKET',
                                        styleUid: type === 'STYLE' ? data.style?.uuid : undefined
                                    }).then((res) => {
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
                                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                    close: false
                                                })
                                            );
                                        }
                                    });

                                    e.stopPropagation();
                                }}
                                sx={{ color: '#fff' }}
                                fontSize="small"
                            />
                        ))}
                    {like === 'collect' &&
                        (active ? (
                            <GradeOutlinedIcon
                                onClick={(e) => {
                                    favoriteCollect({
                                        marketUid: data.uid,
                                        type: type === 'STYLE' ? 'TEMPLATE_MARKET' : 'APP_MARKET',
                                        styleUid: type === 'STYLE' ? data.style?.uuid : undefined
                                    }).then((res) => {
                                        if (res) {
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: '收藏成功',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'success'
                                                    },
                                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                    close: false
                                                })
                                            );
                                        }
                                    });
                                    setActive(false);
                                    e.stopPropagation();
                                }}
                                sx={{ color: '#fff' }}
                                fontSize="small"
                            />
                        ) : (
                            <GradeIcon
                                onClick={(e) => {
                                    favoriteCancel({
                                        marketUid: data.uid,
                                        type: type === 'STYLE' ? 'TEMPLATE_MARKET' : 'APP_MARKET',
                                        styleUid: type === 'STYLE' ? data.style?.uuid : undefined
                                    }).then((res) => {
                                        if (res) {
                                            dispatch(
                                                openSnackbar({
                                                    open: true,
                                                    message: '取消收藏成功',
                                                    variant: 'alert',
                                                    alert: {
                                                        color: 'success'
                                                    },
                                                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                    close: false
                                                })
                                            );
                                        }
                                    });
                                    setActive(true);
                                    e.stopPropagation();
                                }}
                                sx={{ color: '#ecc94b99' }}
                                fontSize="small"
                            />
                        ))}
                </div>
            </div>
            {data?.style?.saleConfig?.openSale && (
                <div className="absolute bottom-[calc(50%-13px)] right-[calc(50%-37px)] rounded-full bg-[#717476] text-white text-base font-semibold flex items-center gap-1 px-2 py-1">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11435" width="20" height="20">
                        <path
                            d="M816.49 909H211.21c-1.1 0-2-0.9-2-2v-68.18c0-1.1 0.9-2 2-2h605.28c1.1 0 2 0.9 2 2V907c0 1.1-0.9 2-2 2z"
                            fill="#FFAA22"
                            p-id="11436"
                        ></path>
                        <path
                            d="M910.24 316.23c-27.11 0-49.1 22.52-49.1 50.31 0 7.28 1.58 14.16 4.3 20.4l-176.13 80.21-147.2-258.57c14.56-8.73 24.46-24.74 24.46-43.28 0-27.79-21.98-50.31-49.1-50.31s-49.1 22.52-49.1 50.31c0 17.99 9.29 33.66 23.15 42.55l-158.16 259.3-176.13-80.21c2.71-6.25 4.3-13.12 4.3-20.4 0-27.78-21.98-50.31-49.1-50.31s-49.1 22.52-49.1 50.31c0 27.78 21.98 50.31 49.1 50.31 3.99 0 7.82-0.62 11.53-1.54l86.65 366.28h601.43l86.65-366.28c3.71 0.92 7.54 1.54 11.53 1.54 27.12 0 49.1-22.52 49.1-50.31 0.01-27.78-21.97-50.31-49.08-50.31z"
                            fill="#FFD68D"
                            p-id="11437"
                        ></path>
                    </svg>
                    高级版
                </div>
            )}
        </div>
    );
    // ) : (
    //     <div
    //         className="overflow-hidden group rounded-[12px] shadow-md cursor-pointer bg-white relative p-4 bg-cover bg-[url('https://p8.itc.cn/q_70/images03/20230904/6b9e1ed6da8a434983fdd664d27e0d0a.jpeg')]"
    //         style={{
    //             aspectRatio: '.75'
    //         }}
    //         onClick={() => handleDetail(data)}
    //     >
    //         <div className="absolute bottom-0 right-0 w-full aspect-[1.5] bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.8))]">
    //             <div className="flex gap-2 justify-start items-center absolute left-[16px] bottom-[40px]">
    //                 <div className="z-1 p-1 rounded-md border border-solid border-slate-200 flex justify-center items-center">
    //                     <img className="w-[16px] h-[16px]" src={getImage(data?.icon)} />
    //                 </div>
    //                 <div className="text-white text-[16px] font-bold line-clamp-2">{data.name}</div>
    //             </div>
    //             <div className="absolute left-[16px] bottom-[8px]">
    //                 {like === 'market' &&
    //                     (marketActive ? (
    //                         <div
    //                             onClick={(e) => {
    //                                 favoriteCancel({ marketUid: data.uid }).then((res) => {
    //                                     if (res) {
    //                                         setMarketActive(false);
    //                                         dispatch(
    //                                             openSnackbar({
    //                                                 open: true,
    //                                                 message: '取消收藏成功',
    //                                                 variant: 'alert',
    //                                                 alert: {
    //                                                     color: 'success'
    //                                                 },
    //                                                 close: false
    //                                             })
    //                                         );
    //                                     }
    //                                 });
    //                                 e.stopPropagation();
    //                             }}
    //                         >
    //                             <GradeIcon sx={{ color: '#ecc94b99' }} fontSize="small" />
    //                         </div>
    //                     ) : (
    //                         <div
    //                             onClick={(e) => {
    //                                 favoriteCollect({ marketUid: data.uid }).then((res) => {
    //                                     if (res) {
    //                                         setMarketActive(true);
    //                                         dispatch(
    //                                             openSnackbar({
    //                                                 open: true,
    //                                                 message: '收藏成功',
    //                                                 variant: 'alert',
    //                                                 alert: {
    //                                                     color: 'success'
    //                                                 },
    //                                                 close: false
    //                                             })
    //                                         );
    //                                     }
    //                                 });

    //                                 e.stopPropagation();
    //                             }}
    //                         >
    //                             <GradeOutlinedIcon sx={{ color: '#fff' }} fontSize="small" />
    //                         </div>
    //                     ))}
    //                 {like === 'collect' &&
    //                     (active ? (
    //                         <div
    //                             onClick={(e) => {
    //                                 favoriteCollect({ marketUid: data.uid }).then((res) => {
    //                                     if (res) {
    //                                         dispatch(
    //                                             openSnackbar({
    //                                                 open: true,
    //                                                 message: '收藏成功',
    //                                                 variant: 'alert',
    //                                                 alert: {
    //                                                     color: 'success'
    //                                                 },
    //                                                 close: false
    //                                             })
    //                                         );
    //                                     }
    //                                 });
    //                                 setActive(false);
    //                                 e.stopPropagation();
    //                             }}
    //                             className="absolute left-[16px] bottom-[11px]"
    //                         >
    //                             <GradeOutlinedIcon sx={{ color: '#0003' }} fontSize="small" />
    //                         </div>
    //                     ) : (
    //                         <div
    //                             onClick={(e) => {
    //                                 favoriteCancel({ marketUid: data.uid }).then((res) => {
    //                                     if (res) {
    //                                         dispatch(
    //                                             openSnackbar({
    //                                                 open: true,
    //                                                 message: '取消收藏成功',
    //                                                 variant: 'alert',
    //                                                 alert: {
    //                                                     color: 'success'
    //                                                 },
    //                                                 close: false
    //                                             })
    //                                         );
    //                                     }
    //                                 });
    //                                 setActive(true);
    //                                 e.stopPropagation();
    //                             }}
    //                             className="absolute left-[16px] bottom-[11px]"
    //                         >
    //                             <GradeIcon sx={{ color: '#ecc94b99' }} fontSize="small" />
    //                         </div>
    //                     ))}
    //             </div>
    //         </div>
    //         <div className="absolute right-[16px] bottom-[16px] w-7 h-7 rounded-full bg-[#673ab7] hidden group-hover:block">
    //             <div className="w-full h-full flex justify-center items-center">
    //                 <ArrowForwardIcon fontSize="small" sx={{ color: '#fff' }} />
    //             </div>
    //         </div>
    //     </div>
    // );
};
export default MarketTemplate;
