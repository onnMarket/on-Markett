import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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

import MenuInferiorADM from '../navigation/navigationBar_admin';
import cores from '../style/cores';

export default function InicioADM() {
  const navigation = useNavigation();
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let produtosData = [];
    let categoriasData = [];

    axios
      .get('https://on-markett-2.onrender.com/api/produtos')
      .then((resProdutos) => {
        produtosData = resProdutos.data;
        return axios.get('https://on-markett-2.onrender.com/api/categorias');
      })
      .then((resCategorias) => {
        categoriasData = resCategorias.data;

        const nomesCategoriasComProdutos = new Set(produtosData.map(p => p.categoria));
        const categoriasComProdutos = categoriasData
          .filter(cat => nomesCategoriasComProdutos.has(cat.nome))
          .sort((a, b) => a.nome.localeCompare(b.nome));

        setProdutos(produtosData);
        setCategorias(categoriasComProdutos);
      })
      .catch((error) => {
        console.error('Erro ao buscar dados:', error);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  const produtosFiltrados = categoriaSelecionada
    ? produtos.filter(prod => prod.categoria === categoriaSelecionada)
    : produtos;

  return (
    <SafeAreaView style={estilos.container}>
      {/* HEADER */}
      <View style={estilos.header}>
        <View style={estilos.caixaCabecalho}>
          <Avatar
            rounded
            size="large"
            source={require('../../image/onMarket_3.png')}
          />
          <View style={estilos.caixaBusca}>
            <TextInput
              placeholder="Pesquise aqui..."
              placeholderTextColor="#aaa"
              style={estilos.input}
            />
            <MaterialIcons name="search" size={24} color="gray" />
          </View>
        </View>
      </View>

      {/* CONTEÚDO PRINCIPAL */}
      <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <View style={estilos.linhaTitulo}>
          <Text style={estilos.conteudo_principal}>Categorias</Text>
        </View>

        {/* Categorias com botão "Todos" */}
        <View style={estilos.grid}>
          {/* Botão "Todos" */}
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

          {/* Demais categorias */}
          {categorias.map((item, index) => (
            <TouchableOpacity
              key={index}
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

        <View style={{ marginTop: 20 }}>
          <View style={estilos.linhaTitulo}>
            <Text style={estilos.conteudo_principal}>
              {categoriaSelecionada
                ? `Produtos da categoria "${categoriaSelecionada}"`
                : 'Todos os Produtos:'}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('CadastrarProdutos')}>
              <MaterialIcons name="add-box" size={28} color={cores.texto} />
            </TouchableOpacity>
          </View>

          {carregando ? (
            <Text>Carregando produtos...</Text>
          ) : produtosFiltrados.length === 0 ? (
            <Text style={{ marginTop: 10 }}>Nenhum produto encontrado.</Text>
          ) : (
            <View style={estilos.gridProdutos}>
              {produtosFiltrados.map((produto) => (
                <TouchableOpacity
                  key={produto.id}
                  style={estilos.cardProduto}
                  onPress={() => navigation.navigate('AtualizarProduto', { produto })}
                >
                  {produto.foto ? (
                    <Image
                      source={{
                        uri:
                          produto.foto.startsWith('http') || produto.foto.startsWith('data:')
                            ? produto.foto
                            : `https://drive.google.com/uc?export=view&id=${produto.foto}`,
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
                    <Text style={estilos.nomeProduto}>{produto.nome}</Text>
                    <Text style={estilos.precoProduto}>
                      R$ {parseFloat(produto.preco).toFixed(2)}
                    </Text>
                    <Text
                      style={[
                        estilos.estrelasProduto,
                        produto.quantidade_estoque <= 10 && { color: cores.alerta },
                      ]}
                    >
                      Estoque: {produto.quantidade_estoque}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* MENU FIXO INFERIOR */}
      <MenuInferiorADM navigation={navigation} />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
  },
  header: {
    backgroundColor: cores.Principal,
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
    backgroundColor: cores.Secundaria,
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
  conteudo: {
    padding: 20,
    marginBottom: 100,
  },
  linhaTitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  estrelasProduto: {
    fontSize: 12,
    color: '#777',
  },
});
