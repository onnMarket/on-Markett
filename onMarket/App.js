import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import CriarConta from "./telas/criarConta";
import Login from "./telas/login";
import RecuperacaoSenha from "./telas/recuperacaoSenha";
import Inicio from "./telas/inicio";
import InicioADM from "./telas/admin/inicioAdmin";
import CadastrarProdutos from "./telas/admin/cadastrarProdutos";
import AtualizarProduto from "./telas/admin/AtualizarProduto";
import Clientes from "./telas/admin/Clientes";
import Membros from "./telas/admin/Membros";
import CadastrarMembro from "./telas/admin/cadastrarMembro";
import AtualizarMembro from "./telas/admin/AtualizarMembro";

const Stack = createNativeStackNavigator();

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
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AtualizarProduto"
          component={AtualizarProduto}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecuperacaoSenha"
          component={RecuperacaoSenha}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Inicio"
          component={Inicio}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InicioADM"
          component={InicioADM}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CadastrarProdutos"
          component={CadastrarProdutos}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Clientes"
          component={Clientes}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Membros"
          component={Membros}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CadastrarMembro"
          component={CadastrarMembro}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AtualizarMembro"
          component={AtualizarMembro}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
