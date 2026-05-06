import { NextRequest, NextResponse } from "next/server";
import { TOOLS, callTool } from "@/lib/mcp-tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROTOCOL_VERSION = "2024-11-05";

function jsonRpc(id: unknown, result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id, result });
}

function jsonRpcError(id: unknown, code: number, message: string) {
  return NextResponse.json({ jsonrpc: "2.0", id, error: { code, message } });
}

export async function POST(req: NextRequest) {
  const secret = process.env.MCP_SECRET;
  const provided = req.headers.get("x-api-key");

  if (!secret || provided !== secret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let body: { jsonrpc?: string; id?: unknown; method?: string; params?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return jsonRpcError(null, -32700, "Parse error");
  }

  // Notifications have no id — acknowledge and return
  if (body.id === undefined || body.id === null) {
    return new NextResponse(null, { status: 202 });
  }

  const { id, method, params = {} } = body;

  switch (method) {
    case "initialize":
      return jsonRpc(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: "idea-planner", version: "1.0.0" },
      });

    case "tools/list":
      return jsonRpc(id, { tools: TOOLS });

    case "tools/call": {
      const name = params.name as string | undefined;
      const args = (params.arguments ?? {}) as Record<string, unknown>;

      if (!name) return jsonRpcError(id, -32602, "params.name is required");

      const result = await callTool(name, args);
      return jsonRpc(id, result);
    }

    default:
      return jsonRpcError(id, -32601, `Method not found: ${method}`);
  }
}
