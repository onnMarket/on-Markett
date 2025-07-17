import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import cores from "../style/cores";
import MenuInferiorCliente from "../navigation/navigationBar_cliente";

export default function HistoricoPedidos({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarPedidos = async () => {
      setCarregando(true);
      try {
        const usuarioSalvo = await AsyncStorage.getItem("@usuario");
        const usuario = JSON.parse(usuarioSalvo);
        const id = usuario?.id;

        if (!id) {
          Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
          return;
        }

        const res = await axios.get(
          `https://on-markett-2.onrender.com/api/pedidos/comprador/${id}`
        );
        const pedidosDetalhados = await Promise.all(
          res.data.map(async (pedido) => {
            const resDetalhes = await axios.get(
              `https://on-markett-2.onrender.com/api/pedidos/${pedido.id}`
            );
            const itens = await Promise.all(
              resDetalhes.data.itens.map(async (item) => {
                const produto = await axios.get(
                  `https://on-markett-2.onrender.com/api/produtos/${item.produtoId}`
                );
                return { ...item, produto: produto.data };
              })
            );
            return { ...pedido, itens };
          })
        );

        setPedidos(pedidosDetalhados);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        Alert.alert("Erro", "Não foi possível carregar o histórico de pedidos.");
      } finally {
        setCarregando(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", carregarPedidos);
    return unsubscribe;
  }, [navigation]);

  const calcularTotal = (itens) => {
    return itens.reduce((total, item) => {
      return total + item.quantidade * parseFloat(item.preco_unitario);
    }, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Histórico de Pedidos</Text>
          <Image
            source={require("../../image/onMarket_2.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={cores.Primaria} />
            <Text style={{ marginTop: 10, color: cores.texto }}>
              Carregando pedidos...
            </Text>
          </View>
        ) : pedidos.length === 0 ? (
          <Text style={{ textAlign: "center" }}>Nenhum pedido encontrado.</Text>
        ) : (
          pedidos.map((pedido, index) => (
            <TouchableOpacity
              key={pedido.id}
              style={styles.pedidoContainer}
              onPress={() =>
                navigation.navigate("StatusPedido", { pedidoId: pedido.id })
              }
            >
              <Text style={styles.dataPedido}>
                Compra {index + 1} - {new Date(pedido.data).toLocaleDateString()}
              </Text>
              <View style={styles.itensContainer}>
                {pedido.itens.map((item) => (
                  <Image
                    key={item.id}
                    source={{
                      uri:
                        item.produto.foto?.length < 100
                          ? `https://drive.google.com/uc?export=view&id=${item.produto.foto}`
                          : `data:image/jpeg;base64,${item.produto.foto}`,
                    }}
                    style={styles.itemImagem}
                  />
                ))}
              </View>
              <Text style={styles.valorTotal}>
                Valor Total: R$ {calcularTotal(pedido.itens).toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <MenuInferiorCliente navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Alinha título à esquerda e logo à direita
    marginBottom: 15,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: cores.texto,
  },
  logo: {
    width: 110,
    height: 40,
  },
  loadingContainer: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  pedidoContainer: {
    backgroundColor: cores.cardProdutos,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  dataPedido: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: cores.texto,
  },
  itensContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  itemImagem: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  valorTotal: {
    fontSize: 14,
    textAlign: "right",
    color: cores.texto,
    fontWeight: "bold",
  },
});
