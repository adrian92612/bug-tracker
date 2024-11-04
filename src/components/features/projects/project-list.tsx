import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { deleteProject, ProjectWithOMT } from "@/lib/actions/project-actions";
import { format } from "date-fns";
import { MoreActionsDropdown } from "../more-actions";
import { ProjectForm } from "./project-form";

type ProjectCardProps = {
  project: ProjectWithOMT;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="rounded-none h-full flex flex-col">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <Badge variant="ongoing">{project.status.toLowerCase()}</Badge>
          <MoreActionsDropdown
            id={project.id}
            name={project.name}
            pageHref={`/dashboard/projects/${project.id}`}
            deleteFn={deleteProject}
            editForm={
              <ProjectForm ownerId={project.ownerId} project={project} />
            }
          />
        </div>
        <CardTitle className="text-xl">{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>Project Owner: {project.owner.name}</div>
        <div>
          Members:
          {project.members.map((member) => member.user.name)}
        </div>
        <div>Tickets: {project.tickets.length}</div>
        <div>Deadline: {format(new Date(project.deadline), "PPP")}</div>
      </CardContent>
    </Card>
  );
};

type ProjectListProps = {
  projects: ProjectWithOMT[];
};

const ProjectList = async ({ projects }: ProjectListProps) => {
  return (
    <div>
      <h2>Projects</h2>
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

export default ProjectList;
