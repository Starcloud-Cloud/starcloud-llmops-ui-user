import { Col, ColorPicker, Divider, InputNumber, Radio, Row, Space, Typography } from 'antd';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './index.scss';

type IPictureCreateMenuProps = {
    menuVisible: boolean;
    setMenuVisible: (menuVisible: boolean) => void;
};

export const PictureCreateMenu = ({ setMenuVisible, menuVisible }: IPictureCreateMenuProps) => {
    const [select, setSelect] = useState<undefined | number>(undefined);
    const [inputNumber, setInputNumber] = useState<null | number>();

    return (
        <Col className={menuVisible ? 'pcm_menu' : 'pcm_menu_hidden'}>
            <Row className="flex flex-col justify-start" style={{ width: '90%', marginTop: '30px' }}>
                <Typography.Text aria-level={1} style={{ fontSize: '16px' }}>
                    背景选择
                </Typography.Text>
                <div className="flex">
                    <Space>
                        <ColorPicker />
                        <ColorPicker />
                        <ColorPicker />
                        <ColorPicker onOpenChange={() => null} />
                    </Space>
                </div>
            </Row>
            <Divider type={'horizontal'} />
            <Row style={{ width: '90%', marginTop: '15px' }}>
                <span style={{ fontSize: '16px' }}>裁剪方式</span>
                <div style={{ width: '100%', display: 'flex', marginTop: '5px' }}>
                    <Radio.Group onChange={(e) => setSelect(e.target.value)}>
                        <Radio value={1}>原图</Radio>
                        <Radio value={2}>1:1</Radio>
                    </Radio.Group>
                </div>
            </Row>
            {select === 2 && (
                <Row style={{ width: '90%', marginTop: '30px' }}>
                    <span style={{ fontSize: '16px' }}>主体占比</span>
                    <div style={{ width: '100%', display: 'flex', marginTop: '5px' }}>
                        <InputNumber
                            defaultValue={100}
                            min={0}
                            max={100}
                            formatter={(value) => `${value}%`}
                            // parser={(value) => value!.replace('%', '')}
                            onChange={(v) => setInputNumber(v)}
                        />
                    </div>
                </Row>
            )}
        </Col>
    );
};
