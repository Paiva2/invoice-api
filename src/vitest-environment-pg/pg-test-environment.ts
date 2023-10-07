/* // Importe as bibliotecas necessárias
import { Environment } from "vitest";
import { execSync } from "child_process";

export default <Environment>  {
  name: "postgres",
  transformMode: "web",


  async setup() {
    return {
      async teardown() {
        execSync("concurrently \"cd ./src/vitest-environment-pg && docker-compose down --volumes --remove-orphans\"")
      },
    }
  },
};


 */