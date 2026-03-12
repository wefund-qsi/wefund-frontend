import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";
import "../../../infrastructure/i18n";

describe("LoginForm", () => {
  const setup = () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<LoginForm onSubmit={onSubmit} />);
    return { onSubmit, user };
  };

  it("affiche les champs du formulaire", () => {
    setup();

    expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /se connecter/i })).toBeInTheDocument();
  });

  it("affiche les erreurs de validation quand on soumet un formulaire vide", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText("Le nom d'utilisateur est obligatoire")).toBeInTheDocument();
    });
    expect(screen.getByText("Le mot de passe est obligatoire")).toBeInTheDocument();
  });

  it("appelle onSubmit avec les données valides", async () => {
    const { onSubmit, user } = setup();

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), "alice");
    await user.type(screen.getByLabelText(/mot de passe/i), "secret");
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        username: "alice",
        password: "secret",
      });
    });
  });

  it("affiche une erreur si le nom d'utilisateur est trop court", async () => {
    const { user } = setup();

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), "ab");
    await user.type(screen.getByLabelText(/mot de passe/i), "secret");
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText("Le nom d'utilisateur doit contenir au moins 3 caractères")).toBeInTheDocument();
    });
  });

  it("affiche une erreur si le mot de passe est trop court", async () => {
    const { user } = setup();

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), "alice");
    await user.type(screen.getByLabelText(/mot de passe/i), "abc");
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText("Le mot de passe doit contenir au moins 6 caractères")).toBeInTheDocument();
    });
  });

  it("affiche un message de succès après soumission", async () => {
    const { user } = setup();

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), "alice");
    await user.type(screen.getByLabelText(/mot de passe/i), "secret");
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText("Connexion réussie !")).toBeInTheDocument();
    });
  });
});
