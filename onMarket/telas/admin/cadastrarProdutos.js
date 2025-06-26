import axios from 'axios';
import React, { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function cadastrarProdutos({ navigation }) {
  const [nome, setNome] = useState('');
  const [foto, setFoto] = useState(null);
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [validade, setValidade] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const escolherFoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
      },
      (response) => {
        if (response.didCancel) {
          console.log('Usuário cancelou a seleção de imagem');
        } else if (response.errorCode) {
          console.error('Erro:', response.errorMessage);
        } else {
          const image = response.assets[0];
          setFoto(image); // Você pode usar image.uri ou image.base64
        }
      }
    );
  };

  function cadastrarProduto() {
    axios
      .post('http://localhost:3000/produtos', {
        nome,
        foto: foto?.base64, // ou foto.uri se for salvar o link
        categoria,
        descricao,
        preco,
        validade,
        quantidade,
      })
      .then((response) => {
        console.log(response.data);
        alert('Produto cadastrado com sucesso!');
        navigation.navigate('InicioADM');
      })
      .catch((error) => {
        console.error(error);
        alert('Erro ao cadastrar Produto.');
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

      {/* Botão de escolher imagem */}
      <TouchableOpacity style={styles.botaoFoto} onPress={escolherFoto}>
        <Text style={styles.textoBotao}>
          {foto ? 'Alterar Foto' : 'Escolher Foto'}
        </Text>
      </TouchableOpacity>

      {/* Exibir imagem selecionada */}
      {foto && (
        <Image
          source={{ uri: foto.uri }}
          style={styles.imagemPreview}
        />
      )}

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
  botaoFoto: {
    backgroundColor: '#2196f3',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagemPreview: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  botaoSalvar: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
