import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CarregandoApp from "./telas/CarregandoApp";
import CriarConta from "./telas/criarConta";
import Login from "./telas/login";
import RecuperacaoSenha from "./telas/recuperacaoSenha";
import Inicio from "./telas/cliente/inicio";
import InicioADM from "./telas/admin/inicioAdmin";
import CadastrarProdutos from "./telas/admin/cadastrarProdutos";
import AtualizarProduto from "./telas/admin/AtualizarProduto";
import Clientes from "./telas/admin/Clientes";
import Membros from "./telas/admin/Membros";
import CadastrarMembro from "./telas/admin/cadastrarMembro";
import AtualizarMembro from "./telas/admin/AtualizarMembro";
import Produto from "./telas/cliente/Produto";
import Perfil from "./telas/cliente/Perfil";
import EditarConta from "./telas/cliente/EditarConta";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CarregandoApp">
        <Stack.Screen
          name="CarregandoApp"
          component={CarregandoApp}
          options={{ headerShown: false }}
        />
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
        <Stack.Screen
          name="Produto"
          component={Produto}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Perfil"
          component={Perfil}
          options={{headerShown: false}}
          />
        <Stack.Screen
          name="EditarConta"
          component={EditarConta}
          options={{headerShown: false}}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
