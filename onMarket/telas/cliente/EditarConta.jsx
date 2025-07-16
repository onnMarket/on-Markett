import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import cores from '../style/cores';

export default function EditarConta({ route, navigation }) {
  const { usuario } = route.params;

  // Função para formatar o CPF com máscara 000.000.000-00
  function formatarCPF(value) {
    let cpfLimpo = value.replace(/\D/g, '');
    cpfLimpo = cpfLimpo.substring(0, 11);
    cpfLimpo = cpfLimpo.replace(/(\d{3})(\d)/, '$1.$2');
    cpfLimpo = cpfLimpo.replace(/(\d{3})(\d)/, '$1.$2');
    cpfLimpo = cpfLimpo.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpfLimpo;
  }

  // Inicializa cpf já formatado
  const [cpf, setCpf] = useState(formatarCPF(usuario.cpf || ''));

  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [senha, setSenha] = useState(usuario.senha);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const salvarEdicao = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const atualizado = {
        nome,
        email,
        cpf: cpf.replace(/\D/g, ''), // envia o CPF limpo para a API
        senha,
        tipo: usuario.tipo,
      };

      // Atualiza o usuário na API
      await axios.put(`https://on-markett-2.onrender.com/api/users/${usuario.id}`, atualizado);

      // Salva localmente no AsyncStorage
      await AsyncStorage.setItem('@usuario', JSON.stringify({ ...usuario, ...atualizado }));

      Alert.alert('Sucesso', 'Conta atualizada com sucesso!');

      // Navega para a tela de Perfil com os dados atualizados
      navigation.navigate('Perfil');
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a conta.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.titulo}>Editar Conta</Text>

          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={24} color={cores.texto} style={styles.icon} />
            <TextInput
              placeholder="Nome"
              placeholderTextColor="#999"
              style={styles.input}
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color={cores.texto} style={styles.icon} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="badge" size={24} color={cores.texto} style={styles.icon} />
            <TextInput
              placeholder="CPF"
              placeholderTextColor="#999"
              style={styles.input}
              value={cpf}
              onChangeText={text => setCpf(formatarCPF(text))}
              keyboardType="numeric"
              maxLength={14} // permite máscara
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color={cores.texto} style={styles.icon} />
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
              <MaterialIcons
                name={mostrarSenha ? 'visibility' : 'visibility-off'}
                size={24}
                color={cores.texto}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.botaoSalvar} onPress={salvarEdicao}>
            <Text style={styles.textoBotao}>Salvar Alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoCancelar} onPress={() => navigation.goBack()}>
            <Text style={styles.textoBotao}>Cancelar</Text>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: cores.cardProdutos,
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: cores.texto,
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
    color: cores.texto,
    fontSize: 16,
  },
  botaoSalvar: {
    backgroundColor: cores.botaoEditar,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoCancelar: {
    backgroundColor: cores.botaoDeletar,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: cores.textoClaro,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
