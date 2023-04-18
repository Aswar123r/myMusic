const path = require('path')

const Album = require('./api/albums')
const AlbumService = require('./services/postgres/AlbumService')
const AlbumValidator = require('./validator/Albums')

const Song = require('./api/songs')
const SongService = require('./services/postgres/SongService')
const SongValidator = require('./validator/songs')

const Playlist = require('./api/playlists')
const PlaylistService = require('./services/postgres/PlaylistService')
const PlaylistValidator = require('./validator/Playlists')

const user = require('./api/users')
const UserService = require('./services/postgres/UserService')
const UserValidator = require('./validator/Users')

const Collaboration = require('./api/collaborations')
const CollaborationService = require('./services/postgres/CollaborationService')
const CollaborationValidator = require('./validator/Collaborations')

const AuthenticationService = require('./services/postgres/AuthenticationService')
const AuthenticationValidator = require('./validator/Authentications')
const Authentication = require('./api/authentications')
const TokenManager = require('./tokenize/tokenManager')

const Export = require('./api/exports')
const ProducerService = require('./services/rabbitmq/ProducerService')
const ExportValidator = require('./validator/Exports')

const Upload = require('./api/uploads')
const StorageService = require('./services/storages/StorageService')
const UploadValidator = require('./validator/Uploads')

const LikeService = require('./services/postgres/LikeService')

const CacheService = require('./services/redis/CacheService')

const Cacheservice = new CacheService()
const Songservice = new SongService(Cacheservice)
const Albumservice = new AlbumService(Cacheservice)
const Userservice = new UserService()
const Authenticationservice = new AuthenticationService()
const Playlistservice = new PlaylistService(Cacheservice)
const Collaborationservice = new CollaborationService()
const Storageservice = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'))
const Likeservice = new LikeService(Cacheservice)

const modulePlugin = [
  {
    plugin: Authentication,
    options: {
      serviceUser: Userservice,
      serviceAuthentication: Authenticationservice,
      tokenManager: TokenManager,
      validator: AuthenticationValidator
    }
  },
  {
    plugin: Album,
    options: {
      service: Albumservice,
      validator: AlbumValidator,
      serviceLikeAlbum: Likeservice
    }
  },
  {
    plugin: Collaboration,
    options: {
      serviceCollaboration: Collaborationservice,
      validator: CollaborationValidator,
      servicePlaylist: Playlistservice,
      serviceUser: Userservice
    }
  },
  {
    plugin: Song,
    options: {
      service: Songservice,
      validator: SongValidator
    }
  },
  {
    plugin: Playlist,
    options: {
      servicePlaylist: Playlistservice,
      validator: PlaylistValidator,
      serviceCollaboration: Collaborationservice
    }
  },
  {
    plugin: user,
    options: {
      service: Userservice,
      validator: UserValidator
    }
  },
  {
    plugin: Upload,
    options: {
      serviceStorage: Storageservice,
      validator: UploadValidator,
      serviceAlbum: Albumservice
    }
  },
  {
    plugin: Export,
    options: {
      serviceRabbitMq: ProducerService,
      validator: ExportValidator,
      servicePlaylist: Playlistservice
    }
  }
]

module.exports = modulePlugin
