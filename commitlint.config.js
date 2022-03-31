module.exports = {
    extends: ['@commitlint/config-conventional'], 'type-enum': [
        2,
        'always',
        [
            'build',
            'chore',
            'improvement',
            'ci',
            'docs',
            'feat',
            'fix',
            'perf',
            'refactor',
            'revert',
            'style',
            'test',
        ],
    ],
};
