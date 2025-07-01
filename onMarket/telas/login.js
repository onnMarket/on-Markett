import axios from 'axios';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import cores from './style/cores'; // ajuste conforme sua estrutura de pastas

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

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
      <Input
        placeholder="Email"
        leftIcon={<MaterialIcons name="email" size={24} color={cores.texto} />}
        containerStyle={styles.inputContainer}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        placeholder="Senha"
        leftIcon={<MaterialIcons name="lock" size={24} color={cores.texto} />}
        secureTextEntry
        containerStyle={styles.inputContainer}
        value={senha}
        onChangeText={setSenha}
      />

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
  },
  inputContainer: {
    width: '80%',
    marginBottom: 10,
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
