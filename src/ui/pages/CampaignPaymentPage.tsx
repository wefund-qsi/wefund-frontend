import { Alert, Box, Button, Card, CardContent, CardHeader, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { CampaignId, getCampaignCollectedAmount, type Campaign } from "../../domain/campagns/entites/campaign";
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
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Button variant="text" onClick={() => { void navigate(`/campaigns/${campaign.id}`); }} sx={{ alignSelf: "flex-start" }}>
          {t("payment.back")}
        </Button>

        <Card>
          <CardHeader
            title={t("payment.title")}
            subheader={t("payment.subtitle")}
          />
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" fontWeight={700}>{campaign.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {campaign.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {t("payment.currentFunding")}: {getCampaignCollectedAmount(campaign).toLocaleString()} EUR
                </Typography>
                <Typography variant="body2">
                  {t("payment.goal")}: {campaign.goal.toLocaleString()} EUR
                </Typography>
              </Box>

              {paymentSuccess ? <Alert severity="success">{t("payment.success")}</Alert> : null}

              {isProcessing ? (
                <Stack spacing={2} alignItems="center" sx={{ py: 3 }}>
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
      </Stack>
    </Container>
  );
}

export default CampaignPaymentPage;
