// routing
import Routes from 'routes';
import './App.scss';
import zhCN from 'antd/locale/zh_CN';
// project imports

import NavigationScroll from 'layout/NavigationScroll';
import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
// import Loader from 'ui-component/Loader';

import ThemeCustomization from 'themes';
// import { dispatch } from 'store';
// import { getMenu } from 'store/slices/menu';
import useAuthorizedStore from 'store/authorize';

// auth provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import { openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';
import usePubSubEvent from 'hooks/usePubsub';
import { ConfigProvider } from 'antd';

import infoStore from 'store/entitlementAction';
import Phone from 'ui-component/login/phone';
import { getUserInfo } from 'api/login';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// import { t } from 'hooks/web/useI18n';
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP ||============================== //
const App = () => {
    // const [loading, setLoading] = useState<boolean>(false);
    const setUnauthorized = useAuthorizedStore((state) => state.setUnauthorized);

    // useEffect(() => {
    //     dispatch(getMenu()).then(() => {
    //         setLoading(true);
    //     });
    // }, []);
    // 当状态 isUnauthorized 改变时显示一个对话框
    // 当状态 isUnauthorized 改变时显示一个对话框
    usePubSubEvent('unauthorized', (_: any, data: string) => {
        setUnauthorized();
    });

    // 订阅全局错误事件
    usePubSubEvent('global.error', (_, data) => {
        // 显示错误提示
        dispatch(
            openSnackbar({
                open: true,
                message: data.message,
                variant: 'alert',
                alert: {
                    color: data.type
                },
                close: false
            })
        );
    });

    // if (!loading) return <Loader />;
    //绑定手机号
    const { use, setuse } = infoStore();
    const location = useLocation();
    useEffect(() => {
        if (use?.mobile === '' && !use?.mobile) {
            setPhoneOpen(true);
        } else {
            setPhoneOpen(false);
        }
    }, [use?.mobile, location]);
    const [phoneOpne, setPhoneOpen] = useState(false);
    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#673ab7' } }} locale={zhCN}>
            <ThemeCustomization>
                <RTLLayout>
                    <NavigationScroll>
                        <AuthProvider>
                            <>
                                <Routes />
                                <Snackbar />
                            </>
                        </AuthProvider>
                    </NavigationScroll>
                </RTLLayout>
            </ThemeCustomization>
            {phoneOpne && (
                <Phone
                    phoneOpne={phoneOpne}
                    title="绑定手机号"
                    submitText="绑定"
                    onClose={() => {
                        setPhoneOpen(false);
                    }}
                    emits={async () => {
                        setPhoneOpen(false);
                        const result = await getUserInfo();
                        setuse(result);
                    }}
                />
            )}
        </ConfigProvider>
    );
};

export default App;
