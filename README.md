# Tavares · Dashboard

Painel de operações inspirado na referência visual fornecida: tema escuro, destaque amarelo, indicadores, gráfico de faturamento, status da operação, últimos pedidos e top produtos. Projeto independente, sem vínculo ou conexão com a Suprify.

## Abrir no computador

Baixe **somente `index.html`** e abra com dois cliques no navegador. O estilo e o JavaScript estão embutidos: não é necessário baixar outros arquivos. Você também pode usar **Code → Download ZIP**, extrair e abrir o HTML.

Ou inicie um servidor estático na raiz do projeto:

```sh
python3 -m http.server 8011 --bind 127.0.0.1
```

O site não precisa de instalação, build ou conexão à internet. Estilos, ícones e JavaScript estão dentro de `index.html`; as fontes são locais.

## Editar os valores

Clique no **pequeno ícone de olho no canto superior esquerdo**, acima do menu Dashboard. No celular, abra o menu lateral primeiro. Ele abre um editor discreto; não é um mecanismo de autenticação.

Você pode modificar:

- Faturamento Total, Pedidos no Período, Ticket Médio e Itens Despachados.
- Pedidos hoje e os nove status da operação.
- Total acumulado e valores diários ou mensais do gráfico.

Os períodos **7d, 30d e 12m** guardam indicadores independentes. Selecione o período antes de editar. O botão de cálculo do ticket divide o faturamento pelos pedidos. Uma série manual precisa ter 7, 30 ou 12 valores, separados por ponto e vírgula ou linha; seu total é calculado automaticamente. Sem série manual, o painel distribui o total em uma curva ilustrativa. Os indicadores manuais são independentes dos pedidos cadastrados. O simulador pode somar contribuições de demonstração separadamente, sem modificar esses valores originais.

## Simulador de vendas

Na tela **Pedidos**, clique em **Simular vendas**. Escolha de **1 a 500 pedidos**, informe a faixa de valores ou use os preços do catálogo, selecione os status e o ritmo: lote instantâneo, 0,5s, 1,5s, 3s ou **5s por pedido (padrão)**. Os atalhos preenchem lotes de 10, 30 ou 100 pedidos.

Durante a entrada em sequência, é possível pausar, continuar, encerrar e ligar/desligar o som. As notificações mostram cada nova entrada, a barra acompanha o progresso e o lote concluído tem um efeito visual que respeita a preferência por movimento reduzido. É possível navegar para o dashboard enquanto o simulador está rodando e controlar a execução pelo **olhinho no canto superior esquerdo → Simulador de vendas**. Essa seção fica recolhida dentro do editor, sem controle flutuante sobre o dashboard. Os botões de pausa e retomada também continuam no quadro do simulador na tela Pedidos. Fechar ou recarregar a página interrompe a geração; pedidos já criados ficam salvos.

A origem dos pedidos gerados é preservada internamente e na coluna **origem** do CSV, inclusive após recarregar ou restaurar um backup. As linhas da tabela exibem apenas os dados do pedido, sem etiqueta adicional; o status de pagamento aprovado aparece como **Pago**. Por padrão, contribuem para os indicadores, gráfico e status da operação. É possível desmarcar essa opção na configuração do lote. As contribuições são calculadas separadamente dos valores manuais. **Limpar simulações** remove os pedidos fictícios e essas contribuições, preservando os pedidos cadastrados manualmente e os valores originais do editor. Alterar o status de um pedido simulado recalcula sua contribuição. A simulação não movimenta estoque nem processa pagamentos.

O total de receita inclui pedidos simulados pagos, impressos, despachados, postados e entregues. Todos os status contam como pedidos; itens despachados incluem despachados, postados e entregues. O ticket é recalculado quando há simulações incluídas no período. A lista exibe até 50 registros por vez, com opção de carregar mais.

## Recursos

- **Catálogo:** cadastrar, editar, excluir e exportar produtos.
- **Importadores:** importar CSV e baixar modelo; SKUs repetidos são ignorados.
- **Fornecedores:** manter contatos e observações.
- **Pedidos:** cadastrar pedidos, vincular produtos e alterar status. Alimentam Últimos pedidos e Top produtos.
- **Integrações:** salvar atalhos para lojas e canais; não sincroniza contas externas.
- **Financeiro & PIX:** registrar movimentações, exportar CSV e guardar/copiar uma chave PIX. Não processa pagamentos.
- **Ferramentas:** calcular margem e preço sugerido, exportar indicadores e gerenciar backups JSON.
- **Tutoriais e Chamados:** orientações de uso e registro local de pendências.
- Busca por nome, SKU ou cliente; tema claro/escuro; perfil editável; layout responsivo.

**Os dados ficam no localStorage deste navegador e desta origem.** Não são compartilhados entre dispositivos ou usuários. Limpar os dados do navegador pode apagá-los. Faça backups em **Ferramentas → Backup e restauração**. Ao migrar do arquivo local para um endereço publicado, exporte e restaure o backup na nova origem. Não há backend, login, sincronização de vendas, integração logística ou recarga real.

## Publicar no GitHub Pages

Em **Settings → Pages**, selecione **Deploy from a branch → main → / (root)** e salve. O GitHub exibirá o endereço quando a publicação terminar. Todos os arquivos estáticos necessários estão na raiz.

## Testes de interface

O teste em `tests/smoke.cjs` usa Node.js, Playwright e Chromium. No ambiente de desenvolvimento em nuvem, eles já estão disponíveis. Com o servidor rodando na porta 8011:

```sh
node tests/smoke.cjs
node tests/standalone.cjs
node tests/simulation.cjs
```

É possível definir `TEST_URL` e `CHROMIUM_PATH`. O teste usa um navegador isolado e não altera os dados do seu navegador pessoal. Verifica edição e persistência dos indicadores, independência dos períodos, gráfico, cadastro de produtos e pedidos, importação/exportação, financeiro, fornecedores, canais, chamados, cálculo de margem, temas, backup/restauração, exclusão e uso no celular.

O teste `standalone.cjs` copia apenas o HTML para uma pasta isolada e carrega seu conteúdo com interceptação de navegação e rede desativada, verificando que nenhuma dependência externa é requisitada. O Chromium gerenciado do ambiente bloqueia URLs `file:`, então esse teste não executa navegação direta pelo sistema de arquivos.
