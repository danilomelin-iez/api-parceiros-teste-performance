import { lerDadosContrato } from "../lerDadosContrato.js";
import { lerContratoTermos } from "../lerContratoTermos.js";
import { ListarContratoCliente } from "../listarContratoCliente.js";
import { lerContratoSituacao } from "../lerContratoSituacao.js";
import { lerContratoNotaFiscalData } from "../fluxos/lerContratoNotaFiscalData.js";

import { group } from "k6";

// --- Configurações do Teste de Carga ---
export let options = {
  cloud: {
    projectID: "3770451",
    name: "GET - Contratos(Carga)",
    tags: {
      ambiente: "homologacao",
      tipo_teste: "carga",
    },
  },

  insecureSkipTLSVerify: true,
  executor: "ramping-vus",

  stages: [
    { duration: "1m", target: 10 },
    { duration: "3m", target: 20 },
    { duration: "1m", target: 0 },
  ],

  thresholds: {
    // 1. Taxa de Falha das Requisições HTTP:
    //   - Idealmente, deve ser o mais próximo de zero possível.
    //   - Um ponto de partida comum é não tolerar mais que 1-2% de falhas.
    http_req_failed: ["rate<0.02"], // Menos de 2% de todas as requisições podem falhar

    // 2. Duração das Requisições HTTP (Tempos de Resposta):
    //   - Foco nos percentis para capturar a experiência da maioria dos usuários.
    //   - Valores dependem muito do tipo de API, mas aqui estão alguns exemplos genéricos:
    http_req_duration: [
      "p(90)<800", // 90% das requisições devem ser concluídas em menos de 800 milissegundos
      "p(95)<1500", // 95% das requisições devem ser concluídas em menos de 1.5 segundos
      "p(99)<3000", // 99% das requisições devem ser concluídas em menos de 3 segundos
      // 'avg<500',   // Opcional: Tempo médio de resposta abaixo de 500ms (percentis são geralmente melhores)
    ],

    checks: ["rate>=0.98"], // Pelo menos 98% de todos os checks (se implementados) devem passar

    // 4. Volume Mínimo de Requisições (Opcional, para garantir que o teste rodou o suficiente):
    //   - Garante que o teste processou uma quantidade mínima de tráfego.
    //   - Ajuste o 'count' baseado na duração do seu teste e VUs.
    //     Para seus stages, algo como 1000 é um valor baixo, apenas para garantir que rodou.
    //     Se cada iteração faz 5 requests (pelos 5 groups), e você tem ~4000 iterações (estimativa),
    //     o total de requests seria ~20000.
    http_reqs: ["count>1000"], // Pelo menos 1000 requisições totais no teste
  },
};

// --- Teste de cada Fluxo ---
export default function () {
  group("Ler Dados Contrato", () => {
    lerDadosContrato();
  });

  group("Ler Contrato Termos", () => {
    lerContratoTermos();
  });

  group("Listar Contrato Cliente", () => {
    ListarContratoCliente();
  });

  group("Ler Contrato Situacao", () => {
    lerContratoSituacao();
  });

  group("Ler Contrato Nota Fiscal Data", () => {
    lerContratoNotaFiscalData();
  });
}
