import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupForm from "./SignupForm";
import "../../../infrastructure/i18n";

describe("SignupForm", () => {
  const setup = () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup({ delay: null });
    render(<SignupForm onSubmit={onSubmit} />);
    return { onSubmit, user };
  };

  const fill = (prenom: string, nom: string, username: string, password: string) => {
    fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: prenom } });
    fireEvent.change(screen.getByLabelText(/^nom \*/i), { target: { value: nom } });
    fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), { target: { value: username } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: password } });
  };

  it("affiche les champs du formulaire", () => {
    setup();

    expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^nom \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /s'enregistrer/i })).toBeInTheDocument();
  });

  it("affiche les erreurs de validation quand on soumet un formulaire vide", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /s'enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText("Le prénom est obligatoire")).toBeInTheDocument();
    });
    expect(screen.getByText("Le nom est obligatoire")).toBeInTheDocument();
    expect(screen.getByText("Le nom d'utilisateur est obligatoire")).toBeInTheDocument();
    expect(screen.getByText("Le mot de passe est obligatoire")).toBeInTheDocument();
  });

  it("appelle onSubmit avec les données valides", async () => {
    const { onSubmit, user } = setup();

    fill("alice", "duval", "alice", "secret");
    await user.click(screen.getByRole("button", { name: /s'enregistrer/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        prenom: "alice",
        nom: "duval",
        username: "alice",
        password: "secret",
      });
    });
  });

  it("affiche une erreur si le nom d'utilisateur est trop court", async () => {
    const { user } = setup();

    fill("alice", "duval", "ab", "secret");
    await user.click(screen.getByRole("button", { name: /s'enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText("Le nom d'utilisateur doit contenir au moins 3 caractères")).toBeInTheDocument();
    });
  });

  it("affiche une erreur si le mot de passe est trop court", async () => {
    const { user } = setup();

    fill("alice", "duval", "alice", "abc");
    await user.click(screen.getByRole("button", { name: /s'enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText("Le mot de passe doit contenir au moins 6 caractères")).toBeInTheDocument();
    });
  });

  it("affiche un message de succès après soumission", async () => {
    const { user } = setup();

    fill("alice", "duval", "alice", "secret");
    await user.click(screen.getByRole("button", { name: /s'enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText("Inscription réussie !")).toBeInTheDocument();
    });
  });
});
