import axios from 'axios';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Image,ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Row, Table } from 'react-native-table-component';

import MenuInferiorADM from '../navigation/navigationBar_admin';
import cores from '../style/cores';

const Clientes = ({ navigation }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const tableHead = ['ID', 'Nome completo', 'E-mail', 'CPF'];

  useEffect(() => {
    axios
      .get('https://on-markett-2.onrender.com/api/users')
      .then((response) => {
        if (Array.isArray(response.data)) {
          const usuariosClientes = response.data.filter(
            (usuario) => usuario.tipo === 'cliente'
          );
          setClientes(usuariosClientes);
        } else {
          console.error('Resposta inesperada:', response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar clientes:', error);
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingBottom: 70 }}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Lista de Clientes</Text>
              <Image
                source={require("../../image/onMarket_2.png")}
                style={styles.logo}
                resizeMode="contain"
              />
          </View>

          {loading ? (
            <Text>Carregando...</Text>
          ) : (
            <View style={styles.tableWrapper}>
              <Table borderStyle={{ borderWidth: 1, borderColor: cores.bordaTabela }}>
                <Row
                  data={tableHead}
                  style={styles.head}
                  textStyle={styles.headerText}
                  flexArr={[1, 2, 2, 2]}
                />
              </Table>
              <ScrollView>
                {clientes.map((cliente) => (
                  <TouchableOpacity
                    key={cliente.id}
                    onPress={() => navigation.navigate('VisualizarCliente', { cliente })}
                    style={styles.rowTouchable}
                  >
                    <Table borderStyle={{ borderWidth: 1, borderColor: cores.bordaTabela }}>
                      <Row
                        data={[
                          cliente.id || '',
                          cliente.nome || '',
                          cliente.email || '',
                          cliente.cpf || '',
                        ]}
                        style={styles.row}
                        textStyle={styles.cellText}
                        flexArr={[1, 2, 2, 2]}
                      />
                    </Table>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
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
    backgroundColor: cores.Secundaria,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableWrapper: {
    borderWidth: 1,
    borderColor: cores.bordaTabela,
    borderRadius: 4,
    overflow: 'hidden',
  },
  head: {
    height: 40,
    backgroundColor: cores.tituloTabela,
  },
  headerText: {
    margin: 6,
    textAlign: 'center',
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderColor: cores.bordaTabela,
  },
  rowTouchable: {
    borderBottomWidth: 1,
    borderColor: cores.bordaTabela,
  },
  row: {
    height: 40,
    backgroundColor: cores.Secundaria,
  },
  cellText: {
    margin: 6,
    textAlign: 'center',
  },
  logo: {
    width: 110,
    height: 40,
  },
});

export default Clientes;
