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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import cores from '../style/cores';

function formatDateToISO(dateStr) {
  if (!dateStr) return dateStr;
  if (dateStr.includes('-')) return dateStr;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function formatarData(texto) {
  let data = texto.replace(/\D/g, '');
  if (data.length > 2) data = data.slice(0, 2) + '/' + data.slice(2);
  if (data.length > 5) data = data.slice(0, 5) + '/' + data.slice(5, 9);
  return data;
}

function formatarPreco(valor) {
  let precoFormatado = valor.replace(/\D/g, '');
  if (precoFormatado.length <= 2) {
    precoFormatado = precoFormatado.padStart(3, '0');
  }
  const parteInteira = precoFormatado.slice(0, -2);
  const parteDecimal = precoFormatado.slice(-2);
  return `${parseInt(parteInteira).toString()},${parteDecimal}`;
}

export default function AtualizarProduto({ route, navigation }) {
  const { produto } = route.params;

  const [nome, setNome] = useState(produto.nome);
  const [foto, setFoto] = useState(produto.foto);
  const [categoria, setCategoria] = useState(produto.categoria);
  const [descricao, setDescricao] = useState(produto.descricao);
  const [preco, setPreco] = useState(formatarPreco(produto.preco.toString()));
  const [validade, setValidade] = useState(produto.validade.includes('-') ? produto.validade.split('-').reverse().join('/') : produto.validade);
  const [quantidade, setQuantidade] = useState(produto.quantidade_estoque.toString());

  const atualizarProduto = async () => {
    try {
      const precoNumerico = parseFloat(preco.replace(',', '.'));

      await axios.put(`https://on-markett-2.onrender.com/api/produtos/${produto.id}`, {
        nome,
        foto,
        categoria,
        descricao,
        preco: precoNumerico,
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

          <View style={styles.inputContainer}>
            <MaterialIcons name="shopping-bag" size={24} color={cores.texto} style={styles.icon} />
            <TextInput
              placeholder="Nome"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="image" size={24} color={cores.texto} style={styles.icon} />
            <TextInput
              placeholder="Foto"
              placeholderTextColor="#999"
              value={foto}
              onChangeText={setFoto}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="category" size={24} color={cores.texto} style={styles.icon} />
            <TextInput
              placeholder="Categoria"
              placeholderTextColor="#999"
              value={categoria}
              onChangeText={setCategoria}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="description" size={24} color={cores.texto} style={styles.icon} />
            <TextInput
              placeholder="Descrição"
              placeholderTextColor="#999"
              value={descricao}
              onChangeText={setDescricao}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="attach-money" size={24} color={cores.texto} style={styles.icon} />
            <TextInput
              placeholder="Preço"
              placeholderTextColor="#999"
              value={preco}
              onChangeText={(text) => setPreco(formatarPreco(text))}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="calendar-today" size={24} color={cores.texto} style={styles.icon} />
            <TextInput
              placeholder="Validade (dd/MM/yyyy)"
              placeholderTextColor="#999"
              value={validade}
              onChangeText={(text) => setValidade(formatarData(text))}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="inventory" size={24} color={cores.texto} style={styles.icon} />
            <TextInput
              placeholder="Quantidade no Estoque"
              placeholderTextColor="#999"
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.input,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
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
