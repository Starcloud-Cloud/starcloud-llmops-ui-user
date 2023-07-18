import { Button } from '@mui/material';
import { Col, Divider, Input, Row, Space, Tag } from 'antd';

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Slider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './index.scss';
import { createText2Img, getImgMeta } from '../../../../api/picture/create';
import { IImageListType } from '../index';
import { useWindowSize } from '../../../../hooks/useWindowSize';

const { TextArea } = Input;
const { CheckableTag } = Tag;

const CollapseChildren = ({
    selectedGuidancePresetTags,
    setSelectedGuidancePresetTags,
    selectedSamplerTags,
    setSamplerSelectedTags,
    selectedStylePresetTags,
    setSelectedStylePresetTags,
    params
}: {
    selectedGuidancePresetTags: number[];
    setSelectedGuidancePresetTags: (selectedGuidancePresetTags: number[]) => void;
    selectedSamplerTags: number[];
    setSamplerSelectedTags: (selectedGuidancePresetTags: number[]) => void;
    selectedStylePresetTags: string[];
    setSelectedStylePresetTags: (selectedGuidancePresetTags: string[]) => void;
    params: IParamsType | null;
}) => {
    const handleGuidanceChange = (tag: number, checked: boolean) => {
        const nextSelectedTags = checked ? [tag] : selectedGuidancePresetTags.filter((t) => t !== tag);
        setSelectedGuidancePresetTags(nextSelectedTags);
    };

    const handleSamplerChange = (tag: number, checked: boolean) => {
        const nextSelectedTags = checked ? [tag] : selectedSamplerTags.filter((t) => t !== tag);
        setSamplerSelectedTags(nextSelectedTags);
    };

    const handlePresetChange = (tag: string, checked: boolean) => {
        const nextSelectedTags = checked ? [tag] : selectedStylePresetTags.filter((t) => t !== tag);
        setSelectedStylePresetTags(nextSelectedTags);
    };

    return (
        <div className="pcm_collapse_child_wrapper">
            <div className="pcm_collapse_child_item">
                <span className={'mb-1.5 text-base'}>guidancePreset:</span>
                <Space size={[0, 8]} wrap>
                    {params?.guidancePreset.map((tag) => (
                        <CheckableTag
                            key={tag.value}
                            checked={selectedGuidancePresetTags.includes(tag.value)}
                            onChange={(checked) => handleGuidanceChange(tag.value, checked)}
                        >
                            {tag.label}
                        </CheckableTag>
                    ))}
                </Space>
            </div>
            <Divider type={'horizontal'} />
            <div className="pcm_collapse_child_item">
                <span className={'mb-1.5 text-base'}>sampler:</span>
                <Space size={[0, 8]} wrap>
                    {params?.sampler.map((tag) => (
                        <CheckableTag
                            key={tag.value}
                            checked={selectedSamplerTags.includes(tag.value)}
                            onChange={(checked) => handleSamplerChange(tag.value, checked)}
                        >
                            {tag.label}
                        </CheckableTag>
                    ))}
                </Space>
            </div>
            <Divider type={'horizontal'} />
            <div className="pcm_collapse_child_item">
                <span className={'mb-1.5 text-base'}>stylePreset:</span>
                <Space size={[0, 8]} wrap>
                    {params?.stylePreset.map((tag) => (
                        <CheckableTag
                            key={tag.value}
                            checked={selectedStylePresetTags.includes(tag.value)}
                            onChange={(checked) => handlePresetChange(tag.value, checked)}
                        >
                            {tag.label}
                        </CheckableTag>
                    ))}
                </Space>
            </div>
        </div>
    );
};

type IPictureCreateMenuProps = {
    menuVisible: boolean;
    setMenuVisible: (menuVisible: boolean) => void;
    setImgList: (imgList: IImageListType) => void;
    imgList: IImageListType;
};
export type IParamsType = {
    guidancePreset: IParamsTypeGuidancePreset[];
    stylePreset: IParamsTypeStylePreset[];
    imageSize: IParamsTypeImageSize[];
    samples: IParamsTypeSamples[];
    sampler: IParamsTypeSampler[];
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
export const PictureCreateMenu = ({ setMenuVisible, menuVisible, setImgList, imgList }: IPictureCreateMenuProps) => {
    const [select, setSelect] = useState<undefined | string>(undefined);
    const [inputValue, setInputValue] = useState('');
    const [visible, setVisible] = useState(false);
    const [params, setParams] = useState<null | IParamsType>(null);
    const [selectedGuidancePresetTags, setSelectedGuidancePresetTags] = useState<number[]>([]);
    const [selectedSamplerTags, setSamplerSelectedTags] = useState<number[]>([]);
    const [selectedStylePresetTags, setSelectedStylePresetTags] = useState<string[]>([]);
    const [samples, setSamples] = useState(4);
    const size = useWindowSize();

    useEffect(() => {
        (async () => {
            const res = await getImgMeta();
            setParams(res);
        })();
    }, []);

    const handleCreate = async () => {
        const res = await createText2Img({
            imageRequest: {
                prompt: inputValue,
                width: select?.split('x')?.[0],
                height: select?.split('x')?.[1],
                samples,
                style_preset: selectedStylePresetTags?.[0],
                guidance_preset: selectedGuidancePresetTags?.[0],
                sampler: selectedSamplerTags?.[0]
            }
        });
        setImgList([...res.messages, ...imgList] || []);
    };
    return (
        <Col className={menuVisible ? (size.width < 768 ? 'pcm_menu_m' : 'pcm_menu') : 'pcm_menu_hidden'}>
            <div className={'overflow-y-auto overflow-x-hidden flex flex-col items-center pb-2 w-full h-[calc(100%-70px)]'}>
                <Row className={'w-[100%] p-[16px] rounded-xl bg-white'}>
                    <span className={'text-base font-medium'}>图片描述</span>
                    <TextArea
                        rows={6}
                        style={{ width: '100%', marginTop: '5px', resize: 'none' }}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={
                            '在这里输入你对图片的描述，例如：大海边，蓝天白云，一座小房子，房子旁边有许多椰子树，或者，帅气的年轻男子，上身穿一件皮夹克，裤子是牛仔裤，站在纽约的时代广场，电影感，4K像素'
                        }
                    />
                </Row>
                <Row className={'w-[100%] mt-[15px] p-[16px] rounded-xl bg-white'}>
                    <span className={'text-base font-medium'}>尺寸选择</span>
                    <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', marginTop: '5px' }}>
                        {params?.imageSize.map((item, index: number) => (
                            <div className={'w-1/3 mb-2'} key={index}>
                                <span
                                    onClick={() => setSelect(item.value)}
                                    className={select === item.value ? 'pcm_tab_span_active' : 'pcm_tab_span'}
                                >
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </Row>
                <Row className={'w-[100%] mt-[15px] p-[16px] rounded-xl bg-white'}>
                    <span className={'text-base font-medium'}>生成张数</span>
                    <div style={{ width: '100%', display: 'flex', marginTop: '5px' }}>
                        <Slider
                            color="secondary"
                            defaultValue={4}
                            valueLabelDisplay="on"
                            aria-labelledby="discrete-slider-small-steps"
                            marks
                            step={1}
                            min={1}
                            max={8}
                            onChange={(e, value, number) => setSamples(value as number)}
                        />
                    </div>
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
                        <div className={'px-1 mt-[5px]'}>
                            <CollapseChildren
                                selectedGuidancePresetTags={selectedGuidancePresetTags}
                                setSelectedGuidancePresetTags={setSelectedGuidancePresetTags}
                                params={params}
                                setSelectedStylePresetTags={setSelectedStylePresetTags}
                                selectedStylePresetTags={selectedStylePresetTags}
                                setSamplerSelectedTags={setSamplerSelectedTags}
                                selectedSamplerTags={selectedSamplerTags}
                            />
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
            {/*<div*/}
            {/*    className="flex cursor-pointer h-24 w-5 items-center justify-end bg-white outline-none rotate-180 absolute z-10 top-1/2 -translate-y-1/2 transform -right-5"*/}
            {/*    onClick={() => setMenuVisible(!menuVisible)}*/}
            {/*></div>*/}
            {/*<span className="panel-collapse-border-handle z-10 h-24 w-[21px] bg-neutral-200 absolute top-1/2 -translate-y-1/2 transform -right-5 rotate-180"></span>*/}
            {/*{menuVisible ? (*/}
            {/*    <LeftOutlined*/}
            {/*        rev={undefined}*/}
            {/*        className="cursor-pointer z-20 absolute top-1/2 -translate-y-1/2 transform -right-4"*/}
            {/*        onClick={() => setMenuVisible(!menuVisible)}*/}
            {/*    />*/}
            {/*) : (*/}
            {/*    <RightOutlined*/}
            {/*        rev={undefined}*/}
            {/*        className="cursor-pointer z-20 absolute top-1/2 -translate-y-1/2 transform -right-4"*/}
            {/*        onClick={() => setMenuVisible(!menuVisible)}*/}
            {/*    />*/}
            {/*)}*/}
        </Col>
    );
};
