import { SearchOutlined } from '@mui/icons-material';
import { Button, Card, Divider, Image, Dropdown, MenuProps, Space, Drawer, Checkbox } from 'antd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { FormControl, InputLabel, MenuItem, InputAdornment, IconButton, Select } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ClearIcon from '@mui/icons-material/Clear';
import React from 'react';

const items: MenuProps['items'] = [
    {
        key: '1',
        label: '删除'
    },
    {
        key: '2',
        label: '复制'
    }
];

const AddStyle = () => {
    const [visible, setVisible] = useState(false);
    const [selectImgs, setSelectImgs] = useState<
        {
            id: string;
            src: string;
        }[]
    >([]);

    const [query, setQuery] = useState<any | null>(null);
    const [hoverIndex, setHoverIndex] = useState('');

    const handleAdd = () => {
        setVisible(true);
    };

    const handleQuery = ({ label, value }: { label: string; value: string }) => {
        setQuery({
            ...query,
            [label]: value
        });
    };

    const handleChoose = ({ id, src }: { id: string; src: string }) => {
        const index = selectImgs.map((item) => item.id).findIndex((v) => v === id);
        if (index > -1) {
            const copySelectImgs = [...selectImgs];
            copySelectImgs.splice(index, 1);
            setSelectImgs([...copySelectImgs]);
        } else {
            const copySelectImgs = [...selectImgs];
            copySelectImgs.push({ id, src });
            console.log(copySelectImgs, 'copySelectImgs');
            setSelectImgs([...copySelectImgs]);
        }
    };

    const IMAGE_LIST = [
        {
            id: '1',
            src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
        },
        {
            id: '2',
            src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
        },
        {
            id: '3',
            src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
        }
    ];

    const selectImgsIds = React.useMemo(() => {
        return selectImgs.map((item) => item.id);
    }, [selectImgs]);

    return (
        <div className="p-3">
            <div className="py-3">
                <Button onClick={() => handleAdd()}>增加风格</Button>
            </div>
            <div>
                <Card
                    type="inner"
                    title="风格"
                    extra={
                        <Dropdown menu={{ items }} placement="bottom" arrow>
                            <MoreVertIcon className="cursor-pointer" />
                        </Dropdown>
                    }
                >
                    <div className="mb-3">风格示意图6张</div>
                    <div>
                        <Image.PreviewGroup
                            preview={{
                                onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`)
                            }}
                        >
                            <Image width={160} height={200} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                            <Image
                                width={160}
                                height={200}
                                src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                            />
                        </Image.PreviewGroup>
                    </div>
                    <Divider
                        style={{
                            margin: '16px 0'
                        }}
                    />
                    <div className="flex justify-between">
                        <Button>选择模版风格</Button>
                        <div className="flex justify-center items-center cursor-pointer">
                            <span>点击放大编辑</span>
                            <SearchOutlined />
                        </div>
                    </div>
                </Card>
            </div>
            <div className="flex justify-center p-2">
                <Space>
                    <Button type="primary">保存配置</Button>
                    <Button type="primary">保存并开始生成</Button>
                </Space>
            </div>
            <Drawer
                title="选择模版"
                onClose={() => setVisible(false)}
                open={visible}
                width={500}
                footer={
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <p>选择模版：</p>
                            <div>
                                {selectImgs.map((item, index) => (
                                    <Image width={32} height={40} src={item.src} preview={false} />
                                ))}
                            </div>
                        </div>
                        <div className="flex">
                            <Space>
                                <Button>取消</Button>
                                <Button type="primary">确定</Button>
                            </Space>
                        </div>
                    </div>
                }
            >
                <div className="grid grid-cols-3 gap-3">
                    <FormControl key={query?.color} color="secondary" size="small" fullWidth>
                        <InputLabel id="types">色调</InputLabel>
                        <Select
                            value={query?.color}
                            onChange={(e: any) => handleQuery({ label: 'type', value: e.target.value })}
                            endAdornment={
                                query?.color && (
                                    <InputAdornment className="mr-[10px]" position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                handleQuery({ label: 'type', value: '' });
                                            }}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                            labelId="types"
                            label="色调"
                        >
                            <MenuItem value={'XHS'}>小红书</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl key={query?.topic} color="secondary" size="small" fullWidth>
                        <InputLabel id="types">主题</InputLabel>
                        <Select
                            value={query?.topic}
                            onChange={(e: any) => handleQuery({ label: 'type', value: e.target.value })}
                            endAdornment={
                                query?.topic && (
                                    <InputAdornment className="mr-[10px]" position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                handleQuery({ label: 'type', value: '' });
                                            }}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                            labelId="types"
                            label="主题"
                        >
                            <MenuItem value={'XHS'}>小红书</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl key={query?.picNum} color="secondary" size="small" fullWidth>
                        <InputLabel id="types">图片数量</InputLabel>
                        <Select
                            value={query?.picNum}
                            onChange={(e: any) => handleQuery({ label: 'type', value: e.target.value })}
                            endAdornment={
                                query?.picNum && (
                                    <InputAdornment className="mr-[10px]" position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                handleQuery({ label: 'type', value: '' });
                                            }}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                            labelId="types"
                            label="图片数量"
                        >
                            <MenuItem value={'XHS'}>小红书</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <div className="flex items-center mt-1">
                        <InfoIcon
                            style={{
                                fontSize: '12px'
                            }}
                        />
                        <p className="text-xs">系统根据您的商品信息，为您找到了3款图片模版供您选择</p>
                    </div>
                    <div className="mt-3">
                        <Space wrap>
                            {IMAGE_LIST.map((item, index) => (
                                <div className="relative">
                                    <Image
                                        onClick={() => handleChoose({ id: item.id, src: item.src })}
                                        onMouseEnter={() => setHoverIndex(item.id)}
                                        onMouseLeave={() => setHoverIndex('')}
                                        key={index}
                                        width={145}
                                        height={200}
                                        src={item.src}
                                        preview={false}
                                        className={`cursor-pointer ${
                                            hoverIndex === item.id ? 'outline outline-offset-2 outline-1 outline-[#673ab7]' : ''
                                        } rounded-sm`}
                                    />
                                    <Checkbox checked={selectImgsIds.includes(item.id)} className="absolute right-0 top-0" />
                                </div>
                            ))}
                        </Space>
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

export default AddStyle;
