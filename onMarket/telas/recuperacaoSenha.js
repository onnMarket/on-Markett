import axios from 'axios';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import cores from './style/cores';

export default function RecuperacaoSenha({ navigation }) {
  const [email, setEmail] = useState('');

  const enviarRecuperacao = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, informe seu e-mail.');
      return;
    }

    try {
      await axios.post('https://on-markett-2.onrender.com/api/users/resetSenha', { email });
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
        leftIcon={<MaterialIcons name="email" size={24} color={cores.texto} />}
        containerStyle={styles.inputContainer}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.botao} onPress={enviarRecuperacao}>
        <Text style={styles.textoBotao}>Enviar Nova Senha</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.input,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '100%',
    marginBottom: 15,
  },
  botao: {
    backgroundColor: cores.botaoEnviar,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  textoBotao: {
    color: cores.textoClaro,
    fontWeight: 'bold',
    fontSize: 18,
  },
});
