import { NextResponse } from "next/server";

// Simulated database using Map for mutable storage
const apiKeysMap = new Map([
  [
    "1",
    {
      id: "1",
      name: "default",
      key: "tvly-abcdefghijklmnopqrstuvwxyz123456",
      usage: 24,
    },
  ],
]);

export async function GET() {
  return NextResponse.json(Array.from(apiKeysMap.values()));
}

export async function POST(request) {
  try {
    const { name } = await request.json();
    const newKey = {
      id: Date.now().toString(),
      name,
      key: `tvly-${Array(32)
        .fill(0)
        .map(() => Math.random().toString(36)[2])
        .join("")}`,
      usage: 0,
    };
    apiKeysMap.set(newKey.id, newKey);
    return NextResponse.json(newKey);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  apiKeysMap.delete(id);
  return NextResponse.json({ success: true });
}
