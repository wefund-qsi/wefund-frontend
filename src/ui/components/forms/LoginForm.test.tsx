import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import LoginForm from "../../features/users/LoginForm";
import { AuthProvider } from "../../shared/modules/users/adapters/primary/useAuthProvider";
import "../../i18n";

const renderWithProviders = ({ initialRoute = "/" } = {}) => {
  return render(
    React.createElement(
      MemoryRouter as React.ElementType,
      { initialEntries: [initialRoute] },
      React.createElement(
        AuthProvider as React.ElementType,
        null,
        React.createElement(LoginForm as React.ElementType)
      )
    )
  );
};

describe("LoginForm", () => {
  const setup = () => {
    const user = userEvent.setup();
    renderWithProviders();
    return { user };
  };

  describe("rendu initial", () => {
    it("affiche le titre du formulaire", () => {
      setup();
      const allMatches = screen.getAllByText(/se connecter/i);
      expect(allMatches.length).toBeGreaterThanOrEqual(1);
    });

    it("affiche les champs username et password", () => {
      setup();
      expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    });

    it("affiche le bouton de soumission", () => {
      setup();
      expect(screen.getByRole("button", { name: /se connecter/i })).toBeInTheDocument();
    });

    it("affiche le lien vers la page d'inscription", () => {
      setup();
      expect(screen.getByRole("button", { name: /s'enregistrer/i })).toBeInTheDocument();
    });

    it("n'affiche pas d'alerte d'erreur au départ", () => {
      setup();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("validation", () => {
    it("affiche une erreur si le username est vide à la soumission", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: /se connecter/i }));

      await waitFor(() => {
        expect(screen.getByText("Le nom d'utilisateur est obligatoire")).toBeInTheDocument();
      });
    });

    it("affiche une erreur si le password est vide à la soumission", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: /se connecter/i }));

      await waitFor(() => {
        expect(screen.getByText("Le mot de passe est obligatoire")).toBeInTheDocument();
      });
    });

    it("affiche les deux erreurs quand le formulaire est entièrement vide", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: /se connecter/i }));

      await waitFor(() => {
        expect(screen.getByText("Le nom d'utilisateur est obligatoire")).toBeInTheDocument();
        expect(screen.getByText("Le mot de passe est obligatoire")).toBeInTheDocument();
      });
    });
  });

  describe("soumission", () => {
    it("affiche une erreur API si les identifiants sont incorrects", async () => {
      const { user } = setup();

      await user.type(screen.getByLabelText(/nom d'utilisateur/i), "mauvais");
      await user.type(screen.getByLabelText(/mot de passe/i), "mauvais");
      await user.click(screen.getByRole("button", { name: /se connecter/i }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(
          screen.getByText(/identifiants invalides/i)
        ).toBeInTheDocument();
      });
    });

    it("ne montre pas d'erreur API si les identifiants sont corrects", async () => {
      const { user } = setup();

      await user.type(screen.getByLabelText(/nom d'utilisateur/i), "alice");
      await user.type(screen.getByLabelText(/mot de passe/i), "secret");
      await user.click(screen.getByRole("button", { name: /se connecter/i }));

      await waitFor(() => {
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      });
    });
  });

  describe("visibilité du mot de passe", () => {
    it("le mot de passe est masqué par défaut", () => {
      setup();
      const input = screen.getByLabelText(/mot de passe/i);
      expect(input).toHaveAttribute("type", "password");
    });

    it("affiche le mot de passe quand on clique sur l'icône", async () => {
      const { user } = setup();
      const toggle = screen.getByRole("button", { name: /toggle password visibility/i });

      await user.click(toggle);

      expect(screen.getByLabelText(/mot de passe/i)).toHaveAttribute("type", "text");
    });

    it("re-masque le mot de passe au deuxième clic", async () => {
      const { user } = setup();
      const toggle = screen.getByRole("button", { name: /toggle password visibility/i });

      await user.click(toggle);
      await user.click(toggle);

      expect(screen.getByLabelText(/mot de passe/i)).toHaveAttribute("type", "password");
    });
  });
});