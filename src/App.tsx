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
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                close: false
            })
        );
    });

    // if (!loading) return <Loader />;
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
        </ConfigProvider>
    );
};

export default App;
