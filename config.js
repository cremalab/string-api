module.exports = {
  test: {
    server: {
      host: '0.0.0.0',
      port: 7357
    },
    database: {
      host: '127.0.0.1',
      port: 27017,
      db: 'crema_il2',
      username: '',
      password: ''
    }
  },
  development: {
    server: {
      host: '0.0.0.0',
      port: 8000
    },
    database: {
      host: '127.0.0.1',
      port: 27017,
      db: 'crema_il2',
      username: '',
      password: ''
    }
  },
  production: {
    server: {
      host: '0.0.0.0',
      port: 8000
    },
    database: {
      host: '127.0.0.1',
      port: 27017,
      db: 'crema_il2',
      username: '',
      password: ''
    }
  }
};
