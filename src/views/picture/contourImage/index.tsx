import { Button, TextField } from '@mui/material';
import { UndoRounded, RedoRounded, CleaningServicesRounded } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import _ from 'lodash-es';
const ContourImage = () => {
    const [descOpen, setDescOpen] = useState(false);
    const [desc, setDesc] = useState('');
    const [history, setHistory] = useState<any[]>([]);
    const [lines, setLines] = useState<any[]>([]);
    const isDrawing = useRef(false);
    const hisRef = useRef(false);
    const stageRef: any = useRef(null);
    const handleMouseDown = (e: any) => {
        hisRef.current = false;
        isDrawing.current = true;
        console.log(e.target);

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
        console.log(e);

        isDrawing.current = false;
    };
    useEffect(() => {
        if (!hisRef.current && lines.length > 0) {
            const newValue = _.cloneDeep(history);
            newValue.push(lines);
            setHistory(newValue);
        }
    }, [lines.length]);
    useEffect(() => {
        console.log(lines);
        console.log(history);
    }, [history]);
    //上一步
    const pervious = () => {
        const newValue = _.cloneDeep(lines);
        newValue.splice(newValue.length - 1, 1);
        setLines(newValue);
    };
    //下一步
    const nextStep = () => {
        hisRef.current = true;
        const newHis = _.cloneDeep(history);
        newHis.pop();
        if (history.length !== lines.length) {
            setHistory(newHis);
            setLines(newHis[newHis.length - 1]);
        }
    };
    //清空
    const clearStep = () => {
        setLines([]);
    };
    return (
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
                    <Button
                        onClick={nextStep}
                        color="secondary"
                        size="small"
                        variant="outlined"
                        startIcon={<RedoRounded fontSize="small" />}
                    >
                        下一步
                    </Button>
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
                    onClick={() => {
                        console.log(stageRef.current.toDataURL());
                    }}
                    color="secondary"
                    variant="outlined"
                    fullWidth
                >
                    生成简笔画
                </Button>
            </div>
            <div className="w-[500px] h-[500px] border border-solid border-[black]"></div>
        </div>
    );
};
export default ContourImage;
