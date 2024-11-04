"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  changeProjectStatus,
  deleteProject,
  ProjectWithOMT,
} from "@/lib/actions/project-actions";
import { MoreActionsDropdown } from "../more-actions";
import { ProjectForm } from "./project-form";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUserRole } from "../../../../context/role-provider";
import { isAdminOrManager } from "@/lib/utils";

type ProjectCardProps = {
  project: ProjectWithOMT;
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const role = useUserRole();
  const handleStatus = async () => {
    try {
      setIsLoading(true);
      if (project.status === "CLOSED") {
        await changeProjectStatus(project.id, "ONGOING");
      } else {
        await changeProjectStatus(project.id, "CLOSED");
      }
    } catch (error) {
      console.error("Failed to update project status: ", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <CardFooter className="justify-end">
        {isAdminOrManager(role) && (
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={handleStatus}
          >
            {project.status === "CLOSED" ? "Re-open" : "Close"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
