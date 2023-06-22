module.exports = {
  apps: [
    {
      name: "Energy",
      script: "./index.js",
      watch: true,
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3006,
      },
    },
  ],
};