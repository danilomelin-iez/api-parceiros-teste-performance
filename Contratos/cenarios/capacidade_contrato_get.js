import { lerDadosContrato } from "../fluxos/lerDadosContrato_get.js";
import { lerContratoTermos } from "../fluxos/lerContratoTermos_get.js";
import { ListarContratoCliente } from "../fluxos/listarContratoCliente_get.js";
import { lerContratoSituacao } from "../fluxos/lerContratoSituacao_get.js";
import { lerContratoNotaFiscalData } from "../fluxos/lerContratoNotaFiscalData_get.js";

import { group } from "k6";

// --- Configurações do Teste de Capacidade ---
export let options = {
  cloud: {
    projectID: "3770451",
    name: "GET - Contratos(Capacidade)",
    tags: {
      ambiente: "homologacao",
      tipo_teste: "capacidade",
    },
  },

  executor: "ramping-vus",
  insecureSkipTLSVerify: true,

  stages: [
    // Começa com uma carga baixa para estabelecer uma linha de base
    { duration: "2m", target: 20 }, // 20 VUs por 2 minutos
    { duration: "1m", target: 20 }, // Mantém 20 VUs por mais 1 minuto (estabilização)

    // Aumenta gradualmente a carga em degraus
    { duration: "2m", target: 40 }, // Rampa para 40 VUs em 2 minutos
    { duration: "2m", target: 40 }, // Mantém 40 VUs por 2 minutos

    { duration: "2m", target: 60 }, // Rampa para 60 VUs em 2 minutos
    { duration: "2m", target: 60 }, // Mantém 60 VUs por 2 minutos

    { duration: "2m", target: 80 }, // Rampa para 80 VUs em 2 minutos
    { duration: "2m", target: 80 }, // Mantém 80 VUs por 2 minutos

    { duration: "2m", target: 100 }, // Rampa para 100 VUs em 2 minutos
    { duration: "2m", target: 100 }, // Mantém 100 VUs por 2 minutos

    // Continue adicionando mais stages com 'targets' progressivamente maiores
    // até onde você espera ou quer encontrar o limite.
    // Por exemplo: 150 VUs, 200 VUs, 250 VUs, etc.
    // A duração de cada stage pode ser ajustada (ex: 3-5 minutos para observar melhor).

    // { duration: '3m', target: 150 },
    // { duration: '3m', target: 150 },

    // { duration: '3m', target: 200 },
    // { duration: '3m', target: 200 },

    // Opcional: Um ramp-down no final, embora para testes de capacidade
    // o foco seja mais em encontrar o limite superior.
    { duration: "2m", target: 0 }, // Diminui para 0 VUs
  ],

  thresholds: {
    // Os thresholds aqui são definidos para identificar QUANDO a performance
    // se torna inaceitável. É esperado que alguns desses thresholds
    // FALHEM durante um teste de capacidade, pois isso ajuda a definir o limite.

    // Exemplo: Se o P95 do tempo de resposta exceder 2 segundos, consideramos degradado.
    http_req_duration: ["p(95)<2000"],

    // Exemplo: Se a taxa de erro exceder 5%, consideramos o sistema instável.
    http_req_failed: ["rate<0.05"],

    // Exemplo: Pelo menos 95% dos checks devem passar, mesmo sob carga.
    checks: ["rate>=0.95"],
  },
};

// --- Teste de cada Fluxo ---
export default function () {
  group("Fluxo Contrato - Leitura Dados Contrato", () => {
    lerDadosContrato();
  });

  group("Fluxo Contrato - Leitura Termos", () => {
    lerContratoTermos();
  });

  group("Fluxo Contrato - Listagem Cliente", () => {
    ListarContratoCliente();
  });

  group("Fluxo Contrato - Leitura Situação", () => {
    lerContratoSituacao();
  });

  group("Fluxo Contrato - Leitura Nota Fiscal Data", () => {
    lerContratoNotaFiscalData();
  });
}
