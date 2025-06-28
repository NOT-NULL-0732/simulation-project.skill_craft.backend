export const AppConfig = {
  db: {
    host: 'localhost',
    port: 5432,
    user: 'root',
    password: 'root',
    database: 'example',
    get connectionString() {
      return `postgres://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    },
  },
};
