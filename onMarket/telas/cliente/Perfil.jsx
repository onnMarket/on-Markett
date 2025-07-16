import React, { useState, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, Alert, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import cores from "../style/cores";
import { useFocusEffect } from "@react-navigation/native";
import MenuInferiorCliente from "../navigation/navigationBar_cliente";

export default function Perfil({ navigation }) {
  const [usuario, setUsuario] = useState(null);

  // Função para formatar CPF no formato 000.000.000-00
  function formatarCPF(value) {
    if (!value) return "-";
    const cpfLimpo = value.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return value; // Se não tiver 11 dígitos, retorna como veio
    return cpfLimpo
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  useFocusEffect(
    useCallback(() => {
      const carregarUsuario = async () => {
        try {
          const usuarioStr = await AsyncStorage.getItem("@usuario");
          if (usuarioStr) {
            const usuarioObj = JSON.parse(usuarioStr);
            setUsuario(usuarioObj);
          } else {
            navigation.replace("Login");
          }
        } catch (error) {
          console.error("Erro ao carregar usuário:", error);
        }
      };

      carregarUsuario();
    }, [])
  );

  const logout = async () => {
    Alert.alert(
      "Sair",
      "Deseja realmente sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("@usuario");
            navigation.replace("Login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const editarConta = () => {
    navigation.navigate("EditarConta", { usuario });
  };

  const excluirConta = () => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(
                `https://on-markett-2.onrender.com/api/users/${usuario.id}`
              );
              await AsyncStorage.removeItem("@usuario");
              Alert.alert(
                "Conta excluída",
                "Sua conta foi removida com sucesso."
              );
              navigation.replace("Login");
            } catch (error) {
              console.error("Erro ao excluir conta:", error);
              Alert.alert("Erro", "Não foi possível excluir a conta.");
            }
          },
        },
      ]
    );
  };

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>Carregando dados do usuário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.conteudoCentralizado}>
        <View style={styles.card}>
          <Text style={styles.titulo}>Perfil do Usuário</Text>

          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.valor}>{usuario.nome}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.valor}>{usuario.email}</Text>

          <Text style={styles.label}>CPF:</Text>
          <Text style={styles.valor}>{formatarCPF(usuario.cpf)}</Text>

          <Text style={styles.label}>Tipo de Conta:</Text>
          <Text style={styles.valor}>{usuario.tipo}</Text>

          <Text style={styles.label}>Senha:</Text>
          <Text style={styles.valor}>{usuario.senha || "-"}</Text>

          <TouchableOpacity
            style={styles.botaoCartao}
            onPress={() => navigation.navigate("CadastroCartao")}
          >
            <Text style={styles.textoBotao}>Cadastrar Cartão</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoEditar} onPress={editarConta}>
            <Text style={styles.textoBotao}>Editar Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoExcluir} onPress={excluirConta}>
            <Text style={styles.textoBotao}>Excluir Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoLogout} onPress={logout}>
            <Text style={styles.textoBotao}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuInferior}>
        <MenuInferiorCliente navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
    paddingHorizontal: 20,
  },
  conteudoCentralizado: {
    flex: 1,
    justifyContent: "center", // Centraliza verticalmente
    paddingBottom: 80, // Espaço para a barra fixa inferior
  },
  card: {
    backgroundColor: cores.cardProdutos,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  botaoCartao: {
    backgroundColor: cores.botaoEnviar,
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: cores.texto,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: cores.texto,
    marginTop: 10,
  },
  valor: {
    fontSize: 18,
    color: cores.texto,
    marginTop: 2,
  },
  botaoEditar: {
    backgroundColor: cores.botaoEditar,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  botaoExcluir: {
    backgroundColor: cores.botaoDeletar,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  botaoLogout: {
    backgroundColor: cores.botaoSair,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotao: {
    color: cores.textoClaro,
    fontSize: 18,
    fontWeight: "bold",
  },
  texto: {
    color: cores.texto,
    fontSize: 16,
    textAlign: "center",
  },
  menuInferior: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
