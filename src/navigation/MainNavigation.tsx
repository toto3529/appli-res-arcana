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
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="HomeTab" screenOptions={{ headerShown: false }}>
        <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: "Home" }} />
        <Tab.Screen name="StatsTab" component={StatsStackNavigator} options={{ title: "Stats" }} />
        <Tab.Screen name="SettingsTab" component={SettingsStackNavigator} options={{ title: "Settings" }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
