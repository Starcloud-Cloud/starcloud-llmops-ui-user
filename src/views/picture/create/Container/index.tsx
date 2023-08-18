import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { IconButton } from '@mui/material';
import MuiTooltip from '@mui/material/Tooltip';
import { Divider, Space } from 'antd';
import { translateText } from 'api/picture/create';
import imgLoading from 'assets/images/picture/loading.gif';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { downloadFile } from 'utils/download';
import PicModal from '../Modal';
import { IImageListType, IImageListTypeChildImages } from '../index';
import './index.scss';
import InfiniteScroll from 'react-infinite-scroll-component';

export const PictureCreateContainer = ({
    menuVisible,
    imgList,
    setMenuVisible,
    width,
    height,
    isFetch,
    setInputValue,
    setInputValueTranslate,
    fetchMoreData,
    hasMore
}: {
    menuVisible?: boolean;
    imgList: IImageListType;
    setMenuVisible: (menuVisible: boolean) => void;
    width: number;
    height: number;
    isFetch: boolean;
    setInputValue: (value: string) => void;
    setInputValueTranslate: (flag: boolean) => void;
    fetchMoreData: any;
    hasMore: boolean;
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<string | undefined>(undefined);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentImageList, setCurrentImageList] = useState<IImageListTypeChildImages[]>([]);
    const [open, setOpen] = React.useState(false);
    const [record, setRecord] = useState<{
        height: number;
        width: number;
        engine: string;
        prompt: string;
    } | null>(null);

    const [currentTranslateIndex, setCurrentTranslateIndex] = useState<number>();
    const [currentTranslateText, setCurrentTranslateText] = useState<string>('');

    const handleInputValueTranslate = (value: string, index: number) => {
        setCurrentTranslateText('翻译中...');
        setCurrentTranslateIndex(index);
        if (value) {
            translateText({
                textList: [value],
                sourceLanguage: 'en',
                targetLanguage: 'zh'
            }).then((res) => {
                setCurrentTranslateText(res.translatedList[0].translated);
            });
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleMouseEnter = (index: string) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(undefined);
    };

    const batchHandle = (images: IImageListTypeChildImages[]) => {
        images.forEach((img) => {
            downloadFile(img.url, `${img.uuid}.${img.media_type?.split('/')[1]}`);
        });
    };

    return (
        <div className="pcm_container" style={menuVisible ? {} : { width: '100%' }}>
            <div>
                <IconButton onClick={() => setMenuVisible(!menuVisible)} size="large" aria-label="chat menu collapse">
                    <MenuRoundedIcon />
                </IconButton>
            </div>
            <div className="h-full">
                <div
                    id="scrollableDiv"
                    className="h-[calc(100vh-208px)] xs:overflow-y-auto lg:overflow-y-hidden  hover:overflow-y-auto"
                    style={{ scrollbarGutter: 'stable' }}
                >
                    <InfiniteScroll
                        scrollableTarget="scrollableDiv"
                        dataLength={imgList?.length || 0}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={<h4>Loading...</h4>}
                    >
                        {imgList.map((item, index) => (
                            <div key={index}>
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between w-full">
                                        <div className="flex items-center w-4/5">
                                            {!item.create && (
                                                <div className="text-base text-zinc-500" style={{ flex: '0 0 170px' }}>
                                                    {dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
                                                </div>
                                            )}
                                            <div className="overflow-hidden overflow-ellipsis whitespace-nowrap  text-base font-medium min-h-[24px]">
                                                {index > 0 ? (
                                                    <MuiTooltip
                                                        title={
                                                            <div>
                                                                <span>
                                                                    {index === currentTranslateIndex ? currentTranslateText : item.prompt}
                                                                </span>
                                                            </div>
                                                        }
                                                        placement="top-start"
                                                    >
                                                        <span className="ml-1">
                                                            {index === currentTranslateIndex ? currentTranslateText : item.prompt}
                                                        </span>
                                                    </MuiTooltip>
                                                ) : (
                                                    item.prompt
                                                )}
                                            </div>
                                            {!item.create && (
                                                <MuiTooltip title="再次使用描述" arrow placement="top">
                                                    <ArrowCircleLeftOutlinedIcon
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            setInputValue(item.prompt);
                                                            setInputValueTranslate(true);
                                                        }}
                                                    />
                                                </MuiTooltip>
                                            )}
                                        </div>
                                        {!item.create && (
                                            <Space className="w-1/5 flex justify-end">
                                                <div className="bg-black/50 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer">
                                                    <MuiTooltip title="翻译成中文" arrow placement="top">
                                                        <svg
                                                            onClick={() => handleInputValueTranslate(item.prompt, index)}
                                                            className="text-base cursor-pointer"
                                                            viewBox="0 0 1024 1024"
                                                            version="1.1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            p-id="11576"
                                                            width="16"
                                                            height="16"
                                                        >
                                                            <path
                                                                d="M160 144a32 32 0 0 0-32 32V864a32 32 0 0 0 32 32h688a32 32 0 0 0 32-32V176a32 32 0 0 0-32-32H160z m0-64h688a96 96 0 0 1 96 96V864a96 96 0 0 1-96 96H160a96 96 0 0 1-96-96V176a96 96 0 0 1 96-96z"
                                                                fill="#ffffff"
                                                                p-id="11577"
                                                            ></path>
                                                            <path
                                                                d="M482.176 262.272h59.616v94.4h196v239.072h-196v184.416h-59.616v-184.416H286.72v-239.04h195.456V262.24z m-137.504 277.152h137.504v-126.4H344.64v126.4z m197.12 0h138.048v-126.4H541.76v126.4z"
                                                                fill="#ffffff"
                                                                p-id="11578"
                                                            ></path>
                                                        </svg>
                                                    </MuiTooltip>
                                                </div>
                                                <div className="bg-black/50 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer">
                                                    <MuiTooltip title="下载" arrow placement="top">
                                                        <CloudDownloadIcon
                                                            style={{ color: '#fff', height: '16px' }}
                                                            onClick={() => batchHandle(item.images)}
                                                        />
                                                    </MuiTooltip>
                                                </div>
                                            </Space>
                                        )}
                                    </div>
                                    <div className="w-[full] grid grid-cols-2 gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                        {item.images.map((img, imgIndex) =>
                                            img.url === 'new_img' ? (
                                                <div
                                                    className="group relative shrink grow overflow-hidden rounded bg-zinc-900"
                                                    key={imgIndex}
                                                    onMouseEnter={() => handleMouseEnter(img.uuid)}
                                                    onMouseLeave={handleMouseLeave}
                                                    onClick={() => {
                                                        setCurrentIndex(imgIndex);
                                                    }}
                                                >
                                                    <div
                                                        className="h-full w-full object-cover duration-500 opacity-100 rounded-md cursor-pointer bg-white flex justify-center items-center border-solid border-2 border-[#673ab7]"
                                                        style={{ aspectRatio: width / height }}
                                                    >
                                                        {isFetch ? (
                                                            <img width={60} src={imgLoading} alt="loading" />
                                                        ) : (
                                                            <svg
                                                                version="1.1"
                                                                id="Layer_1"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                x="0px"
                                                                y="0px"
                                                                width="48px"
                                                                height="48px"
                                                                viewBox="0 0 48 48"
                                                                enableBackground="new 0 0 48 48"
                                                                xmlSpace="preserve"
                                                            >
                                                                <image
                                                                    id="image0"
                                                                    width="48"
                                                                    height="48"
                                                                    x="0"
                                                                    y="0"
                                                                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
                AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABFFBMVEUAAAAbidsSptUZmtcV
                p9MWn9cUp9IIxsYA3bgA37kA27YhhN4Wo9QXnNsTp9MXntYVodUTptMMvcoA4LoA3roA3rUA4rwH
                zcIRsc8Up9UdiuIeiOEdiOIOs8yMAP9DW+tBXOlDWupFWuw1beZEXOtgOPJRS+9WRO8qeOU8Y+li
                OPINvcqOBP90H/iOAv+NA/8Xmtkakt4VodcJxsQtdOVrLvdgPfRWS/JOVPB+FvtyKPhoNfYSrNFf
                P/QUptUXn9dfQPRIWu9gP/Q8betcQfQArd46ZegqgOcEtOJrL/cCsuAhi+cDsd46bes1behxKPgA
                rdsFstsDst0pgeVFXu9cQ/NpM/ZbQ/M5b+lfQfOSAP/////updnfAAAAW3RSTlMAHCtHV3KCYlM3
                HB8vTV18qrqaelwfPYqqiz1cenwfii+6XZqLTap8iqqaTT2KelyaiqpsbHqKmqqKmqqauop6i3xd
                TS8ffGw9fHqKXJpNTRw4U2NygnJXRyscgI11jwAAAAFiS0dEW3S8lTQAAAAHdElNRQfnBgcPKQZz
                ezFgAAAgBElEQVR42u2d6WPbVnbFOZO004ayE9txRiPJrGl6WJkRaTXTxZaqluPWqWzX6bTpNv3/
                /5ASBBeQxPLevecuD8T5kG+RQfzuO+e+BUCvd0T6xS9++csvvvjiyy+//JOF/nStX/3qz/58oa++
                +sr6AjtJqH/y4MHDh19/882jEj1+/KSgb799an21nXDqP3j49del2Mvgr/Wd9WV34uskG/GP6vT4
                8a+fVKkrgYSVjfpHDTqtgZ8nQRcEKSqEfZXv76urgMT04OFvmtmH0u8qIC09ePhNCPzTYPhdI5CO
                Akd+xNDfyPqndWrSSSD8Bf5o+p0FeNfDh4HwY62/q4AEFNLtrwf/r4n4uxBwqn4EfZr3dxbgV/2w
                hp/c+HUW4Fox9JmDv7MAdwrv+lD4nzz51vpHd1rpQRR9euPfZYBLxdFHDf8uA3wopukH4+8KwF6x
                gx+Kv8sAY0UmPx5/VwCWivZ+XO/XFYC9oge/wPB/0h0LMFKfgP8RY9G/KwBXOqPglxj+XQFYiIRf
                in83D9RW3IKvNP7OAZRFwy/IvysATRHxn4p0f10BaCt+1Ud8+HcFoCgifmH+3UKQkqj4Re3/CepA
                QP/s7Ox8o7N+3/p2exMV/6NTWfyAAliwP7841KIKrG+6H5HxS9v/E24LcHZ2UaPzrgYyEVt/Hf6c
                FqCefl4CXQ0whr8Gf3oCNNPvbKDHwi+z97MnagKE4j/yEjgJfbTPij8tAfox+I+5BDjDX4c/KQFi
                8R9rCbDw6/CnJAAF/1GWQAr847eCqfiPrgR4+JX4x3cAHP4LnVlj0dLJMxZ+8eW/lWIDgIn/eEqA
                OfwfKfGP7AD753z+x5EDXP5K/h/JHzD8j8MEuPi1+EcGAIx/200gGf5RMwCM/W9NYGCNyS1+jfX/
                paICADj8c/3Fc2tSx84/KgDg/C8uhi+sWQmItfJ/XPwvRsOXz615ocUf/nr8YxoACf4LCxgOf2tN
                zB1/rQWgKP7Y9q9gAcN2xQDf/l1OAPoy+HMLGL5szWwAMPz1+EdMAOT4Ly1gOG5JDED4O5wACvLP
                LaAljUDHn2wBw+FfWtNj6wSBX60BjOAv0/5vdJkXwHCceCMAGf4e+cuO/4VerSsg6RjA8He4AyjO
                f50BaTcCIP5KDYAr/us2MOlGADH71wsAF/P/gl5tKyDNFQFM+/dI6wiQN/6FDFg0As+tacYLZP8e
                jwALrf/u6XJYVHKNAIy/TgMQs/+nw7/YBAzT2xqA8VdpAKK+FazFv9gEJFcBMP4qARB1/kt4Aaig
                0TDZCgC1/0oB4JT/QQGkMx3E8dcIgKjzvzoTgFyXw4MKSGM6iOOvEABxDwBq8t/vAjNNEqiAp6c4
                /vIBEPkAqFoDWFEACVTACZC//EvAIp//0+W/Pw1IYncQtvynEQCxz38rNoBLjYbJVQCUv3AAxA5/
                df7lBeC6Ar5H8hcOgOjXP+g2gNUFMBxfWXNW4S8bANHDX70BqC4At2dEcMt/4gFA+BCIPv/KAnC6
                NYQd/5IBQPkOjHoDUFsAHisA2v9JBsC3FP76DUB9AfirADB/OQOgfQbKIADqC8BbBYD5ixkA8Stg
                JvxLF4KczgbR/IU6QOpH4CwagKYCcFUBaP4yAfAdlb9JA9BYAI4qALn/IxcA9G9A2gRA6WbQjibW
                4NcC7v+KGQDjE6BGAVByHmBfTk6IoPkLGADnC7BWARBQAD4qAM4fbgC8DwBbBUBIAXioAOwCsIAB
                ML//bMa/qQfMZX5SFM8fOwXkfv7bLACae8BcxgtC2A2ApTzht+QfkgDmFYBeAIAaAHneX5BdAAQX
                wNBwOUCAP6wDROC3NICwFiCT4YIQfAIA6wC/w3z225B/YAuQ6WWL+GMMADH4MxkGQHgCDM0mg/gJ
                AMYAUPhNAyA8ATKZTAYl+PMNABL9K1nyjzEAmwoQaAD5BgCkbxsAcQawkPpJ4acS/JkGAMVvGwAR
                LWAu9Z1BgQaQZwBI71/K1ABGsQWg3QhKNAAcA0DTt9sEzhWbANptgMAKMMMA4IO/Zx0AkS2gehsg
                0gBSDUCAfs84ACgGoLoiKNIAkAxAYvBnsg2AymfCJpPpdLbWdDoZj00aQd63f4EGIETfOgBKpwCT
                yaxU00IRKLUBIg1gvAFIDf5MtgEwOhz501mNptN1DahsDcs0ALEGIEjf2gD2O8B6+hsjWFaKRiOI
                PgNOMADJwZ/JUwc4CaC/LQGFNkCmAYgxAGH6rjrAYPxLTRTaAJkVgHADAG3018lPAMThz11AuA0Q
                2QIINgDSk93R8hIA0fjzEpC9OTIrAGEGoELf2gBGLPyZRPtAoRlgwFFg6b5vK1MDuGTzF60AoRlg
                81FgNfrWHeArNv6F5JaEpQKg3gAU+r6CPPAPmfjX6LXUvRELgJoWUM/6czk4BcAb/oIhIBYA1S2g
                Mn3jDhDFfzaTuTliAXDqY/Bnsj8IzrR/QQsQC4ByAzCg7+Ag+BiBX6YC5ALg1Mfgz2RpAK9A9r+U
                QB8oFgAHBqCz3lcmyykglL+ABUjtARwYgO6kb0eWATDC8of3gfAXgW312MXgz2QYACNU+ydlAUKb
                wJlcDP5MhgaA5w+2ALkOcJMAtoM/k50BSPDHWoBcB7hqAY0HfyY7AxDhD7UAuSWA3ADMB38mMwMY
                4ab/QhYgGAALA7Ca8+/JzACy8S/BH1gAggFw6oN+z84AhPwfmQFyBnB9fWbNfS2rNSBB/jALkDKA
                67+6uLDmvpER/1eC/FEWILQGeJ39/nNr7msZfhJCjj/oaJDEGuAP1/kN6FuDX8mmA7xEbf9XCZIB
                AlPA6xV+PwZg900oSf6QPUH8gwDX21tw1AYgzx/SBKA3Aa6L98Aa/FoWBqDBH5AB4CngDn43CWBh
                AEv+IguA2AKATgGv926ClwTQN4D8+J84f34GIA1gH/8RG8AIcvxfowBgBnB9fXgbjtYARojHf8LE
                XAlAGUAZfjctoLoBKPLnNgEYAyjH7yYBlA1g/fivQgPALgCIAVTgd5MAygagy5+5FAQwgB+q8B+p
                AWwe/1doAJfi3BqAAVxX34pjNIDt639UGgBuAbAN4LruZliTX0nTALb8lQKAVwBcA6jF7yUBFLeB
                C29/0uPPKQCeAVw33A4nCaDHv/j2N60GYMZZCGAZQBP+4zOAIn+1BoBVAAwDuG7kf2wGsPPyR8UA
                YBQAwwCa8XtpAbUMwI4/vQDIBhCC30sCGOBXbQAYBUA1gCD8XhJAxwD2+Gs2AIwCIB4ECuR/RAaw
                /+5/3QCgTwMl8R+RAVwefPxHNwDIBUB5FiB7ziNQ1uhzyfM//PaPcgCQC4DQAgYPfy8JIG4AJZ9+
                0g4A6m5gfAsYgd9LAhjwVw8AagFEG0AU/6MwgNIvv6kHAPFASOzDIFH4Ly58PBEsiv+y9MuP6gFA
                nQVGzgEj+ftIAFEDqPjwo3oAEAsg7pVwP8TeHR8JoI/fIACIk4CoOWDs8G+9AYyqvvtrEADEHjCm
                BYzn72MRQI7/sEoGAUBLgIg5IAG/jwSQMoBq/CYBQEuAcAOg8PeRAOr4TQKAmADBLSCJf3sN4LKO
                v0kA0FYBQhMguvvP1VoDqMVvEwC0FiAwAUjD/8JHCyjwLEA9fqE3QTaJlACBq4BU/i4SAP4sQBN+
                mwCgGUDYIkD4zu+ePCQA2gAqZ/62HaDgHIAY/xftNIDG4W9lAGIJQLX/Cx/7QFgDCMBv1AHSEuB3
                ovxdJADSAELwWwWA1CIAh7+HBAAaQBB+qwCQWgbm8G+XAQTiT8sAGltAFn8PiwAoAwjFn5YBNCYA
                efq3lIcEwBhA88zPugOkGUBTAvD4e0gAiAGMwoe/VQAQDaB+DkCf/rfKAGLwmwWAyGlg5vhviQFE
                4U/MAJ6K8vfQArINIA6/mQEQXw/4O1H+DhKAawCx+NPqAOsTgM3fQwLwDCAav9EuMPmZ8Kei/FM3
                AAJ+KwOgvh/2RJK/h30ghgFQ8Ke1BtirSwAAfw8JoIs/sTXAugeCeOu/uRwkAPUoKBG/lQGQXxB+
                Isk/XQOg4rcyAPoL4p9J8k/VAOj4jQyA8X74ihaAuwCcK8kWMG7Rd18m/BlvBn0qyd9BAkTPAXn4
                jaaAjC+EVLQAiAmAiwSINAAmfqMA4Hwh5pkg/+QMgIs/pUfB1iqdBEIawOQMgI8/pWdBVyptAUAN
                gIMWMMIA+PSNDID3gagTwQBwkADBBgDBb2MAvI9EPpMLAAcJEGoAGPwJvQ1kq1O5AEjGAFD4TQyA
                yb+sBUDxT8QAYPjTeR9cQSUPBaMaAActYIABAPGn80LIgp6JNQAOEqDZAJD4LRaBmd+I7pVsBMAa
                AAcJ0LANBJj27yiVNwLvSC4A7A2gfh8Yjd/AAAD8T+QCwLcBwOkbGAA7/3uHPSAuABwYQHULKIBf
                3wAQ/A96QFwA2D8OUtkCiuBXnwJC+O8vAwENwD4BKgxABr/2FJC3/r/RUzkDME+AUgO4FMKvbQAg
                /vs9IK4D9GkA+MbfyAAA7X+uvR4Qx9+jAQjiVzYAGP+9HrDVBiBJX9kAcPx3e0BgB+jOAGTx6xoA
                kH9PqgO0nwPuGIA0flUDwEz/cp1IGYD5PmDRAMTxaxoAcvjvFUA7DUC089M3ACz/nUkA0gDsW0BN
                /IoGAOa/MwlAGoB5C3im5f2qBoBa/dmqcBgAOAV0YgBa+NUMAD38ezuzwFYZQF8Tv5YBCPB/2tYO
                4K8V8SsZwGvk7G+tk3YawNVvNfHrGIDA8O8VJwEtMoCr17OxagFoGIAM/8L7IVtjAFeLuzVtmwHg
                u/+VtrPAlhjA1fJ+tc0AhIZ/rzAJaMc2UI6/dQYgx39bAMAEsDKAwdX6hrXLAATxb2eB6RvA1QZ/
                ywyAyX+wVGMBpG4ABfyz2aRFBsDAP7haTIc2el26jHDSDgO42r1pLTIAMv+rq5K/dlgD62WApE+C
                7f/U9hgAHX/on/wenwDaBnD4W1VbQEkDoPK/qvujuy7wLPWHQUp+q24LKGcAZPyvG/5wcVHpWdIG
                UJpzbTEAkeG/0tYEfoNeBVQ0gHL8LTEAgfQvrYDTZJ8Hvqr6pW0wgNdU/oPQf2FdAafgBNAygOo6
                b4MBCA//pfL/4Sm6BdAxgLrfmb4B0Jd+IvivOsGn4ARQMYDan5m+AZD5D5q6/5J/5wRcAAoG0FDl
                qRuAzvBfalsACb0UsOlXJm4AV/RTf9H8l7X2PXYSaI1feRUYbgCMjZ94/ksL+B6aALIGMAj5jSkb
                AGfbl8I/+we/RyaAaAd4FfQTdbeB3OCn8d8UAMoABDvAMPzKLSD0nYAG/LMMeAZMADkDCMWv3AJ6
                wU/mPxssCwCVAGL4w6e3iRoA88wXmf/iHwYWgFAHGPPr0jQAxtSPyX9VAJ4DIO7HJbkIxD3yy+Cf
                F4Djr4NG/rYUF4HYJ74HnH/9dbYZiEkAgQCILu30DIB/4J/FH1gA+ACId7bkDADxvEfc/k9ZAWAS
                AB0AlGBLzACu7PnjCgAcAKS+JjEDgDzuxWkAM/3NogAQCYANAOKvSsoAME/7cfnP/nZRAN4CgPyj
                EjIA0MOeAy7/2d/1ThEJAAwAek2nsw8Me9aX2QAs9AZSALgACF7zL1EqBoB71JvP/+2iAPgtAIw/
                B79uC0g3AOCT/uwGYDa7WRSAmwaAhV+5BaQaAGTmt9KAz392+6b3914aAGY9p2AASPyIAJjN7t70
                /sFHALDtLAEDwL7nBRAAs7eLAvhHD/z5P8b/PjD4NT8DAP/ZzaIAAj6tLt0AIGrZ+0EQ+FueEAEw
                u+UXAJ8/Ar93A8C/5Aty12Z37AJgN4CYH+LbAATe8TaA3LW3WQGcWfJnzvw28rwNJPKKP0gALBLg
                bs4qADZ/DH7P20Ayb3gE3bhFAfyeUwDMCQAMv18DEHrB5wB03+6yAugb8cfhd2sAYu93xQRA1gJw
                CoDFH4nfqQHIvd4XdfNulwXQM+Af8aBHiDwagOTbnVH3bcH/7l2P2ASw+EPxe9wHlsQPu31vOQXA
                4I/G7+8giCh+WAe4TIC7f+qRMoA+/4Pjd2cAsvhhHWChAOItwBV/XwYgjR9nAMsEuPvn7G+q8RfA
                78sAxPEDDaBQAJEWQOUvgt/TNpACfuBNXCbA3fvlX43aECLu/wW934cgL9tA5Fe7xgl34+4KBRCx
                GORr+LsxAOxhr2rhFlDyBLhb/d3gECDyl8LvZBFICz+uA1wnwJv1Xw6sAHf8PawCq+FHGsAqAeab
                Px2SAu7wezAA7utdYjTA3bi3+wXQ6zd2gg75mxuA3uDPBDSAPAGyvaCtzlLDb24AuviRBrBKgGwr
                oKAaE6Dix2777cvWAJTxQw1glQDLleDmGjj3Nvdby9IA1PFDDWCVAPlC4F4J7NbA+Zmvhd+iDA1A
                H7+IAZQVwKoK+mdnZ4v/Mq5XnL+dAVjgFzGA1UKg98utkJUBmOCHGsC6BdwsBOIlP/yNDEBx1WdX
                A+Cdu1nzf8O/rnLJNv+5LAzADD/2lm4SYC5zrRrDX9kAlttAdvSxBrBpAXfXgRLjr2sAE1v8QgZw
                uAyQDH51A7DFL2QAlbPABPjrGsCPtvilDAA/C4z8ciVDmgYw0vsedpWQt27LHz4L1Br+qgYw0vse
                tsqNvdnynzu+zAZpGcBoxDgGiRPy1t2JFYAifyUDyPHbG8AAeOsKBoCdBSIvslEqBjC6XG2ImRuA
                xDYQehKgOPx1DGC03RC15j8A3rpboQJQ5a9gAKPCjnhrDQA4CVCb/S0lbgCjnRMR1vwHwFu3YwCw
                rSDkFYZI2ABGu+eh2msAc9AF6tq/tAHs4Zf7Hm6oBsBbt2MAqJ0Abf6SBjA6wC/1PVyT+3uzwx/U
                A6rzlzOAEvz2BoBcBNrlj9kJUOcvZgCl+O0NYIC7c3sGAOkB9fkLGUAp/Xa1gG/3DGDu6uqCJWIA
                VfhbNQe83SsAfg8IvLhgSRhAJf5WGwC/B7TgL2AANfjtDQDXAh7wZ68DmvCHvxKsDr8DA8Dd5P0A
                YLcAJvzRrwSrx+/AAGAJcHMHLgAb/lgDaMDfJgM4DABmD2jDH2kAo0b8bTKA28MC4PWABvO/GbID
                DMDfJgM4DADmMpANf9gUMAh/iwygJAB4LYD++t9SIAMIw+/AAKAfBkAmgBF/jAEE0vdgAAPQjbsF
                FwDqumKFMIBg/B4MAJQAN2X8GS2AFX+AAUTgd7APDLrRZQ0AqwWwaQABBhCF334fGHWjSwOAkQBG
                DQDbAOLwOzAA3NdBoQUwMOLPNIBY/K1pAW/uwAlgFQCsReBo/K1pASv40wvAKgA4i8AE/G0xgCr+
                5ASAXBVF9ACg4PdgAIih9raKP/k8qFUAkDtAGn4HBoC41dX854ZVSRLRAIj4PRjAAHDXbisLgLoV
                bMWfZgBk/C0xgGr+1BYgKQOg42+JAdTwn5tdFE2EKSAHvwcD4N/rGv53/0K7KKsOMH4KyMLvwQD4
                97qOPzEB+EVJVKwBbF7tcsQGUMufuBOYyBQw9LhHqw2glj+1BTDiH9cBvmLj92AA3Htdzz+xBIgy
                AD5+FwbAvNcN/ImPBCVwDACB34UBsO712wb8xARgFiVZ4R0gBH/6BtDIn5gARgYQHAAg/MkbwE0j
                f+IcwIZ/aACg8LswAM69buafVgKEGQAOvwsDYNzrAP5pJUCIAfAn/s4MgH6vQ/jPaRdlwz+kA0Ti
                T9wAmqZ/S9H2AegXxVFAAEDxezgLTr/Xze1/cgnQGABg/B7OgpPvdYj90xPApACaAgCOP2UDCOSf
                1DJwPX7Aqn+LDCAo/jOpViVPY+Xh78MASO126PBPKgGm2vh9GMBAlD/1MKBFAYy18fswgPhb/TbY
                /unHwQ34T9T5J2oAEcOffBgw/qrYmqrjT9QAovhTHwgyKICxNn4fBhDrtXH4E3ogaKLP34UBDET5
                kx8JVe8Bp+r4nRhA1J2OxU9/Jly9AMbq+BM0gGj+9LeCaBfARJ+/DwOIyNp4/IwXgynzn+rj92EA
                ESONwP/uXSoFMNbn78MABpL4OR8J0+U/0ceflgG8pfGf0y9Mlf9BALxiPuqXjAEE3mcafta7YVUL
                QH/4ezGAgSR+jgEEXRhKY338Lk4C9oISgOj+TAPQdICJAX8XR4GDxhkdP+/zAHr8p+rpn5ABMPAz
                PxCjVwBj/eHvxQCa7jILP/MTYWr8J/rD340BDOrxR5z6gBuAWgFMDIa/GwOoS4Ab3vBnfyNQaS9g
                asI/AQPg4md/JlipAMYG+BMwAD5+9ldidQ6E2PB3YgCVMQvAz/9OuEoBbBsAre7PkwEMBPGzDUCl
                AKYWw9+PAZQmAAY/3wA01oKN+Hs2ABR+vgFozAPHFvbv2QBg+AEGoFAAE5Ph78YA9m8wY89HxADE
                mwAr/l4MYLA7+JH4IQYgXQBW/N0YQDEBsPQxBiDcBU5N4v/CyzmQnduLxo8xANkmIOf/Sh2/l4Ng
                BQPA47/7PfgSBTS2sX93BgDt/DYCXaNgE2DG30sHmN9ccOe3Fv1ZgF0N2sffTQeY2asMfVAHuJQo
                f/32z5MBDMTwozrATEIZMDHj78YA7j+I4QcagFAGGPJ3YgD3Hz/J8QcagEwGTIymf14M4P7+48eP
                b+T4ozrApQQywJK/AwPI6C8kaADQy8VngCV/cwO4X+GXTABkAPTwFmDK33gNaE1fNAHm4IsGF4Ap
                f9MAuC/gT8gAwG3g2JK/ZQDc/+vHouQMANoBLgW0gKnV9o+xAewMflkDmAtcPpb/0Iy/lQHs0xc1
                AHgA9HAWMDHa/jc1gPsS/IIGgA+ATO3gb2EAZfQX+izF/1bmZ0AsYGx0/Gsj9SngfQV+wUUgiQDI
                hBr+lvyVA+B9JX3BBJAJgB7AAuz56wZADX3BFnAu94N4+Kerxz/sJoCqBnBfj1/OAKQCoMe0gM3j
                n4YNoJ4BNNAXNACxAOBVwGTz+LdlACh1gE2DX9IA5qK/rD/lDn9T/ionwd8H0Bc0AMEAyPRiTCmB
                wtt/LBsAjQAIoy9nAKIBsKyAYXQJ7Lz90bIBEO8AQ6xf1gDm0j+x11tAjCqB3Zd/mgaAsAGE05cz
                AHn+CwsYhtfAdO/dr6YBINoBRgx+QQMQbgCKFRBSApODbz+0NQDi6IsZgHgDkOvlGud4Oq0Z+yVf
                /mhnBxg5+OUMYK7Df9kGbGpgPDmsgumk4sN/lvyFDCBw0qdiAAOtAvhpH+yiDBaaZv8Z13z12TIA
                ZAyAMPjlDEClAcj1YkhR6zpAGn0pA1BqAHL9SCmAdnWAxMEvZgAfNPn3eq8SMwB0ANDpCxnAXJd/
                r5+WAWADgDH4xQxAsQHI9VMs/9acAuDR/yhzEuzftPnHN4ItOQXAxi9yFFS1ASRWgCF/WAAwvV+s
                A5hb8I9sBA0TABUACPwiHYAR/7hGMPkHASD0ZQxAbQVwXxGNoKEBQAIAhF/EANQnAFuFtwF25wAQ
                AQDDL2EABhMAQgXYJQA7ADDRL2YAJhOA+Aow488NACh+AQMw5l84HOCzBWAGABa/wBqQ8g4AuQLM
                EoAVAGj8+DWguTX9TCHLAVYFwAkAOH58ANyaTQCL6gdUgBF/RgDg8Qt0gIYTwJ0KcNsCMPjj8eMN
                wAn/gAUhowIgNwAS+PEG4IZ/cwXYLANRGwAZ/HADcMS/sQJS+iKAEH64AZguAB7qhb8CIAWAGH70
                FNAZ/4YKsCgAZ/zBAWC+ABhXAQb8KQ2AHH50ADjkX1sB+vwJDcDea3w9G4BL/nUVoF8A8QEgOfzB
                mwBO+ddUgH/+svixAeCWf3UFaPOPbgCE+UMDwDH/ygpwzl8YPzYAXPOvqgDdaWBsAyjOHxkAzvlX
                rAnqFkBcAyCOHxoA7vn3es9LCkB1L8Abf2QAuFr/r6yAV6YFENcAKPAHBkAS/MtOiChuB0fxV8CP
                3ANIhP+iAl6aFYA7/rgGYG6NNUb7bxDR4h81AdDgjwsAB+d/Y7Q3HVSaBkTxl1z63wgWAAm0/3UV
                oNQFRlzfew38R8x/rwJ0moCICaCK/eMagAT57y0IHCV/WAOQTPu/VwFj1Qzwxx8UALeJ8u/1Bi8V
                C6C1/OfWGDl6oZYBEQsASvxBDUCS8b/VT0oW0PH3qvXOgGwB+OMPagCTjf+CfpTPAH/5j2kAkh/+
                uV5IW0DH37nyGOj4Hyv/1faglAVE8NdZ/8U0gHNraFi9kLKAmP2flPi3aPjn+knGAmL2/7X4I86A
                tY7/MgZs+evs/35ETABbiD/TC7gFuDv/0/Gv1fNzKP7zqPO/WgHwmYt/3obFnyqdWQ3/dPi3dvjn
                6hvx12oAOv6NwsSAu8e/MPzbj3+hPqAEYh//VAqAjn+YuJ1A/OtfdAKAyf9Y8GdimUA8f50A6PhH
                iJ4DlLc/JcD/uPBnopUA6e2fKh0Ai/87F6/91lZ8CZzR3v6q0QHw+FujsFJcCRDxqxgAZ/33aPFn
                6p+F1gD92w8KBsDgf3vU/DOF2MA559Mf4vg/MfgfPf6l6muAav0riScA4/xHh3+j/vl5+dBnf/hT
                ehHgc4cfpUVDsK2C8wV7yFd/hVsAMv/jnPqFCfO555VkC4DKv+v91CTKn9r+dfjVJNkDUtu/Dr+i
                BAuAaP8dflXJFQCNf4dfWVIFQLP/Dr+6hAqANPw7/AaSKQAC/w8dfhNJFAAB/7sOv5U88O/oG8oc
                /02H31TgpeBY/u/cfeT12ATdDYzGb/3rO0ELII5/1/j5kA3+btbnRqAmIAp/R9+RIBkQg7/r+5wJ
                gD+cfxf8/sS1gHD8HX2fUsF/+67N73ZJWwwLCKT/oTvi6VrUiUAY/s74/YtC/1MI/g5+GooPgc/N
                B37fdb6fjuIqoLnx6+CnpvAKaLD+23ddu5+k3gd1grVj//ZDxz5lNZnAp+rcn7/rxn0LVGMCnyvg
                LwZ9R75NOqyBT58Obf92vhzyHflW6g9/+Pf/WOrnn3/+z//a6L//J9P//vGP/2d9gZr6fwApfYYx
                DHMWAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA2LTA3VDE1OjQxOjA2KzA4OjAwLJ5v2AAAACV0
                RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNi0wN1QxNTo0MTowNiswODowMF3D12QAAAAASUVORK5CYII="
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="h-full w-full object-cover duration-500 opacity-100 rounded-md cursor-pointer bg-white flex justify-center items-center"
                                                    style={{ aspectRatio: item?.width / item?.height }}
                                                    key={img.uuid}
                                                    onMouseEnter={() => handleMouseEnter(img.uuid)}
                                                    onMouseLeave={handleMouseLeave}
                                                    onClick={() => {
                                                        setCurrentIndex(imgIndex);
                                                        setRecord({
                                                            height: item.height,
                                                            width: item.width,
                                                            prompt: item.prompt,
                                                            engine: item.engine
                                                        });
                                                    }}
                                                >
                                                    <img
                                                        onClick={() => {
                                                            handleOpen();
                                                            setCurrentImageList(item.images);
                                                        }}
                                                        className="h-full w-full object-cover duration-500 opacity-100 rounded-md cursor-pointer"
                                                        src={img.url}
                                                        alt={img.uuid}
                                                    />
                                                    {hoveredIndex === img.uuid && (
                                                        <Space className="absolute top-2 right-2">
                                                            <div
                                                                className="bg-black/50 w-7 h-7 flex justify-center items-center rounded-md cursor-pointer"
                                                                onClick={() =>
                                                                    downloadFile(img.url, `${img.uuid}.${img.media_type?.split('/')[1]}`)
                                                                }
                                                            >
                                                                <MuiTooltip title="下载" arrow placement="top">
                                                                    <CloudDownloadIcon style={{ color: '#fff', height: '16px' }} />
                                                                </MuiTooltip>
                                                            </div>
                                                        </Space>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                                <Divider type="horizontal" />
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>
                {record && (
                    <PicModal
                        open={open}
                        setOpen={setOpen}
                        currentImageList={currentImageList}
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                        engine={record?.engine}
                        prompt={record?.prompt}
                        width={record?.width}
                        height={record?.height}
                    />
                )}
            </div>
        </div>
    );
};
