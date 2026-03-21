import { Alert, Box, Button, Card, CardContent, CircularProgress, Container, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { CampaignId, getCampaignCollectedAmount, getCampaignProgress, getCampaignProgressForBar, type Campaign } from "../../domain/campagns/entites/campaign";
import type { ViewCampaign } from "../../domain/campagns/uses-cases/view-campaign";
import type { BankPaymentFormValues } from "../components/forms/BankPaymentForm";
import BankPaymentForm from "../components/forms/BankPaymentForm";
import type { FundCampaign } from "../../domain/contributions/uses-cases/fund-campaign";
import type { UserId } from "../../domain/users/entities/user";

interface CampaignPaymentPageProps {
  contributorId: UserId;
  viewCampaign: ViewCampaign;
  fundCampaign: FundCampaign;
}

function CampaignPaymentPage({ contributorId, viewCampaign, fundCampaign }: CampaignPaymentPageProps) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    viewCampaign.execute(CampaignId(id)).then(setCampaign).catch(console.error);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [id, viewCampaign]);

  if (!campaign) {
    return <Typography variant="h5">{t("campaign.notFound")}</Typography>;
  }

  const handlePayment = async (values: BankPaymentFormValues) => {
    try {
      setErrorMessage(null);
      setIsProcessing(true);

      await new Promise<void>((resolve) => {
        timeoutRef.current = setTimeout(() => resolve(), 5000);
      });

      await fundCampaign.execute({
        campaignId: campaign.id,
        contributorId,
        amount: values.amount,
      });

      setPaymentSuccess(true);
      timeoutRef.current = setTimeout(() => {
        void navigate(`/campaigns/${campaign.id}`);
      }, 1400);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={{ xs: 4, md: 5 }}>
        <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
          <Typography variant="overline" color="secondary.main">
            {t("payment.eyebrow")}
          </Typography>
          <Typography variant="h1" component="h1" sx={{ fontSize: { xs: "2.35rem", md: "4rem" }, lineHeight: { xs: 1.03, md: 0.98 } }}>
            {t("payment.title")}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85 }}>
            {t("payment.subtitle")}
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="start">
          <Grid size={{ xs: 12, md: 7.25 }}>
            <Card
              sx={(theme) => ({
                borderRadius: 5,
                border: `1px solid ${theme.palette.divider}`,
                background: "linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(251,247,240,0.98) 100%)",
                boxShadow: "0 20px 46px rgba(97, 95, 47, 0.08)",
              })}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h3" component="h2" sx={{ fontSize: { xs: "1.9rem", md: "2.3rem" }, mb: 0.8 }}>
                      {t("payment.formTitle")}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                      {t("payment.formDescription")}
                    </Typography>
                  </Box>

                  {paymentSuccess ? <Alert severity="success">{t("payment.success")}</Alert> : null}

                  {isProcessing ? (
                    <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
                      <CircularProgress />
                      <Typography variant="body1">{t("payment.processing")}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("payment.processingHint")}
                      </Typography>
                    </Stack>
                  ) : (
                    <BankPaymentForm
                      defaultAmount={undefined}
                      isSubmitting={isProcessing}
                      onSubmit={handlePayment}
                      errorMessage={errorMessage}
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4.75 }}>
            <Card
              sx={(theme) => ({
                borderRadius: 5,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
                background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${theme.palette.background.paper} 100%)`,
                boxShadow: "0 18px 40px rgba(97, 95, 47, 0.08)",
              })}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2.5}>
                  <Button variant="text" onClick={() => { void navigate(`/campaigns/${campaign.id}`); }} sx={{ alignSelf: "flex-start", px: 0, color: "primary.main", fontWeight: 600 }}>
                    {t("payment.back")}
                  </Button>
                  <Box>
                    <Typography variant="h4" component="h2" sx={{ fontSize: "1.8rem", mb: 1 }}>
                      {campaign.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {campaign.description}
                    </Typography>
                  </Box>

                  <Box>
                    <Stack direction="row" spacing={1.2} alignItems="baseline" sx={{ mb: 1.2 }}>
                      <Typography
                        component="p"
                        sx={{
                          color: "text.primary",
                          fontFamily: "var(--font-family-heading)",
                          fontSize: { xs: "2.8rem", md: "3.6rem" },
                          lineHeight: 0.9,
                        }}
                      >
                        {getCampaignProgress(campaign)}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {t("payment.progressReached")}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={getCampaignProgressForBar(campaign)}
                      sx={{
                        mb: 2.2,
                        height: 10,
                        borderRadius: 999,
                        bgcolor: alpha("#615f2f", 0.14),
                        "& .MuiLinearProgress-bar": { bgcolor: "#615f2f" },
                      }}
                    />
                    <Stack spacing={1.4}>
                      <Box>
                        <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 0.35 }}>
                          {t("payment.currentFunding")}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 700 }}>
                          {getCampaignCollectedAmount(campaign).toLocaleString()} EUR
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 0.35 }}>
                          {t("payment.goal")}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 700 }}>
                          {campaign.goal.toLocaleString()} EUR
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}

export default CampaignPaymentPage;
