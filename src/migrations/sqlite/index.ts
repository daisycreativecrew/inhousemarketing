import * as migration_20261021_111905_initial from './20261021_111905_initial';

export const migrations = [
  {
    up: migration_20261021_111905_initial.up,
    down: migration_20261021_111905_initial.down,
    name: '20261021_111905_initial'
  },
];
