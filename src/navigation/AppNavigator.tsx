import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import TabNavigator from './TabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import LoadingScreen from '../components/LoadingScreen';
import { colors } from '../theme';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Initialisation..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={isAuthenticated ? "MainTabs" : "Login"}
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background.paper,
            borderBottomWidth: 1,
            borderBottomColor: colors.border.primary,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
          },
          headerTintColor: colors.primary.main,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            color: colors.text.primary,
          },
          headerBackTitleVisible: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={TabNavigator} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen} 
              options={{ title: 'Paramètres' }}
            />
          </>
        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}