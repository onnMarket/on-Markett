import axios from 'axios';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Row, Rows, Table } from 'react-native-table-component';

import MenuInferiorADM from '../navigation-bar/navigationBar_admin';
import cores from '../style/cores';

const Clientes = ({ navigation }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableHead = ['ID', 'Nome completo', 'E-mail', 'CPF'];

  useEffect(() => {
    axios.get('https://on-markett-2.onrender.com/api/users')
      .then(response => {
        if (Array.isArray(response.data)) {
          const usuariosClientes = response.data.filter(usuario => usuario.tipo === 'cliente');
          setClientes(usuariosClientes);
        } else {
          console.error("Resposta inesperada:", response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar clientes:", error);
        setLoading(false);
      });
  }, []);

  const tableData = clientes.map(cliente => [
    cliente.id || '',
    cliente.nome || '',
    cliente.email || '',
    cliente.cpf || ''
  ]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingBottom: 70 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Lista de Clientes</Text>
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
  container: { flex: 1, padding: 16, backgroundColor: cores.Secundaria },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  head: { height: 40, backgroundColor: cores.tituloTabela },
  text: { margin: 6, textAlign: 'center' },
});

export default Clientes;
