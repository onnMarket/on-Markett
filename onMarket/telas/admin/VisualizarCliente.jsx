import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import cores from '../style/cores';
import moment from 'moment';
import 'moment/locale/pt-br';

const VisualizarCliente = ({ route }) => {
  const { cliente } = route.params;
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch(
          `https://on-markett-2.onrender.com/api/pedidos/comprador/${cliente.id}`
        );
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      }
    };

    fetchPedidos();
  }, [cliente.id]);

  const dataCadastro = moment(cliente.data_cadastro || cliente.created_at);
  const tempoDeCliente = dataCadastro.fromNow();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.titulo}>Detalhes do Cliente</Text>
        <View style={styles.caixaInfo}>
          <Text style={styles.label}>Nome:</Text>
          <Text>{cliente.nome}</Text>

          <Text style={styles.label}>E-mail:</Text>
          <Text>{cliente.email}</Text>

          <Text style={styles.label}>CPF:</Text>
          <Text>{cliente.cpf}</Text>

          <Text style={styles.label}>Cliente desde:</Text>
          <Text>{dataCadastro.format('LL')} ({tempoDeCliente})</Text>
        </View>

        <Text style={styles.titulo}>Pedidos Realizados</Text>
        {pedidos.length > 0 ? (
          pedidos.map((pedido, index) => (
            <View key={index} style={styles.compraItem}>
              <Text>Pedido #{pedido.id}</Text>
              <Text>Data: {moment(pedido.data).format('LL')}</Text>
              <Text>Forma de Pagamento: {pedido.formaPagamento}</Text>
              <Text>Status: {pedido.status}</Text>
            </View>
          ))
        ) : (
          <Text style={{ marginTop: 10 }}>Nenhum pedido registrado.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: cores.Secundaria },
  titulo: { fontSize: 20, fontWeight: 'bold', marginVertical: 15 },
  caixaInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  label: { fontWeight: 'bold', marginTop: 10 },
  compraItem: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
});

export default VisualizarCliente;
