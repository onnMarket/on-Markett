import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const categorias = [
  { nome: 'Frutas', icone: 'apple', tipo: 'FontAwesome' },
  { nome: 'Verduras', icone: 'leaf', tipo: 'FontAwesome' },
  { nome: 'Frios', icone: 'snowflake-o', tipo: 'FontAwesome' },
  { nome: 'Casa', icone: 'home', tipo: 'MaterialIcons' },
  { nome: 'Higiene', icone: 'shower', tipo: 'FontAwesome' },
  { nome: 'Descartáveis', icone: 'trash', tipo: 'FontAwesome' },
  { nome: 'Bebidas', icone: 'glass', tipo: 'FontAwesome' },
  { nome: 'Veja mais', icone: 'ellipsis-h', tipo: 'FontAwesome' }
];


export default function InicioADM() {
  const navigation = useNavigation();

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
          <TouchableOpacity style={estilos.notificacao}>
            <TouchableOpacity style={estilos.item}>
              <MaterialIcons name="shopping-cart" size={28} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTEÚDO PRINCIPAL COM SCROLL */}
      <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <View style={estilos.linhaTitulo}>
          <Text style={estilos.conteudo_principal}>Produtos Cadastrados</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CadastrarProdutos')}>
            <MaterialIcons name="add-box" size={28} color="#000000" />
          </TouchableOpacity>
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
      </ScrollView>

      {/* MENU FIXO INFERIOR */}
      <View style={estilos.menu}>
        <TouchableOpacity style={estilos.item}>
          <MaterialIcons name="analytics" size={28} color={"#F5F5F5"} />
          <Text style={estilos.textoItem}>Relatórios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.item}>
          <MaterialIcons name="home" size={28} color="#F5F5F5" />
          <Text style={estilos.textoItem}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.item}>
          <MaterialIcons name="ballot" size={28} color="#fff" />
          <Text style={estilos.textoItem}>Pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.item}>
          <MaterialIcons name="groups" size={28} color="#fff" />
          <Text style={estilos.textoItem}>Clientes</Text>
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
  bolinhanotificação: {
    width: 8,
    height: 8,
    backgroundColor: '#2AAA53',
    borderRadius: 4,
    position: 'absolute',
    top: 15,
    left: 15,
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
    justifyContent: 'space-between',
  },
  itemCategoria: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 20,
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
  cardDestino: {
    marginRight: 15,
    width: 150,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagemDestino: {
    width: '100%',
    height: 120,
  },
  infoCard: {
    padding: 10,
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
  estrelasProduto: {
    fontSize: 12,
    color: '#777',
  },
  cardRecomendadoVertical: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagemRecomendadoVertical: {
    width: '100%',
    height: 200,
    borderRadius: 8,
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
