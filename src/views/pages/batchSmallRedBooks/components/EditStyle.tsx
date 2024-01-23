import { FormControl, InputLabel, Select, MenuItem, FormHelperText, TextField } from '@mui/material';
import { DeleteOutlined } from '@ant-design/icons';
import { Image, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import _ from 'lodash-es';
import Form from 'views/pages/smallRedBook/components/form';
import { SelectTemplateModal } from './SelectTemplateModal';

import React from 'react';
import { getImageTemplateTypes } from 'api/template';
const EditStyle = ({ typeList, imageStyleData, setData }: { typeList: any[]; imageStyleData: any; setData: (data: any) => void }) => {
    const [open, setOpen] = React.useState(false);
    const [currentTemp, setCurrentTemp] = React.useState<any>(null);
    const [tempList, setTempList] = React.useState<any>([]);
    const [imageTypeList, setImageTypeList] = React.useState<any[]>([]);
    const handleOk = (temp: any) => {
        setCurrentTemp(temp);
        const newData = _.cloneDeep(imageStyleData);
        newData.id = temp.id;
        newData.variableList = temp.variableList;
        setData(newData);
        setOpen(false);
    };
    useEffect(() => {
        getImageTemplateTypes().then((res) => {
            setImageTypeList(res);
            const list = res.map((element: any) => {
                return element.list;
            });
            setTempList(list.flat());
        });
    }, []);
    useEffect(() => {
        if (imageStyleData.id) {
            const data = tempList.find((v: any) => v.id === imageStyleData?.id);
            setCurrentTemp(data);
        }
    }, [imageStyleData, tempList]);

    return (
        <div className="flex min-h-[250px]">
            <div className="flex-1">
                {open && (
                    <SelectTemplateModal open={open} imageTypeList={imageTypeList} handleClose={() => setOpen(false)} handleOk={handleOk} />
                )}
                <FormControl error={!imageStyleData?.id} sx={{ flex: 1 }} color="secondary" fullWidth>
                    <TextField
                        color="secondary"
                        className="!cursor-pointer"
                        id="outlined-basic"
                        label="风格"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={currentTemp?.name}
                        onClick={() => setOpen(true)}
                        error={!imageStyleData?.id}
                    />
                    <FormHelperText>{!imageStyleData?.id ? '图片风格是必选项' : ' '}</FormHelperText>
                </FormControl>
                {imageStyleData?.id && (
                    <div>
                        <Row className="items-center mt-[20px]" gutter={20}>
                            {imageStyleData?.variableList?.map(
                                (el: any, index: number) =>
                                    el.style === 'INPUT' && (
                                        <>
                                            <Col key={index} sm={12}>
                                                <Form
                                                    flag={true}
                                                    index={index}
                                                    changeValue={(data: any) => {
                                                        const newData = _.cloneDeep(imageStyleData);
                                                        newData.variableList[data.index].value = data.value;
                                                        setData(newData);
                                                    }}
                                                    item={el}
                                                />
                                            </Col>
                                            <Col key={index} sm={12}>
                                                {(imageStyleData?.variableList?.some((value: any) => value?.field === 'TITLE') ||
                                                    imageStyleData?.variableList?.some((value: any) => value?.field === 'SUB_TITLE')) && (
                                                    <FormControl sx={{ mt: 2 }} size="small" color="secondary" fullWidth>
                                                        <InputLabel id="model">生成模式</InputLabel>
                                                        <Select
                                                            labelId="model"
                                                            value={imageStyleData?.model}
                                                            label="生成模式"
                                                            onChange={(e) => {
                                                                const newData = _.cloneDeep(imageStyleData);
                                                                newData.variableList[index].model = e.target.value;
                                                                setData(newData);
                                                            }}
                                                        >
                                                            <MenuItem value="USER">用户填写</MenuItem>
                                                            <MenuItem value="VARIABLE">变量替换</MenuItem>
                                                            <MenuItem value="AI">AI生成</MenuItem>
                                                            <MenuItem value="MULTIMODAL">AI多模态生成</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            </Col>
                                        </>
                                    )
                            )}
                        </Row>
                        <div className="float-right">
                            <div className="text-[12px]">风格示例图</div>
                            <Image width={200} preview={false} src={currentTemp?.example} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default EditStyle;
