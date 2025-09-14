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
  redis: {
    port: 6379,
    host: '192.168.1.51',
    password: 'redis_3tASHP',
  },
  crypto: {
    key: Buffer.from("b0eb16bade17274dcb27326ba7c78b32f3779738975ae8f415c5b09ee0495c26", "hex"),
  }
};
