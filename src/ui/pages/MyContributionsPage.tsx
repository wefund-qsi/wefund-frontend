import { Alert, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, Typography } from "@mui/material";
import { startTransition, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCampaignCollectedAmount, type Campaign } from "../../domain/campagns/entites/campaign";
import type { ViewCampaign } from "../../domain/campagns/uses-cases/view-campaign";
import type { RefundContribution } from "../../domain/contributions/uses-cases/refund-contribution";
import type { ViewUserContributions } from "../../domain/contributions/uses-cases/view-user-contributions";
import type { Contribution } from "../../domain/contributions/entities/contribution";
import type { UserId } from "../../domain/users/entities/user";
import RefundRequestForm from "../components/forms/RefundRequestForm";

type ContributionWithCampaign = {
  contribution: Contribution;
  campaign: Campaign | null;
};

interface MyContributionsPageProps {
  contributorId: UserId;
  viewCampaign: ViewCampaign;
  viewUserContributions: ViewUserContributions;
  refundContribution: RefundContribution;
}

function MyContributionsPage({
  contributorId,
  viewCampaign,
  viewUserContributions,
  refundContribution,
}: MyContributionsPageProps) {
  const { t } = useTranslation();
  const [items, setItems] = useState<ContributionWithCampaign[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [refundingContribution, setRefundingContribution] = useState<ContributionWithCampaign | null>(null);
  const [isRefunding, setIsRefunding] = useState(false);

  const loadContributions = useCallback(async () => {
    const contributions = await viewUserContributions.execute(contributorId);
    return Promise.all(
      contributions.map(async (contribution) => ({
        contribution,
        campaign: await viewCampaign.execute(contribution.campaignId),
      })),
    );
  }, [contributorId, viewCampaign, viewUserContributions]);

  useEffect(() => {
    let isMounted = true;

    void loadContributions().then((nextItems) => {
      if (!isMounted) {
        return;
      }

      startTransition(() => {
        setItems(nextItems);
      });
    });

    return () => {
      isMounted = false;
    };
  }, [loadContributions]);

  const handleRefund = async (contributionId: Contribution["id"]) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsRefunding(true);
      await new Promise<void>((resolve) => setTimeout(resolve, 5000));
      await refundContribution.execute(contributionId);
      setRefundingContribution(null);
      setSuccessMessage(t("contributions.refunded"));
      startTransition(() => {
        void loadContributions().then(setItems);
      });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsRefunding(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" fontWeight={700}>
        {t("contributions.title")}
      </Typography>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

      {items.length === 0 ? (
        <Typography color="text.secondary">{t("contributions.empty")}</Typography>
      ) : (
        <Grid container spacing={3}>
          {items.map(({ contribution, campaign }) => {
            const canEdit = campaign?.status === "ACTIVE";

            return (
              <Grid key={contribution.id} size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                        <Typography variant="h6" fontWeight={700}>
                          {campaign?.title ?? t("campaign.notFound")}
                        </Typography>
                        <Chip label={campaign?.status ?? "missing"} sx={{ textTransform: "capitalize" }} />
                      </Stack>

                      <Typography variant="body2" color="text.secondary">
                        {campaign?.description}
                      </Typography>

                      <Typography variant="body1">
                        {t("contributions.amount")}: {contribution.amount.toLocaleString()} EUR
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("contributions.createdAt")}: {new Date(contribution.createdAt).toLocaleDateString()}
                      </Typography>
                      {campaign ? (
                        <Typography variant="body2" color="text.secondary">
                          {t("contributions.campaignTotal")}: {getCampaignCollectedAmount(campaign).toLocaleString()} EUR
                        </Typography>
                      ) : null}

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                        <Button
                          color="error"
                          variant="outlined"
                          disabled={!canEdit}
                          onClick={() => setRefundingContribution({ contribution, campaign })}
                        >
                          {t("contributions.refund")}
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={refundingContribution !== null} onClose={() => setRefundingContribution(null)} fullWidth maxWidth="sm">
        <DialogTitle>{t("contributions.refundDialogTitle")}</DialogTitle>
        <DialogContent>
          {isRefunding ? (
            <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
              <CircularProgress />
              <Typography variant="body1">{t("contributions.processingRefund")}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t("contributions.processingHint")}
              </Typography>
            </Stack>
          ) : refundingContribution ? (
            <Stack spacing={3}>
              <Typography variant="body1">
                {t("contributions.refundDialogBody")}
              </Typography>
              <RefundRequestForm
                isSubmitting={isRefunding}
                errorMessage={errorMessage}
                onSubmit={async () => {
                  await handleRefund(refundingContribution.contribution.id);
                }}
              />
            </Stack>
          ) : null}
        </DialogContent>
        {!isRefunding ? (
          <DialogActions>
            <Button onClick={() => setRefundingContribution(null)}>{t("contributions.cancel")}</Button>
          </DialogActions>
        ) : null}
      </Dialog>
    </Stack>
  );
}

export default MyContributionsPage;
