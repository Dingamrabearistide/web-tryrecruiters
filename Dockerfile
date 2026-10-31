FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_OPTIONS=--max-old-space-size=4096

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

COPY pnpm-lock.yaml package.json ./
RUN pnpm install

COPY . .

# Debug: voir ce qui existe avant build
RUN ls -la

RUN pnpm run build --configuration=production

# Debug: voir ce qui a été généré
RUN ls -la dist/ && ls -la dist/web-tryrecruiters/ || ls -la dist/ -R | head -n 100

FROM nginx:alpine
# Attention: vérifie le nom exact du dossier dans dist/
# Si ton projet s'appelle web-tryrecruiters, Angular 17+ génère /browser
COPY --from=builder /app/dist/web-tryrecruiters/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
