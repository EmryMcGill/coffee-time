import { Tabs } from 'expo-router';
import { Home, Plus, User } from 'lucide-react-native';

export default function TabLayout() {

  return (
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarIconStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
          tabBarShowLabel: false
        }}
      />
      <Tabs.Screen 
        name="createBrew" 
        options={{
          title: 'Create Brew',
          tabBarIcon: ({ color, size }) => (
            <Plus color={color} size={size} />
          ),
          tabBarShowLabel: false
        }}
      />
      <Tabs.Screen 
        name="(profile)" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
          tabBarShowLabel: false
        }}
      />
    </Tabs>
  );
}
