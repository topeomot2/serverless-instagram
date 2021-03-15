module.exports = {
    testEnvironment: "node",
    testMatch: [
        '**/tests/**/*.spec.(ts|js)',
        '**/tests/**/*.test.(ts|js)'
      ],
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
  }