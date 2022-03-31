module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {

        'type-enum': [
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
        'footer-empty': [2, 'never'],
        'body-empty': [2, 'never'],
    },
};
