module.exports = {
  apps: [
    {
      name: "socket Service",
      script: "./index.js",
      watch: true,
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3004,
      },
    },
  ],
};