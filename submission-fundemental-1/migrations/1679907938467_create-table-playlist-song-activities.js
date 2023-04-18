exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      references: '"playlists"',
      onDelete: 'cascade'
    },
    song_id: {
      type: 'VARCHAR(50)',
      references: '"songs"',
      onDelete: 'cascade'
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: '"users"',
      onDelete: 'cascade'
    },
    action: {
      type: 'VARCHAR(7)',
      notNull: true
    },
    time: {
      type: 'TEXT'
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities')
}
