import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import cores from "../style/cores";

export default function DetalhesPedido({ route, navigation }) {
  const { pedidoId } = route.params;
  const [pedido, setPedido] = useState(null);
  const [itensComProdutos, setItensComProdutos] = useState([]);

  useEffect(() => {
    const carregarPedido = async () => {
      try {
        const resPedido = await axios.get(
          `https://on-markett-2.onrender.com/api/pedidos/${pedidoId}`
        );
        const pedidoData = resPedido.data;

        const itens = pedidoData.itens || [];

        // Para cada item do pedido, busca os dados do produto
        const itensDetalhados = await Promise.all(
          itens.map(async (item) => {
            const resProduto = await axios.get(
              `https://on-markett-2.onrender.com/api/produtos/${item.produtoId}`
            );
            return {
              ...item,
              produto: resProduto.data,
            };
          })
        );

        setPedido(pedidoData);
        setItensComProdutos(itensDetalhados);
      } catch (error) {
        console.error("Erro ao carregar pedido ou produtos:", error);
        Alert.alert("Erro", "Erro ao carregar detalhes do pedido.");
      }
    };

    carregarPedido();
  }, []);

  const concluirPedido = async () => {
    try {
      const res = await axios.patch(
        `https://on-markett-2.onrender.com/api/pedidos/${pedidoId}/status`
      );
      Alert.alert("Sucesso", res.data.message);
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Erro ao concluir o pedido"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {pedido ? (
          <>
            <Text style={styles.titulo}>Detalhes do Pedido #{pedido.id}</Text>
            <Text style={styles.textoNegrito}>
              Forma de Pagamento: {pedido.formaPagamento}
            </Text>
            <Text style={styles.textoNegrito}>Status: {pedido.status}</Text>

            {itensComProdutos.map((item) => (
              <View key={item.id} style={styles.cardProduto}>
                {item.produto?.foto ? (
                  <Image
                    source={{
                      uri:
                        item.produto.foto.length < 100
                          ? `https://drive.google.com/uc?export=view&id=${item.produto.foto}`
                          : item.produto.foto,
                    }}
                    style={styles.imagemProduto}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.imagemProduto,
                      {
                        backgroundColor: "#ccc",
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Text>Sem imagem</Text>
                  </View>
                )}

                <View style={styles.infoCard}>
                  <Text style={styles.nomeProduto}>{item.produto?.nome}</Text>
                  <Text>{item.produto?.descricao}</Text>
                  <Text>Quantidade: {item.quantidade}</Text>
                  <Text style={styles.precoProduto}>
                    Preço unitário: R$ {parseFloat(item.preco_unitario).toFixed(2)}
                  </Text>
                  <Text style={styles.totalProduto}>
                    Total: R$ {(item.quantidade * parseFloat(item.preco_unitario)).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.botao} onPress={concluirPedido}>
              <Text style={styles.textoBotao}>Concluir Pedido</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text>Carregando pedido...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: cores.texto,
  },
  textoNegrito: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: cores.texto,
  },
  cardProduto: {
    flexDirection: "row",
    backgroundColor: cores.cardProdutos,
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
  },
  imagemProduto: {
    width: 100,
    height: 100,
  },
  infoCard: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  nomeProduto: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.texto,
    marginBottom: 4,
  },
  precoProduto: {
    fontSize: 14,
    color: cores.Preco,
  },
  totalProduto: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
    color: cores.texto,
  },
  botao: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  textoBotao: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
