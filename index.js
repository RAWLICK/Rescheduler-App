/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {Store, persistor} from './src/app/Store';
import { PersistGate } from 'redux-persist/integration/react';

const Root = () => (
    <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
      </PersistGate>
    </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
