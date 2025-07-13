/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {Store, persistor} from './src/app/Store';
import { PersistGate } from 'redux-persist/integration/react';
import {useAuth0, Auth0Provider} from 'react-native-auth0';

const Root = () => (
    <Auth0Provider
        // domain={'dev-euawlucdljtesr0z.us.auth0.com'}
        // clientId={'MgGS4kNAn4YSeC5lqwlJ9bM3hcCk7Cus'}
        domain= {'dev-ohpipjjs64tqo7j8.us.auth0.com'}
        clientId= {'nRmEpjXepZqDx39ScNB3qqpGJ5w7ErRg'}
    >
        <Provider store={Store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </Auth0Provider>
);

AppRegistry.registerComponent(appName, () => Root);
