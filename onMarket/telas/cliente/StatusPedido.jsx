import axios from "axios";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import cores from "../style/cores";

export default function StatusPedido({ route }) {
  const { pedidoId } = route.params;
  const [pedido, setPedido] = useState(null);
  const [itens, setItens] = useState([]);

  useEffect(() => {
    const carregarPedido = async () => {
      try {
        const resPedido = await axios.get(
          `https://on-markett-2.onrender.com/api/pedidos/${pedidoId}`
        );
        const dados = resPedido.data;

        const itensDetalhados = await Promise.all(
          dados.itens.map(async (item) => {
            const produtoRes = await axios.get(
              `https://on-markett-2.onrender.com/api/produtos/${item.produtoId}`
            );
            return {
              ...item,
              produto: produtoRes.data,
            };
          })
        );

        setPedido(dados);
        setItens(itensDetalhados);
      } catch (error) {
        console.error("Erro ao carregar pedido:", error);
        Alert.alert("Erro", "Não foi possível carregar o status do pedido.");
      }
    };

    carregarPedido();
  }, []);

  const calcularTotal = () => {
    return itens.reduce((total, item) => {
      return total + item.quantidade * parseFloat(item.preco_unitario);
    }, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {pedido ? (
          <>
            <Text style={styles.titulo}>
              Compra {pedido.id} - {new Date(pedido.data).toLocaleDateString()}:
            </Text>

            <View style={styles.listaProdutos}>
              {itens.map((item) => (
                <View key={item.id} style={styles.itemContainer}>
                  <Image
                    source={{
                      uri: item.produto.foto.length < 100
                        ? `https://drive.google.com/uc?export=view&id=${item.produto.foto}`
                        : `data:image/jpeg;base64,${item.produto.foto}`,
                    }}
                    style={styles.produtoImagem}
                  />
                  <View style={styles.infoProduto}>
                    <Text style={styles.produtoNome}>{item.produto.nome}</Text>
                    <Text style={styles.produtoDetalhe}>
                      Quantidade: {item.quantidade}
                    </Text>
                    <Text style={styles.produtoDetalhe}>
                      Preço unitário: R$ {parseFloat(item.preco_unitario).toFixed(2)}
                    </Text>
                    <Text style={styles.produtoSubtotal}>
                      Subtotal: R$ {(item.quantidade * parseFloat(item.preco_unitario)).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <Text style={styles.statusTitulo}>Status:</Text>
            <Text style={styles.statusTexto}>
              {pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}
            </Text>

            <Text style={styles.totalTitulo}>Total da compra:</Text>
            <Text style={styles.totalValor}>R$ {calcularTotal().toFixed(2)}</Text>
          </>
        ) : (
          <Text>Carregando...</Text>
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: cores.texto,
  },
  listaProdutos: {
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: cores.cardProdutos,
    borderRadius: 8,
    padding: 10,
  },
  produtoImagem: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  infoProduto: {
    flex: 1,
    justifyContent: "center",
  },
  produtoNome: {
    fontSize: 14,
    fontWeight: "bold",
    color: cores.texto,
  },
  produtoDetalhe: {
    fontSize: 12,
    color: cores.texto,
  },
  produtoSubtotal: {
    fontSize: 12,
    color: cores.texto,
    fontWeight: "bold",
    marginTop: 4,
  },
  statusTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.texto,
    marginTop: 10,
    marginBottom: 4,
  },
  statusTexto: {
    fontSize: 16,
    color: cores.texto,
    marginBottom: 15,
  },
  totalTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.texto,
  },
  totalValor: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginBottom: 20,
  },
});
