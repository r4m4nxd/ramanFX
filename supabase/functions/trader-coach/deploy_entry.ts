// Deploy entry for the edge function `trader-coach` (verify_jwt false; the function checks its own secret): it imports the
// reviewed source at ONE commit of github.com/r4m4nxd/ramanFX, so the deployed code is exactly what is on GitHub.
// To redeploy: push, put the new commit SHA below, deploy this file as index.ts (MCP deploy_edge_function).
import 'https://raw.githubusercontent.com/r4m4nxd/ramanFX/2ef73a1657627bf59792c758d05063c4e580826b/supabase/functions/trader-coach/index.ts';
