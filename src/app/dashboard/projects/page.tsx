import { FormDialog } from "@/components/features/form-dialog";
import { ProjectForm } from "@/components/features/projects/project-form";
import { ProjectList } from "@/components/features/projects/project-list";
import { getProjects } from "@/lib/actions/project-actions";
import { getSessionInfo } from "@/lib/actions/user-actions";
import { isAdminOrManager } from "@/lib/utils";
import { redirect } from "next/navigation";

const ProjectsPage = async () => {
  const { userId, userRole } = await getSessionInfo();
  if (!userId || !userRole) redirect("/login");

  const isAdmin = userRole === "Admin";
  const projects = await getProjects(isAdmin ? undefined : userId);

  return (
    <div className="h-full">
      {isAdminOrManager(userRole) && (
        <div className="p-2 flex items-center justify-center md:justify-end">
          <FormDialog buttonLabel="Create Project" formTitle="New Project">
            <ProjectForm ownerId={userId} />
          </FormDialog>
        </div>
      )}
      <ProjectList projects={projects} />
    </div>
  );
};

export default ProjectsPage;
