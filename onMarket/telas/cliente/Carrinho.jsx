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
  const [carregando, setCarregando] = useState(true);

  // NOVO: cartões e cartão selecionado
  const [cartoes, setCartoes] = useState([]);
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null);
  const [carregandoCartoes, setCarregandoCartoes] = useState(false);

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

        setCarregando(true);
        const resCarrinho = await axios.get(
          `https://on-markett-2.onrender.com/api/carrinho/${id}`
        );
        setCarrinhoId(resCarrinho.data.carrinhoId);
        setItens(resCarrinho.data.itens || []);
        setCarregando(false);

        // Buscar cartões
        setCarregandoCartoes(true);
        const resCartoes = await axios.get(
          `https://on-markett-2.onrender.com/api/payment/listar/${id}`
        );
        setCartoes(resCartoes.data || []);
        setCarregandoCartoes(false);

        // Se tiver cartões, selecionar o primeiro por padrão
        if (resCartoes.data && resCartoes.data.length > 0) {
          setCartaoSelecionado(resCartoes.data[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Alert.alert("Erro", "Não foi possível carregar o carrinho ou cartões.");
        setCarregando(false);
        setCarregandoCartoes(false);
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
      await axios.delete(
        `https://on-markett-2.onrender.com/api/carrinho/${carrinhoId}/${produtoId}`
      );
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
      Alert.alert(
        "Carrinho vazio",
        "Adicione produtos antes de finalizar a compra."
      );
      return;
    }

    if (!cartaoSelecionado) {
      Alert.alert(
        "Cartão não selecionado",
        "Selecione um cartão para finalizar a compra."
      );
      return;
    }

    try {
      await axios.post(
        `https://on-markett-2.onrender.com/api/payment/finalizar`,
        {
          compradorId: usuarioId,
          formaPagamento: "cartao",
          pagamentoId: cartaoSelecionado,
        }
      );

      setItens([]);
      Alert.alert("Compra finalizada", "Obrigado pela sua compra!");
      // navigation.navigate("Home");
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Não foi possível finalizar a compra."
      );
    }
  };

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {carregando ? (
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
              <View style={estilos.infoCard}>
                <Text style={estilos.nomeProduto}>{item.Produto?.nome}</Text>
                <Text>Quantidade: {item.quantidade}</Text>
                <Text style={estilos.precoProduto}>
                  R$ {(item.Produto?.preco * item.quantidade).toFixed(2)}
                </Text>

                <TouchableOpacity
                  style={estilos.botaoRemover}
                  onPress={() =>
                    Alert.alert(
                      "Confirmar",
                      "Deseja remover esse item do carrinho?",
                      [
                        { text: "Cancelar", style: "cancel" },
                        {
                          text: "Remover",
                          onPress: () => removerItem(item.produtoId),
                        },
                      ]
                    )
                  }
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    Remover
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Mostrar cartões, total e botão finalizar APENAS se houver itens */}
        {itens.length > 0 && (
          <>
            {carregandoCartoes ? (
              <View style={{ marginTop: 20, alignItems: "center" }}>
                <ActivityIndicator size="small" color={cores.Preco} />
                <Text>Carregando cartões...</Text>
              </View>
            ) : cartoes.length === 0 ? (
              <Text
                style={{ marginTop: 20, textAlign: "center", color: "red" }}
              >
                Nenhum cartão cadastrado. Por favor, cadastre um cartão.
              </Text>
            ) : (
              <View style={{ marginTop: 20 }}>
                <Text
                  style={{
                    marginBottom: 8,
                    fontWeight: "bold",
                    color: cores.texto,
                  }}
                >
                  Selecione um cartão para pagamento:
                </Text>
                {cartoes.map((cartao) => (
                  <TouchableOpacity
                    key={cartao.id}
                    style={[
                      estilos.cartaoItem,
                      cartaoSelecionado === cartao.id &&
                        estilos.cartaoSelecionado,
                    ]}
                    onPress={() => setCartaoSelecionado(cartao.id)}
                  >
                    <Text style={{ color: cores.texto }}>
                      {`**** **** **** ${cartao.numeroCartao.slice(-4)} - ${
                        cartao.nomeTitular
                      }`}
                    </Text>
                    <Text style={{ color: cores.texto, fontSize: 12 }}>
                      {`Validade: ${cartao.validade}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={estilos.total}>
              Total: R$ {calcularTotal().toFixed(2)}
            </Text>

            <TouchableOpacity
              style={estilos.botaoFinalizar}
              onPress={() =>
                Alert.alert(
                  "Finalizar Compra",
                  `Total a pagar: R$ ${calcularTotal().toFixed(
                    2
                  )}\nConfirmar compra?`,
                  [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Confirmar", onPress: finalizarCompra },
                  ]
                )
              }
            >
              <Text
                style={{ color: "#fff", textAlign: "center", fontSize: 16 }}
              >
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
  cartaoItem: {
    backgroundColor: cores.cardProdutos,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  cartaoSelecionado: {
    borderWidth: 2,
    borderColor: cores.Preco,
  },
});
