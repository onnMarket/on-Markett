import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import axios from "axios";
import cores from "../style/cores";

export default function Pedidos({ navigation }) {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const res = await axios.get("https://on-markett-2.onrender.com/api/pedidos");
        // Filtra só os que não estão entregues
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
      <Text>Status: {item.status}</Text>
      <Text>Data: {new Date(item.data).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Nenhum pedido pendente.</Text>}
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
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
});
