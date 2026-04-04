FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci                    # ci = clean install, faster and more reliable than npm install

COPY . .
RUN npm run build             # produces a static /app/dist folder

# Second stage — tiny nginx image just to serve the built files
# The builder stage is discarded, keeping the final image small
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
