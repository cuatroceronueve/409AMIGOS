import prisma from "../../lib/prisma";

export default async function handle(req, res) {
  try {
    const result = await prisma.users.findMany({
      select: {
        address: true,
      },
      orderBy: {
        fechaCreacion: "desc",
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
}
