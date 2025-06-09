const SUPABASE_URL = "https://xqrgjcuglehopjksyyjt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcmdqY3VnbGVob3Bqa3N5eWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NjI0NzMsImV4cCI6MjA2NTAzODQ3M30.CkMkdfBQw0mfrhHuPmTwpmiSmBVU_gEp0K76tGcOs-0";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


document.addEventListener("DOMContentLoaded", async () => {
  try {
    const { data, error } = await supabase.from("burgers").select("*");

    if (error) {
      console.error("Erro ao conectar com Supabase:", error.message);
    } else {
      console.log("✅ Supabase conectado com sucesso!");
      console.log("🍔 Itens do cardápio:", data);
    }
  } catch (e) {
    console.error("Erro inesperado ao testar conexão com Supabase:", e);
  }
});