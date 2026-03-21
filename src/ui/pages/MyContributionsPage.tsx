import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [items, setItems] = useState<ContributionWithCampaign[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [refundingContribution, setRefundingContribution] = useState<ContributionWithCampaign | null>(null);
  const [isRefunding, setIsRefunding] = useState(false);

  const locale = i18n.language.startsWith("fr") ? "fr-FR" : "en-GB";

  const formatCurrency = useCallback((value: number) => (
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value)
  ), [locale]);

  const formatDate = useCallback((value: string) => (
    new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value))
  ), [locale]);

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

  const stats = useMemo(() => {
    const totalAmount = items.reduce((sum, { contribution }) => sum + contribution.amount, 0);
    const activeCount = items.filter(({ campaign }) => campaign?.status === "ACTIVE").length;
    const completedCount = items.filter(({ campaign }) => campaign?.status === "REUSSIE" || campaign?.status === "ECHOUEE").length;

    return {
      totalCount: items.length,
      totalAmount,
      activeCount,
      completedCount,
    };
  }, [items]);

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
    <Stack spacing={{ xs: 4, md: 5 }}>
      <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
        <Typography variant="overline" color="secondary.main">
          {t("contributions.eyebrow")}
        </Typography>
        <Typography variant="h1" component="h1" sx={{ fontSize: { xs: "2.4rem", md: "4rem" }, lineHeight: { xs: 1.03, md: 0.98 } }}>
          {t("contributions.title")}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85 }}>
          {t("contributions.description")}
        </Typography>
      </Stack>

      {items.length > 0 ? (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={(theme) => ({
                height: "100%",
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${theme.palette.background.paper} 100%)`,
                px: 2.5,
                py: 2.75,
              })}
            >
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.75 }}>
                {t("contributions.totalCount")}
              </Typography>
              <Typography variant="h2" component="p" sx={{ fontSize: { xs: "2.25rem", md: "2.75rem" }, lineHeight: 0.95 }}>
                {stats.totalCount}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              sx={(theme) => ({
                height: "100%",
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(180deg, ${alpha(theme.palette.secondary.main, 0.06)} 0%, ${theme.palette.background.paper} 100%)`,
                px: 2.5,
                py: 2.75,
              })}
            >
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.75 }}>
                {t("contributions.totalAmount")}
              </Typography>
              <Typography variant="h2" component="p" sx={{ fontSize: { xs: "2.05rem", md: "2.4rem" }, lineHeight: 0.95 }}>
                {formatCurrency(stats.totalAmount)}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              sx={(theme) => ({
                height: "100%",
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(180deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${theme.palette.background.paper} 100%)`,
                px: 2.5,
                py: 2.75,
              })}
            >
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.75 }}>
                {t("contributions.activitySummary")}
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="baseline" flexWrap="wrap">
                <Typography variant="h2" component="p" sx={{ fontSize: { xs: "2.05rem", md: "2.4rem" }, lineHeight: 0.95 }}>
                  {stats.activeCount}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {t("contributions.activeCount")}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  ·
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {stats.completedCount} {t("contributions.completedCount")}
                </Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      ) : null}

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

      {items.length === 0 ? (
        <Box
          sx={(theme) => ({
            borderRadius: 5,
            border: `1px dashed ${alpha(theme.palette.primary.main, 0.22)}`,
            background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${theme.palette.background.paper} 100%)`,
            px: { xs: 2.5, md: 3 },
            py: { xs: 3, md: 3.5 },
          })}
        >
          <Stack spacing={2}>
            <Typography color="text.secondary">{t("contributions.empty")}</Typography>
            <Button variant="contained" sx={{ alignSelf: "flex-start" }} onClick={() => { void navigate("/campaigns"); }}>
              {t("contributions.discoverCampaigns")}
            </Button>
          </Stack>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map(({ contribution, campaign }) => {
            const canEdit = campaign?.status === "ACTIVE";
            const statusLabel = campaign ? t(`campaign.statuses.${campaign.status}`) : t("campaign.notFound");

            return (
              <Grid key={contribution.id} size={{ xs: 12, md: 6, lg: 4 }}>
                <Card
                  sx={(theme) => ({
                    height: "100%",
                    borderRadius: 4,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    boxShadow: "0 14px 30px rgba(97, 95, 47, 0.06)",
                  })}
                >
                  <CardContent sx={{ p: 2.5, height: "100%" }}>
                    <Stack spacing={2.4} sx={{ height: "100%" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                        <Typography variant="h4" component="h2" sx={{ fontSize: "1.5rem" }}>
                          {campaign?.title ?? t("campaign.notFound")}
                        </Typography>
                        <Chip
                          label={statusLabel}
                          sx={(theme) => ({
                            textTransform: "none",
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            color: "text.primary",
                            borderRadius: 999,
                          })}
                        />
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.8,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {campaign?.description ?? t("contributions.campaignUnavailable")}
                      </Typography>

                      <Stack spacing={0.4}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {t("contributions.amount")}
                        </Typography>
                        <Typography
                          component="p"
                          sx={{
                            color: "text.primary",
                            fontFamily: "var(--font-family-heading)",
                            fontSize: { xs: "2rem", md: "2.2rem" },
                            lineHeight: 0.95,
                          }}
                        >
                          {formatCurrency(contribution.amount)}
                        </Typography>
                      </Stack>

                      <Grid container spacing={2}>
                        <Grid size={6}>
                          <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 0.35 }}>
                            {t("contributions.createdAt")}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600, lineHeight: 1.6 }}>
                            {formatDate(contribution.createdAt)}
                          </Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 0.35 }}>
                            {t("contributions.campaignTotal")}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600, lineHeight: 1.6 }}>
                            {campaign ? formatCurrency(getCampaignCollectedAmount(campaign)) : "—"}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ pt: 1, mt: "auto" }}>
                        {campaign ? (
                          <Button variant="text" onClick={() => { void navigate(`/campaigns/${campaign.id}`); }}>
                            {t("contributions.viewCampaign")}
                          </Button>
                        ) : null}
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

      <Dialog
        open={refundingContribution !== null}
        onClose={() => setRefundingContribution(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle sx={{ px: { xs: 3, md: 3.5 }, pt: { xs: 3, md: 3.5 }, pb: 1 }}>
          {t("contributions.refundDialogTitle")}
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 3, md: 3.5 }, pb: 1.5 }}>
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
              <Box
                sx={(theme) => ({
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.secondary.main, 0.06),
                  px: 2.25,
                  py: 2,
                })}
              >
                <Stack spacing={0.9}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {t("contributions.refundCampaign")}
                  </Typography>
                  <Typography variant="h4" component="p" sx={{ fontSize: "1.45rem" }}>
                    {refundingContribution.campaign?.title ?? t("campaign.notFound")}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {t("contributions.refundAmount", { amount: formatCurrency(refundingContribution.contribution.amount) })}
                  </Typography>
                </Stack>
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.85, color: "text.secondary" }}>
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
          <DialogActions sx={{ px: { xs: 3, md: 3.5 }, pb: { xs: 3, md: 3.5 }, pt: 1.5 }}>
            <Button onClick={() => setRefundingContribution(null)}>{t("contributions.cancel")}</Button>
          </DialogActions>
        ) : null}
      </Dialog>
    </Stack>
  );
}

export default MyContributionsPage;
