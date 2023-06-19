module.exports = {
  apps: [
    {
      name: "Scheduler Service",
      script: "./index.js",
      watch: true,
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
    },
  ],
};