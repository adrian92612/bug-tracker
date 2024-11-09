import { ForbiddenPage } from "@/components/features/forbidden";
import { ProjectInformation } from "@/components/features/projects/project-information";
import { ProjectPersonnel } from "@/components/features/projects/project-personnel";
import { ProjectTickets } from "@/components/features/projects/project-tickets";
import { getProject } from "@/lib/actions/project-actions";
import { getSessionInfo } from "@/lib/actions/user-actions";

type ProjectDetailsPageProps = {
  params: {
    id: string;
  };
};

const ProjectDetailsPage = async ({ params }: ProjectDetailsPageProps) => {
  const project = await getProject(params.id);
  if (!project) {
    return <div>Project not found</div>;
  }

  const { userId } = await getSessionInfo();
  const isInProject =
    project.ownerId === userId ||
    project.members.some((member) => member.userId === userId);

  if (!isInProject) return <ForbiddenPage />;

  return (
    <div className="p-4 grid md:grid-cols-2 gap-4 min-h-full">
      <div className="flex flex-col gap-4">
        <ProjectInformation project={project} />
        <ProjectPersonnel project={project} />
      </div>
      <ProjectTickets tickets={project.tickets} />
    </div>
  );
};

export default ProjectDetailsPage;
