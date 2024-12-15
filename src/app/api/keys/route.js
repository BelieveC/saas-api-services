import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data: apiKeys, error } = await supabase
      .from("api_keys")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(apiKeys || []);
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json();

    // Check if name already exists
    const { data: existingKey, error: checkError } = await supabase
      .from("api_keys")
      .select("id")
      .ilike("name", name)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    if (existingKey) {
      return NextResponse.json(
        { error: "An API key with this name already exists" },
        { status: 409 }
      );
    }

    const newKey = {
      name,
      key: `tvly-${Array(32)
        .fill(0)
        .map(() => Math.random().toString(36)[2])
        .join("")}`,
      usage: 0,
    };

    const { data, error } = await supabase
      .from("api_keys")
      .insert([newKey])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating API key:", error);
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    const { error } = await supabase.from("api_keys").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting API key:", error);
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 }
    );
  }
}
