import { ProjectInformation } from "@/components/features/projects/project-information";
import { ProjectPersonnel } from "@/components/features/projects/project-personnel";
import { ProjectTickets } from "@/components/features/projects/project-tickets";
import { getProject } from "@/lib/actions/project-actions";

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

  return (
    <div className="p-4 grid md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <ProjectInformation project={project} />
        <ProjectPersonnel project={project} />
      </div>
      <ProjectTickets tickets={project.tickets} />
    </div>
  );
};

export default ProjectDetailsPage;
