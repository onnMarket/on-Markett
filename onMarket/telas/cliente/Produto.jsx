import { useState, useEffect } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cores from "../style/cores";

export default function Produto({ navigation, route }) {
  const { item } = route.params || {};
  const [quantidade, setQuantidade] = useState("1");
  const [compradorId, setCompradorId] = useState(route.params?.compradorId);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function buscarCompradorId() {
      if (!compradorId) {
        try {
          const usuarioSalvo = await AsyncStorage.getItem("@usuario");
          const usuario = JSON.parse(usuarioSalvo);
          if (usuario?.id) {
            setCompradorId(usuario.id);
          } else {
            Alert.alert("Erro", "Usuário não encontrado.");
          }
        } catch (e) {
          console.error("Erro ao carregar compradorId:", e);
          Alert.alert("Erro", "Falha ao carregar dados do usuário.");
        }
      }
    }

    buscarCompradorId();
  }, []);

  if (!item) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Produto não encontrado.</Text>
      </View>
    );
  }

  const adicionarAoCarrinho = async () => {
    const qtd = parseInt(quantidade);
    if (!qtd || isNaN(qtd) || qtd <= 0 || qtd > item.quantidade_estoque) {
      Alert.alert("Erro", "Digite uma quantidade válida e dentro do estoque.");
      return;
    }

    if (!compradorId) {
      Alert.alert("Erro", "ID do comprador não encontrado.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "https://on-markett-2.onrender.com/api/carrinho/adicionar",
        {
          compradorId,
          produtoId: item.id,
          quantidade: qtd,
        }
      );

      Alert.alert("Sucesso", "Produto adicionado ao carrinho!");
      navigation.navigate("Carrinho", { compradorId });
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Erro ao adicionar ao carrinho"
      );
    } finally {
      setLoading(false);
    }
  };

  const atualizarQuantidade = (valor) => {
    const numero = parseInt(valor.replace(/[^0-9]/g, ""));
    if (isNaN(numero)) {
      setQuantidade("");
    } else if (numero > item.quantidade_estoque) {
      setQuantidade(item.quantidade_estoque.toString());
    } else if (numero <= 0) {
      setQuantidade("1");
    } else {
      setQuantidade(numero.toString());
    }
  };

  const qtdAtual = parseInt(quantidade || "1");
  const estoqueMax = item.quantidade_estoque;

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
          <View style={styles.quantidadeContainer}>
            <TouchableOpacity
              style={[
                styles.botaoQtd,
                qtdAtual <= 1 && styles.botaoQtdDesabilitado,
              ]}
              onPress={() => {
                const novaQtd = Math.max(1, qtdAtual - 1);
                setQuantidade(novaQtd.toString());
              }}
              disabled={qtdAtual <= 1 || loading}
            >
              <Text
                style={[
                  styles.textoBotaoQtd,
                  qtdAtual <= 1 && styles.textoBotaoQtdDesabilitado,
                ]}
              >
                −
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.inputQuantidade}
              keyboardType="numeric"
              value={quantidade}
              onChangeText={atualizarQuantidade}
              editable={!loading}
            />

            <TouchableOpacity
              style={[
                styles.botaoQtd,
                qtdAtual >= estoqueMax && styles.botaoQtdDesabilitado,
              ]}
              onPress={() => {
                if (qtdAtual < estoqueMax) {
                  setQuantidade((qtdAtual + 1).toString());
                }
              }}
              disabled={qtdAtual >= estoqueMax || loading}
            >
              <Text
                style={[
                  styles.textoBotaoQtd,
                  qtdAtual >= estoqueMax && styles.textoBotaoQtdDesabilitado,
                ]}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: loading ? "#999" : "green",
              padding: 15,
              borderRadius: 8,
              opacity: loading ? 0.7 : 1,
            }}
            onPress={adicionarAoCarrinho}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Adicionar ao carrinho
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: cores.cardProdutos,
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
  descricaoProduto: {
    fontSize: 14,
    color: cores.texto,
    marginTop: 10,
    lineHeight: 20,
  },
  quantidadeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  botaoQtd: {
    backgroundColor: cores.mais_menos,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  botaoQtdDesabilitado: {
    backgroundColor: cores.impossibilitar,
    opacity: 0.6,
  },
  textoBotaoQtd: {
    fontSize: 20,
    fontWeight: "bold",
    color: cores.texto,
  },
  textoBotaoQtdDesabilitado: {
    color: cores.impossibilitar,
  },
  inputQuantidade: {
    borderWidth: 1,
    borderColor: cores.bordaTabela,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    minWidth: 50,
    textAlign: "center",
    backgroundColor: cores.cardProdutos,
  },
});
