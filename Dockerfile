FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
COPY pnpm-lock.yaml package.json ./
RUN pnpm install
COPY . .
RUN npx ng build --configuration=production

FROM nginx:alpine
# Copie peu importe le nom exact du dossier dist
COPY --from=builder /app/dist /tmp/dist
RUN ls -R /tmp/dist && \
    if [ -d /tmp/dist/tryrecruiters-web/browser ]; then cp -r /tmp/dist/tryrecruiters-web/browser/* /usr/share/nginx/html/; \
    elif [ -d /tmp/dist/tryrecruiters-web ]; then cp -r /tmp/dist/tryrecruiters-web/* /usr/share/nginx/html/; \
    else cp -r /tmp/dist/*/browser/* /usr/share/nginx/html/ 2>/dev/null || cp -r /tmp/dist/*/* /usr/share/nginx/html/; fi && \
    ls -la /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
