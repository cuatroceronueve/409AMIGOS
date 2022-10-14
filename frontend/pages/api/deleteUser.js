import prisma from "../../lib/prisma";

export default async function handle(req, res) {
  const idParam = req.query.id;
  try {
    const result = await prisma.users.delete({
      where: {
        id: parseInt(idParam),
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
}
