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
import { launchImageLibrary } from 'react-native-image-picker';

export default function CadastrarProdutos({ navigation }) {
  const [nome, setNome] = useState('');
  const [foto, setFoto] = useState(null);
  const [categoria, setCategoria] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [validade, setValidade] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [listaCategorias, setListaCategorias] = useState([]);

  useEffect(() => {
    axios
      .get('https://on-markett-2.onrender.com/api/categorias') // rota corrigida
      .then((response) => setListaCategorias(response.data))
      .catch((error) =>
        console.error('Erro ao carregar categorias:', error)
      );
  }, []);

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
          setFoto(image);
        }
      }
    );
  };

  const cadastrarProduto = async () => {
    const categoriaFinal = categoria === '__nova__' ? novaCategoria.trim() : categoria;

    if (!categoriaFinal) {
      alert('Selecione ou digite uma categoria válida.');
      return;
    }

    if (!quantidade || isNaN(quantidade)) {
      alert('Informe a quantidade em estoque corretamente.');
      return;
    }

    if (!preco || isNaN(preco)) {
      alert('Informe o preço corretamente.');
      return;
    }

    try {
<<<<<<<<< Temporary merge branch 1
      // Cadastrar produto
      await axios.post('https://on-markett-2.onrender.com/api/produtos', {
=========
      await axios.post('http://10.31.89.242:3000/produtos', {
>>>>>>>>> Temporary merge branch 2
        nome,
        foto: foto?.base64,
        categoria: categoriaFinal,
        descricao,
        preco: parseFloat(preco),
        validade,
        quantidade_estoque: parseInt(quantidade),  // conforme seu modelo backend
      });

      // Verificar se categoria existe para atualizar quantidade
      const categoriaExistente = listaCategorias.find(
        (cat) => cat.nome.toLowerCase() === categoriaFinal.toLowerCase()
      );

      if (categoriaExistente) {
<<<<<<<<< Temporary merge branch 1
        await axios.put(`https://on-markett-2.onrender.com/api/categorias/${categoriaExistente.id}`, {
          quantidade: categoriaExistente.quantidade + 1,
        });
      } else {
        await axios.post('https://on-markett-2.onrender.com/api/categorias', {
=========
        await axios.patch(`http://10.31.89.242:3000/categorias/${categoriaExistente.id}`, {
          quantidade: categoriaExistente.quantidade + 1,
        });
      } else {
        await axios.post('http://10.31.89.242:3000/categorias', {
>>>>>>>>> Temporary merge branch 2
          nome: categoriaFinal,
          quantidade: 1,
          icone: '', // pode ajustar se quiser ícone padrão
          tipo: '',  // pode ajustar se quiser tipo padrão
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
          <TextInput
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />

          <TouchableOpacity style={styles.botaoFoto} onPress={escolherFoto}>
            <Text style={styles.textoBotao}>
              {foto ? 'Alterar Foto' : 'Escolher Foto'}
            </Text>
          </TouchableOpacity>

          {foto && (
            <Image source={{ uri: foto.uri }} style={styles.imagemPreview} />
          )}

          <View style={styles.input}>
            <Picker
              selectedValue={categoria}
              onValueChange={(itemValue) => setCategoria(itemValue)}
            >
              <Picker.Item label="Selecione uma categoria" value="" />
              {listaCategorias.map((cat) => (
                <Picker.Item key={cat.id} label={cat.nome} value={cat.nome} />
              ))}
              <Picker.Item label="Criar nova categoria..." value="__nova__" />
            </Picker>
          </View>

          {categoria === '__nova__' && (
            <TextInput
              placeholder="Nova Categoria"
              value={novaCategoria}
              onChangeText={setNovaCategoria}
              style={styles.input}
            />
          )}

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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 30,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
