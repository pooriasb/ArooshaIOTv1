module.exports = {
  apps: [
    {
      name: "Log",
      script: "./index.js",
      watch: true,
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3008,
      },
    },
  ],
};