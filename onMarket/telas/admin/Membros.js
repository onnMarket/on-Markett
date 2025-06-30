import axios from 'axios';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Row, Table } from 'react-native-table-component';
import { MaterialIcons } from '@expo/vector-icons';

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingBottom: 70 }}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Lista de Membros</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('CadastrarMembro')}
            >
              <MaterialIcons name="add-box" size={28} color="#000000" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text>Carregando...</Text>
          ) : (
            <View style={styles.tableWrapper}>
              <Table borderStyle={{ borderWidth: 1, borderColor: '#ccc' }}>
                <Row
                  data={tableHead}
                  style={styles.head}
                  textStyle={styles.headerText}
                  flexArr={[1, 2, 2, 2]}
                />
              </Table>
              {membros.map((membro) => (
                <TouchableOpacity
                  key={membro.id}
                  onPress={() => navigation.navigate('AtualizarMembro', { membro })}
                  style={styles.rowTouchable}
                >
                  <Table borderStyle={{ borderWidth: 1, borderColor: '#ccc' }}>
                    <Row
                      data={[
                        membro.id || '',
                        membro.nome || '',
                        membro.email || '',
                        membro.cpf || ''
                      ]}
                      style={styles.row}
                      textStyle={styles.cellText}
                      flexArr={[1, 2, 2, 2]}
                    />
                  </Table>
                </TouchableOpacity>
              ))}
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
    backgroundColor: '#F5F5F5',
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
  addButton: {
    padding: 4,
  },
  tableWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  headerText: {
    margin: 6,
    textAlign: 'center',
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  rowTouchable: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    height: 40,
    backgroundColor: '#fff',
  },
cellText: {
  margin: 6,
  textAlign: 'center',
},

});

export default Membros;
