module.exports = {
  apps: [
    {
      name: "Influx",
      script: "./index.js",
      watch: true,
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3005,
      },
    },
  ],
};