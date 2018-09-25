module.exports = {
  verbose: true,
  testURL: "http://localhost/",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "json"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      "tsConfig": "tsconfig.json"
    }
  },
  testMatch: [
    "**/__tests__/*.+(ts|tsx|js)"
  ]
};
