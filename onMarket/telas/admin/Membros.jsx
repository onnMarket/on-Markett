import axios from 'axios';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Row, Table } from 'react-native-table-component';
import { MaterialIcons } from '@expo/vector-icons';

import MenuInferiorADM from '../navigation/navigationBar_admin';
import cores from '../style/cores'

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
              <MaterialIcons name="add-box" size={28} color={cores.btnAdd} />
            </TouchableOpacity>
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
  addButton: {
    padding: 4,
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

});

export default Membros;
