import { ProjectWithOMT } from "@/lib/actions/project-actions";
import { ProjectCard } from "./project-card";

type ProjectListProps = {
  projects: ProjectWithOMT[];
};

export const ProjectList = async ({ projects }: ProjectListProps) => {
  return (
    <div>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 p-2 gap-5">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
};
