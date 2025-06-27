import axios from 'axios';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Row, Rows, Table } from 'react-native-table-component';

import MenuInferiorADM from '../navigation-bar/navigationBar_admin';

const Membros = ({ navigation }) => {
  const [membros, setMembros] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableHead = ['ID', 'Nome completo', 'E-mail', 'CPF'];

  useEffect(() => {
    axios.get('https://on-markett-2.onrender.com/api/users')
      .then(response => {
        if (Array.isArray(response.data)) {
          const usuariosMembros = response.data.filter(usuario => usuario.tipo === 'adm');
          setMembros(usuariosMembros);
        } else {
          console.error("Resposta inesperada:", response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar membros:", error);
        setLoading(false);
      });
  }, []);

  const tableData = membros.map(membro => [
    membro.id || '',
    membro.nome || '',
    membro.email || '',
    membro.cpf || ''
  ]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingBottom: 70 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Lista de Membros</Text>
          {loading ? (
            <Text>Carregando...</Text>
          ) : (
            <Table borderStyle={{ borderWidth: 1, borderColor: '#ccc' }}>
              <Row data={tableHead} style={styles.head} textStyle={styles.text} />
              <Rows data={tableData} textStyle={styles.text} />
            </Table>
          )}
        </View>
      </View>
      <MenuInferiorADM navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
});

export default Membros;
