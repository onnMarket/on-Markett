import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
import PerfilADM from "./telas/admin/PerfilADM";
import EditarConta from "./telas/cliente/EditarConta";
import Carrinho from "./telas/cliente/Carrinho";
import CadastrarCategoria from "./telas/admin/CadastrarCateogia";
import VisualizarCliente from "./telas/admin/VisualizarCliente";
import Pedidos from "./telas/admin/Pedidos";
import DetalhesPedido from "./telas/admin/DetalhesPedido";
import HistoricoCompras from "./telas/cliente/HistoricoPedidos";
import StatusPedido from "./telas/cliente/StatusPedido";
import CadastroCartao from "./telas/cliente/CadastroCartao";

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
          name="HistoricoCompras"
          component={HistoricoCompras}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CadastroCartao" component={CadastroCartao} />

        <Stack.Screen
          name="StatusPedido"
          component={StatusPedido}
          options={{ headerBackTitleVisible: false, title: '' }}
        />
        <Stack.Screen
          name="CadastroUsuario"
          component={CriarConta}
          options={{ headerBackTitleVisible: false, title: '' }}
        />
        <Stack.Screen
          name="AtualizarProduto"
          component={AtualizarProduto}
          options={{ headerBackTitleVisible: false, title: '' }}
        />
        <Stack.Screen
          name="RecuperacaoSenha"
          component={RecuperacaoSenha}
          options={{ headerBackTitleVisible: false, title: '' }}
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
          options={{ headerBackTitleVisible: false, title: '' }}
        />
        <Stack.Screen
          name="Clientes"
          component={Clientes}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Membros"
          component={Membros}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CadastrarMembro"
          component={CadastrarMembro}
          options={{ headerBackTitleVisible: false, title: '' }}
        />
        <Stack.Screen
          name="AtualizarMembro"
          component={AtualizarMembro}
          options={{ headerBackTitleVisible: false, title: '' }}
        />
        <Stack.Screen
          name="Produto"
          component={Produto}
          options={{ headerBackTitleVisible: false, title: '' }}
        />
        <Stack.Screen
          name="Perfil"
          component={Perfil}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PerfilADM"
          component={PerfilADM}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditarConta"
          component={EditarConta}
          options={{ headerBackTitleVisible: false, title: '' }}
        />
        <Stack.Screen
          name="Carrinho"
          component={Carrinho}
          options={{ headerBackTitleVisible: false, title: '' }}
        />
        <Stack.Screen
          name="CadastrarCategoria"
          component={CadastrarCategoria}
          options={{ headerBackTitleVisible: false, title: '' }}
        />
        <Stack.Screen
          name="VisualizarCliente"
          component={VisualizarCliente}
          options={{ headerBackTitleVisible: false, title: '' }}
        />
        <Stack.Screen
          name="Pedidos"
          component={Pedidos}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetalhesPedido"
          component={DetalhesPedido}
          options={{ headerBackTitleVisible: false, title: '' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
