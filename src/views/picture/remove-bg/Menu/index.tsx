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
            <div
                className="flex cursor-pointer h-24 w-5 items-center justify-end bg-white outline-none rotate-180 absolute z-10 top-1/2 -translate-y-1/2 transform -right-5"
                onClick={() => setMenuVisible(!menuVisible)}
            ></div>
            <span className="panel-collapse-border-handle z-10 h-24 w-[21px] bg-neutral-200 absolute top-1/2 -translate-y-1/2 transform -right-5 rotate-180"></span>
            {menuVisible ? (
                <LeftOutlined
                    rev={undefined}
                    className="cursor-pointer z-20 absolute top-1/2 -translate-y-1/2 transform -right-4"
                    onClick={() => setMenuVisible(!menuVisible)}
                />
            ) : (
                <RightOutlined
                    rev={undefined}
                    className="cursor-pointer z-20 absolute top-1/2 -translate-y-1/2 transform -right-4"
                    onClick={() => setMenuVisible(!menuVisible)}
                />
            )}
        </Col>
    );
};
