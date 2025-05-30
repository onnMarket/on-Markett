import axios from 'axios';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function RecuperacaoSenha({ navigation }) {
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [repetirSenha, setRepetirSenha] = useState('');

  const atualizarSenha = async () => {
    // 🔴 ALERTA caso as senhas sejam diferentes
    if (novaSenha !== repetirSenha) {
      Alert.alert('Senhas diferentes', 'A senha e a confirmação não coincidem.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/usuario');
      const usuarios = response.data;
      const usuario = usuarios.find(u => u.email === email);

      if (!usuario) {
        alert('Erro', 'Usuário não encontrado.');
        return;
      }

      await axios.patch(`http://localhost:3000/usuario/${usuario.id}`, {
        senha: novaSenha
      });

      alert('Sucesso', 'Senha atualizada com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      alert('Erro', 'Erro ao atualizar a senha.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Input
        placeholder="Email"
        leftIcon={<MaterialIcons name="email" size={24} color="black" />}
        containerStyle={styles.inputContainer}
        value={email}
        onChangeText={setEmail}
      />
      <Input
        placeholder="Nova senha"
        leftIcon={<MaterialIcons name="lock" size={24} color="black" />}
        containerStyle={styles.inputContainer}
        secureTextEntry
        value={novaSenha}
        onChangeText={setNovaSenha}
      />
      <Input
        placeholder="Repita a nova senha"
        leftIcon={<MaterialIcons name="lock" size={24} color="black" />}
        containerStyle={styles.inputContainer}
        secureTextEntry
        value={repetirSenha}
        onChangeText={setRepetirSenha}
      />

      <TouchableOpacity style={styles.botao_1} onPress={atualizarSenha}>
        <Text style={styles.texto}>Redefinir Senha</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: '80%',
    alignSelf: 'center',
  },
  botao_1: {
    backgroundColor: '#f4e453',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  texto: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
