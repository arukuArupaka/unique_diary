import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Gemini APIのキーとURL
const GEMINI_API_KEY = Deno.env.get("GOOGLE_API_KEY");
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { diaryText } = await req.json();
    if (!diaryText) {
      throw new Error("日記のテキストがありません。");
    }

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `あなたはプロの日記カウンセラーです。ユーザーの日記に対して、ポジティブで、共感的、かつ具体的なフィードバックを100文字程度で返してください。\n\n## ユーザーの日記:\n${diaryText}`,
            },
          ],
        },
      ],
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error.message || "Gemini APIでエラーが発生しました。"
      );
    }

    const responseData = await response.json();
    const feedback = responseData.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // ★★★ ここが修正された部分です ★★★
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    return new Response(
      JSON.stringify({ error: "An unknown error occurred" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
