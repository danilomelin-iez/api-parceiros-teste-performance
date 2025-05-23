import { group, sleep } from "k6";

// --- Configurações do Teste de Stress ---
export let options = {
  cloud: {
    // Opcional: Configurações para o Grafana Cloud k6
    projectID: "3770451", // Substitua, se aplicável
    name: "Teste Stress - Contratos API",
    tags: {
      ambiente: "homologacao", // Ou o ambiente de teste
      tipo_teste: "stress",
    },
  },

  executor: "ramping-vus",
  insecureSkipTLSVerify: true,

  stages: [
    // Fase 1: Aumento rápido para uma carga já alta (além do normal)
    { duration: "2m", target: 100 }, // Ex: Rampa para 100 VUs em 2 minutos
    { duration: "1m", target: 100 }, // Mantém por 1 minuto

    // Fase 2: Aumento ainda mais agressivo para VUs muito altos para causar stress
    { duration: "2m", target: 300 }, // Ex: Rampa para 300 VUs em 2 minutos
    { duration: "3m", target: 300 }, // Mantém por 3 minutos para observar o comportamento sob stress extremo

    // Fase 3: Aumento para o limite máximo que você quer testar ou até a falha
    { duration: "2m", target: 500 }, // Ex: Rampa para 500 VUs em 2 minutos (ou mais, ex: 800, 1000)
    { duration: "3m", target: 500 }, // Mantém por 3 minutos ou até o sistema falhar

    // Fase 4: Fase de Recuperação (opcional, mas recomendada pelo seu plano)
    // Reduz a carga drasticamente para observar se o sistema se recupera.
    { duration: "1m", target: 50 }, // Reduz para uma carga baixa
    { duration: "2m", target: 50 }, // Mantém para observar a recuperação
    { duration: "1m", target: 0 }, // Rampa para zero
  ],

  thresholds: {
    // Para testes de stress, os thresholds são menos sobre "passar/falhar"
    // e mais sobre observar o comportamento. No entanto, você pode definir
    // alguns para ajudar a identificar pontos críticos.
    // É esperado que alguns thresholds falhem, o que é parte do resultado do teste.

    // Exemplo: Queremos que a taxa de erro não exploda *muito* rapidamente,
    // mas esperamos que ela aumente significativamente.
    // 'http_req_failed': ['rate<0.5'], // Talvez até 50% de erro seja "aceitável" para *identificar* o stress

    // Exemplo: A duração das requisições vai aumentar, isso é esperado.
    // Este threshold provavelmente será violado e isso é informativo.
    http_req_duration: ["p(95)<5000"], // P95 abaixo de 5 segundos, mesmo sob stress

    // Checks podem começar a falhar mais frequentemente sob stress extremo
    checks: ["rate>=0.75"], // Pelo menos 75% dos checks devem passar, mesmo sob stress
  },

  // É comum que um teste de stress gere muitos erros.
  // A opção 'discardResponseBodies' pode ajudar a reduzir o consumo de memória no k6
  // se as respostas forem grandes e você não precisar delas para todos os VUs.
  // discardResponseBodies: true,
};

// --- Teste de cada Fluxo ---
export default function () {
  group("Stress API Contratos - Ler Dados Contrato", () => {
    lerDadosContrato();
  });

  group("Stress API Contratos - Ler Termos", () => {
    lerContratoTermos();
  });

  group("Stress API Contratos - Listar Cliente", () => {
    ListarContratoCliente();
  });

  group("Stress API Contratos - Ler Situação", () => {
    lerContratoSituacao();
  });

  group("Stress API Contratos - Ler Nota Fiscal Data", () => {
    lerContratoNotaFiscalData();
  });
}
