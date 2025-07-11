import axios from "axios";
import { useEffect, useState } from "react";
import {
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

// Função para buscar o usuário pelo ID
const buscarUsuario = async (usuarioId) => {
  try {
    // Requisição para pegar os dados do usuário
    const response = await axios.get(`https://on-markett-2.onrender.com/api/users/${usuarioId}`);
    return response.data;  // Retorna o objeto de usuário diretamente
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw new Error("Não foi possível carregar as informações do usuário.");
  }
};

export default function DetalhesPedido({ route, navigation }) {
  const { pedidoId } = route.params;
  const [pedido, setPedido] = useState(null);
  const [itensComProdutos, setItensComProdutos] = useState([]);
  const [usuario, setUsuario] = useState(null); // Estado para armazenar os dados do usuário

  useEffect(() => {
    const carregarPedido = async () => {
      try {
        // Carregando o pedido
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

        // Carregar informações do usuário, utilizando o usuarioId do pedido
        if (pedidoData.compradorId) {
          const usuarioData = await buscarUsuario(pedidoData.compradorId);
          setUsuario(usuarioData);  // Atualiza o estado com os dados do usuário
        }
      } catch (error) {
        console.error("Erro ao carregar pedido ou produtos:", error);
        Alert.alert("Erro", "Erro ao carregar detalhes do pedido.");
      }
    };

    carregarPedido();  // Chama a função para carregar o pedido
  }, [pedidoId]); // Recarregar a cada mudança no pedidoId

  const concluirPedido = async () => {
    try {
      const res = await axios.patch(
        `https://on-markett-2.onrender.com/api/pedidos/${pedidoId}/status`
      );
      Alert.alert("Sucesso", res.data.message);
      navigation.goBack();  // Voltar para a tela anterior
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

            {/* Exibir o nome do usuário (cliente) */}
            {usuario ? (
              <Text style={styles.textoNegrito}>
                Nome do Cliente: {usuario.nome}
              </Text>
            ) : (
              <Text style={styles.textoNegrito}>Carregando nome do cliente...</Text>
            )}

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
              <Text style={styles.textoBotao}>Alterar Status</Text>
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
