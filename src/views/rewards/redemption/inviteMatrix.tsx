import { Row, Col, Card, Button } from 'antd';
import React from 'react';
import infoStore from 'store/entitlementAction';
import copy from 'clipboard-copy';
import { Tooltip, Box, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

export const InviteMatrix = () => {
    const [word, setWord] = React.useState('');
    const { use } = infoStore();
    const copyCode = () => {
        copy(word + window.location.protocol + '//' + window.location.host + '/login?q=' + use?.inviteCode);
        dispatch(
            openSnackbar({
                open: true,
                message: '复制成功',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                close: false
            })
        );
    };

    const words = [
        '推荐给你魔法矩阵，仿写小红书文案，省时还免费，还可以一键批量发布到平台！',
        '免费的小红书专业内容批量生成，让小红书矩阵制作变得更简单，还可以一键批量发布到平台，快去试试吧！',
        '魔法矩阵的账号批量管理，让自己的矩阵账号管理变的很容易，还可以一键批量发布到平台！',
        '魔法矩阵，小红书专业内容生成。批量制作书单号，情感号，资料号等，还在持续更新，真的很推荐给你试试！'
    ];

    const handleRadomWord = () => {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setWord(randomWord);
    };

    React.useEffect(() => {
        handleRadomWord();
    }, []);

    return (
        <div className="bg-white p-4 rounded">
            <div className="mt-3">
                <p className="text-black text-2xl">邀请有奖</p>
            </div>
            <Row gutter={24}>
                <Col span={12}>
                    <Card
                        title="拉新规则"
                        bordered={false}
                        style={{
                            boxShadow: 'none'
                        }}
                    >
                        <div>
                            <p className="text-base">分享二维码，邀请新人成功注册，新用户获得1天试用版。</p>
                            <p className="ml-2">-邀请好友需为之前从未注册过魔法矩阵的新用户。</p>
                            <p className="ml-2">-用户每成功邀请1位好友注册，可获得1天个人版会员。</p>
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        bordered={false}
                        title="推广素材"
                        style={{
                            boxShadow: 'none',
                            backgroundColor: '#f5f5f5'
                        }}
                        extra={
                            <svg
                                onClick={() => handleRadomWord()}
                                className="cursor-pointer"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="1752"
                                width="18"
                                height="18"
                            >
                                <path
                                    d="M853.333333 56.888889c62.577778 0 113.777778 51.2 113.777778 113.777778v682.666666c0 62.577778-51.2 113.777778-113.777778 113.777778H170.666667c-62.577778 0-113.777778-51.2-113.777778-113.777778V170.666667c0-62.577778 51.2-113.777778 113.777778-113.777778h682.666666m0-56.888889H170.666667C76.8 0 0 76.8 0 170.666667v682.666666c0 93.866667 76.8 170.666667 170.666667 170.666667h682.666666c93.866667 0 170.666667-76.8 170.666667-170.666667V170.666667c0-93.866667-76.8-170.666667-170.666667-170.666667z"
                                    p-id="1753"
                                ></path>
                                <path
                                    d="M739.555556 199.111111c-48.355556 0-85.333333 36.977778-85.333334 85.333333s36.977778 85.333333 85.333334 85.333334 85.333333-36.977778 85.333333-85.333334-36.977778-85.333333-85.333333-85.333333z m-227.555556 227.555556c-48.355556 0-85.333333 36.977778-85.333333 85.333333s36.977778 85.333333 85.333333 85.333333 85.333333-36.977778 85.333333-85.333333-36.977778-85.333333-85.333333-85.333333z m-227.555556 227.555555c-48.355556 0-85.333333 36.977778-85.333333 85.333334s36.977778 85.333333 85.333333 85.333333 85.333333-36.977778 85.333334-85.333333-36.977778-85.333333-85.333334-85.333334z"
                                    p-id="1754"
                                ></path>
                            </svg>
                        }
                    >
                        <span>{word}</span>
                        <span className="text-[#693af4]">
                            {window.location.protocol + '//' + window.location.host + '/login?q=' + use?.inviteCode}
                        </span>
                        <Tooltip arrow placement="top" title={<Box sx={{ p: 0.5, fontSize: '14px' }}>复制</Box>}>
                            <IconButton size="small" onClick={copyCode}>
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <div className="w-[300px] mx-auto mt-5">
                            <Button type="primary" block onClick={copyCode}>
                                复制链接及信息
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
