import axios from 'axios';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import cores from './style/cores';

export default function CriarConta({ navigation }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const validarCampos = () => {
    if (!nome || !cpf || !email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return false;
    }

    // Validação simples de email
    const regexEmail = /^\S+@\S+\.\S+$/;
    if (!regexEmail.test(email)) {
      Alert.alert("Erro", "Por favor, insira um email válido.");
      return false;
    }

    // Limpa CPF e verifica se tem 11 números
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      Alert.alert("Erro", "CPF deve conter 11 números.");
      return false;
    }

    return true;
  };

  async function criarConta() {
    if (!validarCampos()) return;

    try {
      const cpfLimpo = cpf.replace(/\D/g, '');
      const response = await axios.post("https://on-markett-2.onrender.com/api/users", {
          nome,
          email,
          cpf: cpfLimpo,
          senha,
          tipo: "cliente",
        });

      console.log(response.data);
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      navigation.navigate('Login');
    } catch (error) {
      console.error("Erro no cadastro:", error.response ? error.response.data : error.message);
      Alert.alert("Erro", error.response?.data?.error || "Erro ao cadastrar usuário.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Campo Nome */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={24} color={cores.texto} style={styles.icon} />
        <TextInput
          placeholder="Nome"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
      </View>

      {/* Campo Email */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color={cores.texto} style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      {/* Campo CPF */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="badge" size={24} color={cores.texto} style={styles.icon} />
        <TextInput
          placeholder="CPF"
          placeholderTextColor="#999"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          style={styles.input}
          maxLength={14} // permite CPF com máscara, tipo 000.000.000-00
        />
      </View>

      {/* Campo Senha com ver/ocultar */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color={cores.texto} style={styles.icon} />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <MaterialIcons
            name={mostrarSenha ? 'visibility' : 'visibility-off'}
            size={24}
            color={cores.texto}
          />
        </TouchableOpacity>
      </View>

      {/* Botão de salvar */}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.input,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '100%',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: cores.texto,
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
