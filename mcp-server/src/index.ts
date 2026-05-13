import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

const execPromise = promisify(exec);

const server = new Server(
  {
    name: "playwright-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List all playwright tests
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_tests",
        description: "List all Playwright test files in the project",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "run_test",
        description: "Run a specific Playwright test file",
        inputSchema: {
          type: "object",
          properties: {
            testFile: {
              type: "string",
              description: "The name of the test file to run (e.g., login.spec.ts)",
            },
          },
          required: ["testFile"],
        },
      },
    ],
  };
});

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "list_tests") {
      const testsDir = path.join(process.cwd(), "..", "tests");
      const files = await fs.readdir(testsDir);
      const testFiles = files.filter(f => f.endsWith(".spec.ts") || f.endsWith(".spec.js"));
      
      return {
        content: [
          {
            type: "text",
            text: `Available tests:\n${testFiles.join("\n")}`,
          },
        ],
      };
    }

    if (name === "run_test") {
      const { testFile } = z.object({ testFile: z.string() }).parse(args);
      const testPath = path.join("tests", testFile);
      
      try {
        const { stdout, stderr } = await execPromise(`npx playwright test ${testPath}`, {
          cwd: path.join(process.cwd(), ".."),
        });
        
        return {
          content: [
            {
              type: "text",
              text: `Test execution finished:\n\nSTDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`,
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `Test execution failed:\n${error.message}\n\nSTDOUT:\n${error.stdout}\n\nSTDERR:\n${error.stderr}`,
            },
          ],
          isError: true,
        };
      }
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Playwright MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
