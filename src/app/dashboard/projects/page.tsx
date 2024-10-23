import { FormDialog } from "@/components/features/form-dialog";
import { ProjectForm } from "@/components/features/projects/project-form";
import ProjectList from "@/components/features/projects/project-list";

import { getProjects } from "@/lib/actions/project-actions";
import { getUserId } from "@/lib/actions/user-actions";

const ProjectsPage = async () => {
  const id = await getUserId();
  const projects = await getProjects();
  console.log(projects);
  return (
    <div className="h-full">
      ProjectsPage
      <FormDialog buttonLabel="Create Project" formTitle="New Project">
        <ProjectForm ownerId={id ?? ""} />
      </FormDialog>
      <ProjectList projects={projects} />
    </div>
  );
};

export default ProjectsPage;
