# Playwright MCP Server

This is a Model Context Protocol (MCP) server that provides tools for interacting with Playwright tests in this project.

## Tools

- `list_tests`: List all available Playwright test files in the `tests/` directory.
- `run_test`: Run a specific test file and get the output.

## Installation

```bash
cd mcp-server
npm install
npm run build
```

## Running

You can start the server using:

```bash
npm start
```

## Configuration for Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["/path/to/this/project/mcp-server/dist/index.js"]
    }
  }
}
```

Replace `/path/to/this/project` with the actual absolute path to this repository.
