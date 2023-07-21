import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Col, Input, Row } from 'antd';

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import CasinoIcon from '@mui/icons-material/Casino';
import { Slider } from '@mui/material';

import { InboxOutlined } from '@ant-design/icons';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MuiTooltip from '@mui/material/Tooltip';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { t } from 'hooks/web/useI18n';
import { useEffect, useState } from 'react';
import { removeFalseProperties } from 'utils/validate';
import { createText2Img, getImgMeta } from '../../../../api/picture/create';
import { useWindowSize } from '../../../../hooks/useWindowSize';
import { IImageListType } from '../index';
import './index.scss';

const { Dragger } = Upload;

const marks = [
    {
        value: 1,
        label: '7:4',
        data: '896x512'
    },
    {
        value: 2,
        label: '3:2',
        data: '768x512'
    },
    {
        value: 3,
        label: '4:3',
        data: '683x512'
    },
    {
        value: 4,
        label: '5:4',
        data: '640x512'
    },
    {
        value: 5,
        label: '1:1',
        data: '512x512'
    },
    {
        value: 6,
        label: '4:5',
        data: '512x640'
    },
    {
        value: 7,
        label: '3:4',
        data: '512x683'
    },
    {
        value: 8,
        label: '2:3',
        data: '512x768'
    },
    {
        value: 9,
        label: '4:7',
        data: '512x896'
    }
];

function valueLabelFormat(value: number) {
    return marks.find((v) => v.value === value)?.data;
}

const { TextArea } = Input;

type IPictureCreateMenuProps = {
    menuVisible: boolean;
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
    conversationId: string;
    setIsFirst: (flag: boolean) => void;
    setIsFetch: (flag: boolean) => void;
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
    conversationId,
    setIsFirst,
    setIsFetch
}: IPictureCreateMenuProps) => {
    const [visible, setVisible] = useState(false);
    const [showVoidInputValue, setShowVoidInputValue] = useState(false);
    const [voidInputValue, setVoidInputValue] = useState('');
    const [params, setParams] = useState<null | IParamsType>(null);
    const [currentStyle, setCurrentStyle] = useState('');
    const [seed, setSeed] = useState<number>();
    const [step, setStep] = useState<number>();
    const [strength, setStrength] = useState<number>();
    const [uploadFile, setUploadFile] = useState<string>('');
    const [showImg, setShowImg] = useState(false);
    const [imageStrength, setImageStrength] = useState(45);
    const [selectModel, setSelectModel] = useState<string>('stable-diffusion-xl-beta-v2-2-2');

    const size = useWindowSize();

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
        if (params?.examplePrompt) {
            const randomIndex = Math.floor(Math.random() * params?.examplePrompt.length);
            setInputValue(params?.examplePrompt?.[randomIndex].value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.examplePrompt]);

    const onDice = () => {
        if (params?.examplePrompt) {
            const randomIndex = Math.floor(Math.random() * params?.examplePrompt.length);
            setInputValue(params?.examplePrompt?.[randomIndex].value);
        }
    };

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        fileList: [],
        customRequest: async ({ file, onSuccess, onError }) => {
            try {
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
        setIsFetch(true);
        const imageRequest = {
            prompt: inputValue,
            width: width,
            height: height,
            samples,
            style_preset: currentStyle,
            image_strength: imageStrength / 100,
            seed: seed,
            steps: step,
            negative_prompt: voidInputValue,
            engine: selectModel,
            init_image: uploadFile,
            guidance_strength: strength
        };

        const res = await createText2Img({
            conversationUid: conversationId,
            scene: 'WEB_ADMIN',
            appUid: 'BASE_GENERATE_IMAGE',
            imageRequest: removeFalseProperties(imageRequest)
        });
        setIsFetch(false);
        setIsFirst(false);
        setImgList([res, ...imgList] || []);
    };
    // @ts-ignore
    return (
        <Col className={menuVisible ? (size.width < 768 ? 'pcm_menu_m' : 'pcm_menu') : 'pcm_menu_hidden'}>
            <div
                style={{ scrollbarGutter: 'stable' }}
                className={
                    'overflow-x-hidden flex flex-col items-center pb-2 w-full h-[calc(100%-70px)] xs:overflow-y-auto lg:overflow-y-hidden  hover:overflow-y-auto'
                }
            >
                <Row className={'w-[100%] p-[16px] rounded-xl bg-white'}>
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
                                <span className="text-xs">{t(`textToImage.${item.label}`)}</span>
                            </div>
                        ))}
                    </div>
                </Row>

                <Row className={'w-[100%] p-[16px] rounded-xl bg-white mt-[15px] relative p_textarea'}>
                    <div className={'text-base font-medium flex items-center justify-between w-full'}>
                        <div className="flex items-center justify-between">创意描述</div>
                        <div>
                            <CasinoIcon className="cursor-pointer text-base" onClick={onDice} />
                        </div>
                    </div>
                    <TextArea
                        autoSize={{ minRows: 6 }}
                        className=" w-full mt-3"
                        onChange={(e) => setInputValue(e.target.value)}
                        value={inputValue}
                        placeholder={'请输入你的创意'}
                        // maxLength={800}
                        // showCount
                    />
                    <div className="flex items-center mt-5 cursor-pointer" onClick={() => setShowVoidInputValue(!showVoidInputValue)}>
                        <div className={'text-base font-medium'}>不希望呈现的内容</div>
                        {showVoidInputValue ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    </div>
                    {showVoidInputValue && (
                        <TextArea
                            autoSize={{ minRows: 3 }}
                            className=" w-full mt-3"
                            onChange={(e) => setVoidInputValue(e.target.value)}
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
                                    defaultValue={5}
                                    step={1}
                                    marks={marks}
                                    valueLabelDisplay="auto"
                                    min={1}
                                    max={9}
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
                                defaultValue={4}
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
                </Row>
                <Row className={'w-[100%] mt-[15px] p-[16px] rounded-xl bg-white flex flex-col'}>
                    <div className="flex items-center cursor-pointer justify-between">
                        <div className="flex items-center cursor-pointer" onClick={() => setShowImg(!showImg)}>
                            <span className={'text-base font-medium'}>图像</span>
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
                                                    style={{
                                                        filter: `blur(${imageStrength / 10}px)`
                                                    }}
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
                                        <span className={'text-base font-medium'}>图像强度</span>
                                        <div
                                            style={{
                                                display: 'flex',
                                                marginTop: '5px',
                                                justifyContent: 'center',
                                                width: '100%'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '92%'
                                                }}
                                            >
                                                <Slider
                                                    color="secondary"
                                                    defaultValue={45}
                                                    valueLabelDisplay="auto"
                                                    aria-labelledby="discrete-slider-small-steps"
                                                    step={1}
                                                    min={0}
                                                    max={100}
                                                    onChange={(e, value, number) => setImageStrength(value as number)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Dragger {...props}>
                                    <div>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined rev={undefined} />
                                        </p>
                                        <p className="ant-upload-text">上传图片以创建变体</p>
                                    </div>
                                </Dragger>
                            )}
                        </div>
                    )}
                </Row>
                <Row className={'w-[100%] mt-[15px] p-[16px] rounded-xl bg-white'}>
                    <span className={'text-base font-medium'}>
                        高级
                        {visible ? (
                            <EyeOutlined rev={undefined} className={'cursor-pointer ml-1'} onClick={() => setVisible(!visible)} />
                        ) : (
                            <EyeInvisibleOutlined className={'cursor-pointer ml-1'} rev={undefined} onClick={() => setVisible(!visible)} />
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
                                defaultValue={50}
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
                    生成
                </Button>
            </Row>
        </Col>
    );
};
