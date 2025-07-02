import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const cores = {
  Secundaria: '#f0f0f0',
  cardProdutos: '#fff',
  texto: '#333',
  botaoDeletar: '#d9534f',
  textoClaro: '#fff',
};

export default function Perfil({ navigation }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioStr = await AsyncStorage.getItem('@usuario');
        if (usuarioStr) {
          const usuarioObj = JSON.parse(usuarioStr);
          console.log('Usuário carregado:', usuarioObj);
          setUsuario(usuarioObj);
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    };

    carregarUsuario();
  }, []);

  const logout = async () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('@usuario');
            navigation.replace('Login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!usuario) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.texto}>Carregando dados do usuário...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Perfil do Usuário</Text>

        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.valor}>{usuario.nome}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.valor}>{usuario.email}</Text>

        <Text style={styles.label}>CPF:</Text>
        <Text style={styles.valor}>{usuario.cpf || '-'}</Text>

        <Text style={styles.label}>Tipo de Conta:</Text>
        <Text style={styles.valor}>{usuario.tipo}</Text>

        <Text style={styles.label}>Senha:</Text>
        <Text style={styles.valor}>{usuario.senha || '-'}</Text>

        <TouchableOpacity style={styles.botaoLogout} onPress={logout}>
          <Text style={styles.textoBotao}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: cores.cardProdutos,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: cores.texto,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
    marginTop: 10,
  },
  valor: {
    fontSize: 18,
    color: cores.texto,
    marginTop: 2,
  },
  botaoLogout: {
    backgroundColor: cores.botaoDeletar,
    marginTop: 30,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: cores.textoClaro,
    fontSize: 18,
    fontWeight: 'bold',
  },
  texto: {
    color: cores.texto,
    fontSize: 16,
    textAlign: 'center',
  },
});
