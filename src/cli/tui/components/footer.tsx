import { Box, Text } from "ink";

import { useAgentLoop } from "../hooks/use-agent-loop";

export function Footer() {
  const { agent } = useAgentLoop();
  return (
    <Box paddingLeft={2}>
      <Text color={currentTheme.colors.secondaryText}>{agent.model.name}</Text>
    </Box>
  );
}
