import React, { useEffect } from 'react';

// material-ui
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Card, CardContent, Divider, Grid, Theme, Tooltip, Typography } from '@mui/material';

// project imports
import dayjs from 'dayjs';
import { gridSpacing } from 'store/constant';
import { LoadingDot } from 'ui-component/LoadingDot';
import { IHistory } from './Chat';

import User from 'assets/images/users/user-round.svg';
import copy from 'clipboard-copy';
import { t } from 'hooks/web/useI18n';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import ChatMarkdown from 'ui-component/Markdown';
import { LoadingSpin } from 'ui-component/LoadingSpin';
import { WebPageInfo } from '../../../../../ui-component/webPageInfo/index';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ConfigProvider, Popover, Tag } from 'antd';
import { isMobile } from 'react-device-detect';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { ImageCard } from 'ui-component/imageCard';
import imgError from 'assets/images/img_error.svg';
import ReplayIcon from '@mui/icons-material/Replay';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// ==============================|| CHAT MESSAGE HISTORY ||============================== //

interface ChartHistoryProps {
    data: IHistory[];
    theme: Theme;
    chatBoxHeight?: number;
    handleRetry?: (index: number) => void;
    handleExample?: (q: string) => void;
}

const value2JsonMd = (value: any, type: number) => `这里是${type === 1 ? '输入信息' : '输出信息'} :

~~~json
${JSON.stringify(value)}
~~~
`;

const ChatHistory = ({ data, theme, handleRetry, chatBoxHeight, handleExample }: ChartHistoryProps) => {
    const [currentChat, setCurrentChat] = React.useState('');
    const [expandedItems, setExpandedItems] = React.useState<any[]>([]);

    const toggleItem = (item: any) => {
        if (expandedItems.includes(item)) {
            // 如果项目已展开，则收起它
            setExpandedItems(expandedItems.filter((i) => i !== item));
        } else {
            // 如果项目未展开，则展开它
            setExpandedItems([...expandedItems, item]);
        }
    };

    useEffect(() => {
        const handleError = (event: any) => {
            const target = event.target;
            if (target instanceof HTMLImageElement) {
                target.src = imgError;
                target.alt = '图片加载异常';
            }
        };

        window.addEventListener('error', handleError, true);

        return () => {
            window.removeEventListener('error', handleError, true);
        };
    }, []);

    return (
        <Grid item xs={12} className="p-[12px] h-full">
            <Grid container spacing={gridSpacing}>
                {data.map((history, index) => (
                    <React.Fragment key={index}>
                        {history.message && (
                            <Grid item xs={12} className="mt-3">
                                <Grid
                                    container
                                    spacing={gridSpacing}
                                    style={{ marginLeft: 0, width: '100%' }}
                                    onMouseEnter={() => setCurrentChat(`${index}-message`)}
                                    onMouseLeave={() => setCurrentChat('')}
                                >
                                    <div className="w-full flex">
                                        <div className="w-full">
                                            <Grid item xs={12}>
                                                <Grid item xs={12}>
                                                    <Typography
                                                        align="right"
                                                        variant="subtitle2"
                                                        color={theme.palette.mode === 'dark' ? 'dark.900' : ''}
                                                        className="h-[19px]"
                                                    >
                                                        {currentChat === `${index}-message` &&
                                                            dayjs(history.createTime).format('YYYY-MM-DD HH:mm:ss')}
                                                    </Typography>
                                                </Grid>
                                                <Card
                                                    sx={{
                                                        display: 'inline-block',
                                                        float: 'right',
                                                        bgcolor: theme.palette.mode === 'dark' ? 'grey.600' : theme.palette.primary.light
                                                    }}
                                                >
                                                    <CardContent sx={{ width: '100%', ml: 'auto' }} className="px-[18px] !py-[12px]">
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={12}>
                                                                <div className="text-sm whitespace-pre-line text-[#364152]">
                                                                    {history.message}
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </div>
                                        <img className="w-[35px] h-[35px] rounded-xl ml-1" src={User} alt="" />
                                    </div>
                                </Grid>
                            </Grid>
                        )}
                        {history.isAds ? (
                            history.ads && (
                                <Grid item xs={12}>
                                    <Grid container spacing={gridSpacing}>
                                        <Grid
                                            item
                                            xs={12}
                                            className="flex"
                                            onMouseEnter={() => setCurrentChat(`${index}-answer`)}
                                            onMouseLeave={() => setCurrentChat('')}
                                        >
                                            <div className="flex flex-col w-full">
                                                <Card
                                                    sx={{
                                                        display: 'inline-block'
                                                    }}
                                                    className="bg-[#f2f3f5] w-[70%] m-[auto]"
                                                >
                                                    <CardContent className="px-[18px] !py-[12px]">
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={12}>
                                                                <div className="relative">
                                                                    <div className="text-sm whitespace-pre-line text-[#364152] flex justify-center items-center">
                                                                        {history.ads}
                                                                    </div>
                                                                    <Tooltip title={'这是一条广告'} placement="top" arrow>
                                                                        <HelpOutlineIcon className="text-base ml-1 cursor-pointer absolute top-[-5px] right-[-10px]" />
                                                                    </Tooltip>
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )
                        ) : history.isStatement ? (
                            history.answer && (
                                <Grid item xs={12}>
                                    <Grid container spacing={gridSpacing}>
                                        <Grid
                                            item
                                            xs={12}
                                            className="flex"
                                            onMouseEnter={() => setCurrentChat(`${index}-answer`)}
                                            onMouseLeave={() => setCurrentChat('')}
                                        >
                                            <div className="flex flex-col w-full">
                                                <Card
                                                    sx={{
                                                        display: 'inline-block'
                                                    }}
                                                    className="bg-[#f2f3f5]"
                                                >
                                                    <CardContent className="px-[18px] !py-[12px]">
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={12}>
                                                                {history.answer ? (
                                                                    <div className="text-sm whitespace-pre-line text-[#364152]">
                                                                        {history.answer}
                                                                    </div>
                                                                ) : (
                                                                    <LoadingDot />
                                                                )}
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )
                        ) : (
                            <Grid item xs={12}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid
                                        item
                                        xs={12}
                                        className="flex"
                                        onMouseEnter={() => setCurrentChat(`${index}-answer`)}
                                        onMouseLeave={() => setCurrentChat('')}
                                    >
                                        <div className="w-[35px] h-[35px] flex justify-center items-center  mr-2">
                                            <img className="w-[35px] h-[35px] rounded-xl" src={history.robotAvatar} alt="" />
                                        </div>
                                        <div className="max-w-[calc(100%-43px)]">
                                            <Grid item xs={12} className="flex items-center">
                                                <Typography align="left" variant="subtitle2" className="h-[19px]">
                                                    {history.robotName}
                                                </Typography>
                                                <Typography align="left" variant="subtitle2" className="ml-1">
                                                    {currentChat === `${index}-answer` &&
                                                        dayjs(history.createTime).format('YYYY-MM-DD HH:mm:ss')}
                                                </Typography>
                                            </Grid>
                                            <div className="inline-flex flex-col max-w-full">
                                                <Card
                                                    sx={{
                                                        display: 'inline-block',
                                                        width: '100%'
                                                    }}
                                                    className="bg-[#f2f3f5]"
                                                >
                                                    <CardContent className="px-[24px] !py-[12px]">
                                                        <Grid container spacing={1} className="relative">
                                                            <Grid item xs={12}>
                                                                {history?.process &&
                                                                    history?.process?.map((item: any, index: number) => {
                                                                        if (
                                                                            item.showType === 'tips' ||
                                                                            item.showType == 'url' ||
                                                                            item.showType == 'img'
                                                                        ) {
                                                                            return (
                                                                                <div className="flex flex-col pb-3 rounded-md" key={index}>
                                                                                    <div
                                                                                        onClick={() =>
                                                                                            item.status &&
                                                                                            item.success &&
                                                                                            toggleItem(item.id)
                                                                                        }
                                                                                        className={`flex items-center px-[8px] py-[8px] ${
                                                                                            item.status === 0
                                                                                                ? 'bg-[#dbf3d9]'
                                                                                                : item.status && item.success
                                                                                                ? 'bg-stone-200'
                                                                                                : item.status && !item.success
                                                                                                ? 'bg-red-500'
                                                                                                : ''
                                                                                        }  w-[250px] justify-between rounded-md cursor-pointer`}
                                                                                    >
                                                                                        <div className="flex justify-center">
                                                                                            {item.status === 0 && (
                                                                                                <div className="flex items-center">
                                                                                                    <LoadingSpin />
                                                                                                    <div className="text-sm pl-1 w-[200px] line-clamp-1">
                                                                                                        {/* 工作中 */}
                                                                                                        {item.tips}
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                            {item.status === 1 && item.success && (
                                                                                                <div className="flex items-center">
                                                                                                    <CheckCircleIcon className="text-base text-green-500" />
                                                                                                    <div className="text-sm pl-1 w-[200px] line-clamp-1">
                                                                                                        {/* 完成 */}
                                                                                                        {item.tips}
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                            {item.status === 1 && !item.success && (
                                                                                                <div className="flex items-center">
                                                                                                    <Popover content={item.errorMsg}>
                                                                                                        <ErrorIcon className="text-base text-red-500" />
                                                                                                    </Popover>
                                                                                                    <div className="text-sm pl-1 w-[200px] line-clamp-1">
                                                                                                        {/* {item.errorMsg} */}
                                                                                                        {item.tips}
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                        {/* 完成并且是成功的才能打开 */}
                                                                                        {!!(item.status && item.success) && (
                                                                                            <div className="flex items-center justify-center">
                                                                                                {expandedItems.includes(item.id) ? (
                                                                                                    <ExpandLessIcon className="w-[18px] h-[18px]" />
                                                                                                ) : (
                                                                                                    <ExpandMoreIcon className="w-[18px] h-[18px]" />
                                                                                                )}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    {expandedItems.includes(item.id) && (
                                                                                        <>
                                                                                            {false && (
                                                                                                <div className="pt-[.5em]">
                                                                                                    <div>
                                                                                                        <ChatMarkdown
                                                                                                            textContent={value2JsonMd(
                                                                                                                item.input,
                                                                                                                1
                                                                                                            )}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <ChatMarkdown
                                                                                                            textContent={value2JsonMd(
                                                                                                                item.data,
                                                                                                                2
                                                                                                            )}
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                            {item.showType === 'url' && (
                                                                                                <WebPageInfo data={item.data || []} />
                                                                                            )}
                                                                                            {item.showType === 'img' && (
                                                                                                <ImageCard data={item.data || []} />
                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        }
                                                                    })}
                                                                {history.context &&
                                                                    history.context.map((item: any, index: number) => (
                                                                        <div key={index}>
                                                                            {history?.answer ? (
                                                                                <div
                                                                                    className={`text-sm whitespace-pre-line  ${
                                                                                        history.status === 'ERROR'
                                                                                            ? 'text-[red]'
                                                                                            : 'text-[#364152]'
                                                                                    }`}
                                                                                >
                                                                                    <ChatMarkdown textContent={history.answer} />
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex justify-start mb-1">
                                                                                    <LoadingDot />
                                                                                </div>
                                                                            )}
                                                                            {!history.isNew && (
                                                                                <>
                                                                                    <div className="py-1">
                                                                                        <Divider />
                                                                                    </div>
                                                                                    <div className="flex items-center mt-1">
                                                                                        <div
                                                                                            className="text-xs"
                                                                                            style={{ flex: '0 0 37px' }}
                                                                                        >
                                                                                            来源：
                                                                                        </div>
                                                                                        <div className="grid grid-cols-3 gap-1 flex: 1 w-full">
                                                                                            {item?.data?.map((v: any, index: number) => (
                                                                                                <Popover
                                                                                                    key={index}
                                                                                                    content={
                                                                                                        <div className="max-w-[250px]">
                                                                                                            <span>{v?.desc}</span>
                                                                                                            {isMobile && (
                                                                                                                <div>
                                                                                                                    <a
                                                                                                                        target="_blank"
                                                                                                                        href={v.url}
                                                                                                                    >
                                                                                                                        点击查看
                                                                                                                    </a>
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    }
                                                                                                    trigger={isMobile ? 'click' : 'hover'}
                                                                                                    title={
                                                                                                        <div className="w-[250px]">
                                                                                                            {v.name}
                                                                                                        </div>
                                                                                                    }
                                                                                                >
                                                                                                    {/* <ConfigProvider
                                                                                                        theme={{
                                                                                                            components: {
                                                                                                                Tag: {
                                                                                                                    defaultBg: '#ede7f6',
                                                                                                                    defaultColor: '#673ab7'
                                                                                                                }
                                                                                                            }
                                                                                                        }}
                                                                                                    > */}
                                                                                                    <Tag
                                                                                                        className="cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis w-full !text-[12px]"
                                                                                                        bordered={false}
                                                                                                        color={'purple'}
                                                                                                        onClick={() =>
                                                                                                            v.type === 'WEB' &&
                                                                                                            !isMobile &&
                                                                                                            window.open(v?.url)
                                                                                                        }
                                                                                                    >
                                                                                                        <span>{index + 1}.</span>
                                                                                                        <span className="ml-[2px]">
                                                                                                            {v?.name}
                                                                                                        </span>
                                                                                                    </Tag>
                                                                                                    {/* </ConfigProvider> */}
                                                                                                </Popover>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                {!history?.context &&
                                                                    (history?.answer ? (
                                                                        <div
                                                                            className={`text-sm whitespace-pre-line  ${
                                                                                history.status === 'ERROR' ? 'text-[red]' : 'text-[#364152]'
                                                                            }`}
                                                                        >
                                                                            {history?.aiModel?.includes('gpt-4') && (
                                                                                <div
                                                                                    style={{
                                                                                        borderWidth: '0 24px 24px 0',

                                                                                        borderColor:
                                                                                            'transparent #ede8f6 transparent transparent'
                                                                                    }}
                                                                                    className="w-0 h-0 border-solid rounded-tr-[8px] absolute right-[-24px] top-[-4px]"
                                                                                >
                                                                                    <span className="absolute top-[-1px] right-[-20px]">
                                                                                        4
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            <ChatMarkdown textContent={history.answer} />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex justify-start">
                                                                            <LoadingDot />
                                                                        </div>
                                                                    ))}
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                                {/* 正在生成的没有, 只有error的才有重试 */}
                                                {!history.isNew && (
                                                    <div className=" leading-5 mt-2 inline-block transition-opacity text-[#B5BED0]">
                                                        <Tooltip title={'复制'}>
                                                            <ContentCopyIcon
                                                                className="text-[16px] cursor-pointer"
                                                                onClick={() => {
                                                                    copy(history.answer || '');
                                                                    dispatch(
                                                                        openSnackbar({
                                                                            open: true,
                                                                            message: t('market.copySuccess'),
                                                                            variant: 'alert',
                                                                            alert: {
                                                                                color: 'success'
                                                                            },
                                                                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                                                                            close: false
                                                                        })
                                                                    );
                                                                }}
                                                            />
                                                        </Tooltip>
                                                        {history.status === 'ERROR' && (
                                                            <Tooltip title={'重试'}>
                                                                <ReplayIcon
                                                                    className="text-[16px] cursor-pointer ml-1"
                                                                    onClick={() => handleRetry && handleRetry(index)}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    </div>
                                                )}

                                                {/* 正在执行的才有 */}
                                                {history.isNew &&
                                                    (history.answer ? (
                                                        <div className="text-[13px] leading-5 mt-2 inline-block transition-opacity text-[#B5BED0]">
                                                            正在回答中...
                                                        </div>
                                                    ) : (
                                                        <div className="text-[13px] leading-5 mt-2  inline-block transition-opacity text-[#B5BED0]">
                                                            正在思考中...
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </React.Fragment>
                ))}
            </Grid>
        </Grid>
    );
};

export default ChatHistory;
