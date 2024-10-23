import { createId } from "@paralleldrive/cuid2";
import {
  PrismaClient,
  ProjectStatus,
  TicketPriority,
  TicketStatus,
  TicketType,
} from "@prisma/client";
import { genSalt, hashSync } from "bcrypt-ts";

const prisma = new PrismaClient();

type userProps = {
  email: string;
  name: string;
  password: string;
  role: "ADMIN" | "MANAGER" | "DEVELOPER" | "CONTRIBUTOR" | "USER";
};

const users: userProps[] = [
  {
    email: "admin@example.com",
    name: "Amber Villamin",
    password: "Admin123!",
    role: "ADMIN",
  },
  {
    email: "manager@example.com",
    name: "Allyza Abad",
    password: "Manager123!",
    role: "MANAGER",
  },
  {
    email: "manager2@example.com",
    name: "Christian Corleone",
    password: "Manager123!",
    role: "MANAGER",
  },
  {
    email: "developer@example.com",
    name: "Haru Persian",
    password: "Developer123!",
    role: "DEVELOPER",
  },
  {
    email: "developer2@example.com",
    name: "Harriet Nose",
    password: "Developer123!",
    role: "DEVELOPER",
  },
  {
    email: "developer3@example.com",
    name: "Hela Nobrand",
    password: "Developer123!",
    role: "DEVELOPER",
  },
  {
    email: "contributor@example.com",
    name: "Brucey Wasi",
    password: "Contributor123!",
    role: "CONTRIBUTOR",
  },
  {
    email: "contributor2@example.com",
    name: "Clyde Capone",
    password: "Contributor123!",
    role: "CONTRIBUTOR",
  },
  {
    email: "contributor3@example.com",
    name: "Kiko Putol",
    password: "Contributor123!",
    role: "CONTRIBUTOR",
  },
  {
    email: "contributor4@example.com",
    name: "Wilson Blood",
    password: "Contributor123!",
    role: "CONTRIBUTOR",
  },
  {
    email: "user@example.com",
    name: "Nabia Capone",
    password: "User123!",
    role: "USER",
  },
  {
    email: "user2@example.com",
    name: "Mango Meadeows",
    password: "User123!",
    role: "USER",
  },
  {
    email: "user3@example.com",
    name: "Buddy Meadeows",
    password: "User123!",
    role: "USER",
  },
  {
    email: "user4@example.com",
    name: "Bart Pareño",
    password: "User123!",
    role: "USER",
  },
  {
    email: "user5@example.com",
    name: "Yume Dune",
    password: "User123!",
    role: "USER",
  },
  {
    email: "user6@example.com",
    name: "Hannah Bishi",
    password: "User123!",
    role: "USER",
  },
];

const projects = [
  {
    name: "Project Alpha",
    description: "A project focusing on alpha development.",
    deadline: new Date("2024-12-31"),
    status: "ONGOING" as ProjectStatus,
  },
  {
    name: "Project Beta",
    description: "Beta project with various testing efforts.",
    deadline: new Date("2024-11-15"),
    status: "ONGOING" as ProjectStatus,
  },
  {
    name: "Project Gamma",
    description: "Gamma project focusing on high-priority tasks.",
    deadline: new Date("2024-10-30"),
    status: "OVERDUE" as ProjectStatus,
  },
  {
    name: "Project Delta",
    description: "A project aimed at system integration.",
    deadline: new Date("2024-11-05"),
    status: "CLOSED" as ProjectStatus,
  },
  {
    name: "Project Epsilon",
    description: "Epsilon project for deployment and monitoring.",
    deadline: new Date("2025-01-20"),
    status: "ONGOING" as ProjectStatus,
  },
];

const tickets = [
  {
    title: "Fix login bug",
    description: "Resolve an issue preventing users from logging in.",
    status: "OPEN" as TicketStatus,
    priority: "HIGH" as TicketPriority,
    type: "BUG" as TicketType,
  },
  {
    title: "Add dashboard feature",
    description: "Implement the new dashboard statistics feature.",
    status: "IN_PROGRESS" as TicketStatus,
    priority: "MEDIUM" as TicketPriority,
    type: "TASK" as TicketType,
  },
  {
    title: "Database schema update",
    description: "Update the database schema to improve performance.",
    status: "IN_REVIEW" as TicketStatus,
    priority: "CRITICAL" as TicketPriority,
    type: "TASK" as TicketType,
  },
  {
    title: "UI/UX design overhaul",
    description: "Revamp the UI for a better user experience.",
    status: "CLOSED" as TicketStatus,
    priority: "LOW" as TicketPriority,
    type: "OTHERS" as TicketType,
  },
];

async function main() {
  console.log("Clearing existing data...");
  await prisma.projectAssignment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding users...");
  await Promise.all(
    users.map(async (user) => {
      try {
        const salt = await genSalt(10);
        const hashedPassword = hashSync(user.password, salt);
        await prisma.user.upsert({
          where: {
            email: user.email,
          },
          update: {},
          create: {
            id: createId(),
            name: user.name,
            email: user.email,
            password: hashedPassword,
            role: user.role,
          },
        });

        console.log(`${user.role} ${user.name} has been created`);
      } catch (error) {
        console.error(`Failed to create user ${user.email}:`, error);
      }
    })
  );

  console.log("Seeding projects and tickets...");
  // Get users for assigning to projects
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  const managers = await prisma.user.findMany({ where: { role: "MANAGER" } });
  const developers = await prisma.user.findMany({
    where: { role: "DEVELOPER" },
  });
  const contributors = await prisma.user.findMany({
    where: { role: "CONTRIBUTOR" },
  });

  // Create projects with members and tickets
  await Promise.all(
    projects.map(async (project) => {
      try {
        // Randomly select 1 manager, 2 developers, and 3 contributors
        const manager = managers[Math.floor(Math.random() * managers.length)];
        const projectDevelopers = getRandomElements(developers, 2);
        const projectContributors = getRandomElements(contributors, 3);

        // Create project
        const createdProject = await prisma.project.create({
          data: {
            id: createId(),
            name: project.name,
            description: project.description,
            deadline: project.deadline,
            status: project.status,
            ownerId: admin!.id,
          },
        });

        // Assign manager, developers, and contributors to the project
        await prisma.projectAssignment.create({
          data: {
            userId: manager.id,
            projectId: createdProject.id,
          },
        });

        await Promise.all(
          [...projectDevelopers, ...projectContributors].map(async (member) => {
            await prisma.projectAssignment.create({
              data: {
                userId: member.id,
                projectId: createdProject.id,
              },
            });
          })
        );

        // Create 4 tickets for each project
        await Promise.all(
          tickets.map(async (ticket) => {
            await prisma.ticket.create({
              data: {
                id: createId(),
                title: ticket.title,
                description: ticket.description,
                status: ticket.status,
                priority: ticket.priority,
                type: ticket.type,
                projectId: createdProject.id,
                createdById: manager.id, // Assuming project owner creates tickets
              },
            });
          })
        );

        console.log(
          `Project "${createdProject.name}" with assigned roles and tickets has been created`
        );
      } catch (error) {
        console.error(`Failed to create project ${project.name}:`, error);
      }
    })
  );
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
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
