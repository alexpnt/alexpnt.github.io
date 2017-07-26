---
title: A brave new blog
date: 2017-07-01 13:37:48
tags:
- walkthrough
- hexo
---
I always enjoyed the idea of keeping a journal where ideas, tips and tricks from my daily life could be shared. With this first post I intend to move forward this goal. By sharing knowledge, you grow a bit and help others improve. It also helps you to keep motivated, giving you a sense of purpose since you feel that you are contributing to the community.

## The Hexo Framework


This site is built using the awesome [hexo framework](https://hexo.io/) with a slightly customized version of the [Cactus Dark](https://github.com/probberechts/cactus-dark)  theme. In the light of the open source  movement, you can find the [source code](https://github.com/AlexPnt/hexo-site) of this site in my github account.

The [hexo framework](https://hexo.io) is a fast and simple static site generator. Rather than generating dynamic content depending on the user request, a set of raw content is matched against a set of templates and styles to produce the final static content, that never changes over time. This has some advantages such as simplicity and speed, since there is no need to perform complex queries to complex backends to retrieve and build the content that the user is requesting. 



## Walkthrough

In order to get started you need to have the Node.js package manager ([npm](https://www.npmjs.com/)) and the version control system [git](https://git-scm.com/) installed.

__Setting up hexo:__


```bash
npm install hexo-cli -g
hexo init mysite
cd mysite
npm install
```

__Installing the cactus-dark theme:__
```bash
git clone https://github.com/probberechts/cactus-dark.git themes/cactus-dark
npm install hexo-pagination --save
```

In your config.yml file, change the theme setting:
```yaml
theme: cactus-dark
```

__Start serving your new site:__
```bash
hexo generate
hexo serve
```

Head over to http://localhost:4000 to see it in action! 
After this, go ahead and customize it to your needs. There is a basic folder structure that you have to keep in mind.  

```txt
├── _config.yml - (configuration settings) 
├── public      - (static files, which may be deployed to a live server)
├── scaffolds   - (pages and posts will be based on these scaffolds)
├── source      - (raw source content of your site)
└── themes      - (custom themes of your site)
```

For more details, head over to the great [hexo documentation](https://hexo.io/docs/).






