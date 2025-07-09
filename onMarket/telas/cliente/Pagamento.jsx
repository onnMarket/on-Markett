import { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cores from "../style/cores";
import { AntDesign } from "@expo/vector-icons";

export default function Pagamento({ navigation }) {
  const [itens, setItens] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const [carrinhoId, setCarrinhoId] = useState(null);
  const [aberto, setAberto] = useState(false);
  const [selecionado, setSelecionado] = useState(null);
  
  const opcoes = [
    {id: 1, label: 'Cartão de Débito'},
    {id: 2, label: 'Cartão de Crédito'},
    {id: 3, label: 'Pix'}
  ];

  const selecionar = (item) => {
    setSelecionado(item.label);
    setAberto(false);
  };

  useEffect(() => {
    async function carregarUsuarioEItens() {
      try {
        const usuarioSalvo = await AsyncStorage.getItem("@usuario");
        const usuario = JSON.parse(usuarioSalvo);
        const id = usuario?.id;

        if (!id) {
          Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
          return;
        }

        setUsuarioId(id);

        const res = await axios.get(`https://on-markett-2.onrender.com/api/carrinho/${id}`);
        setCarrinhoId(res.data.carrinhoId);
        setItens(res.data.itens || []);
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
        Alert.alert("Erro", "Não foi possível carregar o carrinho.");
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
      await axios.post(`https://on-markett-2.onrender.com/api/carrinho/finalizar`, {
        compradorId: usuarioId,
        formaPagamento: "dinheiro", // você pode modificar para permitir escolher a forma
      });

      setItens([]);
      Alert.alert("Compra finalizada", "Obrigado pela sua compra!");

      // Opcional: navegar para outra tela após finalizar
      // navigation.navigate("Home"); 
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      Alert.alert("Erro", error.response?.data?.error || "Não foi possível finalizar a compra.");
    }
  };

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {itens.length === 0 ? (
          <Text style={{ textAlign: "center" }}>Carrinho vazio.</Text>
        ) : (
          itens.map((item) => (
            <View key={item.id} style={estilos.cardProduto}>
              <Image
                source={{
                  uri:
                    item.Produto?.foto?.length < 100
                      ? `https://drive.google.com/uc?export=view&id=${item.Produto.foto}`
                      : `data:image/jpeg;base64,${item.Produto?.foto}`,
                }}
                style={estilos.imagemProduto}
                resizeMode="cover"
              />
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
                        { text: "Remover", onPress: () => removerItem(item.produtoId) },
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

        {itens.length > 0 && (
          <>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "right",
                marginTop: 20,
              }}
            >
              Total: R$ {calcularTotal().toFixed(2)}
            </Text>

            <TouchableOpacity
              style={estilos.botaoFinalizar}
              onPress={() =>
                Alert.alert(
                  "Finalizar Compra",
                  `Total a pagar: R$ ${calcularTotal().toFixed(2)}\nConfirmar compra?`,
                  [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Confirmar", onPress: finalizarCompra },
                  ]
                )
              }
            >
              <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }} /*navigation.navigate("Pagamentos") */>
                Finalizar Compra
              </Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Forma de pagamento:</Text>

            <TouchableOpacity
                style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#fff",
                }}
                onPress={() => setAberto(!aberto)}
            >
                <Text>{selecionado || "Clique para escolher"}</Text>
                <Text>{aberto ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            {aberto && (
                <View
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    backgroundColor: "#fff",
                    marginTop: 5,
                }}
                >
                {opcoes.map((item) => (
                    <TouchableOpacity
                    key={item.id}
                    style={{ padding: 12 }}
                    onPress={() => selecionar(item)}
                    >
                    <Text>{item.label}</Text>
                    </TouchableOpacity>
                ))}
                </View>
            )}

            <Text>Número do Cartão</Text> <TextInput></TextInput>
            <Text>Data de Validade</Text> <TextInput></TextInput>
            <Text>CVV</Text> <TextInput></TextInput>
            <Text>Número do Titular</Text> <TextInput></TextInput>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "right",
                marginTop: 20,
              }}
            >
              Total: R$ {calcularTotal().toFixed(2)}
            </Text>

            <TouchableOpacity style={estilos.botaoFinalizar}>Realizar Pedido</TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
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
});
