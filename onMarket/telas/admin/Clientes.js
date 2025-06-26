/*import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableHead = ['ID', 'Nome completo', 'E-mail', 'CPF'];

  useEffect(() => {
    axios.get('http://192.168.18.114:3000/usuario')
      .then(response => {
        setClientes(response.data);
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6, textAlign: 'center' },
});

export default Clientes;
*/