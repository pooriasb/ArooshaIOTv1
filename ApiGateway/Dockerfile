FROM mcr.microsoft.com/windows/servercore:ltsc2019
ENV NODE_ENV=production
WORKDIR E:\_PROJECt\ArooshaIOT\ApiGateway
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
RUN npm install
CMD ["node", "index.js"]
