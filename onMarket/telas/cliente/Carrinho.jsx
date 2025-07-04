import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
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
import cores from '../style/cores';
import MenuInferiorCliente from '../navigation/navigationBar_cliente';
import BarraPesquisaClientes from '../navigation/baraPesquisa_clientes';

export default function Inicio({ navigation, route }) {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [busca, setBusca] = useState('');
  const {item, quantidade} = route.params || {};

  /*useEffect(() => {
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

        if (categoriasOrdenadas.length > 0) {
          setCategoriaSelecionada(categoriasOrdenadas[0].nome);
        }
      })
      .catch(err => console.error('Erro ao buscar dados:', err));
  }, []);

  const produtosFiltrados = produtos.filter(prod => {
    const pertenceCategoria = categoriaSelecionada ? prod.categoria === categoriaSelecionada : true;
    const contemBusca = prod.nome.toLowerCase().includes(busca.toLowerCase());
    return pertenceCategoria && contemBusca;
  });*/

  return (
    <SafeAreaView style={estilos.container}>
      {/* HEADER */}
      <BarraPesquisaClientes />

      {/* CONTEÚDO PRINCIPAL */}
      <ScrollView>
        <View style={estilos.gridProdutos}>
            <TouchableOpacity
              key={item.id}
              style={estilos.cardProduto}
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
                <Text>Quantidade: {quantidade}</Text>
                <Text style={estilos.precoProduto}>
                  R${' '}
                  soma = {item.preco} * {quantidade}
                  {typeof soma === 'number'
                    ? soma.toFixed(2)
                    : parseFloat(soma)?.toFixed(2) || '0.00'}
                </Text>
                <Text style={estilos.quantidadeProduto}>Estoque: {item.quantidade_estoque}</Text>
              </View>
            </TouchableOpacity>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* MENU FIXO INFERIOR */}
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
    rowGap: 15,
    columnGap: 10,
  },
  itemCategoria: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 15,
    marginRight: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  categoriaSelecionada: {
    backgroundColor: '#c8e6c9',
    padding: 10,
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
  }
});