FROM sahoc-images.divista.huawei.com:80/k8s-dongguan-1/sahoc_nginx:v1.0.0

COPY ./websites/playground/dist /usr/share/nginx/webapp/app

COPY ./.sahoc/nginx.conf /etc/nginx/nginx.conf

RUN mkdir /etc/nginx/logs

RUN chmod -R 755 /usr/share/nginx/webapp/app

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]