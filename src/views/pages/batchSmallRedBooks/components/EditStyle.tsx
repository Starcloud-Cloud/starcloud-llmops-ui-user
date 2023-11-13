import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { DeleteOutlined } from '@ant-design/icons';
import { Image, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import _ from 'lodash-es';
import Form from 'views/pages/smallRedBook/components/form';
const EditStyle = ({ typeList, imageStyleData, setData }: { typeList: any[]; imageStyleData: any; setData: (data: any) => void }) => {
    return (
        <div className="flex min-h-[250px]">
            <div className="flex-1">
                <FormControl error={!imageStyleData?.id} sx={{ flex: 1 }} color="secondary" fullWidth>
                    <InputLabel id="type">风格</InputLabel>
                    <Select
                        value={imageStyleData?.id}
                        onChange={(e: any) => {
                            const newData = _.cloneDeep(imageStyleData);
                            (newData.id = e.target.value),
                                (newData.variables = typeList?.filter((value: any) => value.id === e.target.value)[0]?.variables);
                            setData(newData);
                        }}
                        labelId="type"
                        label="风格"
                    >
                        {typeList?.map((item: any) => (
                            <MenuItem value={item?.id}>{item?.name}</MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{!imageStyleData?.id ? '风格是必选项' : ' '}</FormHelperText>
                </FormControl>
                {imageStyleData?.id && (
                    <div className="mt-[20px]">
                        <Row className="items-center" gutter={20}>
                            {imageStyleData?.variables?.map((el: any, index: number) => (
                                <Col key={index} sm={12} xs={24} md={6}>
                                    <Form
                                        flag={true}
                                        index={index}
                                        changeValue={(data: any) => {
                                            const newData = _.cloneDeep(imageStyleData);
                                            newData.variables[data.index].value = data.value;
                                            setData(newData);
                                        }}
                                        item={el}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </div>
        </div>
    );
};
export default EditStyle;
