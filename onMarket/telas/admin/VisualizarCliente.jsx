import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import cores from '../style/cores';
import moment from 'moment';
import 'moment/locale/pt-br';

const VisualizarCliente = ({ route }) => {
  const { cliente } = route.params;
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await fetch(
          `https://on-markett-2.onrender.com/api/compras/${cliente.id}`//esse é o endpoint que retorna as compras do cliente???
        );
        const data = await response.json();
        setCompras(data);
      } catch (error) {
        console.error('Erro ao buscar compras:', error);
      }
    };

    fetchCompras();
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

        <Text style={styles.titulo}>Compras Realizadas</Text>
        {compras.length > 0 ? (
          compras.map((compra, index) => (
            <View key={index} style={styles.compraItem}>
              <Text>Data: {moment(compra.data).format('LL')}</Text>
              <Text>Produtos: {compra.itens.join(', ')}</Text>
              <Text>Total: R$ {compra.total.toFixed(2)}</Text>
            </View>
          ))
        ) : (
          <Text style={{ marginTop: 10 }}>Nenhuma compra registrada.</Text>
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
