import { Button, Col, Collapse, Input, Row, Space, Tag, Typography } from 'antd';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './index.scss';

const { TextArea } = Input;
const { CheckableTag } = Tag;

const tagsData = ['Movies', 'Books', 'Music', 'Sports'];

const CollapseChildren = () => {
    const [selectedTags, setSelectedTags] = useState<string[]>(['Books']);

    const handleChange = (tag: string, checked: boolean) => {
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter((t) => t !== tag);
        console.log('You are interested in: ', nextSelectedTags);
        setSelectedTags(nextSelectedTags);
    };

    return (
        <div className="pcm_collapse_child_wrapper">
            <div className="pcm_collapse_child_item">
                <span style={{ marginRight: 8 }}>Categories:</span>
                <Space size={[0, 8]} wrap>
                    {tagsData.map((tag) => (
                        <CheckableTag key={tag} checked={selectedTags.includes(tag)} onChange={(checked) => handleChange(tag, checked)}>
                            {tag}
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
};

export const PictureCreateMenu = ({ setMenuVisible, menuVisible }: IPictureCreateMenuProps) => {
    const [select, setSelect] = useState<undefined | number>(undefined);

    return (
        <Col className={menuVisible ? 'pcm_menu' : 'pcm_menu_hidden'}>
            <Row style={{ width: '90%', marginTop: '15px' }}>
                <Typography.Text aria-level={1} style={{ fontSize: '16px' }}>
                    图片描述
                </Typography.Text>
                <TextArea
                    rows={6}
                    style={{ width: '100%', marginTop: '5px' }}
                    placeholder={
                        '在这里输入你对图片的描述，例如：大海边，蓝天白云，一座小房子，房子旁边有许多椰子树，或者，帅气的年轻男子，上身穿一件皮夹克，裤子是牛仔裤，站在纽约的时代广场，电影感，4K像素'
                    }
                />
            </Row>
            <Row style={{ width: '90%', marginTop: '30px' }}>
                <span style={{ fontSize: '16px' }}>尺寸选择</span>
                <div style={{ width: '100%', display: 'flex', marginTop: '5px' }}>
                    <div className={'pcm_tab_span_wrapper'}>
                        <span onClick={() => setSelect(1)} className={select === 1 ? 'pcm_tab_span_active' : 'pcm_tab_span'}>
                            1:1
                        </span>
                    </div>
                    <div className={'pcm_tab_span_wrapper'}>
                        <span onClick={() => setSelect(2)} className={select === 2 ? 'pcm_tab_span_active' : 'pcm_tab_span'}>
                            16:9
                        </span>
                    </div>
                    <div className={'pcm_tab_span_wrapper'}>
                        <span onClick={() => setSelect(3)} className={select === 3 ? 'pcm_tab_span_active' : 'pcm_tab_span'}>
                            9:16
                        </span>
                    </div>
                </div>
            </Row>
            <Row style={{ width: '90%', marginTop: '30px' }}>
                <Collapse
                    style={{ width: '100%' }}
                    items={[
                        {
                            key: '1',
                            label: '高级',
                            children: <CollapseChildren />
                        }
                    ]}
                />
            </Row>
            <Row
                style={{
                    position: 'absolute',
                    bottom: 0,
                    height: '60px',
                    borderTop: '0.5px solid #d9d9d9',
                    width: '100%'
                }}
                justify={'center'}
                align={'middle'}
            >
                <Button type={'primary'} block style={{ width: '94%', background: '#673ab7' }}>
                    生成
                </Button>
            </Row>
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
