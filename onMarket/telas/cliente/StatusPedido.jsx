// Tela: StatusPedido.js
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import axios from "axios";
import cores from "../style/cores";

export default function StatusPedido({ route }) {
  const { pedidoId } = route.params;
  const [pedido, setPedido] = useState(null);
  const [itens, setItens] = useState([]);

  useEffect(() => {
    const carregarPedido = async () => {
      try {
        const resPedido = await axios.get(`https://on-markett-2.onrender.com/api/pedidos/${pedidoId}`);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {pedido ? (
          <>
            <Text style={styles.titulo}>Compra {pedido.id} - {new Date(pedido.data).toLocaleDateString()}:</Text>

            <View style={styles.linhaProdutos}>
              {itens.map((item) => (
                <View key={item.id} style={{ alignItems: "center", marginRight: 15 }}>
                  <Image
                    source={{
                      uri: item.produto.foto.length < 100
                        ? `https://drive.google.com/uc?export=view&id=${item.produto.foto}`
                        : `data:image/jpeg;base64,${item.produto.foto}`,
                    }}
                    style={styles.produtoImagem}
                  />
                  <Text style={styles.produtoNome}>{item.produto.nome}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.statusTitulo}>Status:</Text>
            <Text style={styles.statusTexto}>{pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}</Text>
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
  linhaProdutos: {
    flexDirection: "row",
    marginBottom: 20,
  },
  produtoImagem: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  produtoNome: {
    fontSize: 12,
    marginTop: 5,
    color: cores.texto,
  },
  statusTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.texto,
    marginBottom: 4,
  },
  statusTexto: {
    fontSize: 16,
    color: cores.texto,
    marginBottom: 15,
  },
});