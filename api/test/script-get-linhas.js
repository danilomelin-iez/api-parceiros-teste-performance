import http from "k6/http";
import { htmlReport } from "./bundle.js";
import { check, sleep } from "k6";
//import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
  vus: 10, // 10 usuários virtuais
  duration: "15s", // duração total do teste
  insecureSkipTLSVerify: true,
  cloud: {
    projectID: "3768735",
    // Test runs with the same name groups test runs together
    name: "Testes de GET Linhas",
  },
};

export default function () {
  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICItT3FMWGtCcWNUSWRUN05jMHN1bkxWcE9NRUFESWpVMFZtRmJfUDBEdGY0In0.eyJleHAiOjE3NDgwODYxMTEsImlhdCI6MTc0NzIyMjExMSwianRpIjoiMDI3OWNhN2UtNGRkNy00OTA0LWE5MGEtYjIyZmU5MjhhMDI5IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmllenRlbGVjb20ubmV0LmJyL3JlYWxtcy9pZXpUZWxlY29tIiwic3ViIjoiZmVjYzllM2EtZjliNi00MjhlLTgyNTctYzk4YjJmNzU1Mzg3IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWNlc3NvIiwic2lkIjoiYjlmNGE1ZjgtZmNhMS00MjM1LTliNzItMWE2MWI5M2JkMjJiIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIiXSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiY2xpZW50SG9zdCI6IjEyNy4wLjAuMSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicGFyY2Vpcm9fdXVpZCI6Ijg4MWZiMzRiLTI4OTQtNGFlYi05YjQ5LTVmNTcyYWU2MTI2NSIsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC1hY2Vzc28iLCJjbGllbnRBZGRyZXNzIjoiMTI3LjAuMC4xIiwiY2xpZW50X2lkIjoiYWNlc3NvIn0.bi6MTLC13UC77fO8WKEE7O2_OPwFu7uCDPvAXXtUMo62UugI2NU-FQX7jDzK88XGVUTNQV6XqrbIdOuZ8UKmERcwLlS1a-ohRea6CRTlTdFqrBQY9PPbHn3JL1UiF0T7HNcx-HoFNfDrP5cU73RTEHWd1hb8fb3tRluoGlGGtEDD7sidZ7PVfhXO9w7R4M_f3veG-ZSLVGmc5JL5hkOVkqmNkM3zYf3RTIMS8NEVbimPz5DJ3uKOVvescib0TnU520-rXIomlsTLw-UMKnXKxoxkRPL0R1Fst0ZVxBUBwmoL8VbWEpzKXlJMF4G0l3qLgKfT65lVg89xEiqrldN52A";

  // Array de objetos contendo o nome e a URL de cada requisição
  const requests = [
    {
      name: "Ler Linha",
      url: "https://api-teste.ieztelecom.net.br/api/v1/cliente/contrato/linha/930e6d95-47f7-4f9b-b3c7-26b78df45a73/consumo",
    },
    {
      name: "Ler Linha com Data",
      url: "https://api-teste.ieztelecom.net.br/api/v1/cliente/contrato/linha/930e6d95-47f7-4f9b-b3c7-26b78df45a73/consumo?data_inicial=2024-04-01&data_final=2024-04-24",
    },
    {
      name: "Ler Consumo Diario",
      url: "https://api-teste.ieztelecom.net.br/api/v1/cliente/contrato/linha/658629e4-6add-42ca-9ca9-83b66653a3d4/consumo_detalhado",
    },
    {
      name: "Ler Consumo Diario com Data",
      url: "https://api-teste.ieztelecom.net.br/api/v1/cliente/contrato/linha/658629e4-6add-42ca-9ca9-83b66653a3d4/consumo_detalhado?mes=2&ano=2025",
    },
    {
      name: "Ler Situacao Linha",
      url: "https://api-teste.ieztelecom.net.br/api/v1/cliente/contrato/linha/930e6d95-47f7-4f9b-b3c7-26b78df45a73/situacao",
    },
    {
      name: "Listar Historico de Ligacoes",
      url: "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df-trial/v1/cpf/52239872845",
    },
  ];

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  // Cria um array de requisições para o http.batch
  const batchRequests = requests.map((req) => ["GET", req.url, null, headers]);

  // Executa todas as requisições em batch
  const responses = http.batch(batchRequests);

  // Verifica o status de cada resposta usando o nome da requisição
  responses.forEach((res, index) => {
    check(res, {
      [`${requests[index].name}: status is 200`]: (r) => r.status === 200,
    });
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "relatorio.html": htmlReport(data),
  };
}
