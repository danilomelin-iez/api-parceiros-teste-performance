import http from "k6/http";
import { check, sleep } from "k6";

export function lerContratoSituacao () {
  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICItT3FMWGtCcWNUSWRUN05jMHN1bkxWcE9NRUFESWpVMFZtRmJfUDBEdGY0In0.eyJleHAiOjE3NDgwODYxMTEsImlhdCI6MTc0NzIyMjExMSwianRpIjoiMDI3OWNhN2UtNGRkNy00OTA0LWE5MGEtYjIyZmU5MjhhMDI5IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmllenRlbGVjb20ubmV0LmJyL3JlYWxtcy9pZXpUZWxlY29tIiwic3ViIjoiZmVjYzllM2EtZjliNi00MjhlLTgyNTctYzk4YjJmNzU1Mzg3IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWNlc3NvIiwic2lkIjoiYjlmNGE1ZjgtZmNhMS00MjM1LTliNzItMWE2MWI5M2JkMjJiIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIiXSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiY2xpZW50SG9zdCI6IjEyNy4wLjAuMSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicGFyY2Vpcm9fdXVpZCI6Ijg4MWZiMzRiLTI4OTQtNGFlYi05YjQ5LTVmNTcyYWU2MTI2NSIsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC1hY2Vzc28iLCJjbGllbnRBZGRyZXNzIjoiMTI3LjAuMC4xIiwiY2xpZW50X2lkIjoiYWNlc3NvIn0.bi6MTLC13UC77fO8WKEE7O2_OPwFu7uCDPvAXXtUMo62UugI2NU-FQX7jDzK88XGVUTNQV6XqrbIdOuZ8UKmERcwLlS1a-ohRea6CRTlTdFqrBQY9PPbHn3JL1UiF0T7HNcx-HoFNfDrP5cU73RTEHWd1hb8fb3tRluoGlGGtEDD7sidZ7PVfhXO9w7R4M_f3veG-ZSLVGmc5JL5hkOVkqmNkM3zYf3RTIMS8NEVbimPz5DJ3uKOVvescib0TnU520-rXIomlsTLw-UMKnXKxoxkRPL0R1Fst0ZVxBUBwmoL8VbWEpzKXlJMF4G0l3qLgKfT65lVg89xEiqrldN52A";

  const url =
    "https://api-teste.ieztelecom.net.br/api/v1/cliente/contrato/56f85c9f-84dd-4194-8517-ef0eddfd0a69/situacao";

  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const res = http.get(url, params);

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
