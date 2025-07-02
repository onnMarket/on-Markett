import axios from 'axios';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

import cores from './style/cores';

export default function CriarConta({ navigation }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const validarCampos = () => {
    if (!nome || !cpf || !email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return false;
    }
    return true;
  };

  async function criarConta() {
    if (!validarCampos()) return;

    try {
      const response = await axios.post("https://on-markett-2.onrender.com/api/users", {
        nome,
        email,
        cpf,
        senha,
        tipo: 'cliente',
      });

      console.log(response.data);
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      navigation.navigate('Login');
    } catch (error) {
      console.error("Erro no cadastro:", error?.response?.data || error.message);
      Alert.alert("Erro", error?.response?.data?.error || "Erro ao cadastrar usuário.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.botaoSalvar} onPress={criarConta}>
        <Text style={styles.textoBotao}>Salvar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.input,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 15,
    width: '100%',
    marginBottom: 15
  },
  botaoSalvar: {
    backgroundColor: cores.botaoEnviar,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: cores.textoClaro,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
