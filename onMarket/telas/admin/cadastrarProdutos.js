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

export default function CadastrarProdutos({ navigation }) {
  const [nome, setNome] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [categoria, setCategoria] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
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

    const idImagem = extrairIdDrive(fotoUrl);

    try {
      await axios.post('https://on-markett-2.onrender.com/api/produtos', {
        nome,
        foto: idImagem,
        categoria: categoriaFinal,
        descricao,
        preco: parseFloat(preco),
        validade,
        quantidade_estoque: parseInt(quantidade),
      });

      const categoriaExistente = listaCategorias.find(
        (cat) => cat.nome.toLowerCase() === categoriaFinal.toLowerCase()
      );

      if (categoriaExistente) {
        await axios.put(`https://on-markett-2.onrender.com/api/categorias/${categoriaExistente.id}`, {
          quantidade: categoriaExistente.quantidade + 1,
        });
      } else {
        await axios.post('https://on-markett-2.onrender.com/api/categorias', {
          nome: categoriaFinal,
          quantidade: 1,
          icone: '',
          tipo: '',
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

          <TextInput
            placeholder="URL da imagem (Drive ou outro)"
            value={fotoUrl}
            onChangeText={setFotoUrl}
            style={styles.input}
          />

          {fotoUrl ? (
            <Image
              source={{ uri: `https://drive.google.com/uc?export=view&id=${extrairIdDrive(fotoUrl)}` }}
              style={styles.imagemPreview}
            />
          ) : null}

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
