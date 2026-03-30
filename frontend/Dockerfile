FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci                    # ci = clean install, faster and more reliable than npm install

COPY . .
RUN npm run build             # produces a static /app/dist folder

# Second stage — tiny nginx image just to serve the built files
# The builder stage is discarded, keeping the final image small
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 3000

# Custom nginx config to serve on port 3000 and handle React routing
RUN echo 'server { listen 3000; location / { root /usr/share/nginx/html; try_files $uri /index.html; } }' \
  > /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
