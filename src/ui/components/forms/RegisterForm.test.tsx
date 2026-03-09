import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import RegisterForm from "../../features/users/RegisterForm";
import { AuthProvider } from "../../shared/modules/users/adapters/primary/useAuthProvider";
import "../../i18n";

const renderWithProviders = ({ initialRoute = "/register" } = {}) => {
  return render(
    React.createElement(
      MemoryRouter as React.ElementType,
      { initialEntries: [initialRoute] },
      React.createElement(
        AuthProvider as React.ElementType,
        null,
        React.createElement(RegisterForm as React.ElementType)
      )
    )
  );
};

describe("RegisterForm", () => {
  const setup = () => {
    const user = userEvent.setup();
    renderWithProviders();
    return { user };
  };

  describe("rendu initial", () => {
    it("affiche le titre du formulaire", () => {
      setup();
      expect(screen.getByText(/créer un compte/i)).toBeInTheDocument();
    });

    it("affiche les champs prénom, nom, username et password", () => {
      setup();
      expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^nom$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    });

    it("affiche le bouton de soumission", () => {
      setup();
      expect(screen.getByRole("button", { name: /s'enregistrer/i })).toBeInTheDocument();
    });

    it("affiche le lien vers la page de connexion", () => {
      setup();
      expect(screen.getByRole("button", { name: /se connecter/i })).toBeInTheDocument();
    });

    it("ne contient pas de champ rôle (rôle caché)", () => {
      setup();
      expect(screen.queryByLabelText(/rôle/i)).not.toBeInTheDocument();
    });

    it("n'affiche pas d'alerte d'erreur au départ", () => {
      setup();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("validation", () => {
    it("affiche une erreur si le prénom est vide", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: /s'enregistrer/i }));

      await waitFor(() => {
        expect(screen.getByText("Le prénom est obligatoire")).toBeInTheDocument();
      });
    });

    it("affiche une erreur si le nom est vide", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: /s'enregistrer/i }));

      await waitFor(() => {
        expect(screen.getByText("Le nom est obligatoire")).toBeInTheDocument();
      });
    });

    it("affiche une erreur si le username fait moins de 3 caractères", async () => {
      const { user } = setup();

      await user.type(screen.getByLabelText(/nom d'utilisateur/i), "ab");
      await user.click(screen.getByRole("button", { name: /s'enregistrer/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Le nom d'utilisateur doit contenir au moins 3 caractères")
        ).toBeInTheDocument();
      });
    });

    it("affiche une erreur si le username contient des caractères spéciaux", async () => {
      const { user } = setup();

      await user.type(screen.getByLabelText(/nom d'utilisateur/i), "ali ce!");
      await user.click(screen.getByRole("button", { name: /s'enregistrer/i }));

      await waitFor(() => {
        expect(
          screen.getByText(
            "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores"
          )
        ).toBeInTheDocument();
      });
    });

    it("affiche une erreur si le password fait moins de 6 caractères", async () => {
      const { user } = setup();

      await user.type(screen.getByLabelText(/mot de passe/i), "abc");
      await user.click(screen.getByRole("button", { name: /s'enregistrer/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Le mot de passe doit contenir au moins 6 caractères")
        ).toBeInTheDocument();
      });
    });

    it("affiche toutes les erreurs quand le formulaire est entièrement vide", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: /s'enregistrer/i }));

      await waitFor(() => {
        expect(screen.getByText("Le prénom est obligatoire")).toBeInTheDocument();
        expect(screen.getByText("Le nom est obligatoire")).toBeInTheDocument();
      });
    });
  });

  describe("soumission", () => {
    const fillForm = async (
      user: ReturnType<typeof userEvent.setup>,
      overrides: Partial<{
        prenom: string;
        nom: string;
        username: string;
        password: string;
      }> = {}
    ) => {
      const values = {
        prenom: "Alice",
        nom: "Duval",
        username: "alice_new",
        password: "secret123",
        ...overrides,
      };
      await user.type(screen.getByLabelText(/prénom/i), values.prenom);
      await user.type(screen.getByLabelText(/^nom$/i), values.nom);
      await user.type(screen.getByLabelText(/nom d'utilisateur/i), values.username);
      await user.type(screen.getByLabelText(/mot de passe/i), values.password);
    };

    it("soumet avec succès et ne montre pas d'alerte d'erreur", async () => {
      const { user } = setup();
      await fillForm(user);

      await user.click(screen.getByRole("button", { name: /s'enregistrer/i }));

      await waitFor(() => {
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      });
    });

    it("affiche une erreur API si le username est déjà pris", async () => {
      const { user } = setup();
      await fillForm(user, { username: "alice" });

      await user.click(screen.getByRole("button", { name: /s'enregistrer/i }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByText(/nom d'utilisateur est déjà pris/i)).toBeInTheDocument();
      });
    });
  });

  describe("visibilité du mot de passe", () => {
    it("le mot de passe est masqué par défaut", () => {
      setup();
      expect(screen.getByLabelText(/mot de passe/i)).toHaveAttribute("type", "password");
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