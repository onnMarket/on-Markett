import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Animated, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MenuInferiorADM from '../navigation/navigationBar_admin';
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
      <Text style={styles.textoSecundario}>Status: {item.status}</Text>
      <Text style={styles.textoSecundario}>
        Data: {item.data ? new Date(item.data).toLocaleString() : "Data indisponível"}
      </Text>
    </TouchableOpacity>
  );

  // Roda a animação da seta (360 graus)
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Pedidos Pendentes</Text>
        <Animated.Image
          source={require('../../image/onMarket_2.png')}
          style={[styles.logo, { transform: [{ rotate: rotateInterpolate }] }]}
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
