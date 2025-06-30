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
import { Picker } from '@react-native-picker/picker'; // <- Adicionado para o campo tipo

export default function AtualizarMembro({ route, navigation }) {
  const { membro } = route.params;

  const [nome, setNome] = useState(membro.nome);
  const [email, setEmail] = useState(membro.email);
  const [cpf, setCpf] = useState(membro.cpf);
  const [tipo, setTipo] = useState(membro.tipo); // <- Novo campo

  const atualizar = async () => {
    try {
      await axios.put(`https://on-markett-2.onrender.com/api/users/${membro.id}`, {
        nome,
        email,
        cpf,
        tipo,
      });
      Alert.alert("Sucesso", "Membro atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar.");
    }
  };

  const deletar = async () => {
    try {
      await axios.delete(`https://on-markett-2.onrender.com/api/users/${membro.id}`);
      Alert.alert("Sucesso", "Membro deletado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível deletar.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        placeholder="Nome"
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Email"
      />
      <TextInput
        value={cpf}
        onChangeText={setCpf}
        style={styles.input}
        placeholder="CPF"
        keyboardType="numeric"
      />
      
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Tipo de Conta:</Text>
        <Picker
          selectedValue={tipo}
          onValueChange={(itemValue) => setTipo(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Administrador" value="adm" />
          <Picker.Item label="Cliente" value="cliente" />
          <Picker.Item label="Outro" value="outro" />
        </Picker>
      </View>

      <TouchableOpacity onPress={atualizar} style={styles.botao}>
        <Text style={styles.textoBotao}>Salvar Alterações</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deletar} style={[styles.botao, { backgroundColor: 'red' }]}>
        <Text style={styles.textoBotao}>Excluir Membro</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  pickerLabel: {
    marginLeft: 12,
    marginTop: 10,
    fontWeight: '600',
    color: '#444',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  botao: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
  },
});
