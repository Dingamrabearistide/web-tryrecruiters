FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
COPY pnpm-lock.yaml package.json ./
RUN pnpm install
COPY . .
RUN npx ng build --configuration=production

FROM nginx:alpine
# On copie le dist et on trouve automatiquement le bon dossier browser
COPY --from=builder /app/dist /tmp/dist
RUN rm -rf /usr/share/nginx/html/* && \
    ls -R /tmp/dist && \
    BROWSER_DIR=$(find /tmp/dist -type d -name browser | head -n 1) && \
    if [ -n "$BROWSER_DIR" ]; then cp -r $BROWSER_DIR/* /usr/share/nginx/html/; else cp -r /tmp/dist/*/* /usr/share/nginx/html/; fi && \
    ls -lh /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
