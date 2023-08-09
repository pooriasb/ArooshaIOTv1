module.exports = {
  apps: [
    {
      name: "Auth",
      script: "./index.js",
      watch: true,
      instances: "2",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3009,
      },
    },
  ],
};