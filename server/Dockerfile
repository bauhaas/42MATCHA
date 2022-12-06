FROM node:alpine3.11
WORKDIR /usr/code

# Install the faker package
COPY package*.json ./
RUN npm install

# Copy the code to the container
COPY . .

EXPOSE 3001
CMD ["npm", "run", "start:prod"]