FROM node:alpine3.11
WORKDIR /usr/code

# Copy the code to the container
COPY . .

# Install the faker package
COPY package*.json ./
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
