// Deploy entry for the edge function `trader-coach` (verify_jwt false; the function checks its own secret): it imports the
// reviewed source at ONE commit of github.com/r4m4nxd/ramanFX, so the deployed code is exactly what is on GitHub.
// To redeploy: push, put the new commit SHA below, deploy this file as index.ts (MCP deploy_edge_function).
import 'https://raw.githubusercontent.com/r4m4nxd/ramanFX/626155937d0910c5815e585f3b99f7e90b845f4a/supabase/functions/trader-coach/index.ts';
