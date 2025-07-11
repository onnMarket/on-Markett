import axios from "axios";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import cores from "../style/cores";

export default function Pedidos({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);  // Estado para controlar o carregamento
  const rotateAnim = useState(new Animated.Value(0))[0];  // Inicializa a animação de rotação

  useEffect(() => {
    const carregarPedidos = async () => {
      setLoading(true);  // Ativa o carregamento
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,  // Define o tempo da rotação (1 segundo)
          useNativeDriver: true,
        })
      ).start();

      try {
        const res = await axios.get("https://on-markett-2.onrender.com/api/pedidos");
        // Filtra só os que não estão entregues
        const pendentes = res.data.filter(
          (pedido) => pedido.status.toLowerCase() !== "entregue"
        );
        setPedidos(pendentes);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os pedidos.");
      } finally {
        setLoading(false);  // Desativa o carregamento após os dados serem carregados
      }
    };

    const unsubscribe = navigation.addListener("focus", carregarPedidos);
    return unsubscribe;
  }, [navigation, rotateAnim]);

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

  // Roda a animação da seta (360 graus)
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Se estiver carregando, mostra a seta giratória */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.arrow,
              { transform: [{ rotate: rotateInterpolate }] },
            ]}
          >
            <Text style={styles.arrowText}>↻</Text> {/* Seta giratória */}
          </Animated.View>
          <Text style={styles.loadingText}>Carregando pedidos...</Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Nenhum pedido pendente.</Text>}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    fontSize: 50,  // Tamanho da seta
    color: cores.texto,
  },
  arrowText: {
    fontSize: 50,
    color: cores.texto,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: cores.texto,
  },
});
