FROM node:18.12.1-bullseye AS base

LABEL Name=appointments-backend Version=1.0.0

EXPOSE 5000

ENV DEBIAN_FRONTEND=noninteractive

RUN   apt-get update && apt-get install -y --no-install-recommends \
        locales \
        tzdata \
        ca-certificates \
        libpq-dev \
        && echo "America/Mazatlan" > /etc/timezone \
        && dpkg-reconfigure -f noninteractive tzdata \
        && sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen \
        && echo 'LANG="en_US.UTF-8"'>/etc/default/locale \
        && dpkg-reconfigure --frontend=noninteractive locales \
        && update-locale LANG=en_US.UTF-8 \
        && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir /app && chown -R node:node /app

USER node

WORKDIR /app

COPY --chown=node:node package.json package-lock.json* ./

ENV PATH=/app/node_modules/.bin:$PATH

RUN npm install --no-optional && npm cache clean --force

CMD ["npm", "run", "dev"]

FROM base as prod

COPY --chown=node:node . ./

CMD ["npm", "run", "start"]
