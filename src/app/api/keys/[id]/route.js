import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const id = await params.id;
    const { data: key, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!key) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    return NextResponse.json(key);
  } catch (error) {
    console.error("Error fetching API key:", error);
    return NextResponse.json(
      { error: "Failed to fetch API key" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = await params.id;
    const { name } = await request.json();

    // Check if name already exists
    const { data: existingKey, error: checkError } = await supabase
      .from("api_keys")
      .select("id")
      .neq("id", id)
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

    const { data: updatedKey, error } = await supabase
      .from("api_keys")
      .update({ name })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!updatedKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    return NextResponse.json(updatedKey);
  } catch (error) {
    console.error("Error updating API key:", error);
    return NextResponse.json(
      { error: "Failed to update API key" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = await params.id;
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
