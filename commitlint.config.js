// commitlint.config.js
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'docs',
                'style',
                'refactor',
                'perf',
                'test',
                'chore',
                'content',
            ],
        ],
        'scope-enum': [
            2,
            'always',
            [
                'platform',
                'search',
                'ui',
                'api',
                'build',
                'docs',
                'content',
            ],
        ],
        'subject-case': [2, 'always', 'lower-case'],
        'subject-max-length': [2, 'always', 72],
        'body-max-line-length': [2, 'always', 100],
    },
}