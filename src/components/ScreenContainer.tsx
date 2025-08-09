import { PropsWithChildren } from "react"
import { ViewStyle, ScrollView, ScrollViewProps, View, ViewProps } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"

type BaseProps = {
  contentContainerStyle?: ViewStyle
  scroll?: boolean
} & (ScrollViewProps | ViewProps)

export default function ScreenContainer({ children, contentContainerStyle, scroll = false, ...rest }: PropsWithChildren<BaseProps>) {
  const tabBarHeight = useBottomTabBarHeight()

  // padding bas = hauteur vraie de la tab bar + un petit espace
  const paddingBottom = (contentContainerStyle?.paddingBottom as number | undefined) ?? tabBarHeight + 12
  const mergedStyle = [{ paddingBottom }, contentContainerStyle] as any

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      {scroll ? (
        <ScrollView contentContainerStyle={mergedStyle} {...(rest as ScrollViewProps)}>
          {children}
        </ScrollView>
      ) : (
        <View style={mergedStyle} {...(rest as ViewProps)}>
          {children}
        </View>
      )}
    </SafeAreaView>
  )
}
