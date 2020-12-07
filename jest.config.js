module.exports = {
    moduleFileExtensions: ["js", "json"],
    moduleDirectories: ["node_modules", 'src'],
    modulePaths: [
        "<rootDir>"
    ],
    transform: {
        '^.+\\.js?$': 'babel-jest'
    },
    moduleNameMapper: {
        '^@/components(.+)$': '<rootDir>/src/components$1',
        '^@/routes(.+)$': '<rootDir>/src/routes$1',
    },
    testMatch: [
        '<rootDir>/**/*.test.js',
    ],
    transformIgnorePatterns: ['<rootDir>/node_modules/']
};