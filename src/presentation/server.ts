import express, { Router } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: Options) {
    this.port = options.port;
    this.routes = options.routes;
  }

  async start() {
    // Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(
      fileUpload({
        limits: { fileSize: 1000 * 1024 * 1024 }, // 1GB
      })
    );

    //routes
    this.app.use(this.routes);

    // Start server
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
