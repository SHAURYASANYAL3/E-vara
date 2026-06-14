import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!, // use Deno.env.get
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, // service role key
);

export default async (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401 },
    );
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401 },
    );
  }

  const user_id = user.id;

  const { error } = await supabase
    .from("account_deletion_requests")
    .insert({ user_id });

  if (error) {
    return new Response(JSON.stringify({ success: false, error }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
