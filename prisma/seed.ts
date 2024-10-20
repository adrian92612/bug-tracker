import { createId } from "@paralleldrive/cuid2";
import { PrismaClient } from "@prisma/client";
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

async function main() {
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
