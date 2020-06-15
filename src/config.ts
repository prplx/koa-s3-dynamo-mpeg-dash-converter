import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export interface Config {
  port: number;
}

const config: Config = {
  port: +(process.env.PORT || 3000),
};

export default config;
