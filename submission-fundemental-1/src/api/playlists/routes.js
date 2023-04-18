const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getSongByPlaylistIdHandler,
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postPlaylistIdSongHandler,
    options: {
      auth: 'openmusic_jwt'
    }

  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: 'openmusic_jwt'
    }

  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deleteSongByIdInPlaylistIdHandler,
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistHandler,
    options: {
      auth: 'openmusic_jwt'
    }

  },
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getActivitieByPlaylistIdHandler,
    options: {
      auth: 'openmusic_jwt'
    }
  }
]

module.exports = routes
