import http from "k6/http";
import { check, sleep, group } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  vus: 1000,
  iterations: 3500,
  thresholds: {
    http_req_duration: ["avg < 2000"],
    http_req_failed: ["rate < 0.1"],
  },
};

export default function () {
  const name = "morpheus";
  const job = "zion resident";
  group("Create with valid request should succees", function () {
    const FULL_URL = "https://reqres.in/api/users";
    const payload = JSON.stringify({
      name: name,
      job: job,
    });
    const params = {
      headers: { "Content-Type": "application/json" },
    };
    let res = http.post(FULL_URL, payload, params);
    check(res, {
      "response code is 201": (res) => res.status === 201,
    });
    check(res, {
      "response name should same with request name": (res) => {
        const response = JSON.parse(res.body);
        return response.name === name;
      },
    });
  });

  sleep(1);

  group("Update with valid request should succees", function () {
    const FULL_URL = "https://reqres.in/api/users/2";
    const payload = JSON.stringify({
      name: name,
      job: job,
    });
    const params = {
      headers: { "Content-Type": "application/json" },
    };
    let res = http.put(FULL_URL, payload, params);
    check(res, {
      "response code is 200": (res) => res.status === 200,
    });
    check(res, {
      "response name should same with request name": (res) => {
        const response = JSON.parse(res.body);
        return response.name === name;
      },
    });
    check(res, {
      "response name should same with request name": (res) => {
        const response = JSON.parse(res.body);
        return response.name === name;
      },
    });
  });
}
export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
