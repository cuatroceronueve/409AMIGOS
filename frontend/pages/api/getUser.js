import prisma from "../../lib/prisma";

export default async function handle(req, res) {
  const searchString = req.query.query;
  try {
    const result = await prisma.users.findMany({
      where: {
        OR: [
          {
            nombre: { contains: searchString },
          },
          {
            address: { contains: searchString },
          },
        ],
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
}
