import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image
} from "react-native";
import axios from "axios";
import cores from "../style/cores";
import MenuInferiorADM from '../navigation/navigationBar_admin';

export default function Pedidos({ navigation }) {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const res = await axios.get("https://on-markett-2.onrender.com/api/pedidos");
        const pendentes = res.data.filter(
          (pedido) => pedido.status.toLowerCase() !== "entregue"
        );
        setPedidos(pendentes);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os pedidos.");
      }
    };

    const unsubscribe = navigation.addListener("focus", carregarPedidos);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DetalhesPedido", { pedidoId: item.id })}
    >
      <Text style={styles.textoPedido}>Pedido #{item.id}</Text>
      <Text style={styles.textoSecundario}>Status: {item.status}</Text>
      <Text style={styles.textoSecundario}>
        Data: {item.data ? new Date(item.data).toLocaleString() : "Data indisponível"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Pedidos Pendentes</Text>
        <Image
          source={require('../../image/onMarket_2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.listaVazia}>Nenhum pedido pendente.</Text>
        }
        contentContainerStyle={styles.listaContainer}
      />
      <MenuInferiorADM navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // texto à esquerda, imagem à direita
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    width: 100,
    height: 40,
    size:100,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.texto,
  },
  card: {
    backgroundColor: cores.cardProdutos,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
  },
  textoPedido: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: cores.texto,
  },
  textoSecundario: {
    color: cores.texto,
  },
  listaVazia: {
    textAlign: "center",
    marginTop: 20,
    color: cores.texto,
  },
  listaContainer: {
    padding: 20,
  },
});
