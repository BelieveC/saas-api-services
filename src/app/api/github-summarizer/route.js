import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Extract API key from headers
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401 }
      );
    }

    // Validate API key
    const { data: keyData, error: keyError } = await supabase
      .from("api_keys")
      .select("id, usage")
      .eq("key", apiKey)
      .single();

    if (keyError || !keyData) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Get the request body
    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl) {
      return NextResponse.json(
        { error: "Repository URL is required" },
        { status: 400 }
      );
    }

    // Increment usage counter
    const { error: updateError } = await supabase
      .from("api_keys")
      .update({ usage: keyData.usage + 1 })
      .eq("id", keyData.id);

    if (updateError) {
      console.error("Error updating usage count:", updateError);
    }

    const readmeContent = await getReadmeContent(repoUrl);
    console.log(readmeContent);

    return NextResponse.json({
      summary: `Mock summary for ${repoUrl}`,
      message: "Repository successfully analyzed",
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getReadmeContent(repoUrl) {
  try {
    // Extract owner and repo name from URL
    const urlParts = repoUrl.replace(/\.git$/, "").split("/");
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];

    // Fetch readme content from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.raw",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch readme: ${response.statusText}`);
    }

    const content = await response.text();
    return content;
  } catch (error) {
    console.error("Error fetching readme:", error);
    throw new Error("Failed to fetch repository readme");
  }
}
