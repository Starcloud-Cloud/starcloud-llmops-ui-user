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
                        <Image
                            preview={false}
                            width={30}
                            height={30}
                            src={require('../../../../../assets/images/category/' + data?.icon + '.svg')}
                        />
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
