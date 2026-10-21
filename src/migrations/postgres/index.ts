import * as migration_20261021_111909_initial from './20261021_111909_initial';

export const migrations = [
  {
    up: migration_20261021_111909_initial.up,
    down: migration_20261021_111909_initial.down,
    name: '20261021_111909_initial'
  },
];
