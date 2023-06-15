import { useEffect, useState } from 'react';

// routing
import Routes from 'routes';

// project imports

import NavigationScroll from 'layout/NavigationScroll';
import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
import Loader from 'ui-component/Loader';

import ThemeCustomization from 'themes';
import { dispatch } from 'store';
import { getMenu } from 'store/slices/menu';

// auth provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP ||============================== //

const App = () => {
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getMenu()).then(() => {
            setLoading(true);
        });
    }, []);

    if (!loading) return <Loader />;

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
