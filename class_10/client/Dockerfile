FROM node:18-alpine AS builder
WORKDIR /app
ENV NODE_ENV=development

# Install dependencies (including dev deps needed for TypeScript build)
COPY package.json package-lock.json* ./
RUN npm install --no-audit --prefer-offline --include=dev

# Copy source and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
