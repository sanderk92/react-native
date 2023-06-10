import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Link, Tabs} from 'expo-router';
import {Pressable, useColorScheme} from 'react-native';

import Colors from '../../constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{marginBottom: -3}} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Assignments",
                    tabBarIcon: () => <FontAwesome name="inbox" color={Colors[colorScheme ?? 'light'].text} size={30}/>,
                }}
            />
            <Tabs.Screen
                name="partners"
                options={{
                    title: 'Partners',
                    tabBarIcon: () => <FontAwesome name="briefcase" color={Colors[colorScheme ?? 'light'].text} size={25}/>,
                }}
            />
            <Tabs.Screen
                name="companies"
                options={{
                    title: 'Companies',
                    tabBarIcon: () => <FontAwesome name="building" color={Colors[colorScheme ?? 'light'].text} size={25}/>,
                    headerRight: () => (
                        <Link href="/new-company" asChild>
                            <Pressable>
                                {({ pressed }) => (
                                    <FontAwesome name="plus" size={25} color={Colors[colorScheme ?? 'light'].text} style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}/>
                                )}
                            </Pressable>
                        </Link>
                    ),
                }}
            />
            <Tabs.Screen
                name="user"
                options={{
                    title: 'User',
                    tabBarIcon: () => <FontAwesome name="user" color={Colors[colorScheme ?? 'light'].text} size={25}/>,
                }}
            />
        </Tabs>
    );
}
