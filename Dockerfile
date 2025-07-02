# ------------------------------
# Stage 1: Build with Node
# ------------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ project vào
COPY . .

# Build ứng dụng
RUN npm run build


# ------------------------------
# Stage 2: Serve bằng NGINX
# ------------------------------
FROM nginx:stable-alpine AS production

# Copy file cấu hình NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy file đã build từ stage trước
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose cổng mặc định
EXPOSE 80

# Run NGINX
CMD ["nginx", "-g", "daemon off;"]
