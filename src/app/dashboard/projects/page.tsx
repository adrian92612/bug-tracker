import { auth } from "@/auth";
import { FormDialog } from "@/components/features/form-dialog";
import { ProjectForm } from "@/components/features/projects/project-form";
import { ProjectList } from "@/components/features/projects/project-list";

import { getProjects } from "@/lib/actions/project-actions";
import { isAdminOrManager } from "@/lib/utils";

const ProjectsPage = async () => {
  const session = await auth();
  if (!session) return <div>No User</div>;
  const isAdmin = session.user.role === "ADMIN";

  const projects = await getProjects(isAdmin ? undefined : session.user.id);

  return (
    <div className="h-full">
      {isAdminOrManager(session.user.role) && (
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
