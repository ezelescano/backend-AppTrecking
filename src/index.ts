import server from "./server";
import { swaggerDocs } from "./config/swagger";
import { PORT } from "./config/envs";

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  swaggerDocs(server, Number(PORT));
});
