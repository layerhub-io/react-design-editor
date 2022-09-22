# base image
FROM node:18-alpine as build

# set working directory
WORKDIR /app

ADD . .

RUN pnpm i

RUN pnpm build

# start app
RUN yarn run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.19-alpine

COPY nginx/templates /etc/nginx/templates/

COPY --from=build /app/build /usr/share/nginx/html

# ENV SSH_HOST_BACKEND '3.90.105.241:8080'

CMD ["nginx", "-g", "daemon off;"]