import { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import cores from "../style/cores";

export default function Carrinho({ navigation }) {
  const compradorId = 1; // substituir depois pelo ID real do usuário
  const [itens, setItens] = useState([]);

  useEffect(() => {
    async function carregarCarrinho() {
      try {
        const res = await axios.get(
          `https://on-markett-2.onrender.com/api/carrinho/${compradorId}`
        );
        setItens(res.data.itens || []);
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
      }
    }

    const unsubscribe = navigation.addListener("focus", carregarCarrinho);
    return unsubscribe;
  }, [navigation]);

  const calcularTotal = () => {
    return itens.reduce((total, item) => {
      const preco = item.Produto?.preco || 0;
      return total + preco * item.quantidade;
    }, 0);
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
              </View>
            </View>
          ))
        )}

        {itens.length > 0 && (
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
  },
});
