import { Button, Result } from 'antd';
import { authBind } from 'api/auth-coze';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CozeAuth = () => {
    const [result, setResult] = React.useState<undefined | boolean>(undefined);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    React.useEffect(() => {
        if (code && state) {
            authBind({
                type: 35,
                code,
                state
            })
                .then((res) => {
                    setResult(res);
                })
                .catch(() => {
                    setResult(false);
                });
        }
    });

    return (
        <div>
            <Result
                status={result === undefined ? 'info' : result === true ? 'success' : 'error'}
                title={result === undefined ? '绑定中' : result === true ? '绑定成功' : '绑定失败'}
                extra={[
                    <Button type="primary" key="console" onClick={() => navigate('/user/account-profile/profile?type=2')}>
                        回到首页
                    </Button>
                ]}
            />
        </div>
    );
};

export default CozeAuth;
