// Deploy entry for the edge function `trader-coach` (verify_jwt false; the function checks its own secret): it imports the
// reviewed source at ONE commit of github.com/r4m4nxd/ramanFX, so the deployed code is exactly what is on GitHub.
// To redeploy: push, put the new commit SHA below, deploy this file as index.ts (MCP deploy_edge_function).
import 'https://raw.githubusercontent.com/r4m4nxd/ramanFX/cb255f377a93bbf50f5fc5faa081ea581c4f48a7/supabase/functions/trader-coach/index.ts';
