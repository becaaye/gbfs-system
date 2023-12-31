const config = {
    branches: ["main"],
    plugins: [
        "@semantic-release/release-notes-generator",
        "@semantic-release/github",
        "@semantic-release/npm",
        [
            "@semantic-release/git",
            {
                "assets": ["dist/*.js", "dist/*.map.js"],
                "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
            }
        ]
    ]
};

module.exports = config;