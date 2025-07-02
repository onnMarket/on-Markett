import axios from 'axios';
import { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import cores from '../style/cores';

export default function AtualizarMembro({ route, navigation }) {
  const { membro } = route.params;

  const [nome, setNome] = useState(membro.nome);
  const [email, setEmail] = useState(membro.email);
  const [cpf, setCpf] = useState(membro.cpf);
  const [tipo, setTipo] = useState(membro.tipo);

  const atualizar = async () => {
    const dadosAtualizados = { nome, email, cpf, tipo };

    try {
      await axios.put(`https://on-markett-2.onrender.com/api/users/${membro.id}`, dadosAtualizados);
      Alert.alert("Sucesso", "Membro atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o membro.");
    }
  };

  const deletar = async () => {
    try {
      await axios.delete(`https://on-markett-2.onrender.com/api/users/${membro.id}`);
      Alert.alert("Sucesso", "Membro deletado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível deletar o membro.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={24} color={cores.texto} style={styles.icon} />
        <TextInput
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color={cores.texto} style={styles.icon} />
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="badge" size={24} color={cores.texto} style={styles.icon} />
        <TextInput
          value={cpf}
          onChangeText={setCpf}
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="supervisor-account" size={24} color={cores.texto} style={styles.icon} />
        <Picker
          selectedValue={tipo}
          onValueChange={(itemValue) => setTipo(itemValue)}
          style={styles.picker}
          dropdownIconColor={cores.texto}
        >
          <Picker.Item label="Administrador" value="adm" />
          <Picker.Item label="Cliente" value="cliente" />
        </Picker>
      </View>

      <TouchableOpacity onPress={atualizar} style={styles.botao}>
        <Text style={styles.textoBotao}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={deletar} style={[styles.botao, { backgroundColor: cores.botaoDeletar }]}>
        <Text style={styles.textoBotao}>Excluir Membro</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: cores.Secundaria,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.input,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: cores.texto,
  },
  picker: {
    flex: 1,
    color: cores.texto,
    backgroundColor: 'transparent',
  },
  botao: {
    backgroundColor: cores.botaoEditar,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: cores.textoClaro,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
