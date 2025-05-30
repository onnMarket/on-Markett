import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import CriarConta from "./telas/criarConta";
import Login from "./telas/login";
import RecuperacaoSenha from "./telas/recuperacaoSenha";
import Inicio from "./telas/inicio";

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
        <Stack.Screen name="CadastroUsuario" component={CriarConta} />
        <Stack.Screen name="RecuperacaoSenha" component={RecuperacaoSenha} />
        <Stack.Screen name="Inicio" component={Inicio} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
