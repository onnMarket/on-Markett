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

export default function Carrinho({ navigation }) {
  const [itens, setItens] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const [carrinhoId, setCarrinhoId] = useState(null);
  const [carregando, setCarregando] = useState(true);  // Estado de carregamento

  useEffect(() => {
    async function carregarUsuarioEItens() {
      try {
        const usuarioSalvo = await AsyncStorage.getItem("@usuario");
        const usuario = JSON.parse(usuarioSalvo);
        const id = usuario?.id;

        if (!id) {
          console.warn("Usuário não encontrado no AsyncStorage.");
          Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
          return;
        }

        setUsuarioId(id);

        const res = await axios.get(`https://on-markett-2.onrender.com/api/carrinho/${id}`);
        setCarrinhoId(res.data.carrinhoId);
        setItens(res.data.itens || []);
        setCarregando(false);  // Definir carregando como false após o carregamento do carrinho
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
        Alert.alert("Erro", "Não foi possível carregar o carrinho.");
        setCarregando(false);  // Definir carregando como false em caso de erro também
      }
    }

    const unsubscribe = navigation.addListener("focus", carregarUsuarioEItens);
    return unsubscribe;
  }, [navigation]);

  const calcularTotal = () => {
    return itens.reduce((total, item) => {
      const preco = item.Produto?.preco || 0;
      return total + preco * item.quantidade;
    }, 0);
  };

  const removerItem = async (produtoId) => {
    if (!carrinhoId) {
      Alert.alert("Erro", "Carrinho inválido.");
      return;
    }

    try {
      await axios.delete(`https://on-markett-2.onrender.com/api/carrinho/${carrinhoId}/${produtoId}`);
      setItens((prev) => prev.filter((item) => item.produtoId !== produtoId));
      Alert.alert("Sucesso", "Item removido do carrinho.");
    } catch (error) {
      console.error("Erro ao remover item:", error);
      Alert.alert("Erro", "Não foi possível remover o item.");
    }
  };

  const finalizarCompra = async () => {
    if (!usuarioId) {
      Alert.alert("Erro", "Usuário inválido.");
      return;
    }

    if (itens.length === 0) {
      Alert.alert("Carrinho vazio", "Adicione produtos antes de finalizar a compra.");
      return;
    }

    try {
      // Use a chamada correta de acordo com seu backend:
      await axios.post(`https://on-markett-2.onrender.com/api/carrinho/finalizar`, {
        compradorId: usuarioId,
        formaPagamento: "dinheiro", // adapte para permitir outras formas de pagamento
      });

      setItens([]);
      Alert.alert("Compra finalizada", "Obrigado pela sua compra!");
      // navigation.navigate("Home"); // opcional: redirecionar após compra
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      Alert.alert("Erro", error.response?.data?.error || "Não foi possível finalizar a compra.");
    }
  };

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {carregando ? (  // Mostrar o indicador de carregamento enquanto carregando
          <View style={estilos.carregandoContainer}>
            <ActivityIndicator size="large" color={cores.Preco} />
            <Text style={estilos.textoCarregando}>Carregando carrinho...</Text>
          </View>
        ) : itens.length === 0 ? (
          <Text style={{ textAlign: "center" }}>Carrinho vazio.</Text>
        ) : (
          itens.map((item) => (
            <View key={item.id} style={estilos.cardProduto}>
              {item.Produto?.foto ? (
                <Image
                  source={{
                    uri:
                      item.Produto.foto.length < 100
                        ? `https://drive.google.com/uc?export=view&id=${item.Produto.foto}`
                        : `data:image/jpeg;base64,${item.Produto.foto}`,
                  }}
                  style={estilos.imagemProduto}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    estilos.imagemProduto,
                    { backgroundColor: "#ccc", justifyContent: "center", alignItems: "center" },
                  ]}
                >
                  <Text>Sem imagem</Text>
                </View>
              )}
              <View style={estilos.infoCard}>
                <Text style={estilos.nomeProduto}>{item.Produto?.nome}</Text>
                <Text>Quantidade: {item.quantidade}</Text>
                <Text style={estilos.precoProduto}>
                  R$ {(item.Produto?.preco * item.quantidade).toFixed(2)}
                </Text>

                <TouchableOpacity
                  style={estilos.botaoRemover}
                  onPress={() =>
                    Alert.alert("Confirmar", "Deseja remover esse item do carrinho?", [
                      { text: "Cancelar", style: "cancel" },
                      { text: "Remover", onPress: () => removerItem(item.produtoId) },
                    ])
                  }
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {itens.length > 0 && (
          <>
            <Text style={estilos.total}>Total: R$ {calcularTotal().toFixed(2)}</Text>

            <TouchableOpacity
              style={estilos.botaoFinalizar}
              onPress={() =>
                Alert.alert("Finalizar Compra", `Total a pagar: R$ ${calcularTotal().toFixed(2)}\nConfirmar compra?`, [
                  { text: "Cancelar", style: "cancel" },
                  { text: "Confirmar", onPress: finalizarCompra },
                ])
              }
            >
              <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
                Finalizar Compra
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
  },
  carregandoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  textoCarregando: {
    marginTop: 10,
    fontSize: 16,
    color: cores.texto,
  },
  cardProduto: {
    backgroundColor: cores.cardProdutos,
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
    flexDirection: "row",
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
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    color: cores.texto,
  },
  precoProduto: {
    color: cores.Preco,
    fontSize: 13,
    marginBottom: 8,
  },
  botaoRemover: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  botaoFinalizar: {
    marginTop: 25,
    backgroundColor: "green",
    padding: 15,
    borderRadius: 8,
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 20,
    marginRight: 10,
  },
});
