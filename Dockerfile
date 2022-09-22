# base image
FROM node:18-alpine as build

# set working directory
WORKDIR /app

ADD . .

RUN npm i -g pnpm
RUN pnpm i

RUN pnpm build

FROM nginx:1.19-alpine

COPY nginx/templates /etc/nginx/templates/

COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]