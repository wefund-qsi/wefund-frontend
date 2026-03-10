import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectCreationForm from "./ProjectCreationForm";
import "../../../infrastructure/i18n";

describe("ProjectCreationForm", () => {
  const setup = () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ProjectCreationForm onSubmit={onSubmit} />);
    return { onSubmit, user };
  };

  it("affiche les champs du formulaire", () => {
    setup();

    expect(screen.getByLabelText(/titre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/url de la photo/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enregistrer/i })).toBeInTheDocument();
  });

  it("affiche les erreurs de validation quand on soumet un formulaire vide", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText("Le titre est obligatoire")).toBeInTheDocument();
    });
    expect(screen.getByText("La description est obligatoire")).toBeInTheDocument();
    expect(screen.getByText("L'URL de la photo est obligatoire")).toBeInTheDocument();
  });

  it("affiche une erreur si l'URL est invalide", async () => {
    const { user } = setup();

    await user.type(screen.getByLabelText(/titre/i), "Mon projet");
    await user.type(screen.getByLabelText(/description/i), "Une belle description");
    await user.type(screen.getByLabelText(/url de la photo/i), "pas-une-url");
    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText("L'URL de la photo n'est pas valide")).toBeInTheDocument();
    });
  });

  it("appelle onSubmit avec les données valides", async () => {
    const { onSubmit, user } = setup();

    await user.type(screen.getByLabelText(/titre/i), "Mon projet");
    await user.type(screen.getByLabelText(/description/i), "Une belle description");
    await user.type(screen.getByLabelText(/url de la photo/i), "https://example.com/photo.jpg");
    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: "Mon projet",
        description: "Une belle description",
        photoUrl: "https://example.com/photo.jpg",
      });
    });
  });

  it("affiche un message de succès après soumission", async () => {
    const { user } = setup();

    await user.type(screen.getByLabelText(/titre/i), "Mon projet");
    await user.type(screen.getByLabelText(/description/i), "Une belle description");
    await user.type(screen.getByLabelText(/url de la photo/i), "https://example.com/photo.jpg");
    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText("Projet créé avec succès !")).toBeInTheDocument();
    });
  });
});