import http from "k6/http";
import { check, sleep } from "k6";
// A função handleSummary que gerava 'relatorio.html' foi removida
// pois o script principal (main.js) agora cuida da exportação do sumário
// para 'saida.json' e da geração do 'relatorio-ptbr.html'.

export const options = {
  vus: 10, // 10 usuários virtuais
  duration: "15s", // duração total do teste
};

export default function () {
  // Acessa as variáveis de ambiente injetadas pelo k6
  const token = __ENV.TOKEN;
  const url = __ENV.URL_CONTRATO;

  if (!token || !url) {
    console.error(
      "ERRO: As variáveis de ambiente TOKEN e URL_CONTRATO devem estar definidas."
    );
    return; // Interrompe a iteração se as variáveis não estiverem definidas
  }

  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const res = http.get(url, params);

  check(res, {
    "[API Test] status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
