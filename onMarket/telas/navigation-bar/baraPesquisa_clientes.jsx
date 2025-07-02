import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';
import { Avatar } from 'react-native-elements';
import cores from '../style/cores';

export default function BarraPesquisaClientes({ busca, setBusca }) {
  return (
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
  );
}

const estilos = StyleSheet.create({
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
    color: cores.texto,
    marginRight: 10,
  },
  notificacao: {
    position: 'relative',
    padding: 10,
    borderRadius: 50,
  },
});
