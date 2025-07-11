import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  Animated,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import MenuInferiorADM from "../navigation/navigationBar_admin";
import cores from "../style/cores";

export default function Pedidos({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const rotateAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const carregarPedidos = async () => {
      setLoading(true);

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();

      try {
        const res = await axios.get(
          "https://on-markett-2.onrender.com/api/pedidos"
        );
        const pendentes = res.data.filter(
          (pedido) => pedido.status.toLowerCase() !== "entregue"
        );
        setPedidos(pendentes);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os pedidos.");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", carregarPedidos);
    return unsubscribe;
  }, [navigation, rotateAnim]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("DetalhesPedido", { pedidoId: item.id })
      }
    >
      <Text style={styles.textoPedido}>Pedido #{item.id}</Text>
      <Text style={styles.textoSecundario}>Status: {item.status}</Text>
      <Text style={styles.textoSecundario}>
        Data:{" "}
        {item.data ? new Date(item.data).toLocaleString() : "Data indisponível"}
      </Text>
    </TouchableOpacity>
  );

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotationStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Pedidos Pendentes</Text>
        <Image
          source={require("../../image/onMarket_2.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Animated.View style={rotationStyle}>
            <ActivityIndicator size="large" color={cores.Primaria} />
          </Animated.View>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.listaVazia}>Nenhum pedido pendente.</Text>
          }
          contentContainerStyle={styles.listaContainer}
        />
      )}

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    width: 110,
    height: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
