import { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cores from "../style/cores";

export default function Pagamento() {
  const [usuarioId, setUsuarioId] = useState(null);
  const [numeroCartao, setNumeroCartao] = useState("");
  const [validade, setValidade] = useState("");
  const [codigoSeguranca, setCodigoSeguranca] = useState("");
  const [nomeTitular, setNomeTitular] = useState("");

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const usuarioSalvo = await AsyncStorage.getItem("@usuario");
        const usuario = JSON.parse(usuarioSalvo);
        const id = usuario?.id;

        if (!id) {
          Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
          return;
        }

        setUsuarioId(id);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
      }
    }

    carregarUsuario();
  }, []);

  const cadastrarPagamento = async () => {
    if (!usuarioId || !nomeTitular || !numeroCartao || !validade || !codigoSeguranca) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const pagamento = {
        compradorId: usuarioId,
        nomeTitular,
        numeroCartao,
        validade,
        codigoSeguranca,
        limite: 5000.0,
      };

      await axios.post("https://on-markett-2.onrender.com/api/payment/cadastrar", pagamento);
      Alert.alert("Sucesso", "Cartão cadastrado com sucesso!");
      
      // Limpa os campos
      setNumeroCartao("");
      setValidade("");
      setCodigoSeguranca("");
      setNomeTitular("");
    } catch (error) {
      console.error("Erro ao cadastrar pagamento:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o cartão.");
    }
  };

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={estilos.titulo}>Cadastro de Cartão</Text>

        <Text style={estilos.label}>Nome do Titular</Text>
        <TextInput
          style={estilos.input}
          value={nomeTitular}
          onChangeText={setNomeTitular}
          placeholder="João da Silva"
        />

        <Text style={estilos.label}>Número do Cartão</Text>
        <TextInput
          style={estilos.input}
          value={numeroCartao}
          onChangeText={setNumeroCartao}
          placeholder="1234 5678 9876 5432"
          keyboardType="numeric"
        />

        <Text style={estilos.label}>Validade (AAAA-MM-DD)</Text>
        <TextInput
          style={estilos.input}
          value={validade}
          onChangeText={setValidade}
          placeholder="2026-12-31"
        />

        <Text style={estilos.label}>Código de Segurança (CVV)</Text>
        <TextInput
          style={estilos.input}
          value={codigoSeguranca}
          onChangeText={setCodigoSeguranca}
          placeholder="123"
          keyboardType="numeric"
          secureTextEntry
        />

        <TouchableOpacity style={estilos.botao} onPress={cadastrarPagamento}>
          <Text style={estilos.textoBotao}>Cadastrar Cartão</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  botao: {
    marginTop: 25,
    backgroundColor: "green",
    padding: 15,
    borderRadius: 8,
  },
  textoBotao: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
