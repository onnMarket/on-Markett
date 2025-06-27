import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
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
import { Avatar } from 'react-native-elements';

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    axios.get('https://on-markett-2.onrender.com/api/categorias')
      .then(res => {
        setCategorias(res.data);
        if (res.data.length > 0) setCategoriaSelecionada(res.data[0].nome);
      })
      .catch(err => console.error('Erro ao buscar categorias:', err));

    axios.get('https://on-markett-2.onrender.com/api/produtos')
      .then(res => setProdutos(res.data))
      .catch(err => console.error('Erro ao buscar produtos:', err));
  }, []);

  // Filtra produtos por categoria selecionada e busca
  const produtosFiltrados = produtos.filter(prod => {
    const pertenceCategoria = categoriaSelecionada ? prod.categoria === categoriaSelecionada : true;
    const contemBusca = prod.nome.toLowerCase().includes(busca.toLowerCase());
    return pertenceCategoria && contemBusca;
  });

  return (
    <SafeAreaView style={estilos.container}>
      {/* HEADER */}
      <View style={estilos.header}>
        <View style={estilos.caixaCabecalho}>
          <Avatar
            rounded
            size="large"
            source={require('../image/onMarket_3.png')}
          />
          <View style={estilos.caixaBusca}>
            <TextInput
              placeholder="Pesquise aqui..."
              placeholderTextColor="#aaa"
              style={estilos.input}
              value={busca}
              onChangeText={setBusca}
            />
            <MaterialIcons name="search" size={24} color="gray" />
          </View>
          <TouchableOpacity style={estilos.notificacao}>
            <TouchableOpacity style={estilos.item}>
              <MaterialIcons name="shopping-cart" size={28} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTEÚDO PRINCIPAL */}
      <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
        {/* CATEGORIAS */}
        <View style={estilos.linhaTitulo}>
          <Text style={estilos.conteudo_principal}>Categorias</Text>
        </View>
        <View style={estilos.grid}>
          {categorias.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                estilos.itemCategoria,
                categoriaSelecionada === item.nome && estilos.categoriaSelecionada,
              ]}
              onPress={() => setCategoriaSelecionada(item.nome)}
            >
              <View style={estilos.circuloIcone}>
                {item.tipo === 'MaterialIcons' ? (
                  <MaterialIcons name={item.icone} size={28} color="#212121" />
                ) : (
                  <FontAwesome name={item.icone} size={28} color="#212121" />
                )}
              </View>
              <Text style={estilos.textoCategoria}>{item.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PRODUTOS */}
        <View style={estilos.linhaTitulo}>
          <Text style={estilos.conteudo_principal}>Produtos</Text>
        </View>

        {produtosFiltrados.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Nenhum produto encontrado.
          </Text>
        )}

        <View style={estilos.gridProdutos}>
          {produtosFiltrados.map((item) => (
            <View key={item.id} style={estilos.cardProduto}>
              {item.foto ? (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${item.foto}` }}
                  style={estilos.imagemProduto}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    estilos.imagemProduto,
                    { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
                  ]}
                >
                  <Text>Sem imagem</Text>
                </View>
              )}
              <View style={estilos.infoCard}>
                <Text style={estilos.nomeProduto}>{item.nome}</Text>
                <Text style={estilos.precoProduto}>
                  R${' '}
                  {typeof item.preco === 'number'
                    ? item.preco.toFixed(2)
                    : parseFloat(item.preco)?.toFixed(2) || '0.00'}
                </Text>
                <Text style={estilos.quantidadeProduto}>Estoque: {item.quantidade_estoque}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* MENU FIXO INFERIOR */}
      <View style={estilos.menu}>
        <TouchableOpacity style={estilos.item}>
          <MaterialIcons name="home" size={28} color="#F5F5F5" />
          <Text style={estilos.textoItem}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.item}>
          <MaterialIcons name="shopping-bag" size={28} color="#fff" />
          <Text style={estilos.textoItem}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.item}>
          <MaterialIcons name="person" size={28} color="#fff" />
          <Text style={estilos.textoItem}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  caixaCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caixaBusca: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  input: {
    flex: 1,
    color: '#000',
    marginRight: 10,
  },
  notificacao: {
    position: 'relative',
    padding: 10,
    borderRadius: 50,
  },
  conteudo: {
    padding: 20,
    marginBottom: 100,
  },
  linhaTitulo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  conteudo_principal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCategoria: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 5,
    borderRadius: 10,
  },
  categoriaSelecionada: {
    backgroundColor: '#c8e6c9',
  },
  circuloIcone: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  textoCategoria: {
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
  },
  gridProdutos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardProduto: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  imagemProduto: {
    width: '100%',
    height: 150,
  },
  infoCard: {
    padding: 10,
  },
  nomeProduto: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  precoProduto: {
    color: '#2AAA53',
    fontSize: 13,
    marginBottom: 4,
  },
  quantidadeProduto: {
    fontSize: 12,
    color: '#777',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  item: {
    alignItems: 'center',
  },
  textoItem: {
    color: '#fff',
    fontSize: 10,
  },
});
