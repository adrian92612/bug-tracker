import {
  ProjectStatus,
  Role,
  TicketPriority,
  TicketStatus,
  TicketType,
} from "@prisma/client";

/*
  USERS
*/

type UserType = {
  email: string;
  name: string;
  password: string;
  role: Role;
};

const ADMIN: UserType = {
  email: "admin@example.com",
  name: "Amber Villamin",
  password: "Admin123!",
  role: "Admin",
};

const MANAGERS: UserType[] = [
  {
    email: "manager@example.com",
    name: "Allyza Abad",
    password: "Manager123!",
    role: "Manager",
  },
  {
    email: "manager2@example.com",
    name: "Christian Corleone",
    password: "Manager123!",
    role: "Manager",
  },
];

const DEVELOPERS: UserType[] = [
  {
    email: "developer@example.com",
    name: "Haru Persian",
    password: "Developer123!",
    role: "Developer",
  },
  {
    email: "developer2@example.com",
    name: "Harriet Nose",
    password: "Developer123!",
    role: "Developer",
  },
  {
    email: "developer3@example.com",
    name: "Hela Nobrand",
    password: "Developer123!",
    role: "Developer",
  },
  {
    email: "developer4@example.com",
    name: "Mango Meadeows",
    password: "Developer123!",
    role: "Developer",
  },
  {
    email: "developer5@example.com",
    name: "Buddy Meadeows",
    password: "Developer123!",
    role: "Developer",
  },
  {
    email: "developer6@example.com",
    name: "Bart Pareño",
    password: "Developer123!",
    role: "Developer",
  },
];

const CONTRIBUTORS: UserType[] = [
  {
    email: "contributor@example.com",
    name: "Brucey Wasi",
    password: "Contributor123!",
    role: "Contributor",
  },
  {
    email: "contributor2@example.com",
    name: "Clyde Capone",
    password: "Contributor123!",
    role: "Contributor",
  },
  {
    email: "contributor3@example.com",
    name: "Kiko Putol",
    password: "Contributor123!",
    role: "Contributor",
  },
  {
    email: "contributor4@example.com",
    name: "Wilson Blood",
    password: "Contributor123!",
    role: "Contributor",
  },
  {
    email: "contributor5@example.com",
    name: "Nabia Capone",
    password: "Contributor123!",
    role: "Contributor",
  },
];

const NO_ROLES: UserType[] = [
  {
    email: "user@example.com",
    name: "Yume Dune",
    password: "User123!",
    role: "None",
  },
  {
    email: "user2@example.com",
    name: "Hannah Bishi",
    password: "User123!",
    role: "None",
  },
];

/*
  PROJECTS
*/
type ProjectType = {
  name: string;
  description: string;
  deadline: Date;
  status: ProjectStatus;
};

const PROJECTS: ProjectType[] = [
  {
    name: "Project Alpha",
    description: "UI/UX is requiring an overhaul",
    deadline: new Date("2024-12-25"),
    status: "Ongoing",
  },
  {
    name: "Project Omega",
    description: "This project focuses on the backend",
    deadline: new Date("2025-2-14"),
    status: "Ongoing",
  },
];

/**
 * TICKETS
 */

type TicketSchemaType = {
  title: string;
  description: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  project: string;
};

const TICKETS: TicketSchemaType[] = [
  // Tickets for Project Alpha
  {
    title: "Fix Login Issue",
    description: "Resolve the login bug affecting user authentication.",
    type: "Bug",
    status: "Open",
    priority: "High",
    project: "Project Alpha",
  },
  {
    title: "Update UI Components",
    description: "Revamp the UI for a better user experience.",
    type: "Others",
    status: "In_Progress",
    priority: "Medium",
    project: "Project Alpha",
  },
  {
    title: "Backend Optimization",
    description: "Optimize database queries for faster load times.",
    type: "Task",
    status: "In_Review",
    priority: "Low",
    project: "Project Alpha",
  },

  // Tickets for Project Omega
  {
    title: "Implement API Endpoints",
    description: "Create new API endpoints for the dashboard.",
    type: "Task",
    status: "Open",
    priority: "High",
    project: "Project Omega",
  },
  {
    title: "Database Migration",
    description: "Migrate data from the old database to the new structure.",
    type: "Task",
    status: "In_Progress",
    priority: "Critical",
    project: "Project Omega",
  },
  {
    title: "Setup CI/CD Pipeline",
    description: "Integrate CI/CD for automated deployment.",
    type: "Others",
    status: "In_Review",
    priority: "Medium",
    project: "Project Omega",
  },
  {
    title: "Security Audit",
    description: "Conduct a security audit on the backend services.",
    type: "Task",
    status: "Open",
    priority: "High",
    project: "Project Omega",
  },
  {
    title: "User Feedback Integration",
    description: "Integrate user feedback into the Omega project.",
    type: "Others",
    status: "Resolved",
    priority: "Low",
    project: "Project Omega",
  },
];

export {
  ADMIN,
  MANAGERS,
  DEVELOPERS,
  CONTRIBUTORS,
  NO_ROLES,
  PROJECTS,
  TICKETS,
};
