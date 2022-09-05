declare namespace NodeJS {
  export interface ProcessEnv {
    HOST: string;
    PORT: number;
    NODE_ENV: 'development' | 'testing' | 'staging' | 'production';

    MAIN_DATABASE: string;
    MAIN_DB_TYPE: string;
    MAIN_DB_HOST: string;
    MAIN_DB_PORT: number;
    MAIN_DB_USER: string;
    MAIN_DB_PASS: string;

    ENTITIES_ROOT_PATH: string;
    ENTITIES_EXTENSION: string;

    PLOP_EXECUTION: string;
  }
}
