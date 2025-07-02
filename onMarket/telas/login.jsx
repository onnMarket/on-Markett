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

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function login() {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const response = await axios.post('https://on-markett-2.onrender.com/api/login', {
        email,
        senha,
      });

      const { user } = response.data;

      if (user.tipo === 'adm') {
        navigation.navigate('InicioADM');
      } else if (user.tipo === 'cliente') {
        navigation.navigate('Inicio');
      } else {
        Alert.alert('Erro', 'Tipo de usuário desconhecido!');
      }
    } catch (error) {
      const mensagem = error?.response?.data?.error || 'Erro ao realizar login.';
      Alert.alert('Erro', mensagem);
      console.error('Erro no login:', mensagem);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color={cores.texto} style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color={cores.texto} style={styles.icon} />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#999"
          style={styles.input}
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <MaterialIcons
            name={mostrarSenha ? 'visibility' : 'visibility-off'}
            size={24}
            color={cores.texto}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('RecuperacaoSenha')}>
        <Text style={styles.recuperarSenha}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao_1} onPress={login}>
        <Text style={styles.textoClaro}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao_2} onPress={() => navigation.navigate('CadastroUsuario')}>
        <Text style={styles.texto}>Cadastre-se</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
    color: cores.texto,
    fontSize: 16,
  },
  botao_1: {
    backgroundColor: cores.botaoEnviar,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  botao_2: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  texto: {
    color: cores.texto,
    fontWeight: 'bold',
    fontSize: 20,
  },
  textoClaro: {
    color: cores.Secundaria,
    fontWeight: 'bold',
    fontSize: 20,
  },
  recuperarSenha: {
    color: cores.texto,
    marginBottom: 10,
    textAlign: 'center',
  },
});
