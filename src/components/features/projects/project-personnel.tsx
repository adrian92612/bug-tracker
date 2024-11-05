import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FullProjectDetails } from "@/lib/actions/project-actions";
import { LabelValue } from "../label-value";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoPersonOutline } from "react-icons/io5";

type ProjectPersonnelProps = {
  project: FullProjectDetails;
};

export const ProjectPersonnel = ({ project }: ProjectPersonnelProps) => {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Personnel</CardTitle>
          <LabelValue label="Owner: " value={project.owner.name} />
        </CardHeader>
        <CardContent>
          <div>
            <h2 className="font-semibold text-lg">Members</h2>
            <ul className="flex flex-col gap-1">
              {project.members.map((member) => (
                <li key={member.userId} className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={member.user.image ?? ""} />
                    <AvatarFallback>
                      <IoPersonOutline className="text-xl text-slate-800" />
                    </AvatarFallback>
                  </Avatar>
                  <p>{member.user.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
