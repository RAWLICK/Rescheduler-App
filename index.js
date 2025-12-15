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
import { View, Text, TouchableOpacity, Platform } from 'react-native';

// const CustomTooltip = ({
//   text,
//   isLastStep,
//   isFirstStep,
//   handleNext,
//   handlePrev,
//   handleStop,
// }) => {
//   return (
//     <View
//       style={{
//         backgroundColor: 'white',
//         padding: 16,
//         borderRadius: 14,
//         shadowColor: '#000',
//         shadowOpacity: 0.15,
//         shadowOffset: { width: 0, height: 3 },
//         shadowRadius: 6,
//         elevation: 4,
//         maxWidth: '90%',
//       }}
//     >
//       <Text
//         style={{
//           fontSize: 17,
//           color: '#000',            // ⭐ CHANGE TEXT COLOR HERE
//           fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
//           marginBottom: 16,
//         }}
//       >
//         {text}
//       </Text>

//       <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
//         {!isFirstStep && (
//           <TouchableOpacity onPress={handlePrev}>
//             <Text style={{ color: '#007AFF', marginRight: 20, fontSize: 16 }}>
//               Back
//             </Text>
//           </TouchableOpacity>
//         )}

//         {!isLastStep ? (
//           <TouchableOpacity onPress={handleNext}>
//             <Text style={{ color: '#007AFF', fontSize: 16 }}>Next</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity onPress={handleStop}>
//             <Text style={{ color: '#007AFF', fontSize: 16 }}>Done</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

const Root = () => (
    <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
            <CopilotProvider
            // tooltipComponent={CustomTooltip}
            tooltipStyle={{
                borderRadius: 16, // 👈 rounded corners for tooltip box
                backgroundColor: 'black',
                padding: 12
            }}
            arrowColor='black'
            labels={{
                next: 'Next',
                previous: 'Back',
                finish: 'Done',
            }}
            >
                <App />
            </CopilotProvider>
        </PersistGate>
    </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
