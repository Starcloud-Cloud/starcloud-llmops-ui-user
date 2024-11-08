import { Tabs, Carousel, Image, Button, Modal, QRCode, Spin } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { contentShare, shareBuildSignature } from 'api/redBook/batchIndex';
import './index.scss';

const Share = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const [carouselValue, setCarouselValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [detailData, setDetailData] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const getDetail = async () => {
        setLoading(true);
        try {
            const result = await contentShare(query.get('uid'));
            setLoading(false);
            setDetailData(result.executeResult);
        } catch (err) {
            setLoading(false);
        }
    };
    useEffect(() => {
        getDetail();
        const script = document.createElement('script');
        script.src = 'https://fe-static.xhscdn.com/biz-static/goten/xhs-1.0.1.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script); // 清理脚本
        };
    }, []);
    const redbookShare = async () => {
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            const res = await shareBuildSignature();
            // @ts-ignore
            xhs.share({
                shareInfo: {
                    type: 'normal', // 必填，笔记类型 'video' | 'normal'
                    title: detailData?.copyWriting?.title, // 笔记标题
                    content: detailData?.copyWriting?.content, // 笔记正文
                    images: detailData?.imageList?.map((item: any) => item.url)
                },
                // verifyConfig: {
                //     app_key: 'red.2AiITQapXH8WFKFH', //必填，应用的唯一标识,
                //     nonce: 'c5cM1kfVLn11Lj02syZI7C', // 必填，服务端生成签名的随机字符串
                //     timestamp: 1731052173737, // 必填，服务端生成签名的时间戳
                //     signature: '80d8ec80f35910faaa8b7ca0798624ba24c6be85811523b0bd65307f37f996b5' // 必填，服务端生成的签名
                // },
                verifyConfig: {
                    appKey: res?.app_key, //必填，应用的唯一标识,
                    nonce: res?.nonce, // 必填，服务端生成签名的随机字符串
                    timestamp: res?.timestamp, // 必填，服务端生成签名的时间戳
                    signature: res?.signature // 必填，服务端生成的签名
                },
                fail: (e: any) => {
                    console.log(e);

                    // 调用失败时执行的回调函数
                }
            });
        } else {
            setOpen(true);
        }
    };
    return (
        <div className="share w-full h-[100vh] flex justify-center">
            {loading ? (
                <Spin className="h-full w-full flex justify-center items-center"></Spin>
            ) : (
                <div className="w-full max-w-[500px] shadow-lg">
                    <Tabs
                        centered
                        items={[
                            {
                                label: '详情页',
                                key: '1',
                                children: (
                                    <div className="h-[calc(100vh-46px)] relative">
                                        <div className="h-full overflow-y-scroll">
                                            <div className="relative max-h-[666px]">
                                                <Carousel
                                                    afterChange={setCarouselValue}
                                                    draggable={true}
                                                    adaptiveHeight
                                                    dots={{ className: 'uls' }}
                                                >
                                                    {detailData?.imageList?.map((item: any) => (
                                                        <Image preview={false} src={item?.url} />
                                                    ))}
                                                </Carousel>
                                                <div className="absolute right-[15px] top-[10px] bg-[#2f3334] text-white rounded-[20px] text-md px-[5px] py-[2px] z-10 leading-[14px]">
                                                    {carouselValue + 1}/{detailData?.imageList?.length}
                                                </div>
                                            </div>
                                            <div className="px-[15px]">
                                                <div className="text-lg font-[600] mt-[15px] mb-2 leading-[140%]">
                                                    {detailData?.copyWriting?.title}
                                                </div>
                                                <div className="text-base font-[400] leading-[150%] text-[#000] whitespace-pre-wrap">
                                                    {detailData?.copyWriting?.content}
                                                </div>
                                                <div className="mt-[40px] flex justify-between text-md text-black/60">
                                                    <div>11-05 杭州</div>
                                                    <div className="flex items-center gap-1">
                                                        <svg
                                                            viewBox="0 0 1024 1024"
                                                            version="1.1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            p-id="4449"
                                                            width="15"
                                                            height="15"
                                                        >
                                                            <path
                                                                d="M672 128 640 128 256 128C217.6 128 192 153.6 192 192l0 640c0 38.4 25.6 64 64 64l512 0c38.4 0 64-25.6 64-64L832 320 832 288 672 128zM800 819.2c0 25.6-19.2 51.2-51.2 51.2L268.8 870.4c-25.6 0-51.2-19.2-51.2-51.2L217.6 204.8c0-25.6 19.2-51.2 51.2-51.2L640 153.6 640 256c0 38.4 25.6 64 64 64l96 0L800 819.2zM716.8 288c-25.6 0-51.2-19.2-51.2-51.2L665.6 160l128 128L716.8 288z"
                                                                p-id="4450"
                                                            ></path>
                                                            <path
                                                                d="M691.2 416 332.8 416C326.4 416 320 409.6 320 403.2l0 0C320 390.4 326.4 384 332.8 384l352 0C697.6 384 704 390.4 704 403.2l0 0C704 409.6 697.6 416 691.2 416z"
                                                                p-id="4451"
                                                            ></path>
                                                            <path
                                                                d="M691.2 563.2 332.8 563.2C326.4 563.2 320 550.4 320 544l0 0c0-6.4 6.4-12.8 12.8-12.8l352 0c6.4 0 12.8 6.4 12.8 12.8l0 0C704 550.4 697.6 563.2 691.2 563.2z"
                                                                p-id="4452"
                                                            ></path>
                                                            <path
                                                                d="M499.2 704 332.8 704C326.4 704 320 697.6 320 684.8l0 0c0-6.4 6.4-12.8 12.8-12.8l160 0c6.4 0 12.8 6.4 12.8 12.8l0 0C512 697.6 505.6 704 499.2 704z"
                                                                p-id="4453"
                                                            ></path>
                                                        </svg>
                                                        生长长图
                                                    </div>
                                                </div>
                                                <div className="flex items-center mt-[15px]">
                                                    <svg
                                                        version="1.1"
                                                        id="Layer_1"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        x="0px"
                                                        y="0px"
                                                        width="30px"
                                                        height="30px"
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
                                                    <div className="flex justify-end w-full ml-[15px] bg-[#f5f5f5] rounded-[100px] px-[15px] py-[9px]">
                                                        <img
                                                            className="h-[20px]"
                                                            src="https://www.135editor.com/ai_editor/_nuxt/assets/images/red_book/toolbar//xhspl.9bd224.png"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="py-[20px] flex flex-col gap-[20px] items-center mb-[53px]">
                                                    <img
                                                        className="w-[50px]"
                                                        src="https://www.135editor.com/ai_editor/_nuxt/assets/images/red_book/toolbar//xhsksj.47cb77.png"
                                                    />
                                                    <div className="text-md">
                                                        <span className="text-[rgba(51,51,51,.6)]">这是一片荒草地，</span>
                                                        <span className="text-[#13386c] cursor-pointer">点击评论</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="bg-white w-full absolute bottom-0 px-[15px] py-[8px] flex items-center"
                                            style={{ borderTop: '1px solid #00000014' }}
                                        >
                                            <div className="w-full bg-[#f5f5f5] rounded-[1000px] text-[#999] text-md h-[36px] mr-[10px] pl-4 flex items-center gap-1">
                                                <svg
                                                    viewBox="0 0 1024 1024"
                                                    version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    p-id="5471"
                                                    width="15"
                                                    height="15"
                                                    fill="#999"
                                                >
                                                    <path
                                                        d="M153.6 902.656a32.256 32.256 0 0 1 0-64h716.8a32.256 32.256 0 0 1 0 64zM743.936 151.04l72.192 72.192a51.2 51.2 0 0 1 0 72.192L358.4 751.616a51.2 51.2 0 0 1-36.352 14.848H226.816a25.6 25.6 0 0 1-25.6-25.6v-97.792a51.2 51.2 0 0 1 14.848-36.352l455.68-455.68a51.2 51.2 0 0 1 72.192 0z m-478.72 497.152v54.272h54.272l442.88-442.88L708.096 204.8z"
                                                        fill="#5A5A68"
                                                        p-id="5472"
                                                    ></path>
                                                </svg>
                                                说点什么...
                                            </div>
                                            <div className="flex items-center gap-2 text-[#333] text-[13px]">
                                                <svg
                                                    viewBox="0 0 1024 1024"
                                                    version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    p-id="6478"
                                                    width="20"
                                                    height="20"
                                                >
                                                    <path
                                                        d="M667.786667 117.333333C832.864 117.333333 938.666667 249.706667 938.666667 427.861333c0 138.250667-125.098667 290.506667-371.573334 461.589334a96.768 96.768 0 0 1-110.186666 0C210.432 718.368 85.333333 566.112 85.333333 427.861333 85.333333 249.706667 191.136 117.333333 356.213333 117.333333c59.616 0 100.053333 20.832 155.786667 68.096C567.744 138.176 608.170667 117.333333 667.786667 117.333333z m0 63.146667c-41.44 0-70.261333 15.189333-116.96 55.04-2.165333 1.845333-14.4 12.373333-17.941334 15.381333a32.32 32.32 0 0 1-41.770666 0c-3.541333-3.018667-15.776-13.536-17.941334-15.381333-46.698667-39.850667-75.52-55.04-116.96-55.04C230.186667 180.48 149.333333 281.258667 149.333333 426.698667 149.333333 537.6 262.858667 675.242667 493.632 834.826667a32.352 32.352 0 0 0 36.736 0C761.141333 675.253333 874.666667 537.6 874.666667 426.698667c0-145.44-80.853333-246.218667-206.88-246.218667z"
                                                        fill="#000000"
                                                        p-id="6479"
                                                    ></path>
                                                </svg>
                                                <div>90+</div>
                                                <svg
                                                    viewBox="0 0 1024 1024"
                                                    version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    p-id="7486"
                                                    width="20"
                                                    height="20"
                                                >
                                                    <path
                                                        d="M325.3 810l139.5-73.3c14.8-7.8 31.5-11.9 48.2-11.9 16.7 0 33.4 4.1 48.2 11.9L700.7 810l-26.6-155.1c-5.8-33.6 5.4-67.9 29.8-91.7l112.7-109.8-155.8-22.6c-33.7-4.9-62.9-26.1-78-56.7L513 232.9l-69.8 141.3c-15.1 30.5-44.3 51.6-78 56.6l-155.8 22.6 112.7 109.8c24.5 23.8 35.6 58.1 29.8 91.7L325.3 810m434.2 95.7c-2.3 0-4.7-0.6-6.9-1.7L533.7 789.1c-6.5-3.4-13.6-5.1-20.7-5.1s-14.2 1.7-20.7 5.1L273.4 904c-2.3 1.1-4.6 1.7-6.9 1.7-8.7 0-16.3-7.8-14.7-17.4l41.8-243.4c2.5-14.4-2.3-29.1-12.8-39.3l-177-172.4c-8.8-8.5-4-23.5 8.2-25.3l244.7-35.5c14.5-2.1 27.1-11.2 33.6-24.3l109.4-221.5c2.7-5.5 8-8.3 13.4-8.3 5.3 0 10.6 2.8 13.3 8.3L635.7 348c6.5 13.1 19.1 22.2 33.6 24.3L914 407.8c12.2 1.8 17.1 16.8 8.3 25.3L745.1 605.6c-10.5 10.2-15.3 24.9-12.8 39.3l41.8 243.4c1.6 9.6-6 17.4-14.6 17.4z"
                                                        fill="#666666"
                                                        p-id="7487"
                                                    ></path>
                                                </svg>
                                                <div>7</div>
                                                <svg
                                                    viewBox="0 0 1071 1024"
                                                    version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    p-id="8513"
                                                    width="20"
                                                    height="20"
                                                >
                                                    <path
                                                        d="M395.701 434.549c0 25.716-18.369 47.759-47.759 47.759-25.716 0-47.759-22.043-47.759-47.759 0-25.716 22.042-47.759 47.759-47.759 29.391 0 47.759 22.043 47.759 47.759v0zM943.095 408.833c0-198.385-183.69-360.032-411.465-360.032-231.449 0-415.138 161.647-415.138 360.032 0 117.562 66.129 227.775 176.341 293.903v113.888c0 11.021 7.348 18.369 14.694 22.042 0 0 3.674 0 7.348 0 7.348 0 11.021 0 14.694-3.674l51.434-33.065c0 0 0 0 3.674-3.674l58.78-36.739c29.391 3.674 58.78 7.348 88.171 7.348 227.775 0 411.465-161.647 411.465-360.032v0zM325.898 673.346c-102.865-58.78-165.321-157.972-165.321-264.513 0-172.669 165.321-315.946 371.053-315.946 202.058 0 367.379 143.278 367.379 315.946 0 172.669-165.321 315.946-367.379 315.946-29.391 0-58.78-3.674-88.171-7.348-7.348-3.674-14.694 0-18.369 0l-69.801 47.759c0 0 0 0 0 0l-18.369 11.021v-84.497c0-7.348-3.674-14.694-11.021-18.369v0zM586.737 423.53c0 25.716-22.042 47.759-47.759 47.759s-47.759-22.042-47.759-47.759c0-29.391 22.042-47.759 47.759-47.759 25.716 0 47.759 18.369 47.759 47.759v0zM770.428 423.53c0 25.716-18.369 47.759-47.759 47.759-25.716 0-47.759-22.042-47.759-47.759 0-29.391 22.042-47.759 47.759-47.759 29.391 0 47.759 18.369 47.759 47.759v0z"
                                                        p-id="8514"
                                                    ></path>
                                                </svg>
                                                <div>20+</div>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={redbookShare}
                                            className="absolute bottom-[40px] left-[calc(50%-76px)] w-[auto]"
                                            type="primary"
                                            icon={<SendOutlined />}
                                        >
                                            去小红书发布
                                        </Button>
                                    </div>
                                )
                            },
                            {
                                label: '列表页',
                                key: '2',
                                children: (
                                    <div className="h-[calc(100vh-46px)] relative">
                                        <div className="h-full overflow-y-scroll">
                                            <div className="w-full grid gap-2 grid-cols-2 mt-4">
                                                <div className="shadow-md rounded-lg">
                                                    <Image
                                                        preview={false}
                                                        src={'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_051.jpg'}
                                                    />
                                                    <div className="p-2">
                                                        <div className="my-2">💥杭州宝藏洗衣上门推荐 </div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex gap-1 items-center">
                                                                <svg
                                                                    version="1.1"
                                                                    id="Layer_1"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                    x="0px"
                                                                    y="0px"
                                                                    width="15px"
                                                                    height="15px"
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
                                                                <div className=" text-xs text-black/60">魔法笔记</div>
                                                            </div>
                                                            <div className="flex items-end gap-1 text-black/60 text-xs">
                                                                <svg
                                                                    viewBox="0 0 1024 1024"
                                                                    version="1.1"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    p-id="6478"
                                                                    width="15"
                                                                    height="15"
                                                                >
                                                                    <path
                                                                        d="M667.786667 117.333333C832.864 117.333333 938.666667 249.706667 938.666667 427.861333c0 138.250667-125.098667 290.506667-371.573334 461.589334a96.768 96.768 0 0 1-110.186666 0C210.432 718.368 85.333333 566.112 85.333333 427.861333 85.333333 249.706667 191.136 117.333333 356.213333 117.333333c59.616 0 100.053333 20.832 155.786667 68.096C567.744 138.176 608.170667 117.333333 667.786667 117.333333z m0 63.146667c-41.44 0-70.261333 15.189333-116.96 55.04-2.165333 1.845333-14.4 12.373333-17.941334 15.381333a32.32 32.32 0 0 1-41.770666 0c-3.541333-3.018667-15.776-13.536-17.941334-15.381333-46.698667-39.850667-75.52-55.04-116.96-55.04C230.186667 180.48 149.333333 281.258667 149.333333 426.698667 149.333333 537.6 262.858667 675.242667 493.632 834.826667a32.352 32.352 0 0 0 36.736 0C761.141333 675.253333 874.666667 537.6 874.666667 426.698667c0-145.44-80.853333-246.218667-206.88-246.218667z"
                                                                        fill="#000000"
                                                                        p-id="6479"
                                                                    ></path>
                                                                </svg>
                                                                <div>90+</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="shadow-md rounded-lg">
                                                    <Image
                                                        width="100%"
                                                        preview={false}
                                                        src={'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_033.gif'}
                                                    />
                                                    <div className="p-2">
                                                        <div className="my-2">黄白小课堂 </div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex gap-1 items-center">
                                                                <svg
                                                                    version="1.1"
                                                                    id="Layer_1"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                    x="0px"
                                                                    y="0px"
                                                                    width="15px"
                                                                    height="15px"
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
                                                                <div className=" text-xs text-black/60">魔法笔记</div>
                                                            </div>
                                                            <div className="flex items-end gap-1 text-black/60 text-xs">
                                                                <svg
                                                                    viewBox="0 0 1024 1024"
                                                                    version="1.1"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    p-id="6478"
                                                                    width="15"
                                                                    height="15"
                                                                >
                                                                    <path
                                                                        d="M667.786667 117.333333C832.864 117.333333 938.666667 249.706667 938.666667 427.861333c0 138.250667-125.098667 290.506667-371.573334 461.589334a96.768 96.768 0 0 1-110.186666 0C210.432 718.368 85.333333 566.112 85.333333 427.861333 85.333333 249.706667 191.136 117.333333 356.213333 117.333333c59.616 0 100.053333 20.832 155.786667 68.096C567.744 138.176 608.170667 117.333333 667.786667 117.333333z m0 63.146667c-41.44 0-70.261333 15.189333-116.96 55.04-2.165333 1.845333-14.4 12.373333-17.941334 15.381333a32.32 32.32 0 0 1-41.770666 0c-3.541333-3.018667-15.776-13.536-17.941334-15.381333-46.698667-39.850667-75.52-55.04-116.96-55.04C230.186667 180.48 149.333333 281.258667 149.333333 426.698667 149.333333 537.6 262.858667 675.242667 493.632 834.826667a32.352 32.352 0 0 0 36.736 0C761.141333 675.253333 874.666667 537.6 874.666667 426.698667c0-145.44-80.853333-246.218667-206.88-246.218667z"
                                                                        fill="#000000"
                                                                        p-id="6479"
                                                                    ></path>
                                                                </svg>
                                                                <div>71</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="shadow-md rounded-lg">
                                                    <Image
                                                        preview={false}
                                                        src={'https://service-oss-juzhen.mofaai.com.cn/web/wayl/DM_20241020150431_075.jpg'}
                                                    />
                                                    <div className="p-2">
                                                        <div className="my-2">💥本性善良的人都比较晚熟 </div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex gap-1 items-center">
                                                                <svg
                                                                    version="1.1"
                                                                    id="Layer_1"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                    x="0px"
                                                                    y="0px"
                                                                    width="15px"
                                                                    height="15px"
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
                                                                <div className=" text-xs text-black/60">魔法笔记</div>
                                                            </div>
                                                            <div className="flex items-end gap-1 text-black/60 text-xs">
                                                                <svg
                                                                    viewBox="0 0 1024 1024"
                                                                    version="1.1"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    p-id="6478"
                                                                    width="15"
                                                                    height="15"
                                                                >
                                                                    <path
                                                                        d="M667.786667 117.333333C832.864 117.333333 938.666667 249.706667 938.666667 427.861333c0 138.250667-125.098667 290.506667-371.573334 461.589334a96.768 96.768 0 0 1-110.186666 0C210.432 718.368 85.333333 566.112 85.333333 427.861333 85.333333 249.706667 191.136 117.333333 356.213333 117.333333c59.616 0 100.053333 20.832 155.786667 68.096C567.744 138.176 608.170667 117.333333 667.786667 117.333333z m0 63.146667c-41.44 0-70.261333 15.189333-116.96 55.04-2.165333 1.845333-14.4 12.373333-17.941334 15.381333a32.32 32.32 0 0 1-41.770666 0c-3.541333-3.018667-15.776-13.536-17.941334-15.381333-46.698667-39.850667-75.52-55.04-116.96-55.04C230.186667 180.48 149.333333 281.258667 149.333333 426.698667 149.333333 537.6 262.858667 675.242667 493.632 834.826667a32.352 32.352 0 0 0 36.736 0C761.141333 675.253333 874.666667 537.6 874.666667 426.698667c0-145.44-80.853333-246.218667-206.88-246.218667z"
                                                                        fill="#000000"
                                                                        p-id="6479"
                                                                    ></path>
                                                                </svg>
                                                                <div>90+</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={redbookShare}
                                            className="absolute bottom-[40px] left-[calc(50%-76px)] w-[auto]"
                                            type="primary"
                                            icon={<SendOutlined />}
                                        >
                                            去小红书发布
                                        </Button>
                                    </div>
                                )
                            }
                        ]}
                    ></Tabs>
                </div>
            )}
            <Modal title="笔记发布" open={open} onCancel={() => setOpen(false)} footer={false} closable={false}>
                <div className="w-full flex justify-center items-center flex-col gap-2">
                    <QRCode value={`${process.env.REACT_APP_SHARE_URL}/share?uid=${query.get('uid')}`} />
                    <div className="flex flex-col items-center">
                        <div className="text-md text-[#000000a6]">安卓：仅支持手机浏览器扫码</div>
                        <div className="text-md text-[#000000a6]">苹果：支持微信/手机浏览器扫码</div>
                        <div className="text-md text-[#000000a6]">注意：小红书需更新到最新版本</div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Share;
