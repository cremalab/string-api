module.exports = {
  test: {
    server: {
      host: '0.0.0.0',
      port: 7357
    },
    database: {
      host: '127.0.0.1',
      port: 27017,
      db: 'crema_il2_test',
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
      port: process.env['PORT'],
      db: 'crema_il2',
      username: '',
      password: ''
    }
  },
  production: {
    uri: process.env['MONGOLAB_URI']
  }
};
