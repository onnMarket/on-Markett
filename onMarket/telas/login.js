import axios from 'axios';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

function login() {
  axios.get('http://localhost:3000/usuario')
    .then((response) => {
      const usuarios = response.data;
      const usuario = usuarios.find((u) => u.email === email && u.senha === senha);
      
      if (usuario) {
        if (usuario.tipo === 'admin') {
          navigation.navigate('InicioADM'); // redireciona para tela do admin
        } else if (usuario.tipo === 'cliente') {
          navigation.navigate('Inicio'); // redireciona para tela do cliente
        } else {
          Alert.alert('Erro', 'Tipo de usuário desconhecido!');
        }
      } else {
        Alert.alert('Erro', 'Email ou senha inválidos!');
      }
    })
    .catch((error) => {
      console.error('Erro ao conectar com o servidor:', error.message);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    });
}


  return (
    <SafeAreaView style={styles.container}>
      <Input
        placeholder="Email"
        leftIcon={<MaterialIcons name="email" size={24} color="black" />}
        containerStyle={styles.inputContainer}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        placeholder="Senha"
        leftIcon={<MaterialIcons name="lock" size={24} color="black" />}
        secureTextEntry
        containerStyle={styles.inputContainer}
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity onPress={() => navigation.navigate('RecuperacaoSenha')}>
        <Text style={styles.recuperarSenha}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao_1} onPress={login}>
        <Text style={styles.texto}>Login</Text>
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
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 10,
  },
  botao_1: {
    backgroundColor: '#4caf50',
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
    color: '#212121',
    fontWeight: 'bold',
    fontSize: 20,
  },
  recuperarSenha: {
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
});
