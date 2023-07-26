import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Slider, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

export const Regulation = () => {
    const [regulationText, setRegulationText] = useState('');
    const [mood, setMood] = useState('');
    const [length, setLength] = useState('');
    const [language, setLanguage] = useState('');
    return (
        <div>
            <div>
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                    }
                >
                    基础规则
                </span>
                <div className={'mt-5'}>
                    <TextField
                        label={'角色描述'}
                        className={'mt-1'}
                        fullWidth
                        size={'small'}
                        multiline={true}
                        maxRows={10}
                        minRows={10}
                        onChange={(e) => setRegulationText(e.target.value)}
                    />
                    <div className={'flex  items-center mt-3'}>
                        <FormControl sx={{ width: '150px' }}>
                            <InputLabel id="age-select">回复语气</InputLabel>
                            <Select id="columnId" name="columnId" label={'style'} fullWidth onChange={(e: any) => setMood(e.target.value)}>
                                <MenuItem value="0">默认</MenuItem>
                                <MenuItem value="1">亲切</MenuItem>
                                <MenuItem value="2">可爱</MenuItem>
                                <MenuItem value="3">礼貌</MenuItem>
                                <MenuItem value="4">严肃</MenuItem>
                                <MenuItem value="5">幽默</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: '150px' }} className={'ml-3'}>
                            <InputLabel id="age-select">最大回复长度</InputLabel>
                            <Select
                                id="columnId"
                                name="columnId"
                                label={'style'}
                                fullWidth
                                onChange={(e: any) => setLength(e.target.value)}
                            >
                                <MenuItem value="0">默认</MenuItem>
                                <MenuItem value="1">50字</MenuItem>
                                <MenuItem value="2">100字</MenuItem>
                                <MenuItem value="3">200字</MenuItem>
                                <MenuItem value="4">300字</MenuItem>
                                <MenuItem value="5">500字</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: '150px' }} className={'ml-3'}>
                            <InputLabel id="age-select">回复语种</InputLabel>
                            <Select
                                id="columnId"
                                name="columnId"
                                label={'style'}
                                fullWidth
                                onChange={(e: any) => setLanguage(e.target.value)}
                            >
                                <MenuItem value="0">跟随提问</MenuItem>
                                <MenuItem value="1">始终中文</MenuItem>
                                <MenuItem value="2">始终英文</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
            <div className={'mt-5'}>
                <span
                    className={
                        "before:bg-[#673ab7] before:left-0 before:top-[7px] before:content-[''] before:w-[3px] before:h-[14px] before:absolute before:ml-0.5 block text-lg font-medium pl-[12px] relative"
                    }
                >
                    高级规则
                </span>
                <div className={'mt-3'}>
                    <span className={'text-base'}>回复多样性</span>
                    <Grid item xs={12} container spacing={2} alignItems="center">
                        <Grid item>
                            <Typography variant="h5" color={'#999'}>
                                最准确
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Slider defaultValue={40} valueLabelDisplay="auto" min={15} max={60} />
                        </Grid>
                        <Grid item>
                            <Typography variant="h5" color={'#999'}>
                                天马行空
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </div>
            <div className={'mt-5'}>
                <Button variant={'contained'} color={'secondary'}>
                    保存规则
                </Button>
            </div>
        </div>
    );
};
