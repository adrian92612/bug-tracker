import { createId } from "@paralleldrive/cuid2";
import { PrismaClient, User } from "@prisma/client";
import { genSalt, hashSync } from "bcrypt-ts";
import {
  ADMIN,
  CONTRIBUTORS,
  DEVELOPERS,
  MANAGERS,
  NO_ROLES,
  PROJECTS,
  TICKETS,
} from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing existing data...");
  await prisma.ticketAssignment.deleteMany();
  await prisma.projectAssignment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding users...");
  const users = await Promise.all(
    [ADMIN, ...MANAGERS, ...DEVELOPERS, ...CONTRIBUTORS, ...NO_ROLES].map(
      async (user) => {
        try {
          const salt = await genSalt(10);
          const hashedPassword = hashSync(user.password, salt);
          const createdUser = await prisma.user.create({
            data: {
              id: createId(),
              email: user.email,
              name: user.name,
              password: hashedPassword,
              role: user.role,
            },
          });
          console.log(`${user.role} ${user.name} has been created`);
          return createdUser;
        } catch (error) {
          console.error(`Failed to create user ${user.email} `, error);
          return null;
        }
      }
    )
  );

  const validUsers = users.filter((user) => user !== null);

  const admin = validUsers.find((user) => user.email === ADMIN.email);
  const manager1 = validUsers.find((user) => user.email === MANAGERS[0].email);
  const manager2 = validUsers.find((user) => user.email === MANAGERS[1].email);
  const developers1 = validUsers
    .filter((user) => user.role === "Developer")
    .slice(0, 3);
  const developers2 = validUsers
    .filter((user) => user.role === "Developer")
    .slice(3);
  const contributors1 = validUsers
    .filter((user) => user.role === "Contributor")
    .slice(0, 2);
  const contributors2 = validUsers
    .filter((user) => user.role === "Contributor")
    .slice(2);

  console.log("Seeding projects...");
  await Promise.all(
    PROJECTS.map(async (project, index) => {
      const createdProject = await prisma.project.create({
        data: {
          id: createId(),
          name: project.name,
          description: project.description,
          deadline: project.deadline,
          ownerId: admin!.id,
        },
      });

      const manager = index === 0 ? manager1 : manager2;

      if (manager) {
        await prisma.projectAssignment.create({
          data: {
            userId: manager.id,
            projectId: createdProject.id,
          },
        });
        console.log(
          `Assigned ${manager.name} as manager to project ${createdProject.name}`
        );
      }

      const members =
        index === 0
          ? [...developers1, ...contributors1]
          : [...developers2, ...contributors2];

      await Promise.all(
        members.map(async (user) => {
          await prisma.projectAssignment.create({
            data: {
              userId: user.id,
              projectId: createdProject.id,
            },
          });
          console.log(
            `Assigned ${user.name} as a member of ${createdProject.name}`
          );
        })
      );

      console.log("Seeding tickets");
      const alphaTickets = TICKETS.filter(
        (ticket) => ticket.project === "Project Alpha"
      );
      const omegaTickets = TICKETS.filter(
        (ticket) => ticket.project === "Project Omega"
      );

      const tickets = index === 0 ? alphaTickets : omegaTickets;
      const developers = index === 0 ? developers1 : developers2;
      const contributors = index === 0 ? contributors1 : contributors2;

      await Promise.all(
        tickets.map(async (ticket) => {
          const createdTicket = await prisma.ticket.create({
            data: {
              id: createId(),
              title: ticket.title,
              description: ticket.description,
              type: ticket.type,
              status: ticket.status,
              priority: ticket.priority,
              projectId: createdProject.id,
              createdById: manager!.id,
              assignedToId: getRandomDeveloper(developers).id,
            },
          });

          console.log(
            `${ticket.title} for ${createdProject.name} has been created`
          );

          const [member1, member2] = getUniqueContributors(contributors);
          await prisma.ticketAssignment.createMany({
            data: [
              {
                userId: member1.id,
                ticketId: createdTicket.id,
              },
              {
                userId: member2.id,
                ticketId: createdTicket.id,
              },
            ],
          });
        })
      );
    })
  );
}
function getRandomDeveloper(developers: User[]): User {
  return developers[Math.floor(Math.random() * developers.length)];
}

function getUniqueContributors(contributors: User[]): [User, User] {
  const shuffled = [...contributors].sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1]];
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
