import { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import cores from "../style/cores";

export default function Produto({ navigation, route }) {
  const { item, compradorId } = route.params || {}; // <- compradorId vem da tela anterior
  const [quantidade, setQuantidade] = useState("");

  if (!item) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Produto não encontrado.</Text>
      </View>
    );
  }

  const adicionarAoCarrinho = async () => {
    if (!quantidade || isNaN(quantidade) || Number(quantidade) <= 0) {
      Alert.alert("Erro", "Digite uma quantidade válida");
      return;
    }

    try {
      await axios.post(
        "https://on-markett-2.onrender.com/api/carrinho/adicionarItem",
        {
          compradorId,
          produtoId: item.id,
          quantidade: parseInt(quantidade),
        }
      );

      Alert.alert("Sucesso", "Produto adicionado ao carrinho!");
      navigation.navigate("Carrinho", { compradorId }); // envia compradorId para o Carrinho também
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Erro ao adicionar ao carrinho"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.produtoContainer}>
        {item.foto ? (
          <Image
            source={{
              uri:
                item.foto.length < 100
                  ? `https://drive.google.com/uc?export=view&id=${item.foto}`
                  : `data:image/jpeg;base64,${item.foto}`,
            }}
            style={styles.imagemProduto}
            resizeMode="contain"
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
        <View style={{ padding: 20 }}>
          <Text style={styles.nomeProduto}>{item.nome}</Text>
          <Text style={styles.precoProduto}>
            R$
            {typeof item.preco === "number"
              ? item.preco.toFixed(2)
              : parseFloat(item.preco)?.toFixed(2) || "0.00"}
          </Text>
          <Text style={styles.quantidadeProduto}>
            Estoque: {item.quantidade_estoque}
          </Text>
          <Text style={styles.descricaoProduto}>{item.descricao}</Text>
          <Text style={{ marginTop: 15 }}>Quantidade</Text>
          <TextInput
            placeholder="0"
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 8,
              marginTop: 5,
            }}
          />

          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: "green",
              padding: 15,
              borderRadius: 8,
            }}
            onPress={adicionarAoCarrinho}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Adicionar ao carrinho
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  descricaoProduto: {
    fontSize: 14,
    color: cores.texto,
    marginTop: 10,
    lineHeight: 20,
  },
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
  },
  produtoContainer: {
    marginTop: 30,
  },
  imagemProduto: {
    width: "100%",
    height: 300,
    backgroundColor: "#fff",
  },
  nomeProduto: {
    fontSize: 20,
    fontWeight: "bold",
    color: cores.texto,
    marginBottom: 10,
  },
  precoProduto: {
    fontSize: 18,
    color: cores.Preco,
    marginBottom: 5,
  },
  quantidadeProduto: {
    fontSize: 14,
    color: "#777",
  },
});
