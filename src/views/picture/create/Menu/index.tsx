import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Col, Input, Row } from 'antd';

import CasinoIcon from '@mui/icons-material/Casino';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Slider } from '@mui/material';
import { getAccessToken } from 'utils/auth';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MuiTooltip from '@mui/material/Tooltip';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { userBenefits } from 'api/template';
import { t } from 'hooks/web/useI18n';
import { useEffect, useState } from 'react';
import userInfoStore from 'store/entitlementAction';
import { containsChineseCharactersAndSymbols, removeFalseProperties } from 'utils/validate';
import { createText2Img, variantsImage, getImgMeta, translateText } from '../../../../api/picture/create';
import { useWindowSize } from '../../../../hooks/useWindowSize';
import { IImageListType } from '../index';
import './index.scss';

import AppModal from './appModal';
import { PermissionUpgradeModal } from 'views/template/myChat/createChat/components/modal/permissionUpgradeModal';

const { Dragger } = Upload;

const marks = [
    {
        value: 1,
        label: '16:9',
        data: '1024x576'
    },
    {
        value: 2,
        label: '4:3',
        data: '1024x768'
    },
    {
        value: 3,
        label: '8:7',
        data: ' 1024x896'
    },
    {
        value: 4,
        label: '1:1',
        data: '1024x1024'
    },
    {
        value: 5,
        label: '7:8',
        data: '896x1024'
    },
    {
        value: 6,
        label: '3:4',
        data: '768x1024'
    },
    {
        value: 7,
        label: '9:16',
        data: '576x1024'
    }
];

function valueLabelFormat(value: number) {
    return marks.find((v) => v.value === value)?.data;
}

const { TextArea } = Input;

type IPictureCreateMenuProps = {
    menuVisible: boolean;
    setLoading?: (data: boolean) => void;
    setMenuVisible: (menuVisible: boolean) => void;
    setImgList: (imgList: IImageListType) => void;
    imgList: IImageListType;
    width: number;
    height: number;
    setWidth: (width: number) => void;
    setHeight: (height: number) => void;
    samples: number;
    setSamples: (samples: number) => void;
    inputValue: string;
    setInputValue: (inputValue: string) => void;
    setIsFirst: (flag: boolean) => void;
    setIsFetch: (flag: boolean) => void;
    inputValueTranslate: boolean;
    setInputValueTranslate: (flag: boolean) => void;
    mode?: string;
};

export type IParamsType = {
    guidancePreset: IParamsTypeGuidancePreset[];
    stylePreset: IParamsTypeStylePreset[];
    imageSize: IParamsTypeImageSize[];
    samples: IParamsTypeSamples[];
    sampler: IParamsTypeSampler[];
    examplePrompt: IExamplePrompt[];
    model: IModelType[];
};

export type IExamplePrompt = {
    label: string;
    value: string;
};
export type IParamsTypeGuidancePreset = {
    label: string;
    value: number;
    description: string;
    image: string;
};
export type IParamsTypeStylePreset = {
    label: string;
    value: string;
    description: string;
    image: string;
};
export type IParamsTypeImageSize = {
    label: string;
    value: string;
    description: string;
    scale: string;
};
export type IParamsTypeSamples = {
    label: string;
    value: number;
    description: string;
};
export type IParamsTypeSampler = {
    label: string;
    value: number;
    description: string;
    image: string;
};

export type IModelType = {
    label: string;
    value: string;
    description: string;
};

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

export const PictureCreateMenu = ({
    setMenuVisible,
    menuVisible,
    setLoading,
    setImgList,
    imgList,
    width,
    height,
    setWidth,
    setHeight,
    samples,
    setSamples,
    inputValue,
    setInputValue,
    setIsFirst,
    setIsFetch,
    setInputValueTranslate,
    inputValueTranslate,
    mode
}: IPictureCreateMenuProps) => {
    const [visible, setVisible] = useState(false);
    const [showVoidInputValue, setShowVoidInputValue] = useState(false);
    const [voidInputValue, setVoidInputValue] = useState('');
    const [params, setParams] = useState<null | IParamsType>(null);
    const [currentStyle, setCurrentStyle] = useState('');
    const [seed, setSeed] = useState<number>();
    const [step, setStep] = useState<number>(30);
    const [strength, setStrength] = useState<number>();
    const [uploadFile, setUploadFile] = useState<string>('');
    const [showImg, setShowImg] = useState(false);
    const [showStyle, setShowStyle] = useState(false);
    const [imageStrength, setImageStrength] = useState(0.5);
    const [selectModel, setSelectModel] = useState<string>('stable-diffusion-xl-1024-v1-0');
    const [voidInputValueTranslate, setVoidInputValueTranslate] = useState(true);
    const [appOpen, setAppOpen] = useState(false);
    const [openToken, setOpenToken] = useState(false);
    const emits = (data: any) => {
        setAppOpen(false);
        setInputValue(data);
    };
    const handleInputValueTranslate = (value: boolean) => {
        setInputValueTranslate(value);
        if (inputValue) {
            translateText({
                textList: [inputValue],
                sourceLanguage: !value ? 'en' : 'zh',
                targetLanguage: !value ? 'zh' : 'en'
            }).then((res) => {
                setInputValue(res.translatedList[0].translated);
            });
        }
    };

    const handleVoidInputValueTranslate = (value: boolean) => {
        setVoidInputValueTranslate(value);
        if (voidInputValue) {
            translateText({
                textList: [voidInputValue],
                sourceLanguage: !value ? 'en' : 'zh',
                targetLanguage: !value ? 'zh' : 'en'
            }).then((res) => {
                setVoidInputValue(res.translatedList[0].translated);
            });
        }
    };

    const size = useWindowSize();
    const { setUserInfo }: any = userInfoStore();

    useEffect(() => {
        if (params?.stylePreset) {
            setCurrentStyle(params?.stylePreset[0].value);
        }
    }, [params]);

    useEffect(() => {
        (async () => {
            const res = await getImgMeta();
            setParams(res);
        })();
    }, []);

    useEffect(() => {
        if (params?.examplePrompt && mode !== '裂变') {
            const randomIndex = Math.floor(Math.random() * params?.examplePrompt.length);
            translateText({
                textList: [params?.examplePrompt?.[randomIndex].value],
                sourceLanguage: 'en',
                targetLanguage: 'zh'
            })
                .then((res) => {
                    setInputValue(res.translatedList[0].translated);
                })
                .catch(() => {
                    setInputValue(params?.examplePrompt?.[randomIndex].value);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.examplePrompt]);

    const onDice = () => {
        setInputValueTranslate(true);
        if (params?.examplePrompt) {
            const randomIndex = Math.floor(Math.random() * params?.examplePrompt.length);
            setInputValue(params?.examplePrompt?.[randomIndex].value);
        }
    };

    const props: UploadProps = {
        name: 'image',
        showUploadList: false,
        action: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_URL}/llm/image/upload`,
        headers: {
            Authorization: 'Bearer ' + getAccessToken()
        },
        onChange(info) {
            if (info.file.status === 'uploading') {
                console.log(info);
            } else if (info.file.status === 'done') {
                setUploadFile(info?.file?.response?.data?.url);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };
    //模拟上传
    const props1: UploadProps = {
        name: 'file',
        customRequest: async ({ file, onSuccess, onError }) => {
            try {
                console.log(file, onSuccess);

                // 模拟文件上传请求（这里使用了setTimeout来模拟异步请求）
                getBase64(file as RcFile, (url) => {
                    setUploadFile(url);
                });
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };

    const handleCreate = async () => {
        if (!uploadFile && mode === '裂变') {
            PubSub.publish('global.error', { message: '请上传参考图', type: 'error' });
            return false;
        }
        if (!inputValue) {
            PubSub.publish('global.error', { message: '请填写创意描述', type: 'error' });
            return false;
        }
        if (mode === '裂变') {
            setLoading && setLoading(true);
        }
        setIsFetch(true);

        const imageRequest = {
            prompt: inputValue,
            width: width,
            height: height,
            samples,
            stylePreset: currentStyle,
            imageStrength: 1 - imageStrength,
            seed: seed,
            steps: step,
            negativePrompt: voidInputValue,
            engine: selectModel,
            initImage: uploadFile,
            guidanceStrength: strength
        };

        setInputValueTranslate(true);
        setVoidInputValueTranslate(true);
        const result = containsChineseCharactersAndSymbols(inputValue);
        if (result) {
            try {
                const resTranslate = await translateText({
                    textList: [inputValue],
                    sourceLanguage: 'zh',
                    targetLanguage: 'en'
                });
                imageRequest.prompt = resTranslate.translatedList[0].translated;
                setInputValue(resTranslate.translatedList[0].translated);
            } catch (e) {
                imageRequest.prompt = inputValue;
                setInputValue(inputValue);
            }
        }

        const resultVoidInputValue = containsChineseCharactersAndSymbols(voidInputValue);
        if (resultVoidInputValue) {
            try {
                const resVoidTranslate = await translateText({
                    textList: [voidInputValue],
                    sourceLanguage: 'zh',
                    targetLanguage: 'en'
                });
                imageRequest.negativePrompt = resVoidTranslate.translatedList[0].translated;
                setVoidInputValue(resVoidTranslate.translatedList[0].translated);
            } catch (e) {
                imageRequest.negativePrompt = voidInputValue;
                setVoidInputValue(voidInputValue);
            }
        }

        try {
            if (mode === '裂变') {
                const res = await variantsImage({
                    scene: 'IMAGE_VARIANTS',
                    appUid: 'VARIANTS_IMAGE',
                    imageRequest: removeFalseProperties(imageRequest)
                });
                const benefitsRes = await userBenefits();
                setUserInfo(benefitsRes);

                setIsFetch(false);
                setIsFirst(false);
                setImgList([res?.response, ...imgList] || []);
            } else {
                const res = await createText2Img({
                    scene: 'WEB_IMAGE',
                    appUid: 'GENERATE_IMAGE',
                    imageRequest: removeFalseProperties(imageRequest)
                });
                const benefitsRes = await userBenefits();
                setUserInfo(benefitsRes);

                setIsFetch(false);
                setIsFirst(false);
                setImgList([res?.response, ...imgList] || []);
            }
        } catch (e: any) {
            if (e?.code === 2008002007) {
                setOpenToken(true);
            }
            setLoading && setLoading(false);
            setIsFetch(false);
        }
    };
    // @ts-ignore
    return (
        <>
            <Col className={menuVisible ? (size.width < 768 ? 'pcm_menu_m' : 'pcm_menu') : 'pcm_menu_hidden'}>
                <div
                    style={{ scrollbarGutter: 'stable' }}
                    className={
                        'overflow-x-hidden flex flex-col items-center pb-2 w-full h-[calc(100%-70px)] xs:overflow-y-auto lg:overflow-y-hidden  hover:overflow-y-auto'
                    }
                >
                    {mode !== '裂变' && (
                        <Row className={'w-[100%] p-[16px] mb-[15px] rounded-xl bg-white'}>
                            <span className={'text-base font-medium flex items-center'}>风格模型</span>
                            <div
                                style={{ scrollbarGutter: 'stable' }}
                                className={
                                    'grid gap-4 grid-cols-3 w-full h-[375px] mt-3  p-[4px] xs:overflow-y-auto lg:overflow-y-hidden hover:overflow-y-auto'
                                }
                            >
                                {params?.stylePreset.map((item, index) => (
                                    <div key={index} className="w-full">
                                        <img
                                            src={item.image}
                                            alt={item.label}
                                            className={` w-[calc(100%-2px)] rounded cursor-pointer  ${
                                                item.value === currentStyle ? 'outline outline-offset-2 outline-[#673ab7]' : ''
                                            } hover:outline hover:outline-offset-2 hover:outline-[#673ab7]`}
                                            onClick={() => setCurrentStyle(item.value)}
                                        />
                                        <span className="text-sm">{t(`textToImage.${item.label}`)}</span>
                                    </div>
                                ))}
                            </div>
                        </Row>
                    )}
                    {mode === '裂变' && (
                        <Row className={'w-[100%] p-[16px] rounded-xl bg-white flex flex-col'}>
                            <div className="flex items-center cursor-pointer justify-between">
                                <div className="flex items-center cursor-pointer" onClick={() => setShowImg(!showImg)}>
                                    <span className={'text-base font-medium'}>参考图</span>
                                    {!showImg ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                                </div>
                                {uploadFile && <DeleteOutlineIcon className="text-base" onClick={() => setUploadFile('')} />}
                            </div>
                            {!showImg && (
                                <div className="mt-[15px]">
                                    {uploadFile ? (
                                        <div className="w-full justify-center flex flex-col items-center">
                                            <Dragger {...props} className="w-full">
                                                <div className="flex justify-center">
                                                    <div className="h-[140px] w-[140px] overflow-hidden">
                                                        <img
                                                            className="upload_img h-[140px] object-cover aspect-square"
                                                            src={uploadFile}
                                                            alt={uploadFile}
                                                            // style={{
                                                            //     filter: `blur(${imageStrength / 10}px)`
                                                            // }}
                                                        />
                                                    </div>
                                                </div>
                                            </Dragger>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    marginTop: '15px',
                                                    justifyContent: 'center',
                                                    flexDirection: 'column',
                                                    width: '100%'
                                                }}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className={'text-base font-medium'}>生成图与原图相似度</span>
                                                    <TextField
                                                        type={'number'}
                                                        size="small"
                                                        className="w-[70px]"
                                                        disabled
                                                        value={imageStrength}
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        marginTop: '5px',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        width: '100%'
                                                    }}
                                                    className="flex-col"
                                                >
                                                    <div
                                                        style={{
                                                            width: '92%'
                                                        }}
                                                    >
                                                        <Slider
                                                            color="secondary"
                                                            defaultValue={0.5}
                                                            valueLabelDisplay="auto"
                                                            aria-labelledby="discrete-slider-small-steps"
                                                            step={0.1}
                                                            min={0}
                                                            max={1}
                                                            onChange={(e, value, number) => setImageStrength(value as number)}
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between w-full">
                                                        <span>低</span>
                                                        <span>高</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Dragger {...props}>
                                            <div>
                                                <p className="ant-upload-drag-icon">
                                                    <CloudUploadOutlinedIcon className="text-4xl" />
                                                </p>
                                                <p className="ant-upload-text">上传图片以创建变体</p>
                                            </div>
                                        </Dragger>
                                    )}
                                </div>
                            )}
                        </Row>
                    )}
                    <Row className={'w-[100%] p-[16px] rounded-xl bg-white mt-[15px] relative p_textarea'}>
                        <div className={'text-base font-medium flex items-center justify-between w-full'}>
                            <div className=" flex items-center">
                                <div className="flex items-center justify-between">{mode === '裂变' ? '强化内容描述' : '创意描述'}</div>
                                {!inputValueTranslate ? (
                                    <MuiTooltip title="翻译成英文" arrow placement="top">
                                        <svg
                                            onClick={() => handleInputValueTranslate(!inputValueTranslate)}
                                            className="text-base cursor-pointer ml-2"
                                            viewBox="0 0 1024 1024"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            p-id="10410"
                                            width="24"
                                            height="24"
                                        >
                                            <path
                                                d="M229.248 704V337.504h271.744v61.984h-197.76v81.28h184v61.76h-184v99.712h204.768V704h-278.72z m550.496 0h-70.24v-135.488c0-28.672-1.504-47.232-4.48-55.648a39.04 39.04 0 0 0-14.656-19.616 41.792 41.792 0 0 0-24.384-7.008c-12.16 0-23.04 3.328-32.736 10.016-9.664 6.656-16.32 15.488-19.872 26.496-3.584 11.008-5.376 31.36-5.376 60.992V704h-70.24v-265.504h65.248v39.008c23.168-30.016 52.32-44.992 87.488-44.992 15.52 0 29.664 2.784 42.496 8.352 12.832 5.6 22.56 12.704 29.12 21.376 6.592 8.672 11.2 18.496 13.76 29.504 2.56 11.008 3.872 26.752 3.872 47.264V704z"
                                                fill="#000000"
                                                p-id="10411"
                                            ></path>
                                            <path
                                                d="M160 144a32 32 0 0 0-32 32V864a32 32 0 0 0 32 32h688a32 32 0 0 0 32-32V176a32 32 0 0 0-32-32H160z m0-64h688a96 96 0 0 1 96 96V864a96 96 0 0 1-96 96H160a96 96 0 0 1-96-96V176a96 96 0 0 1 96-96z"
                                                fill="#000000"
                                                p-id="10412"
                                            ></path>
                                        </svg>
                                    </MuiTooltip>
                                ) : (
                                    <MuiTooltip title="翻译成中文" arrow placement="top">
                                        <svg
                                            onClick={() => handleInputValueTranslate(!inputValueTranslate)}
                                            className="text-base cursor-pointer ml-2"
                                            viewBox="0 0 1024 1024"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            p-id="9394"
                                            width="24"
                                            height="24"
                                        >
                                            <path
                                                d="M160 144a32 32 0 0 0-32 32V864a32 32 0 0 0 32 32h688a32 32 0 0 0 32-32V176a32 32 0 0 0-32-32H160z m0-64h688a96 96 0 0 1 96 96V864a96 96 0 0 1-96 96H160a96 96 0 0 1-96-96V176a96 96 0 0 1 96-96z"
                                                fill="#000000"
                                                p-id="9395"
                                            ></path>
                                            <path
                                                d="M482.176 262.272h59.616v94.4h196v239.072h-196v184.416h-59.616v-184.416H286.72v-239.04h195.456V262.24z m-137.504 277.152h137.504v-126.4H344.64v126.4z m197.12 0h138.048v-126.4H541.76v126.4z"
                                                fill="#000000"
                                                p-id="9396"
                                            ></path>
                                        </svg>
                                    </MuiTooltip>
                                )}
                                {inputValueTranslate && <span className="text-xs ml-2">(只能输入英文字符)</span>}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button color="secondary" size="small" variant="text" onClick={() => setAppOpen(true)}>
                                    一键AI生成
                                </Button>
                                {mode !== '裂变' && (
                                    <MuiTooltip title="随机生成描述示例" arrow placement="top">
                                        <CasinoIcon className="cursor-pointer text-base" onClick={onDice} />
                                    </MuiTooltip>
                                )}
                            </div>
                        </div>
                        <TextArea
                            autoSize={{ minRows: 6 }}
                            className=" w-full mt-3"
                            onChange={(e) => {
                                if (inputValueTranslate) {
                                    setInputValue(e.target.value.replace(/[\u4e00-\u9fa5\u3000-\u303F\uFF00-\uFFEF]/g, ''));
                                } else {
                                    setInputValue(e.target.value);
                                }
                            }}
                            value={inputValue}
                            placeholder={mode === '裂变' ? '输入图片中想要强化/突出的内容的描述，例如：突出西装领' : '请输入你的创意'}
                            // maxLength={800}
                            // showCount
                        />
                        <div className="flex items-center mt-5 cursor-pointer">
                            <div className="flex items-center" onClick={() => setShowVoidInputValue(!showVoidInputValue)}>
                                <div className={'text-base font-medium'}>不希望呈现的内容</div>
                                {showVoidInputValue ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                            </div>
                            {showVoidInputValue && (
                                <>
                                    {!voidInputValueTranslate ? (
                                        <MuiTooltip title="翻译成英文" arrow placement="top">
                                            <svg
                                                onClick={() => handleVoidInputValueTranslate(!voidInputValueTranslate)}
                                                className="text-base cursor-pointer ml-2"
                                                viewBox="0 0 1024 1024"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                p-id="10410"
                                                width="24"
                                                height="24"
                                            >
                                                <path
                                                    d="M229.248 704V337.504h271.744v61.984h-197.76v81.28h184v61.76h-184v99.712h204.768V704h-278.72z m550.496 0h-70.24v-135.488c0-28.672-1.504-47.232-4.48-55.648a39.04 39.04 0 0 0-14.656-19.616 41.792 41.792 0 0 0-24.384-7.008c-12.16 0-23.04 3.328-32.736 10.016-9.664 6.656-16.32 15.488-19.872 26.496-3.584 11.008-5.376 31.36-5.376 60.992V704h-70.24v-265.504h65.248v39.008c23.168-30.016 52.32-44.992 87.488-44.992 15.52 0 29.664 2.784 42.496 8.352 12.832 5.6 22.56 12.704 29.12 21.376 6.592 8.672 11.2 18.496 13.76 29.504 2.56 11.008 3.872 26.752 3.872 47.264V704z"
                                                    fill="#000000"
                                                    p-id="10411"
                                                ></path>
                                                <path
                                                    d="M160 144a32 32 0 0 0-32 32V864a32 32 0 0 0 32 32h688a32 32 0 0 0 32-32V176a32 32 0 0 0-32-32H160z m0-64h688a96 96 0 0 1 96 96V864a96 96 0 0 1-96 96H160a96 96 0 0 1-96-96V176a96 96 0 0 1 96-96z"
                                                    fill="#000000"
                                                    p-id="10412"
                                                ></path>
                                            </svg>
                                        </MuiTooltip>
                                    ) : (
                                        <MuiTooltip title="翻译成中文" arrow placement="top">
                                            <svg
                                                onClick={() => handleVoidInputValueTranslate(!voidInputValueTranslate)}
                                                className="text-base cursor-pointer ml-2"
                                                viewBox="0 0 1024 1024"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                p-id="9394"
                                                width="24"
                                                height="24"
                                            >
                                                <path
                                                    d="M160 144a32 32 0 0 0-32 32V864a32 32 0 0 0 32 32h688a32 32 0 0 0 32-32V176a32 32 0 0 0-32-32H160z m0-64h688a96 96 0 0 1 96 96V864a96 96 0 0 1-96 96H160a96 96 0 0 1-96-96V176a96 96 0 0 1 96-96z"
                                                    fill="#000000"
                                                    p-id="9395"
                                                ></path>
                                                <path
                                                    d="M482.176 262.272h59.616v94.4h196v239.072h-196v184.416h-59.616v-184.416H286.72v-239.04h195.456V262.24z m-137.504 277.152h137.504v-126.4H344.64v126.4z m197.12 0h138.048v-126.4H541.76v126.4z"
                                                    fill="#000000"
                                                    p-id="9396"
                                                ></path>
                                            </svg>
                                        </MuiTooltip>
                                    )}
                                </>
                            )}
                        </div>
                        {showVoidInputValue && (
                            <TextArea
                                autoSize={{ minRows: 3 }}
                                className=" w-full mt-3"
                                onChange={(e) => {
                                    if (voidInputValueTranslate) {
                                        setVoidInputValue(e.target.value.replace(/[\u4e00-\u9fa5\u3000-\u303F\uFF00-\uFFEF]/g, ''));
                                    } else {
                                        setVoidInputValue(e.target.value);
                                    }
                                }}
                                value={voidInputValue}
                                placeholder="请输入不希望呈现的内容"
                                // maxLength={800}
                                // showCount
                            />
                        )}
                    </Row>
                    <Row className={'w-[100%] mt-[15px] p-[16px] rounded-xl bg-white'}>
                        <span className={'text-base font-medium flex items-center'}>
                            尺寸选择
                            <MuiTooltip title="选择需要的比例与尺寸，尺寸越大耗时越久" arrow placement="top">
                                <HelpOutlineOutlinedIcon className="text-base ml-1 cursor-pointer" />
                            </MuiTooltip>
                        </span>
                        <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', marginTop: '5px', justifyContent: 'center' }}>
                            <div style={{ width: '92%', display: 'flex', marginTop: '5px', position: 'relative' }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="opacity-muted-extra w-[28px] absolute left-0 top-0"
                                    strokeWidth="1.5"
                                >
                                    <path
                                        d="M3.33333 19L20.6667 19C21.403 19 22 18.3036 22 17.4444L22 6.55556C22 5.69645 21.403 5 20.6667 5L3.33333 5C2.59695 5 2 5.69645 2 6.55556L2 17.4444C2 18.3036 2.59695 19 3.33333 19Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <rect
                                        x="19"
                                        y="16"
                                        width="14"
                                        height="8"
                                        transform="rotate(180 19 16)"
                                        stroke="currentColor"
                                        strokeLinejoin="round"
                                    ></rect>
                                    <rect x="16" y="16" width="8" height="8" transform="rotate(180 16 16)" fill="currentColor"></rect>
                                    <rect x="17" y="17" width="10" height="10" transform="rotate(180 17 17)" fill="#18181B"></rect>
                                    <rect x="20" y="14" width="16" height="4" transform="rotate(180 20 14)" fill="#18181B"></rect>
                                </svg>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="opacity-muted-extra w-[28px] absolute right-0 top-0 rotate-90"
                                    strokeWidth="1.5"
                                >
                                    <path
                                        d="M3.33333 19L20.6667 19C21.403 19 22 18.3036 22 17.4444L22 6.55556C22 5.69645 21.403 5 20.6667 5L3.33333 5C2.59695 5 2 5.69645 2 6.55556L2 17.4444C2 18.3036 2.59695 19 3.33333 19Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <rect
                                        x="19"
                                        y="16"
                                        width="14"
                                        height="8"
                                        transform="rotate(180 19 16)"
                                        stroke="currentColor"
                                        strokeLinejoin="round"
                                    ></rect>
                                    <rect x="16" y="16" width="8" height="8" transform="rotate(180 16 16)" fill="currentColor"></rect>
                                    <rect x="17" y="17" width="10" height="10" transform="rotate(180 17 17)" fill="#18181B"></rect>
                                    <rect x="20" y="14" width="16" height="4" transform="rotate(180 20 14)" fill="#18181B"></rect>
                                </svg>
                                <div className="mt-[20px] w-full">
                                    <Slider
                                        sx={{
                                            '& .MuiSlider-thumb': {
                                                width: 14,
                                                height: 14
                                            }
                                        }}
                                        color="secondary"
                                        aria-label="Always visible"
                                        defaultValue={4}
                                        step={1}
                                        marks={marks}
                                        valueLabelDisplay="auto"
                                        min={1}
                                        max={7}
                                        valueLabelFormat={valueLabelFormat}
                                        onChange={(e, value, number) => {
                                            const data = marks.find((v) => v?.value === value)?.data;
                                            setWidth(Number(data?.split('x')[0]));
                                            setHeight(Number(data?.split('x')[1]));
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {mode !== '裂变' && (
                            <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', marginTop: '5px', justifyContent: 'center' }}>
                                <div className={'text-base font-medium mt-[15px] w-full flex items-center'}>
                                    生成张数
                                    <MuiTooltip title="生成张数越多，耗时越久" arrow placement="top">
                                        <HelpOutlineOutlinedIcon className="text-base ml-1 cursor-pointer" />
                                    </MuiTooltip>
                                </div>
                                <div style={{ width: '92%', display: 'flex', marginTop: '5px' }}>
                                    <Slider
                                        sx={{
                                            '& .MuiSlider-thumb': {
                                                width: 14,
                                                height: 14
                                            }
                                        }}
                                        color="secondary"
                                        defaultValue={samples}
                                        valueLabelDisplay="auto"
                                        aria-labelledby="discrete-slider-small-steps"
                                        marks
                                        step={1}
                                        min={1}
                                        max={8}
                                        onChange={(e, value, number) => setSamples(value as number)}
                                    />
                                </div>
                            </div>
                        )}
                    </Row>
                    {mode !== '裂变' && (
                        <Row className={'w-[100%] mt-[15px] p-[16px] rounded-xl bg-white flex flex-col'}>
                            <div className="flex items-center cursor-pointer justify-between">
                                <div className="flex items-center cursor-pointer" onClick={() => setShowImg(!showImg)}>
                                    <span className={'text-base font-medium'}>参考图</span>
                                    {showImg ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                                </div>
                                {uploadFile && <DeleteOutlineIcon className="text-base" onClick={() => setUploadFile('')} />}
                            </div>
                            {showImg && (
                                <div className="mt-[15px]">
                                    {uploadFile ? (
                                        <div className="w-full justify-center flex flex-col items-center">
                                            <Dragger {...props} className="w-full">
                                                <div className="flex justify-center">
                                                    <div className="h-[140px] w-[140px] overflow-hidden">
                                                        <img
                                                            className="upload_img h-[140px] object-cover aspect-square"
                                                            src={uploadFile}
                                                            alt={uploadFile}
                                                            // style={{
                                                            //     filter: `blur(${imageStrength / 10}px)`
                                                            // }}
                                                        />
                                                    </div>
                                                </div>
                                            </Dragger>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    marginTop: '15px',
                                                    justifyContent: 'center',
                                                    flexDirection: 'column',
                                                    width: '100%'
                                                }}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className={'text-base font-medium'}>生成图与原图相似度</span>
                                                    <TextField
                                                        type={'number'}
                                                        size="small"
                                                        className="w-[70px]"
                                                        disabled
                                                        value={imageStrength}
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        marginTop: '5px',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        width: '100%'
                                                    }}
                                                    className="flex-col"
                                                >
                                                    <div
                                                        style={{
                                                            width: '92%'
                                                        }}
                                                    >
                                                        <Slider
                                                            color="secondary"
                                                            defaultValue={0.5}
                                                            valueLabelDisplay="auto"
                                                            aria-labelledby="discrete-slider-small-steps"
                                                            step={0.1}
                                                            min={0}
                                                            max={1}
                                                            onChange={(e, value, number) => setImageStrength(value as number)}
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between w-full">
                                                        <span>低</span>
                                                        <span>高</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Dragger {...props}>
                                            <div>
                                                <p className="ant-upload-drag-icon">
                                                    <CloudUploadOutlinedIcon className="text-4xl" />
                                                </p>
                                                <p className="ant-upload-text">上传图片以创建变体</p>
                                            </div>
                                        </Dragger>
                                    )}
                                </div>
                            )}
                        </Row>
                    )}
                    {mode === '裂变' && (
                        <Row className={'w-[100%]  mt-[15px] p-[16px] rounded-xl bg-white'}>
                            <div
                                className="cursor-pointer flex"
                                onClick={() => {
                                    setShowStyle(!showStyle);
                                }}
                            >
                                <span className={'text-base font-medium flex items-center'}>风格模型</span>
                                {showStyle ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                            </div>
                            {showStyle && (
                                <div
                                    style={{ scrollbarGutter: 'stable' }}
                                    className={
                                        'grid gap-4 grid-cols-3 w-full h-[375px] mt-3  p-[4px] xs:overflow-y-auto lg:overflow-y-hidden hover:overflow-y-auto'
                                    }
                                >
                                    {params?.stylePreset.map((item, index) => (
                                        <div key={index} className="w-full">
                                            <img
                                                src={item.image}
                                                alt={item.label}
                                                className={` w-[calc(100%-2px)] rounded cursor-pointer  ${
                                                    item.value === currentStyle ? 'outline outline-offset-2 outline-[#673ab7]' : ''
                                                } hover:outline hover:outline-offset-2 hover:outline-[#673ab7]`}
                                                onClick={() => setCurrentStyle(item.value)}
                                            />
                                            <span className="text-sm">{t(`textToImage.${item.label}`)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Row>
                    )}
                    <Row className={'w-[100%] mt-[15px] p-[16px] rounded-xl bg-white'}>
                        <span className={'text-base font-medium flex items-center'}>
                            高级
                            {visible ? (
                                <VisibilityOutlinedIcon className={'cursor-pointer ml-1 text-lg'} onClick={() => setVisible(!visible)} />
                            ) : (
                                <VisibilityOffOutlinedIcon className={'cursor-pointer ml-1 text-lg'} onClick={() => setVisible(!visible)} />
                            )}
                        </span>
                        {visible && (
                            <div className={'px-1 mt-[15px] grid grid-cols-2 gap-4'}>
                                <TextField
                                    value={width}
                                    type={'number'}
                                    label="宽度"
                                    fullWidth
                                    autoComplete="given-name"
                                    onChange={(e) => setWidth(e.target.value as unknown as number)}
                                />
                                <TextField
                                    value={height}
                                    type={'number'}
                                    label="高度"
                                    fullWidth
                                    autoComplete="given-name"
                                    onChange={(e) => setHeight(e.target.value as unknown as number)}
                                />
                                <TextField
                                    type={'number'}
                                    name="高度"
                                    label="预设强度"
                                    fullWidth
                                    autoComplete="given-name"
                                    onChange={(e) => setStrength(e.target.value as unknown as number)}
                                />
                                <TextField
                                    defaultValue={30}
                                    type={'number'}
                                    label="采样步骤"
                                    fullWidth
                                    autoComplete="given-name"
                                    onChange={(e) => setStep(e.target.value as unknown as number)}
                                />
                                <TextField
                                    type={'number'}
                                    label="种子"
                                    fullWidth
                                    autoComplete="given-name"
                                    onChange={(e) => setSeed(e.target.value as unknown as number)}
                                />
                                <div className="col-span-2 flex items-center">
                                    <FormControl sx={{ width: '100%' }}>
                                        <InputLabel id="age-select">模型</InputLabel>
                                        <Select
                                            disabled
                                            className="w-full"
                                            onChange={(e: any) => setSelectModel(e.target.value)}
                                            value={selectModel}
                                            label={'模型'}
                                            name="模型"
                                        >
                                            {params?.model.map((el: any) => (
                                                <MenuItem key={el.value} value={el.value}>
                                                    {el.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        )}
                    </Row>
                    {appOpen && (
                        <AppModal
                            title="创意描述优化"
                            value={inputValue}
                            open={appOpen}
                            emits={emits}
                            tags={['Image', 'Optimize Prompt']}
                            setOpen={setAppOpen}
                        />
                    )}
                </div>
                <Row
                    style={{
                        height: '60px',
                        width: '100%',
                        position: 'absolute',
                        bottom: 0
                    }}
                    justify={'center'}
                    align={'middle'}
                >
                    <Button variant="contained" color="secondary" style={{ width: '94%' }} onClick={() => handleCreate()}>
                        生成 <span className="text-xs opacity-50">{mode !== '裂变' ? `（消耗${samples}点作图）` : '（消耗4点作图）'}</span>
                    </Button>
                </Row>
            </Col>
            <PermissionUpgradeModal open={openToken} handleClose={() => setOpenToken(false)} title={'当前使用的魔法豆不足'} />
        </>
    );
};
