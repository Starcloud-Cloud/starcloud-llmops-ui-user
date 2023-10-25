import { Card, Button, TextField, Tooltip } from '@mui/material';
import { UndoRounded, CleaningServicesRounded, ArrowCircleDown, KeyboardBackspace, History, Casino } from '@mui/icons-material';
import imgLoading from 'assets/images/picture/loading.gif';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stage, Layer, Line } from 'react-konva';
import { sketchToImage } from 'api/picture/images';
import _ from 'lodash-es';
import { Image } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import ImageDetail from '../components/detail';
import downLoadImages from 'hooks/useDownLoadImage';
import SubCard from 'ui-component/cards/SubCard';
import { userBenefits } from 'api/template';
import { getImgMeta } from 'api/picture/create';
import { translateText } from 'api/picture/create';
import userInfoStore from 'store/entitlementAction';
import AppModal from '../create/Menu/appModal';
import { formatNumber } from 'hooks/useDate';
const ContourImage = () => {
    const { setUserInfo }: any = userInfoStore();
    const navigate = useNavigate();
    const [descOpen, setDescOpen] = useState(false);
    const [desc, setDesc] = useState('');
    const [history, setHistory] = useState<any[]>([]);
    const [lines, setLines] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [rightRes, setRightRes] = useState(false);
    const [result, setResult] = useState<any>(null);
    const isDrawing = useRef(false);
    const hisRef = useRef(false);
    const stageRef: any = useRef(null);
    const [params, setParams] = useState<any>('');
    const [appOpen, setAppOpen] = useState(false);
    //图片详情
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState<any>({});
    const [inputValueTranslate, setInputValueTranslate] = useState(false);

    const handleMouseDown = (e: any) => {
        hisRef.current = false;
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { points: [pos.x, pos.y] }]);
    };
    const handleMouseMove = (e: any) => {
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };
    const handleMouseUp = (e: any) => {
        isDrawing.current = false;
    };
    const emits = (data: any) => {
        setAppOpen(false);
        setDesc(data);
    };
    useEffect(() => {
        if (!hisRef.current && lines.length > 0) {
            const newValue = _.cloneDeep(history);
            newValue.push(lines);
            setHistory(newValue);
        }
    }, [lines.length]);
    // useEffect(() => {
    //     console.log(lines);
    //     console.log(history);
    // }, [history]);
    //上一步
    const pervious = () => {
        const newValue = _.cloneDeep(lines);
        newValue.splice(newValue.length - 1, 1);
        setLines(newValue);
    };
    //下一步
    // const nextStep = () => {
    //     hisRef.current = true;
    //     const newHis = _.cloneDeep(history);
    //     newHis.pop();
    //     if (history.length !== lines.length) {
    //         setHistory(newHis);
    //         setLines(newHis[newHis.length - 1]);
    //     }
    // };
    //清空
    const clearStep = () => {
        setLines([]);
    };
    const onDice = () => {
        setInputValueTranslate(true);
        if (params?.examplePrompt) {
            const randomIndex = Math.floor(Math.random() * params?.examplePrompt.length);
            setDesc(params?.examplePrompt?.[randomIndex].value);
        }
    };
    useEffect(() => {
        (async () => {
            const res = await getImgMeta();
            setParams(res);
        })();
    }, []);
    //翻译
    const setTranslation = async (sourceLanguage: string, targetLanguage: string) => {
        const result = await translateText({
            textList: [desc],
            sourceLanguage,
            targetLanguage
        });
        setDesc(result?.translatedList[0]?.translated);
        return result?.translatedList[0]?.translated;
    };
    return (
        <Card className="p-[16px] h-full">
            <SubCard
                sx={{ mb: 3 }}
                contentSX={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px !important' }}
            >
                <div>
                    &nbsp;&nbsp;<span className="text-[#673ab7] font-[500]">轮廓出图</span>
                </div>
                <div>
                    <Button
                        startIcon={<History />}
                        onClick={() => navigate('/imageHistory?scene=IMAGE_SKETCH')}
                        sx={{ ml: 1 }}
                        size="small"
                        variant="contained"
                        color="secondary"
                    >
                        历史记录
                    </Button>
                </div>
            </SubCard>
            <div className="h-full flex items-top justify-center gap-3">
                <div>
                    <div className="w-[500px] h-[500px] border border-solid border-black">
                        <Stage
                            width={500}
                            height={500}
                            ref={stageRef}
                            onMouseDown={handleMouseDown}
                            onMousemove={handleMouseMove}
                            onMouseup={handleMouseUp}
                        >
                            <Layer>
                                {lines.map((line, i: number) => (
                                    <Line
                                        key={i}
                                        points={line.points}
                                        stroke="#000000"
                                        strokeWidth={3}
                                        lineCap="round"
                                        lineJoin="round"
                                        globalCompositeOperation="source-over"
                                    />
                                ))}
                            </Layer>
                        </Stage>
                    </div>
                    <div className="flex justify-center gap-3 my-[16px]">
                        <Button
                            disabled={lines.length === 0}
                            onClick={pervious}
                            color="secondary"
                            size="small"
                            variant="outlined"
                            startIcon={<UndoRounded fontSize="small" />}
                        >
                            上一步
                        </Button>
                        {/* <Button
                        onClick={nextStep}
                        color="secondary"
                        size="small"
                        variant="outlined"
                        startIcon={<RedoRounded fontSize="small" />}
                    >
                        下一步
                    </Button> */}
                        <Button
                            onClick={clearStep}
                            color="secondary"
                            size="small"
                            variant="outlined"
                            startIcon={<CleaningServicesRounded fontSize="small" />}
                        >
                            清空
                        </Button>
                    </div>
                    <div className={'text-base font-medium flex items-center justify-between w-full mb-[10px]'}>
                        <div className=" flex items-center">
                            <div className="flex items-center justify-between">创意描述</div>
                            {!inputValueTranslate ? (
                                <Tooltip title="翻译成英文" arrow placement="top">
                                    <svg
                                        onClick={() => {
                                            setInputValueTranslate(!inputValueTranslate);
                                            setTranslation('zh', 'en');
                                        }}
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
                                </Tooltip>
                            ) : (
                                <Tooltip title="翻译成中文" arrow placement="top">
                                    <svg
                                        onClick={() => {
                                            setInputValueTranslate(!inputValueTranslate);
                                            setTranslation('en', 'zh');
                                        }}
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
                                </Tooltip>
                            )}
                            {inputValueTranslate && <span className="text-xs ml-2">(只能输入英文字符)</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Button color="secondary" size="small" variant="text" onClick={() => setAppOpen(true)}>
                                一键AI生成
                            </Button>
                            <Tooltip title="随机生成描述示例" arrow placement="top">
                                <Casino className="cursor-pointer text-base" onClick={onDice} />
                            </Tooltip>
                        </div>
                    </div>
                    <TextField
                        label="图片描述"
                        error={!desc && descOpen}
                        value={desc}
                        helperText={!desc && descOpen ? '图片描述必填' : ' '}
                        placeholder="在此处填写你画了什么东西，或者你希望AI生成什么"
                        InputLabelProps={{ shrink: true }}
                        color="secondary"
                        multiline
                        fullWidth
                        minRows={2}
                        maxRows={4}
                        onChange={(e) => {
                            setDescOpen(true);
                            if (inputValueTranslate) {
                                setDesc(e.target.value.replace(/[\u4e00-\u9fa5\u3000-\u303F\uFF00-\uFFEF]/g, ''));
                            } else {
                                setDesc(e.target.value);
                            }
                        }}
                    />
                    <Button
                        disabled={loading}
                        onClick={async () => {
                            if (lines.length > 0 && desc) {
                                setLoading(true);
                                setRightRes(true);
                                const result = !inputValueTranslate ? await setTranslation('zh', 'en') : null;
                                try {
                                    const res = await sketchToImage({
                                        imageRequest: {
                                            sketchImage: stageRef.current.toDataURL(),
                                            prompt: result || desc
                                        },
                                        scene: 'IMAGE_SKETCH',
                                        appUid: 'SKETCH_TO_IMAGE'
                                    });
                                    if (res) {
                                        setLoading(false);
                                        setResult(res.response);
                                        userBenefits().then((res) => {
                                            setUserInfo(res);
                                        });
                                    }
                                } catch (err) {
                                    setLoading(false);
                                }
                            } else {
                                setDescOpen(true);
                            }
                        }}
                        color="secondary"
                        variant="contained"
                        fullWidth
                    >
                        生成简笔画 <span className="text-xs opacity-50">（消耗6点作图）</span>
                    </Button>
                </div>
                {rightRes && (
                    <div className="w-[500px] h-[500px] border border-solid border-[black]">
                        {loading ? (
                            <div className="w-full h-full flex justify-center items-center">
                                <img className="w-[80px]" src={imgLoading} alt="" />
                            </div>
                        ) : (
                            <Image
                                className="w-[500px] h-[500px]"
                                src={result?.images[0]?.url}
                                preview={{
                                    visible: false,
                                    mask: (
                                        <div
                                            className="w-full h-full flex justify-center items-center relative"
                                            onClick={() => {
                                                setDetailData(result);
                                                setDetailOpen(true);
                                            }}
                                        >
                                            <EyeOutlined className="text-[20px]" rev={undefined} />
                                            预览
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    downLoadImages(
                                                        result?.images[0].url,
                                                        result?.images[0].mediaType.split('/')[1],
                                                        result?.fromScene,
                                                        formatNumber(result?.finishTime ? result?.finishTime : new Date().getTime())
                                                    );
                                                }}
                                                className="absolute right-[5px] bottom-[5px] w-[30px] h-[30px] flex justify-center items-center rounded-md bg-[#ccc] border-rou border border-solid border-[#ccc] hover:border-[#673ab7]"
                                            >
                                                <ArrowCircleDown />
                                            </div>
                                        </div>
                                    )
                                }}
                            />
                        )}
                    </div>
                )}
                {appOpen && (
                    <AppModal
                        title="创意描述优化"
                        value={desc}
                        open={appOpen}
                        emits={emits}
                        tags={['Image', 'Optimize Prompt']}
                        setOpen={setAppOpen}
                    />
                )}
                {detailOpen && <ImageDetail detailOpen={detailOpen} detailData={detailData} handleClose={() => setDetailOpen(false)} />}
            </div>
        </Card>
    );
};
export default ContourImage;
