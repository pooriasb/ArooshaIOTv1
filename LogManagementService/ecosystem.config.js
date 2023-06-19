module.exports = {
  apps: [
    {
      name: "Log Service",
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