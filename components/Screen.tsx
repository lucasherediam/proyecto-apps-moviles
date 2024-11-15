import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@constants/Colors';
import { StatusBar } from 'expo-status-bar';
import Spacing from '@constants/Spacing';

type ScreenProps = {
    children: React.ReactNode;
    ph?: number;
    phauto?: boolean;
    pt?: number;
    pb?: number;
    statusBar?: 'light' | 'dark';
};

export function Screen({
    children,
    ph,
    phauto,
    pt,
    pb,
    statusBar,
}: ScreenProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                flex: 1,
                paddingTop: pt ?? insets.top,
                paddingBottom: pb ?? insets.bottom,
                paddingHorizontal:
                    ph !== undefined ? ph : phauto ? Spacing.padding.base : 0,
                backgroundColor: Colors.background,
            }}
        >
            <StatusBar style={statusBar || 'light'} />
            {children}
        </View>
    );
}
