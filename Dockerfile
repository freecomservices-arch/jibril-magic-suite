# Étape 1 : Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer les dépendances (sans legacy-peer-deps)
RUN npm ci

# Copier le reste des fichiers
COPY . .

# Argument pour l'URL de l'API (optionnel)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Builder l'application
RUN npm run build

# Étape 2 : Serveur
FROM nginx:alpine

# Copier le build depuis l'étape précédente
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
