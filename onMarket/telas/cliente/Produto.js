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
import cores from '../style/cores';
import MenuInferiorCliente from '../navigation-bar/navigationBar_cliente';

export default function Produto({ navigation, route }) {

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

            {/*Produto*/}
            <View key={item.id}>
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
                <View>
                    <Text style={estilos.nomeProduto}>{item.nome}</Text>
                    <Text style={estilos.precoProduto}>
                        R${' '}
                        {typeof item.preco === 'number'
                        ? item.preco.toFixed(2)
                        : parseFloat(item.preco)?.toFixed(2) || '0.00'}
                    </Text>
                    <Text style={estilos.quantidadeProduto}>Estoque: {item.quantidade_estoque}</Text>
                    <Text>Quantidade</Text> <TextInput placeholder='0'></TextInput>
                    </View>

                    <TouchableOpacity placeholder="Adicionar ao carrinho" style={{backgroundColor:"green"}}></TouchableOpacity >
            </View>

            {/* MENU FIXO INFERIOR */}
            <MenuInferiorCliente navigation={navigation} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.Secundaria,
    }
})

