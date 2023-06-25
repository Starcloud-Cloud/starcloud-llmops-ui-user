import { useEffect, useState } from 'react';

// routing
import Routes from 'routes';

// project imports

import NavigationScroll from 'layout/NavigationScroll';
import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
import Loader from 'ui-component/Loader';

import ThemeCustomization from 'themes';
// import { dispatch } from 'store';
// import { getMenu } from 'store/slices/menu';
import useAuthorizedStore from 'store/authorize';

// auth provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
// import { t } from 'hooks/web/useI18n';
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP ||============================== //
// 在全局的地方创建这个事件
window.handleUnauthorizedEvent = new Event('handleUnauthorized');

const App = () => {
    // const [loading, setLoading] = useState<boolean>(false);
    const setUnauthorized = useAuthorizedStore((state) => state.setUnauthorized);

    // useEffect(() => {
    //     dispatch(getMenu()).then(() => {
    //         setLoading(true);
    //     });
    // }, []);
    // 当状态 isUnauthorized 改变时显示一个对话框
    useEffect(() => {
        const handleUnauthorizedListener = () => {
            setUnauthorized();
        };
        window.addEventListener('handleUnauthorized', handleUnauthorizedListener);
        return () => {
            // 组件卸载时移除监听器
            window.removeEventListener('handleUnauthorized', handleUnauthorizedListener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // if (!loading) return <Loader />;

    return (
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
    );
};

export default App;
