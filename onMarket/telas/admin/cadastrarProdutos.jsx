import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import cores from '../style/cores';

export default function CadastrarProdutos({ navigation }) {
  const [nome, setNome] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [validade, setValidade] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [listaCategorias, setListaCategorias] = useState([]);

  useEffect(() => {
    axios
      .get('https://on-markett-2.onrender.com/api/categorias')
      .then((response) => setListaCategorias(response.data))
      .catch((error) => console.error('Erro ao carregar categorias:', error));
  }, []);

  const extrairIdDrive = (url) => {
    const regex = /(?:\/d\/|id=)([a-zA-Z0-9_-]{10,})/;
    const match = url.match(regex);
    return match ? match[1] : url.trim();
  };

  const formatarPreco = (valor) => {
    let precoFormatado = valor.replace(/\D/g, ''); // Remove tudo que não for número
    if (precoFormatado.length <= 2) {
      precoFormatado = precoFormatado.padStart(3, '0');
    }

    const parteInteira = precoFormatado.slice(0, -2);
    const parteDecimal = precoFormatado.slice(-2);
    return `${parseInt(parteInteira).toString()},${parteDecimal}`;
  };

  const formatarData = (texto) => {
    let data = texto.replace(/\D/g, ''); // remove tudo que não for número
    if (data.length > 2) data = data.slice(0, 2) + '/' + data.slice(2);
    if (data.length > 5) data = data.slice(0, 5) + '/' + data.slice(5, 9);
    return data;
  };

  const cadastrarProduto = async () => {
    if (!categoria) {
      alert('Selecione uma categoria válida.');
      return;
    }

    if (!quantidade || isNaN(quantidade)) {
      alert('Informe a quantidade em estoque corretamente.');
      return;
    }

    const precoNumerico = parseFloat(preco.replace(',', '.'));
    if (!preco || isNaN(precoNumerico)) {
      alert('Informe o preço corretamente.');
      return;
    }

    const idImagem = extrairIdDrive(fotoUrl);

    try {
      await axios.post('https://on-markett-2.onrender.com/api/produtos', {
        nome,
        foto: idImagem,
        categoria,
        descricao,
        preco: precoNumerico,
        validade,
        quantidade_estoque: parseInt(quantidade),
      });

      const categoriaExistente = listaCategorias.find(
        (cat) => cat.nome.toLowerCase() === categoria.toLowerCase()
      );

      if (categoriaExistente) {
        await axios.put(`https://on-markett-2.onrender.com/api/categorias/${categoriaExistente.id}`, {
          quantidade: categoriaExistente.quantidade + 1,
        });
      }

      alert('Produto cadastrado com sucesso!');
      navigation.navigate('InicioADM');
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar produto.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formWrapper}>
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
              placeholder="URL da imagem (Drive ou outro)"
              placeholderTextColor="#999"
              value={fotoUrl}
              onChangeText={setFotoUrl}
              style={styles.input}
            />
          </View>

          {fotoUrl ? (
            <Image
              source={{ uri: `https://drive.google.com/uc?export=view&id=${extrairIdDrive(fotoUrl)}` }}
              style={styles.imagemPreview}
            />
          ) : null}

          <View style={styles.inputContainer}>
            <MaterialIcons name="category" size={24} color={cores.texto} style={styles.icon} />
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={categoria}
                onValueChange={(itemValue) => setCategoria(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione uma categoria" value="" />
                {listaCategorias
                  .slice()
                  .sort((a, b) => a.nome.localeCompare(b.nome))
                  .map((cat) => (
                    <Picker.Item key={cat.id} label={cat.nome} value={cat.nome} />
                  ))}
              </Picker>
            </View>
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
              placeholder="Validade: dd/mm/aaaa"
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

          <TouchableOpacity style={styles.botaoSalvar} onPress={cadastrarProduto}>
            <Text style={styles.textoBotao}>Salvar</Text>
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
  pickerWrapper: {
    flex: 1,
  },
  picker: {
    color: cores.texto,
    backgroundColor: 'transparent',
    width: '100%',
  },
  imagemPreview: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  botaoSalvar: {
    backgroundColor: cores.botaoEnviar,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  textoBotao: {
    color: cores.textoClaro,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
