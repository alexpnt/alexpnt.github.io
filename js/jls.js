$("#lifestream").lifestream({
  limit: 500,
  list:[
  {
    service: 'github',
    user: 'alexpnt',
    template: {
      watchEvent: 'started watching <a href="http://github.com/${status.repo.name}">${status.repo.name}</a>',
      followEvent: 'started following <a href="http://github.com/${status.payload.target.login}">${status.payload.target.login}</a>',
      forkEvent: ' forked <a href="http://github.com/${status.repo.name}">${status.repo.name}</a>',
      createRepositoryEvent: 'created repository <a href="http://github.com/${status.repo.name}">${status.repo.name}</a>',
      createBranchEvent: 'created branch <a href="http://github.com/${status.repo.name}/tree/${status.payload.ref}">${status.payload.ref}</a> at <a href="http://github.com/${status.repo.name}">${status.repo.name}</a>',
      pushEvent: 'pushed to <a href="http://github.com/${status.repo.name}/tree/${status.payload.ref}">${status.payload.ref}</a> at <a href="http://github.com/${status.repo.name}">${status.repo.name}</a>'
    }
  },
  {
    service: 'quora',
    user: 'alexandre-pinto-3',
    template: {
      posted: '<a href="${link}">${title}</a>'
    }
  },
  {
    service: 'delicious',
    user: 'alexpnt',
    template: {
      bookmarked: 'bookmarked <a href="${u}">${d}</a>'
    }
  },
  {
    service: "twitter",
    user: 'alxpnto',
    template: {
      posted: '{{html tweet}}'
    }
  },
  {
    service: 'youtube',
    user: 'alexandpinto',
    template: {
      favorited: 'favorited <a href="${video.player.default}" title="${video.description}">${video.title}</a>'
    }
  },
  {
    service: 'lastfm',
    user: 'alexpnt',
    template: {
      loved: 'loved <a href="${url}">${name}</a> by <a href="${artist.url}">${artist.name}</a>'
    }
  }
]
});