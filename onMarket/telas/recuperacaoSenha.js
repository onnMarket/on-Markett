import axios from 'axios';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Avatar, Input } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


export default function recuperacaoSenha({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');


  /*function login() {
    axios.get('http://localhost:3000/usuario') // ← ALTERADO para emulador Android
      .then((response) => {
        const usuarios = response.data;
        const usuario = usuarios.find((u) => u.email === email && u.senha === senha);
        if (usuario) {
          navigation.navigate('ListarContatos'); // ← só vai funcionar se tela for criada
        } else {
          alert('Email ou senha inválidos!');
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Erro ao conectar com o servidor.');
      });
  }*/


  return (
    <SafeAreaView style={styles.container}>
      {/*<Avatar
        rounded
        size="xlarge"
        title="MJ"
        source={{ uri: 'https://avatars.githubusercontent.com/u/169060996?v=4' }}
        containerStyle={{ marginBottom: 20 }}
      />*/}


      <Input
        placeholder="Email"
        leftIcon={<MaterialIcons name="email" size={24} color="black" />}
        containerStyle={styles.inputContainer}
        value={email}
        onChangeText={setEmail}
      />


      <TouchableOpacity style={styles.botao_1} onPress={login}>
        <Text style={styles.texto}>Recuperar Senha</Text>
      </TouchableOpacity>


    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: '70%',
    alignSelf: 'center',
  },
  botao_1: {
    backgroundColor: '#f4e453',
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
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
});



