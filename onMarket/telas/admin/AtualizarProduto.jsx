import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

import cores from '../style/cores'

function formatDateToISO(dateStr) {
  if (!dateStr) return dateStr;
  if (dateStr.includes('-')) return dateStr; // já no formato ISO
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr; // formato inesperado, retorna original
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export default function AtualizarProduto({ route, navigation }) {
  const { produto } = route.params;

  const [nome, setNome] = useState(produto.nome);
  const [foto, setFoto] = useState(produto.foto);
  const [categoria, setCategoria] = useState(produto.categoria);
  const [descricao, setDescricao] = useState(produto.descricao);
  const [preco, setPreco] = useState(produto.preco.toString());
  const [validade, setValidade] = useState(produto.validade);
  const [quantidade, setQuantidade] = useState(produto.quantidade_estoque.toString());

  const atualizarProduto = async () => {
    try {
      await axios.put(`https://on-markett-2.onrender.com/api/produtos/${produto.id}`, {
        nome,
        foto,
        categoria,
        descricao,
        preco: parseFloat(preco),
        validade: formatDateToISO(validade),
        quantidade_estoque: parseInt(quantidade),
      });

      Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      navigation.navigate('InicioADM');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao atualizar produto.');
    }
  };

  const deletarProduto = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja deletar este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              await axios.delete(`https://on-markett-2.onrender.com/api/produtos/${produto.id}`);
              Alert.alert('Sucesso', 'Produto deletado com sucesso!');
              navigation.navigate('InicioADM');
            } catch (error) {
              console.error(error);
              Alert.alert('Erro', 'Erro ao deletar produto.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formWrapper}>
          <Text style={styles.titulo}>Atualizar Produto</Text>

          <TextInput
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />

          <TextInput
            placeholder="Foto"
            value={foto}
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
            placeholder="Validade (dd/MM/yyyy)"
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

          <TouchableOpacity style={styles.botaoEditar} onPress={atualizarProduto}>
            <Text style={styles.textoBotao}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoDeletar} onPress={deletarProduto}>
            <Text style={styles.textoBotao}>Deletar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: cores.bordaTabela,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  botaoEditar: {
    backgroundColor: cores.botaoEditar,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoDeletar: {
    backgroundColor: cores.botaoDeletar,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  textoBotao: {
    color: cores.textoClaro,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
