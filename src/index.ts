import { app } from "./app";
import { AppDataSource } from "./data-source";



AppDataSource.initialize().then(() => {

  const server = app.listen(3333, () =>
    console.log("Rodando na porta 3333")
  );

})
