import { TextField } from '@mui/material';
import { Descriptions, Space, Button, Tag } from 'antd';
import React, { useEffect } from 'react';
import copy from 'clipboard-copy';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { claimTask, getTaskDetail } from 'api/redBook/client';
import { useLocation } from 'react-router-dom';
import { singleMetadata } from 'api/redBook/task';

const PostTask = () => {
    const [recipient, setRecipient] = React.useState('');
    const [url, setUrl] = React.useState('');
    const [task, setTask] = React.useState<any>(null);
    const [status, setStatus] = React.useState('');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const uid = searchParams.get('uid');
    const [_, update] = React.useState({});

    useEffect(() => {
        if (uid) {
            getTaskDetail(uid).then((res) => {
                setTask({ ...res.content, statusValue: res.status, notificationName: res.notificationName, tags: res.tags });
            });
        }
    }, [uid, _]);

    useEffect(() => {
        if (task) {
            singleMetadata().then((res) => {
                const result = res.singleMissionStatusEnum.find((item: any) => item.value === task.statusValue);
                setStatus(result?.label);
            });
        }
    }, [task]);

    const handleOk = async () => {
        if (!recipient) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '领取人必填',
                    variant: 'alert',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            return;
        }
        if (!url) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: '发布地址必填',
                    variant: 'alert',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            return;
        }
        const res = await claimTask({
            uid,
            claimUsername: recipient,
            publishUrl: url
        });
        if (res) {
            update({});
            dispatch(
                openSnackbar({
                    open: true,
                    message: '提交成功',
                    variant: 'alert',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
        }
    };

    const copyText = (text: string) => {
        copy(text);
        dispatch(
            openSnackbar({
                open: true,
                message: '复制成功',
                variant: 'alert',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                },
                alert: {
                    color: 'success'
                },
                close: false
            })
        );
    };
    return (
        <div className="p-4">
            <Space direction="vertical" size={16} className="w-full">
                <Descriptions
                    title={
                        <div className="items-center">
                            <span className="mr-1">通告信息</span>
                            {status && <Tag>{status}</Tag>}
                        </div>
                    }
                    bordered
                    layout="vertical"
                    items={[
                        {
                            key: '0',
                            label: (
                                <div className="flex items-center" onClick={() => copyText(task?.notificationName)}>
                                    <span>通过名称</span>
                                    <ContentCopyIcon color="secondary" className="text-sm" />
                                </div>
                            ),
                            children: <span onClick={() => copyText(task?.notificationName)}>{task?.notificationName}</span>,
                            span: 3
                        },
                        {
                            key: '1',
                            label: (
                                <div className="flex items-center" onClick={() => copyText(task?.title)}>
                                    <span>文案标题</span>
                                    <ContentCopyIcon color="secondary" className="text-sm" />
                                </div>
                            ),
                            children: <span onClick={() => copyText(task?.title)}>{task?.title}</span>,
                            span: 3
                        },
                        {
                            key: '2',
                            label: (
                                <div className="flex items-center" onClick={() => copyText(task?.text)}>
                                    <span>文案内容</span>
                                    <ContentCopyIcon color="secondary" className="text-sm" />
                                </div>
                            ),
                            children: <span onClick={() => copyText(task?.text)}>{task?.text}</span>,
                            span: 3
                        },
                        {
                            key: '4',
                            label: (
                                <div className="flex items-center" onClick={() => copyText(task?.tags?.join(' '))}>
                                    <span>标签</span>
                                    <ContentCopyIcon color="secondary" className="text-sm" />
                                </div>
                            ),
                            children: <span onClick={() => copyText(task?.tags?.join(' '))}>{task?.tags?.join(' ')}</span>,
                            span: 3
                        },
                        {
                            key: '5',
                            label: '图片列表',
                            children: (
                                <div className="grid grid-cols-2 gap-2">
                                    {task?.picture.map((v: any, i: number) => (
                                        <img key={i} className="w-full" src={v.url} />
                                    ))}
                                </div>
                            ),
                            span: 3
                        }
                    ]}
                />
                <Descriptions
                    title="提交信息"
                    bordered
                    layout="vertical"
                    items={[
                        {
                            key: '1',
                            label: (
                                <div>
                                    <span>领取人</span>
                                    <span className="text-red-500">*</span>
                                </div>
                            ),
                            children: (
                                <TextField
                                    value={recipient}
                                    onChange={(e) => {
                                        setRecipient(e.target.value);
                                    }}
                                    placeholder="请输入认领人"
                                    fullWidth
                                    color="secondary"
                                    id="outlined-basic"
                                    variant="outlined"
                                />
                            ),
                            span: 3
                        },
                        {
                            key: '2',
                            label: (
                                <div>
                                    <span>发布地址</span>
                                    <span className="text-red-500">*</span>
                                </div>
                            ),
                            children: (
                                <TextField
                                    value={url}
                                    onChange={(e) => {
                                        setUrl(e.target.value);
                                    }}
                                    placeholder="请输入发布地址"
                                    fullWidth
                                    color="secondary"
                                    id="outlined-basic"
                                    variant="outlined"
                                />
                            ),
                            span: 3
                        }
                    ]}
                />
                <Button type="primary" block className="mt-4" onClick={handleOk} disabled={task?.statusValue !== 'stay_claim'}>
                    提交
                </Button>
            </Space>
        </div>
    );
};

export default PostTask;
