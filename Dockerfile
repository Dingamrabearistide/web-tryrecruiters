FROM node:20-alpine AS builder
WORKDIR /app

# FIX DEFINITIF : on force pnpm 9.15.4, pas la latest 12
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

COPY pnpm-lock.yaml package.json ./
RUN pnpm install

COPY . .
RUN pnpm run build --configuration=production

FROM nginx:alpine
COPY --from=builder /app/dist/web-tryrecruiters/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
