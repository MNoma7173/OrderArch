import React from 'react'
import Home from './Home'
import Login from './Login'
import Profile from './profile'
import Register from './Register'
import OrderList from './OrderList'
import OrderChat from './OrderChat'
import StartMenu from './StartMenu'
import ContactUs from './ContactUs'
import ProductList from './ProductList'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'


const Stack = createNativeStackNavigator();

enableScreens(false)

const themeheader = (t) => {
  return(
    {
      title: t,
      headerStyle: {
        backgroundColor: "#2e3334",
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  )
}

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='StartHome'>
        <Stack.Screen
          component={StartMenu}
          name="StartHome"
          options={themeheader(`Welcome`)}
        />
        <Stack.Screen
          component={Home}
          name="Menu"
          options={themeheader("Menu")}
        />
        <Stack.Screen
          component={Login}
          name="LogIn"
          options={themeheader("Log In")}
        />
        <Stack.Screen
          component={Register}
          name="Register"
          options={themeheader("Register Account")}
        />
        <Stack.Screen
          component={OrderChat}
          name="OrderChatAI"
          options={themeheader("Order")}
        />
        <Stack.Screen
          component={OrderList}
          name="OrderList"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={ProductList}
          name="Products"
          options={themeheader("Product List")}
        />
        <Stack.Screen
          component={Profile}
          name="UserProfile"
          options={themeheader("User Profile")}
        />
        <Stack.Screen
          component={ContactUs}
          name="Contact"
          options={themeheader("Contact Us")}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


