module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     //  New features
        'fix',      //  Bug fixes
        'docs',     //  Documentation only changes
        'style',    //  Changes that do not affect the meaning of the code (white-space, formatting, etc.)
        'refactor', //  A code change that neither fixes a bug nor adds a feature
        'perf',     //  A code change that improves performance
        'test',     //  Adding missing tests or correcting existing tests
        'chore',    //  Changes to the build process or auxiliary tools and libraries
        'revert',   //  Reverting a previous commit
        'ci',       //  CI configuration files and scripts
        'build',    //  Changes that affect the build system or external dependencies
        'content',  //  Custom type for Fezcodex content
      ],
    ],
  },
};
