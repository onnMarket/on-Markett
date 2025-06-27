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

import MenuInferiorADM from '../navigation-bar/navigationBar_admin'

export default function InicioADM() {
  const navigation = useNavigation();
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    let produtosData = [];
    let categoriasData = [];

    axios.get('https://on-markett-2.onrender.com/api/produtos')
      .then((resProdutos) => {
        produtosData = resProdutos.data;
        return axios.get('https://on-markett-2.onrender.com/api/categorias');
      })
      .then((resCategorias) => {
        categoriasData = resCategorias.data;

        // Cria um Set com os nomes das categorias presentes nos produtos
        const nomesCategoriasComProdutos = new Set(produtosData.map(p => p.categoria));

        // Filtra categorias que possuem produtos e ordena alfabeticamente
        const categoriasComProdutos = categoriasData
          .filter(cat => nomesCategoriasComProdutos.has(cat.nome))
          .sort((a, b) => a.nome.localeCompare(b.nome));

        setProdutos(produtosData);
        setCategorias(categoriasComProdutos);
      })
      .catch((error) => {
        console.error('Erro ao buscar dados:', error);
      });
  }, []);

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

        <View style={estilos.grid}>
          {categorias.map((item, index) => (
            <TouchableOpacity key={index} style={estilos.itemCategoria}>
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

        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={estilos.conteudo_principal}>Produtos em Estoque</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CadastrarProdutos')}>
              <MaterialIcons name="add-box" size={28} color="#000000" />
            </TouchableOpacity>
          </View>

          {produtos.length === 0 ? (
            <Text style={{ marginTop: 10 }}>Nenhum produto encontrado.</Text>
          ) : (
            produtos.map((produto) => (
              <View key={produto.id} style={estilos.cardRecomendadoVertical}>
                <View style={{ backgroundColor: '#FFF', padding: 15, borderRadius: 8 }}>
                  {produto.foto && (
                    <Image
                      source={{
                        uri: produto.foto.startsWith('data:') || produto.foto.startsWith('http')
                          ? produto.foto
                          : `data:image/jpeg;base64,${produto.foto}`,
                      }}
                      style={estilos.imagemProduto}
                      resizeMode="cover"
                    />
                  )}
                  <Text style={estilos.nomeProduto}>{produto.nome}</Text>
                  <Text style={estilos.precoProduto}>R$ {produto.preco}</Text>
                  <Text style={estilos.estrelasProduto}>Estoque: {produto.quantidade_estoque}</Text>
                  <Text style={estilos.estrelasProduto}>Validade: {produto.validade}</Text>
                  <Text style={estilos.estrelasProduto}>{produto.descricao}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* MENU FIXO INFERIOR */}
      <MenuInferiorADM navigation={navigation}/>
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
    justifyContent: 'space-between',
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
    justifyContent: 'flex-start',
  },
  itemCategoria: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 8,
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
  nomeProduto: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  precoProduto: {
    color: '#2AAA53',
    fontSize: 12,
    marginVertical: 4,
  },
  imagemProduto: {
    width: '60%',
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
  },
  estrelasProduto: {
    fontSize: 12,
    color: '#555',
  },
  cardRecomendadoVertical: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
