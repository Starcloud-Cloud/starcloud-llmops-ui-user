import { FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import { DeleteOutlined } from '@ant-design/icons';
import { Image, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import Form from 'views/pages/smallRedBook/components/form';
const EditStyle = ({ typeList, imageStyleData }: { typeList: any[]; imageStyleData: any }) => {
    return (
        <div className="flex min-h-[250px]">
            <div className="flex-1">
                <FormControl sx={{ flex: 1 }} color="secondary" fullWidth>
                    <InputLabel id="type">风格</InputLabel>
                    <Select
                        value={imageStyleData?.id}
                        onChange={(e: any) => {
                            // changeDetail({ value: e.target.value, field: 'imageTemplate', flag: true });
                        }}
                        labelId="type"
                        label="风格"
                    >
                        {typeList?.map((item: any) => (
                            <MenuItem value={item.id}>{item.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {imageStyleData.id && (
                    <div className="mt-[20px]">
                        <Row className="items-center" gutter={20}>
                            {imageStyleData?.variables?.map((el: any, index: number) => (
                                <Col key={index} sm={12} xs={24} md={6}>
                                    <Form
                                        index={index}
                                        changeValue={(data: any) => {
                                            console.log(data);

                                            // changeDetail({ ...data, field: el.field });
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
