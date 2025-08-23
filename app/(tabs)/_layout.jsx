import { Tabs, useRouter } from 'expo-router';
import { Home, Plus, User } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { theme } from '../../constants/theme';

export default function TabLayout() {

  const router = useRouter();

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
        name="dummy"
        options={{
          title: 'Create Brew',
          tabBarShowLabel: false,
          tabBarButton: (props) => (
            <Pressable
              {...props}
              onPress={() => {
                router.push('/createBrew');
              }}
              style={{alignItems: 'center', justifyContent: 'center', height: '100%'}}
            >
              <Plus size={24} color={theme.colors.primary} />
            </Pressable>
          ),
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
