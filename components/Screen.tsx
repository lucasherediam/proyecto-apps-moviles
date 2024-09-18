import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@constants/Colors";
import Spacing from "@constants/Spacing";
import { StatusBar } from "expo-status-bar";

type ScreenProps = {
    children: React.ReactNode;
    stack?: boolean;
};

export function Screen({ children, stack = false }: ScreenProps) {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={{
                flex: 1,
                paddingTop: stack ? 0 : insets.top,
                paddingBottom: insets.bottom,
                paddingHorizontal: Spacing.padding.base,
                backgroundColor: Colors.background,
            }}
        >
            <StatusBar style="light" />
            {children}
        </View>
    );
}
