import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FullProjectDetails } from "@/lib/actions/project-actions";
import { LabelValue } from "../label-value";
import { format } from "date-fns";

type ProjectInformationProps = {
  project: FullProjectDetails;
};

export const ProjectInformation = ({ project }: ProjectInformationProps) => {
  return (
    <section>
      <Card>
        <CardHeader>
          <Badge className="w-fit ml-auto">{project.status}</Badge>
          <CardTitle className="text-xl">{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <LabelValue label="Tickets: " value={project.tickets.length} />
          <LabelValue
            label="Deadline: "
            value={format(project.deadline, "PPP")}
          />
          <LabelValue
            label="Created At: "
            value={format(project.createdAt, "PPP")}
          />
          <LabelValue
            label="Last Updated: "
            value={format(project.updatedAt, "PPP")}
          />
        </CardContent>
      </Card>
    </section>
  );
};
