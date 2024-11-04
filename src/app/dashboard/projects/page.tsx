import { auth } from "@/auth";
import { FormDialog } from "@/components/features/form-dialog";
import { ProjectForm } from "@/components/features/projects/project-form";
import ProjectList from "@/components/features/projects/project-list";

import { getProjects } from "@/lib/actions/project-actions";

const ProjectsPage = async () => {
  const session = await auth();
  if (!session) return <div>No User</div>;

  const projects = await getProjects(
    session.user?.id ? session.user.id : undefined
  );

  const isAdminOrManager =
    session.user.role === "ADMIN" || session.user.role === "MANAGER";

  return (
    <div className="h-full">
      {isAdminOrManager && (
        <div className="p-2 flex items-center justify-center md:justify-end">
          <FormDialog buttonLabel="Create Project" formTitle="New Project">
            <ProjectForm ownerId={session.user.id} />
          </FormDialog>
        </div>
      )}
      <ProjectList projects={projects} />
    </div>
  );
};

export default ProjectsPage;
