import { FormDialog } from "@/components/features/form-dialog";
import { ProjectForm } from "@/components/features/projects/project-form";
import { Button } from "@/components/ui/button";
import { getUserId } from "@/lib/actions/user-actions";

const ProjectsPage = async () => {
  const id = await getUserId();
  return (
    <div className="bg-red-100 h-full">
      ProjectsPage
      <FormDialog buttonLabel="Create Project" formTitle="New Project">
        <ProjectForm ownerId={id ?? ""} />
      </FormDialog>
    </div>
  );
};

export default ProjectsPage;
