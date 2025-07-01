import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import cores from '../style/cores';

export default function MenuInferiorADM({ navigation }) {
  return (
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
  );
}

const estilos = StyleSheet.create({
    menu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: cores.Principal,
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
        color: cores.textoClaro,
        fontSize: 10,
    }
});

