import { Box, Alert, Button } from "@mui/material";
import { useAtom } from "jotai";
import { messagesAtom } from "@/state/atoms";

type Props = {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

export default function LoadStatus({ loading, error, onRetry }: Props) {
  const [messages] = useAtom(messagesAtom);
  if (loading) {
    return (
      <Box sx={{ mb: 2, color: "text.secondary" }}>{messages.loading}</Box>
    );
  }

  if (error) {
    return (
      <Alert
        sx={{ mb: 2 }}
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            {messages.retry}
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return null;
}
