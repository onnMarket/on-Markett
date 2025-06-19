import axios from 'axios';
import React, { useLayoutEffect, useState } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Text } from 'react-native';


export default function cadastrarProdutos({ navigation }) {
  const [nome, setNome] = useState('');
  const [foto, setFoto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [validade, setValidade] = useState('');
  const [quantidade, setQuantidade] = useState('');


  // Função para criar conta
  function cadastrarProduto() {
    axios
      .post("http://localhost:3000/usuario", { // Mudado para o IP do emulador Android
        nome,
        foto,
        categoria,
        descricao,
        preco,
        validade,
        quantidade
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
        placeholder="Foto"
        value={categoria}
        onChangeText={setFoto}
        style={styles.input}
      />
      <TextInput
        placeholder="Categoria"
        value={categoria}
        onChangeText={setCategoria}
        style={styles.input}
      />
      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Preço"
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Validade: xx/xx/xxxx"
        value={validade}
        onChangeText={setValidade}
        style={styles.input}
      />
      <TextInput
        placeholder="Quantidade no Estoque"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
        style={styles.input}
      />


      <TouchableOpacity style={styles.botaoSalvar} onPress={cadastrarProduto}>
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