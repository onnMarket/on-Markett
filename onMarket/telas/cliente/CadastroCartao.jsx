import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import cores from "../style/cores";

export default function CadastroCartao({ navigation }) {
  const [form, setForm] = useState({
    nomeTitular: "",
    numeroCartao: "",
    validade: "",
    codigoSeguranca: "",
    limite: "",
  });
  const [usuarioId, setUsuarioId] = useState(null);
  const [cartoes, setCartoes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cartaoEditando, setCartaoEditando] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("@usuario").then((res) => {
      const usuario = JSON.parse(res);
      setUsuarioId(usuario.id);
      carregarCartoes(usuario.id);
    });
  }, []);

  const carregarCartoes = async (id) => {
    try {
      const res = await axios.get(
        `https://on-markett-2.onrender.com/api/payment/listar/${id}`
      );
      setCartoes(res.data);
    } catch (error) {
      console.error("Erro ao carregar cartões:", error);
    }
  };

  const formatarNumeroCartao = (value) => {
    const numeros = value.replace(/\D/g, "").slice(0, 16);
    const partes = numeros.match(/.{1,4}/g);
    return partes ? partes.join(" ") : "";
  };

  const formatarValidade = (value) => {
    const numeros = value.replace(/\D/g, "").slice(0, 8);
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4)
      return numeros.slice(0, 2) + "/" + numeros.slice(2);
    return (
      numeros.slice(0, 2) +
      "/" +
      numeros.slice(2, 4) +
      "/" +
      numeros.slice(4, 8)
    );
  };

  const handleCadastrarCartao = async () => {
    if (
      !form.nomeTitular ||
      !form.numeroCartao ||
      !form.validade ||
      !form.codigoSeguranca ||
      !form.limite
    ) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      await axios.post(
        "https://on-markett-2.onrender.com/api/payment/cadastrar",
        {
          compradorId: usuarioId,
          ...form,
        }
      );

      Alert.alert("Sucesso", "Cartão cadastrado com sucesso!");
      setForm({
        nomeTitular: "",
        numeroCartao: "",
        validade: "",
        codigoSeguranca: "",
        limite: "",
      });
      carregarCartoes(usuarioId);
    } catch (err) {
      console.error("Erro ao cadastrar cartão:", err);
      Alert.alert("Erro", "Não foi possível cadastrar o cartão.");
    }
  };

  const handleExcluirCartao = async (cartaoId) => {
    try {
      await axios.delete(
        `https://on-markett-2.onrender.com/api/payment/deletar/${cartaoId}`
      );
      Alert.alert("Sucesso", "Cartão excluído com sucesso!");
      carregarCartoes(usuarioId);
    } catch (error) {
      console.error("Erro ao excluir cartão:", error);
      Alert.alert("Erro", "Não foi possível excluir o cartão.");
    }
  };

  const abrirModalEdicao = (cartao) => {
    setCartaoEditando(cartao);
    setForm({
      nomeTitular: cartao.nomeTitular,
      numeroCartao: formatarNumeroCartao(cartao.numeroCartao),
      validade: cartao.validade,
      codigoSeguranca: cartao.codigoSeguranca,
      limite: cartao.limite.toString(),
    });
    setModalVisible(true);
  };

  const handleSalvarEdicao = async () => {
    try {
      await axios.put(
        `https://on-markett-2.onrender.com/api/payment/editar/${cartaoEditando.id}`,
        {
          ...form,
          compradorId: usuarioId,
        }
      );

      Alert.alert("Sucesso", "Cartão atualizado com sucesso!");
      setModalVisible(false);
      setCartaoEditando(null);
      setForm({
        nomeTitular: "",
        numeroCartao: "",
        validade: "",
        codigoSeguranca: "",
        limite: "",
      });
      carregarCartoes(usuarioId);
    } catch (error) {
      console.error("Erro ao editar cartão:", error);
      Alert.alert("Erro", "Não foi possível atualizar o cartão.");
    }
  };

  const renderInput = (icon, placeholder, value, onChangeText, props = {}) => (
    <View style={styles.inputContainer}>
      <MaterialIcons name={icon} size={24} color={cores.texto} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Cadastrar Novo Cartão</Text>

      {renderInput("person", "Nome do Titular", form.nomeTitular, text => setForm({ ...form, nomeTitular: text }))}
      {renderInput("credit-card", "Número do Cartão", form.numeroCartao, text => setForm({ ...form, numeroCartao: formatarNumeroCartao(text) }), { keyboardType: "numeric", maxLength: 19 })}
      {renderInput("calendar-today", "Validade (DD/MM/AAAA)", form.validade, text => setForm({ ...form, validade: formatarValidade(text) }), { maxLength: 10 })}
      {renderInput("lock", "CVV", form.codigoSeguranca, text => setForm({ ...form, codigoSeguranca: text }), { keyboardType: "numeric", secureTextEntry: true, maxLength: 4 })}
      {renderInput("payments", "Limite", form.limite, text => setForm({ ...form, limite: text }), { keyboardType: "numeric" })}

      <TouchableOpacity style={styles.botaoSalvar} onPress={handleCadastrarCartao}>
        <Text style={styles.textoBotao}>Cadastrar Cartão</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Cartões Salvos</Text>
      {cartoes.map((cartao) => (
        <View key={cartao.id} style={styles.cartaoBox}>
          <Text style={styles.cartaoTexto}>
            **** **** **** {cartao.numeroCartao.slice(-4)} - {cartao.nomeTitular}
          </Text>
          <View style={styles.botoesAcao}>
            <TouchableOpacity style={styles.botaoEditar} onPress={() => abrirModalEdicao(cartao)}>
              <Text style={styles.botaoTexto}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoExcluir} onPress={() => handleExcluirCartao(cartao.id)}>
              <Text style={styles.botaoTexto}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.titulo}>Editar Cartão</Text>

            {renderInput("person", "Nome do Titular", form.nomeTitular, text => setForm({ ...form, nomeTitular: text }))}
            {renderInput("credit-card", "Número do Cartão", form.numeroCartao, text => setForm({ ...form, numeroCartao: formatarNumeroCartao(text) }), { keyboardType: "numeric", maxLength: 19 })}
            {renderInput("calendar-today", "Validade (DD/MM/AAAA)", form.validade, text => setForm({ ...form, validade: formatarValidade(text) }), { maxLength: 10 })}
            {renderInput("lock", "CVV", form.codigoSeguranca, text => setForm({ ...form, codigoSeguranca: text }), { keyboardType: "numeric", secureTextEntry: true, maxLength: 4 })}
            {renderInput("payments", "Limite", form.limite, text => setForm({ ...form, limite: text }), { keyboardType: "numeric" })}

            <View style={styles.botoesAcao}>
              <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvarEdicao}>
                <Text style={styles.textoBotao}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalVisible(false)}>
                <Text style={styles.textoBotao}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: cores.Secundaria,
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: cores.texto,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.input,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '100%',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: cores.texto,
  },
  botaoSalvar: {
    backgroundColor: cores.botaoEnviar,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  textoBotao: {
    color: cores.textoClaro,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartaoBox: {
    backgroundColor: cores.impossibilitar,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cartaoTexto: {
    fontSize: 16,
    marginBottom: 10,
    color: cores.texto,
  },
  botoesAcao: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botaoEditar: {
    backgroundColor: cores.botaoEditar,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  botaoExcluir: {
    backgroundColor: cores.botaoDeletar,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  botaoCancelar: {
    backgroundColor: cores.botaoSair,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: cores.fundoPopup,
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
});
