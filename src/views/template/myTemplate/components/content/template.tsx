import { Card, CardContent, Box, Typography, Tooltip, Link } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import { Image } from 'antd';
import marketStore from 'store/market';
import { favoriteCollect, favoriteCancel } from 'api/template/collect';
import './textnoWarp.scss';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useEffect, useState } from 'react';
function Template({ like, data, handleDetail }: any) {
    const { categoryList } = marketStore();
    const [active, setActive] = useState(false);
    const [marketActive, setMarketActive] = useState(false);
    useEffect(() => {
        if (data.isFavorite) {
            setMarketActive(true);
        }
    }, []);
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
    return (
        <Card
            onClick={() => handleDetail(data)}
            sx={{
                aspectRatio: '186 / 220',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid',
                borderColor: '#E6E6E7',
                cursor: 'pointer',
                ':hover': {
                    borderColor: '#CECAD5',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    '.arrow_btn': {
                        display: 'block'
                    }
                },
                p: 2
            }}
        >
            <CardContent
                sx={{
                    p: '0',
                    pt: '8px'
                }}
            >
                {data?.icon && (
                    <div className="w-9 h-9 bg-cover rounded-xl border border-solid border-slate-200 cursor-pointer overflow-hidden flex justify-center items-center">
                        <Image preview={false} width={30} height={30} src={getImage(data?.icon)} />
                    </div>
                )}
                <Tooltip placement="top" disableInteractive title={data.name}>
                    <Typography
                        className=" textnoWarp active cursor overflow-hidden line-clamp-2"
                        gutterBottom
                        variant="h3"
                        sx={{ fontSize: '1.1rem' }}
                        component="div"
                        my={1}
                    >
                        {data.name}
                    </Typography>
                </Tooltip>
                <Tooltip placement="top" disableInteractive title={data.description}>
                    <Typography
                        sx={{ fontSize: '.9rem' }}
                        className="leading-[1.2rem] line-clamp-3 text-[#15273799]"
                        variant="body2"
                        lineHeight="1.1rem"
                    >
                        {data.description}
                    </Typography>
                </Tooltip>
            </CardContent>
            <div className="absolute right-3 bottom-3 w-7 h-7 rounded-full bg-[#673ab7] arrow_btn hidden">
                <div className="w-full h-full flex justify-center items-center">
                    <ArrowForwardIcon fontSize="small" sx={{ color: '#fff' }} />
                </div>
            </div>
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
                        className="absolute left-[16px] bottom-[11px]"
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
                        className="absolute left-[16px] bottom-[11px]"
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
            <Box position="absolute" left="16px" bottom="5px">
                {data.categories &&
                    data.categories.map((item: string) => (
                        <Link color="secondary" href="#" key={item} mr={1} fontSize=".9rem">
                            #{categoryList?.find((el: { code: string }) => el.code === item)?.name}
                        </Link>
                    ))}
            </Box>
        </Card>
    );
}

export default Template;
