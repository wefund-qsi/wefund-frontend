import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectCreationForm from "./ProjectCreationForm";
import "../../../infrastructure/i18n";

describe("ProjectCreationForm", () => {
  const setup = () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup({ delay: null });
    render(<ProjectCreationForm onSubmit={onSubmit} />);
    return { onSubmit, user };
  };

  const fill = (titre: string, description: string, photoUrl: string) => {
    fireEvent.change(screen.getByLabelText(/titre/i), { target: { value: titre } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: description } });
    fireEvent.change(screen.getByLabelText(/url de la photo/i), { target: { value: photoUrl } });
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

  it("affiche une erreur si la description est trop courte", async () => {
    const { user } = setup();

    fill("Mon projet", "Court", "https://example.com/photo.jpg");
    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText("La description doit faire au moins 10 caractères")).toBeInTheDocument();
    });
  });

  it("affiche une erreur si l'URL est invalide", async () => {
    const { user } = setup();

    fill("Mon projet", "Une belle description", "pas-une-url");
    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText("L'URL de la photo n'est pas valide")).toBeInTheDocument();
    });
  });

  it("appelle onSubmit avec les données valides", async () => {
    const { onSubmit, user } = setup();

    fill("Mon projet", "Une belle description", "https://example.com/photo.jpg");
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

    fill("Mon projet", "Une belle description", "https://example.com/photo.jpg");
    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText("Projet créé avec succès !")).toBeInTheDocument();
    });
  });
});