import { Button, Card, OutlinedInput, TextField, FormControl, InputLabel, IconButton } from '@mui/material';
import { Tag, Space, Table } from 'antd';
import React from 'react';
import { AddKeywordModal } from '../AddKeyworkModal';
import AddIcon from '@mui/icons-material/Add';
import { CSVLink } from 'react-csv';

export const KeyWord = () => {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const columns = [
        {
            title: '关键词',
            dataIndex: 'keyword',
            key: 'keyword'
        },
        {
            title: '分值',
            dataIndex: 'score',
            key: 'score'
        },
        {
            title: '搜索量',
            dataIndex: 'search volume',
            key: 'search volume'
        },
        {
            title: '购买率',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: '竞争度',
            dataIndex: 'comp',
            key: 'comp'
        },
        {
            title: '推荐值',
            dataIndex: 'usage',
            key: 'usage'
        },
        {
            title: '使用分布',
            dataIndex: 'usage',
            key: 'usage'
        }
    ];

    const data: any[] = [
        {
            keyword: '1',
            score: 20,
            title: 'iphone',
            comp: '12',
            usage: 3
        }
    ];

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    return (
        <div className="h-full p-3 bg-white">
            {/* <div className="text-lg font-bold py-1">关键词</div> */}
            <div className="flex justify-between">
                {/* <FormControl variant="outlined" className="flex-1">
                    <InputLabel size="small" htmlFor="outlined-adornment-password">
                        关键词
                    </InputLabel>
                    <OutlinedInput
                        label="Outlined"
                        size="small"
                        endAdornment={
                            <IconButton size="small">
                                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                    <path
                                        d="M793.3 191.8h-185c-17.7 0-32 14.3-32 32s14.3 32 32 32h184.9c4.6 0 8.4 3.8 8.4 8.4v303.1c0 4.6-3.8 8.4-8.4 8.4h-507L458 403.9c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L213.2 558.3c-13.1 13.1-20.3 30.5-20.3 49s7.2 35.9 20.3 49l201.4 201.4c6.2 6.2 14.4 9.4 22.6 9.4 8.2 0 16.4-3.1 22.6-9.4 12.5-12.5 12.5-32.8 0-45.3L287.2 639.7h506.1c39.9 0 72.4-32.5 72.4-72.4V264.2c0-39.9-32.5-72.4-72.4-72.4z"
                                        p-id="1595"
                                    ></path>
                                </svg>
                            </IconButton>
                        }
                    />
                </FormControl> */}

                <Button
                    startIcon={<AddIcon />}
                    color="secondary"
                    size="small"
                    variant="contained"
                    className="ml-2"
                    onClick={() => setOpen(true)}
                >
                    增加关键词
                </Button>
                <div>
                    <CSVLink
                        data={data}
                        // headers={columns}
                        onClick={() => {
                            console.log('You click the link'); // 👍🏻 Your click handling logic
                        }}
                    >
                        <IconButton size="small" disabled={!selectedRowKeys.length}>
                            <svg
                                className={`${selectedRowKeys.length && 'text-[#673ab7]'} `}
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                strokeWidth="1.75"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                                <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4"></path>
                                <path d="M7 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0"></path>
                                <path d="M10 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75"></path>
                                <path d="M16 15l2 6l2 -6"></path>
                            </svg>
                        </IconButton>
                    </CSVLink>
                </div>
            </div>

            <div className="mt-3">
                <Table size="small" columns={columns} dataSource={data} pagination={false} rowSelection={rowSelection} />
            </div>
            <AddKeywordModal open={open} handleClose={handleClose} />
        </div>
    );
};
