import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import cores from '../style/cores';

export default function MenuInferiorADM({ navigation }) {
  const insets = useSafeAreaInsets(); // Captura a área segura inferior

  return (
    <View style={[estilos.menu, { paddingBottom: insets.bottom || 10 }]}>
      <TouchableOpacity style={estilos.item} onPress={() => navigation.navigate('Inicio')}>
        <MaterialIcons name="home" size={35} color="#F5F5F5" />
        <Text style={estilos.textoItem}>Início</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={estilos.item}
        onPress={() => navigation.navigate("HistoricoCompras")}
      >
        <MaterialIcons name="shopping-bag" size={35} color="#fff" />
        <Text style={estilos.textoItem}>Histórico</Text>
      </TouchableOpacity>

    <TouchableOpacity style={estilos.item} onPress={() => navigation.navigate('Perfil')}>
      <MaterialIcons name="person" size={35} color="#fff" />
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
    paddingTop: 10,
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


/*

  import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import cores from '../style/cores';

export default function MenuInferiorADM({ navigation }) {
  return (
      <View style={estilos.menu}>
        <TouchableOpacity style={estilos.item} onPress={() => navigation.navigate('Inicio')}>
          <MaterialIcons name="home" size={28} color="#F5F5F5" />
          <Text style={estilos.textoItem}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.item}>
          <MaterialIcons name="shopping-bag" size={28} color="#fff" />
          <Text style={estilos.textoItem}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.item} onPress={() => navigation.navigate('Perfil')}>
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



*/