FROM node:20-alpine AS builder

WORKDIR /app

# Installation de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copie des fichiers nécessaires
COPY pnpm-lock.yaml package.json ./
RUN pnpm install

# Copie du code source
COPY . .

# Build en production Angular
RUN pnpm run build --configuration=production

# Étape 2 – Serveur NGINX pour tester l'application
FROM nginx:stable-alpine

COPY --from=builder /app/dist/tryrecruiters-web/browser /usr/share/nginx/html
COPY nginx.testing.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
