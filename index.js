/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {Store, persistor} from './src/app/Store';
import { PersistGate } from 'redux-persist/integration/react';
import { CopilotProvider } from "react-native-copilot";

const Root = () => (
    <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
            <CopilotProvider
            tooltipStyle={{
                borderRadius: 16, // 👈 rounded corners for tooltip box
                backgroundColor: 'white',
                padding: 12,
            }}
            stepStyle={{
                borderRadius: 20, // 👈 rounded highlight around the element
            }}
            labels={{
                next: 'Next',
                previous: 'Back',
                finish: 'Done',
            }}
            tooltipTextStyle={{
                fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', // 👈 your font
                fontSize: 17,
                color: 'black',
            }}
            >
                <App />
            </CopilotProvider>
        </PersistGate>
    </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
