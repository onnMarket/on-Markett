import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableHead = ['ID', 'Nome completo', 'E-mail', 'CPF'];

  useEffect(() => {
    axios.get('http://localhost:3000/usuario')
      .then(response => {
        if (Array.isArray(response.data)) {
          const usuariosClientes = response.data.filter(usuario => usuario.tipo === 'cliente')
          setClientes(usuariosClientes);
        } else {
          console.error("Resposta inesperada:", response.data)
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
  <View style={{ flex: 1, paddingBottom: 70 }}> {/* reserva espaço para o menu */}
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

  <View style={styles.menu}>
    <TouchableOpacity style={styles.item}>
      <MaterialIcons name="analytics" size={28} color="#F5F5F5" />
      <Text style={styles.textoItem}>Relatórios</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.item}>
      <MaterialIcons name="badge" size={28} color="#F5F5F5" />
      <Text style={styles.textoItem}>Membros</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.item}>
      <MaterialIcons name="home" size={28} color="#F5F5F5" />
      <Text style={styles.textoItem}>Início</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.item}>
      <MaterialIcons name="ballot" size={28} color="#fff" />
      <Text style={styles.textoItem}>Pedidos</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Clientes')}>
      <MaterialIcons name="groups" size={28} color="#fff" />
      <Text style={styles.textoItem}>Clientes</Text>
    </TouchableOpacity>
  </View>
</SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6, textAlign: 'center' },
  item: {
    alignItems: 'center',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textoItem: {
    color: '#fff',
    fontSize: 10,
  },
});

export default Clientes;
