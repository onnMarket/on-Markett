import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';


import CriarConta from './telas/criarConta'; // ← Importar a tela
import Login from './telas/login';


const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CadastroUsuario"
          component={CriarConta}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
