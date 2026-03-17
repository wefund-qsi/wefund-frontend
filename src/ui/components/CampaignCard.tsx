import { Box, Card, CardActionArea, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCampaignCollectedAmount, getCampaignProgress, type Campaign } from "../../domain/campagns/entites/campaign";

interface CampaignCardProps {
  campaign: Campaign;
}

function CampaignCard({ campaign }: CampaignCardProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: "100%", bgcolor: "#606c38", color: "#fefae0" }}>
      <CardActionArea onClick={() => { void navigate(`/campaigns/${campaign.id}`); }} sx={{ height: "100%" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="h6" component="h2" fontWeight={700}>
              {campaign.title}
            </Typography>
            <Chip
              label={campaign.status}
              size="small"
              sx={{ bgcolor: "#fefae0", color: "#283618", textTransform: "capitalize" }}
            />
          </Stack>
          <Typography variant="body2" sx={{ flex: 1, color: "rgba(254, 250, 224, 0.86)" }}>
            {campaign.description}
          </Typography>
          <Box>
            <Typography variant="subtitle2">Objectif: {campaign.goal.toLocaleString()} EUR</Typography>
            <Typography variant="subtitle2">
              Collecte: {getCampaignCollectedAmount(campaign).toLocaleString()} EUR
            </Typography>
            <LinearProgress
              variant="determinate"
              value={getCampaignProgress(campaign)}
              sx={{
                mt: 1,
                height: 8,
                borderRadius: 999,
                bgcolor: "rgba(254, 250, 224, 0.25)",
                "& .MuiLinearProgress-bar": { bgcolor: "#fefae0" },
              }}
            />
            <Typography variant="caption">Fin: {campaign.endDate}</Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CampaignCard;
