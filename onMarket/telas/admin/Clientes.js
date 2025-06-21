import axios from 'axios';
import React, { useLayoutEffect, useState } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
  const tableHead = ['ID', 'Nome completo', 'E-mail', 'CPF'];
  const tableData = [
    ['', '25', , '}'],
    ['Maria', '30'],
    ['Pedro', '22'],
  ];

useEffect(() => {
    axios.get('http://localhost:3000/usuario')
        .then(response => {
        setClientes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar clientes:", error);
      });
}, [])

const tableData = clientes.map(cliente => [
    cliente.id || '', 
    cliente.nome || '', 
    cliente.email || '', 
    cliente.cpf || ''
  ]);

  return (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1, borderColor: '#ccc' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        <Rows data={tableData} textStyle={styles.text} />
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
});

export default Clientes;

