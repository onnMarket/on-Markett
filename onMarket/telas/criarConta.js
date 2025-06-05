import axios from 'axios';
import React, { useLayoutEffect, useState } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Text } from 'react-native';


export default function CriarConta({ navigation }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');


  // Função para criar conta
  function criarConta() {
    axios
      .post("http://localhost:3000/usuario", { // Mudado para o IP do emulador Android
        nome,
        email,
        cpf,
        senha,
        tipo: 'cliente', // Definindo o tipo como cliente
      })
      .then((response) => {
        console.log(response.data);
        alert("Usuário cadastrado com sucesso!");
        navigation.navigate('Login'); // Volta para a tela de login
      })
      .catch((error) => {
        console.error(error);
        alert("Erro ao cadastrar usuário.");
      });
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
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  botaoSalvar: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
   
  },
  textoBotao: {
    color: '#212121',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
