import { Card, Button, TextField } from '@mui/material';
import { UndoRounded, CleaningServicesRounded, ArrowCircleDown, KeyboardBackspace, History } from '@mui/icons-material';
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
const ContourImage = () => {
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
    //图片详情
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState<any>({});

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
                            setDesc(e.target.value);
                        }}
                    />
                    <Button
                        disabled={loading}
                        onClick={async () => {
                            if (lines.length > 0 && desc) {
                                setLoading(true);
                                setRightRes(true);
                                const res = await sketchToImage({
                                    imageRequest: {
                                        sketchImage: stageRef.current.toDataURL(),
                                        prompt: desc
                                    },
                                    scene: 'IMAGE_SKETCH',
                                    appUid: 'SKETCH_TO_IMAGE'
                                });
                                if (res) {
                                    setLoading(false);
                                    setResult(res.response);
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
                                                    downLoadImages(result?.images[0].url, result?.images[0].mediaType.split('/')[1]);
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
                {detailOpen && <ImageDetail detailOpen={detailOpen} detailData={detailData} handleClose={() => setDetailOpen(false)} />}
            </div>
        </Card>
    );
};
export default ContourImage;
