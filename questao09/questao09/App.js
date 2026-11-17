import { useState } from 'react';
import { StyleSheet, Text, Pressable, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const PRODUTOS = [
  { id: 1, nome: 'Sanduíche', preco: 8.0 },
  { id: 2, nome: 'Suco', preco: 5.0 },
  { id: 3, nome: 'Refrigerante', preco: 6.0 },
  { id: 4, nome: 'Salgado', preco: 7.5 },
  { id: 5, nome: 'Pão de queijo', preco: 4.5 },
];

function moeda(valor) {
  const [inteiro, decimal] = valor.toFixed(2).split('.');
  return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimal}`;
}

export default function App() {
  // Quantidade escolhida para cada produto antes de adicionar ao pedido
  const [quantidades, setQuantidades] = useState({ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 });
  // Itens do pedido: array de objetos { id, nome, preco, quantidade }
  const [pedido, setPedido] = useState([]);
  const [finalizado, setFinalizado] = useState(false);
  const [erro, setErro] = useState('');

  function alterarQuantidade(id, delta) {
    const nova = Math.max(1, quantidades[id] + delta);
    setQuantidades({ ...quantidades, [id]: nova });
  }

  function adicionar(produto) {
    const quantidade = quantidades[produto.id];
    const existente = pedido.find((item) => item.id === produto.id);

    if (existente) {
      setPedido(
        pedido.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        )
      );
    } else {
      setPedido([...pedido, { ...produto, quantidade }]);
    }
    setQuantidades({ ...quantidades, [produto.id]: 1 });
    setErro('');
  }

  function remover(id) {
    setPedido(pedido.filter((item) => item.id !== id));
  }

  function finalizar() {
    if (pedido.length === 0) {
      setErro('Adicione pelo menos um item antes de finalizar o pedido.');
      return;
    }
    setErro('');
    setFinalizado(true);
  }

  function novoPedido() {
    setPedido([]);
    setFinalizado(false);
    setErro('');
  }

  const total = pedido.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  if (finalizado) {
    return (
      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        <StatusBar style="dark" />
        <Text style={styles.titulo}>Resumo do pedido</Text>
        <Text style={styles.subtitulo}>Pedido finalizado com sucesso.</Text>

        <View style={styles.cartao}>
          {pedido.map((item) => (
            <View key={item.id} style={styles.linhaResumo}>
              <Text style={styles.resumoItem}>
                {item.quantidade} × {item.nome} ({moeda(item.preco)})
              </Text>
              <Text style={styles.resumoValor}>{moeda(item.preco * item.quantidade)}</Text>
            </View>
          ))}
          <View style={styles.divisor} />
          <View style={styles.linhaResumo}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValor}>{moeda(total)}</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.botaoPrincipal, pressed && styles.pressionado]}
          onPress={novoPedido}
        >
          <Text style={styles.botaoTexto}>Novo pedido</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.titulo}>Lanchonete</Text>
      <Text style={styles.subtitulo}>Escolha a quantidade e adicione ao pedido.</Text>

      {PRODUTOS.map((produto) => (
        <View key={produto.id} style={styles.produto}>
          <View style={styles.produtoInfo}>
            <Text style={styles.produtoNome}>{produto.nome}</Text>
            <Text style={styles.produtoPreco}>{moeda(produto.preco)}</Text>
          </View>

          <View style={styles.seletor}>
            <Pressable style={styles.seletorBotao} onPress={() => alterarQuantidade(produto.id, -1)}>
              <Text style={styles.seletorTexto}>−</Text>
            </Pressable>
            <Text style={styles.seletorQtd}>{quantidades[produto.id]}</Text>
            <Pressable style={styles.seletorBotao} onPress={() => alterarQuantidade(produto.id, 1)}>
              <Text style={styles.seletorTexto}>+</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.botaoAdicionar, pressed && styles.pressionado]}
            onPress={() => adicionar(produto)}
          >
            <Text style={styles.botaoAdicionarTexto}>Adicionar</Text>
          </Pressable>
        </View>
      ))}

      <Text style={styles.secao}>Seu pedido</Text>

      {pedido.length === 0 && (
        <Text style={styles.vazio}>Nenhum item ainda. Toque em "Adicionar" em um produto.</Text>
      )}

      {pedido.map((item) => (
        <View key={item.id} style={styles.itemPedido}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemNome}>
              {item.quantidade} × {item.nome}
            </Text>
            <Text style={styles.itemSubtotal}>
              Subtotal: {moeda(item.preco * item.quantidade)}
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.botaoRemover, pressed && styles.pressionado]}
            onPress={() => remover(item.id)}
          >
            <Text style={styles.botaoRemoverTexto}>Remover</Text>
          </Pressable>
        </View>
      ))}

      <View style={styles.totalLinha}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValor}>{moeda(total)}</Text>
      </View>

      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

      <Pressable
        style={({ pressed }) => [styles.botaoPrincipal, pressed && styles.pressionado]}
        onPress={finalizar}
      >
        <Text style={styles.botaoTexto}>Finalizar pedido</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fdf8ee' },
  container: { padding: 24, paddingTop: 56, paddingBottom: 48 },
  titulo: { fontSize: 28, fontWeight: '700', color: '#3b2a0f' },
  subtitulo: { fontSize: 15, color: '#85703f', marginTop: 4, marginBottom: 24 },
  produto: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#efe3c8',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  produtoInfo: { flex: 1 },
  produtoNome: { fontSize: 16, fontWeight: '700', color: '#3b2a0f' },
  produtoPreco: { fontSize: 14, color: '#85703f', marginTop: 2 },
  seletor: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  seletorBotao: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#f3e7c9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seletorTexto: { fontSize: 18, fontWeight: '700', color: '#3b2a0f' },
  seletorQtd: { fontSize: 16, fontWeight: '600', color: '#3b2a0f', minWidth: 18, textAlign: 'center' },
  botaoAdicionar: {
    backgroundColor: '#c47a0e',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  botaoAdicionarTexto: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  pressionado: { opacity: 0.8 },
  secao: { fontSize: 20, fontWeight: '700', color: '#3b2a0f', marginTop: 24, marginBottom: 12 },
  vazio: { fontSize: 15, color: '#85703f' },
  itemPedido: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#efe3c8',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: 16, fontWeight: '600', color: '#3b2a0f' },
  itemSubtotal: { fontSize: 14, color: '#85703f', marginTop: 2 },
  botaoRemover: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#b3261e',
  },
  botaoRemoverTexto: { color: '#b3261e', fontSize: 14, fontWeight: '600' },
  totalLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1.5,
    borderTopColor: '#e2d3ae',
  },
  totalLabel: { fontSize: 18, fontWeight: '700', color: '#3b2a0f' },
  totalValor: { fontSize: 24, fontWeight: '700', color: '#c47a0e' },
  erro: { color: '#b3261e', marginTop: 12, fontSize: 14 },
  botaoPrincipal: {
    backgroundColor: '#c47a0e',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  botaoTexto: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  cartao: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#efe3c8',
  },
  linhaResumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    gap: 8,
  },
  resumoItem: { fontSize: 15, color: '#3b2a0f', flex: 1 },
  resumoValor: { fontSize: 15, fontWeight: '600', color: '#3b2a0f' },
  divisor: { height: 1.5, backgroundColor: '#e2d3ae', marginVertical: 10 },
});