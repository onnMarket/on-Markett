import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BarraPesquisaClientes from '../navigation/baraPesquisa_clientes';
import MenuInferiorCliente from '../navigation/navigationBar_cliente';
import cores from '../style/cores';

export default function Inicio({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [busca, setBusca] = useState('');
  const [quantidadeCarrinho, setQuantidadeCarrinho] = useState(0);

  useEffect(() => {
    Promise.all([
      axios.get('https://on-markett-2.onrender.com/api/categorias'),
      axios.get('https://on-markett-2.onrender.com/api/produtos')
    ])
      .then(([catRes, prodRes]) => {
        const todasCategorias = catRes.data;
        const todosProdutos = prodRes.data;

        setProdutos(todosProdutos);

        const categoriasComProdutos = todasCategorias.filter(categoria =>
          todosProdutos.some(prod => prod.categoria === categoria.nome)
        );

        const categoriasOrdenadas = categoriasComProdutos.sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );

        setCategorias(categoriasOrdenadas);
      })
      .catch(err => console.error('Erro ao buscar dados:', err));

    async function carregarCarrinho() {
      try {
        const usuarioSalvo = await AsyncStorage.getItem('@usuario');
        const usuario = JSON.parse(usuarioSalvo);
        const usuarioId = usuario?.id;

        if (usuarioId) {
          const respostaCarrinho = await axios.get(
            `https://on-markett-2.onrender.com/api/carrinho/${usuarioId}`
          );
          const quantidade = respostaCarrinho.data.itens.length;
          setQuantidadeCarrinho(quantidade);
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }

    carregarCarrinho();
  }, []);

  const produtosFiltrados = produtos.filter(prod => {
    const pertenceCategoria = categoriaSelecionada ? prod.categoria === categoriaSelecionada : true;
    const contemBusca = prod.nome.toLowerCase().includes(busca.toLowerCase());
    return pertenceCategoria && contemBusca;
  });

  return (
    <SafeAreaView style={estilos.container}>
      <BarraPesquisaClientes setBusca={setBusca} busca={busca} quantidadeCarrinho={quantidadeCarrinho} />

      <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <View style={estilos.linhaTitulo}>
          <Text style={estilos.conteudo_principal}>Categorias</Text>
        </View>
        
        <View style={estilos.grid}>
          <TouchableOpacity
            style={[
              estilos.itemCategoria,
              categoriaSelecionada === null && estilos.categoriaSelecionada,
            ]}
            onPress={() => setCategoriaSelecionada(null)}
          >
            <View style={estilos.circuloIcone}>
              <MaterialIcons name="apps" size={28} color={cores.texto} />
            </View>
            <Text style={estilos.textoCategoria}>Todos</Text>
          </TouchableOpacity>

          {categorias.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                estilos.itemCategoria,
                categoriaSelecionada === item.nome && estilos.categoriaSelecionada,
              ]}
              onPress={() =>
                setCategoriaSelecionada(
                  categoriaSelecionada === item.nome ? null : item.nome
                )
              }
            >
              <View style={estilos.circuloIcone}>
                {item.tipo === 'MaterialIcons' ? (
                  <MaterialIcons name={item.icone} size={28} color={cores.texto} />
                ) : (
                  <FontAwesome name={item.icone} size={28} color={cores.texto} />
                )}
              </View>
              <Text style={estilos.textoCategoria}>{item.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>

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
            <TouchableOpacity
              key={item.id}
              style={estilos.cardProduto}
              onPress={() => navigation.navigate('Produto', { item })}
            >
              {item.foto ? (
                <Image
                  source={{
                    uri: item.foto.length < 100
                      ? `https://drive.google.com/uc?export=view&id=${item.foto}`
                      : `data:image/jpeg;base64,${item.foto}`,
                  }}
                  style={estilos.imagemProduto}
                  resizeMode="cover"
                />
              ) : (
                <View style={[estilos.imagemProduto, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
                  <Text>Sem imagem</Text>
                </View>
              )}
              <View style={estilos.infoCard}>
                <Text style={estilos.nomeProduto}>{item.nome}</Text>
                <Text style={estilos.precoProduto}>
                  R$ {typeof item.preco === 'number'
                    ? item.preco.toFixed(2)
                    : parseFloat(item.preco)?.toFixed(2) || '0.00'}
                </Text>
                <Text style={estilos.quantidadeProduto}>Estoque: {item.quantidade_estoque}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <MenuInferiorCliente navigation={navigation} />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
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
    color: cores.texto,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  itemCategoria: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoriaSelecionada: {
    backgroundColor: '#a5d6a7',
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: cores.Principal,
  },
  circuloIcone: {
    backgroundColor: cores.IconeCategorias,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  textoCategoria: {
    textAlign: 'center',
    fontSize: 14,
    color: cores.texto,
  },
  gridProdutos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardProduto: {
    width: '48%',
    backgroundColor: cores.cardProdutos,
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
    color: cores.texto,
  },
  precoProduto: {
    color: cores.Preco,
    fontSize: 13,
    marginBottom: 4,
  },
  quantidadeProduto: {
    fontSize: 12,
    color: '#777',
  },
});
