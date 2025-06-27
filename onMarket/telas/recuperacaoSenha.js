import axios from 'axios';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function RecuperacaoSenha({ navigation }) {
  const [email, setEmail] = useState('');

  const enviarRecuperacao = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, informe seu e-mail.');
      return;
    }

    try {
      const response = await axios.post('https://on-markett-2.onrender.com/api/users/resetSenha', {
        email
      });

      Alert.alert(
        'Sucesso',
        'Uma nova senha foi enviada para seu e-mail.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      console.error('Erro ao enviar recuperação de senha:', error);
      const errorMsg = error?.response?.data?.error || 'Erro ao enviar a nova senha.';
      Alert.alert('Erro', errorMsg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Input
        placeholder="Digite seu e-mail"
        leftIcon={<MaterialIcons name="email" size={24} color="black" />}
        containerStyle={styles.inputContainer}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.botao_1} onPress={enviarRecuperacao}>
        <Text style={styles.texto}>Enviar Nova Senha</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: '80%',
    alignSelf: 'center',
  },
  botao_1: {
    backgroundColor: '#4caf50',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  texto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
