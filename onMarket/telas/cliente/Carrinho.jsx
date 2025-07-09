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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cores from "../style/cores";

export default function Carrinho({ navigation }) {
  const [itens, setItens] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    async function carregarUsuarioEItens() {
      try {
        const usuarioSalvo = await AsyncStorage.getItem("@usuario");
        const usuario = JSON.parse(usuarioSalvo);
        const id = usuario?.id;

        if (!id) {
          console.warn("Usuário não encontrado no AsyncStorage.");
          return;
        }

        setUsuarioId(id);

        const res = await axios.get(`https://on-markett-2.onrender.com/api/carrinho/${id}`);
        setItens(res.data.itens || []);
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
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

  const removerItem = async (itemId) => {
    try {
      await axios.delete(`https://on-markett-2.onrender.com/api/carrinho/remover/${itemId}`);
      setItens((prev) => prev.filter((item) => item.id !== itemId));
      Alert.alert("Sucesso", "Item removido do carrinho.");
    } catch (error) {
      console.error("Erro ao remover item:", error);
      Alert.alert("Erro", "Não foi possível remover o item.");
    }
  };

  const finalizarCompra = async () => {
    try {
      // Aqui estamos simulando o POST para finalizar (adicione no seu backend depois)
      await axios.post(`https://on-markett-2.onrender.com/api/carrinho/finalizar/${usuarioId}`);
      setItens([]);
      Alert.alert("Compra finalizada", "Obrigado pela sua compra!");
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      Alert.alert("Erro", "Não foi possível finalizar a compra.");
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

                {/* Botão Remover */}
                <TouchableOpacity
                  style={estilos.botaoRemover}
                  onPress={() => removerItem(item.id)}
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

            {/* Botão Finalizar Compra */}
            <TouchableOpacity
              style={estilos.botaoFinalizar}
              onPress={finalizarCompra}
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
