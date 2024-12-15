import { NextResponse } from "next/server";

// Reference the same simulated database
const apiKeys = [
  {
    id: "1",
    name: "default",
    key: "tvly-abcdefghijklmnopqrstuvwxyz123456",
    usage: 24,
  },
];

export async function GET(request, { params }) {
  const { id } = params;
  const key = apiKeys.find((k) => k.id === id);

  if (!key) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }

  return NextResponse.json(key);
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { name } = await request.json();

    const keyIndex = apiKeys.findIndex((k) => k.id === id);
    if (keyIndex === -1) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    // Update only the name, preserve other properties
    apiKeys[keyIndex] = {
      ...apiKeys[keyIndex],
      name,
    };

    return NextResponse.json(apiKeys[keyIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update API key" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const keyIndex = apiKeys.findIndex((k) => k.id === id);

  if (keyIndex === -1) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }

  apiKeys.splice(keyIndex, 1);
  return NextResponse.json({ success: true });
}
