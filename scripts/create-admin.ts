import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const EMAIL = "admin@lumina.store";
const PASSWORD = "lumina123";
const NAME = "Equipe LUMINA";

if (!url || !serviceKey) {
  console.error("Faltam variáveis de ambiente do Supabase.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const { data: existing } = await supabase.auth.admin.listUsers();
  let user = existing.users.find((u) => u.email === EMAIL);

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { name: NAME },
    });
    if (error) throw error;
    user = data.user;
    console.log("Usuário admin criado:", EMAIL);
  } else {
    console.log("Usuário admin já existia:", EMAIL);
  }

  if (!user) throw new Error("Falha ao obter usuário admin.");

  const { error: adminErr } = await supabase
    .from("admin_users")
    .upsert({ user_id: user.id }, { onConflict: "user_id" });
  if (adminErr) throw adminErr;

  console.log("Permissão de admin garantida para", EMAIL);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
