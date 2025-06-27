// components/BottomMenu.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function MenuInferiorADM({ navigation }) {
  return (
    <View style={estilos.menu}>
      <TouchableOpacity onPress={() => navigation.navigate('Relatorios')}>
        <MaterialIcons name="analytics" size={28} color="#F5F5F5" />
        <Text style={{ color: '#F5F5F5', fontSize: 12, textAlign: 'center' }}>Relatórios</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Membros')}>
        <MaterialIcons name="badge" size={28} color="#F5F5F5" />
        <Text style={{ color: '#F5F5F5', fontSize: 12, textAlign: 'center' }}>Membros</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('InicioADM')}>
        <MaterialIcons name="home" size={28} color="#F5F5F5" />
        <Text style={{ color: '#F5F5F5', fontSize: 12, textAlign: 'center' }}>Início</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Pedidos')}>
        <MaterialIcons name="ballot" size={28} color="#F5F5F5" />
        <Text style={{ color: '#F5F5F5', fontSize: 12, textAlign: 'center' }}>Pedidos</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Clientes')}>
        <MaterialIcons name="groups" size={28} color="#F5F5F5" />
        <Text style={{ color: '#F5F5F5', fontSize: 12, textAlign: 'center' }}>Clientes</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
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

