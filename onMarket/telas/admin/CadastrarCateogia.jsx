import axios from 'axios';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import cores from '../style/cores';

export default function CadastrarCategoria({ navigation }) {
  const [nome, setNome] = useState('');
  const [icone, setIcone] = useState('');
  const [tipo, setTipo] = useState('MaterialIcons');

  const cadastrarCategoria = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Informe o nome da categoria.');
      return;
    }
    if (!icone.trim()) {
      Alert.alert('Erro', 'Informe o nome do ícone.');
      return;
    }

    try {
      await axios.post('https://on-markett-2.onrender.com/api/categorias', {
        nome: nome.trim(),
        icone: icone.trim(),
        tipo,
        quantidade: 0, // inicia com zero produtos na categoria
      });

      Alert.alert('Sucesso', 'Categoria cadastrada com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Erro ao cadastrar categoria:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível cadastrar a categoria.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formWrapper}>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="category"
              size={24}
              color={cores.texto}
              style={styles.icon}
            />
            <TextInput
              placeholder="Nome da Categoria"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="insert-emoticon"
              size={24}
              color={cores.texto}
              style={styles.icon}
            />
            <TextInput
              placeholder="Nome do Ícone (ex: shopping-cart)"
              placeholderTextColor="#999"
              value={icone}
              onChangeText={setIcone}
              style={styles.input}
            />
          </View>

          <View style={[styles.inputContainer, { paddingVertical: 0 }]}>
            <MaterialIcons
              name="style"
              size={24}
              color={cores.texto}
              style={[styles.icon, { marginTop: 10 }]}
            />
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={tipo}
                onValueChange={(itemValue) => setTipo(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="MaterialIcons" value="MaterialIcons" />
                <Picker.Item label="FontAwesome" value="FontAwesome" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.botaoSalvar} onPress={cadastrarCategoria}>
            <Text style={styles.textoBotao}>Salvar Categoria</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.input,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
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
  pickerWrapper: {
    flex: 1,
  },
  picker: {
    color: cores.texto,
    backgroundColor: 'transparent',
    width: '100%',
  },
  botaoSalvar: {
    backgroundColor: cores.botaoEnviar,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: cores.textoClaro,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
