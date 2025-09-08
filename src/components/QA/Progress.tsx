import { Box } from "@mui/material";
import { useAtom } from "jotai";
import { idxAtom, qaListAtom } from "@/state/atoms";

export default function Progress() {
  const [idx] = useAtom(idxAtom);
  const [data] = useAtom(qaListAtom);
  return (
    <Box sx={{ mt: 2, color: "text.secondary", fontSize: 12 }}>
      {idx + 1} / {data.length}
    </Box>
  );
}
