import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "./bundle.js";
//import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
  vus: 10, // 10 usuários virtuais
  duration: "15s", // duração total do teste
  insecureSkipTLSVerify: true,
  cloud: {
    projectID: "3768735",
    // Test runs with the same name groups test runs together
    name: "Testes de carga-contratos",
  },
};
export default function () {
  const token = __ENV.TOKEN;

  const url =
    "https://api-teste.ieztelecom.net.br/api/v1/cliente/6b190b78-6431-471d-8ce6-c51246e37ade/contratos";

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const res = http.get(url, headers);

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "relatorio.html": htmlReport(data),
  };
}
