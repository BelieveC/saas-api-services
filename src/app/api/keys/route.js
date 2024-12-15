import { NextResponse } from "next/server";

// This is just a mock implementation. In a real application, you'd want to:
// 1. Use a proper database
// 2. Implement proper authentication
// 3. Add proper error handling
// 4. Use secure key generation

let apiKeys = [];

export async function GET() {
  return NextResponse.json(apiKeys);
}

export async function POST(request) {
  const body = await request.json();
  const newKey = {
    id: Date.now().toString(),
    name: body.name,
    key: `key_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };

  apiKeys.push(newKey);
  return NextResponse.json(newKey);
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  apiKeys = apiKeys.filter((key) => key.id !== id);
  return NextResponse.json({ success: true });
}
