import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

// Types de routes
import { RootStackParamList, RootTabParamList } from "src/navigation/types"

// Écrans
import HomeScreen from "src/screens/HomeScreen"
import AddGameScreen from "src/screens/AddGameScreen"
import StatsScreen from "src/screens/StatsScreen"
import SettingsScreen from "src/screens/SettingsScreen"
import EditGameScreen from "src/screens/EditGameScreen"
import { useThemeStore } from "@stores/themeStore"
import { Ionicons } from "@expo/vector-icons"

// Stack Home + AddGame, typé avec RootStackParamList
const HomeStack = createNativeStackNavigator<RootStackParamList>()
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="AddGame" component={AddGameScreen} options={{ presentation: "modal" }} />
      <HomeStack.Screen name="EditGame" component={EditGameScreen} options={{ presentation: "modal" }} />
    </HomeStack.Navigator>
  )
}

// Stack Stats, typé avec RootStackParamList
const StatsStack = createNativeStackNavigator<RootStackParamList>()
function StatsStackNavigator() {
  return (
    <StatsStack.Navigator screenOptions={{ headerShown: false }}>
      <StatsStack.Screen name="StatsMain" component={StatsScreen} />
    </StatsStack.Navigator>
  )
}

// Stack Settings, typé avec RootStackParamList
const SettingsStack = createNativeStackNavigator<RootStackParamList>()
function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
    </SettingsStack.Navigator>
  )
}

// Bottom Tabs, typé avec RootTabParamList
const Tab = createBottomTabNavigator<RootTabParamList>()

export default function MainNavigation() {
  const isDark = useThemeStore((s) => s.isDark())
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="HomeTab"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: isDark ? "#000" : "#fff",
            borderTopColor: isDark ? "#111" : "#ccc",
          },
          tabBarActiveTintColor: isDark ? "#fff" : "#000",
          tabBarInactiveTintColor: isDark ? "#888" : "#777",
          tabBarIcon: ({ color, size }) => {
            let iconName: string

            if (route.name === "HomeTab") iconName = "home-outline"
            else if (route.name === "StatsTab") iconName = "bar-chart-outline"
            else if (route.name === "SettingsTab") iconName = "settings-outline"
            else iconName = "ellipse-outline"

            return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />
          },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: "Home" }} />
        <Tab.Screen name="StatsTab" component={StatsStackNavigator} options={{ title: "Stats" }} />
        <Tab.Screen name="SettingsTab" component={SettingsStackNavigator} options={{ title: "Settings" }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
