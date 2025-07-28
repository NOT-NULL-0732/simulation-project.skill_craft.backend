export const AppConfig = {
  db: {
    host: '192.168.1.51',
    port: 5432,
    user: 'user_AXKSXQ',
    password: 'password_8Xy5rT',
    database: 'mydb2',
    get connectionString() {
      return `postgres://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    },
  },
};
