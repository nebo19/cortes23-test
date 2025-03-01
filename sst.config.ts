/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'cortes23',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc('Vpc', {
      nat: 'ec2',
      bastion: true,
    });

    const database = new sst.aws.Aurora('Database', {
      engine: 'mysql',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      vpc,
    });

    const api = new sst.aws.ApiGatewayV1('Api');

    const mainHandler = new sst.aws.Function('MainHandler', {
      handler: './src/handlers/main.handler',
      link: [database],
      vpc,
    });

    api.route('POST /quote', mainHandler.arn);
    api.route('POST /validate', mainHandler.arn);

    api.deploy();

    return {
      databaseHost: database.host,
    };
  },
});
