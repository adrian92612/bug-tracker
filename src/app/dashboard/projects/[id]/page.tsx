import { getProject } from "@/lib/actions/project-actions";

type ProjectDetailsPageProps = {
  params: {
    id: string;
  };
};

const ProjectDetailsPage = async ({ params }: ProjectDetailsPageProps) => {
  const project = await getProject(params.id);
  return (
    <div>
      ProjectDetailsPage
      {project?.members.map((member) => (
        <p key={member.userId}>
          {member.user.role} {member.user.name}
        </p>
      ))}
      {project?.tickets.map((t) => (
        <p key={t.id}>{t.title}</p>
      ))}
    </div>
  );
};

export default ProjectDetailsPage;
