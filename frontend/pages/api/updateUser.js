import prisma from "../../lib/prisma";
export default async function handle(req, res) {
  const idParam = req.query.query;
  const {name, address } = req.body;
  
  try {
    await prisma.user.update({
      where: {
        id: idParam,
      },
      data: {
        nombre: name,
        address: address,
      },
    });
    return res.status(200).json({ address });
  } catch {
    return res.status(500).json({ error });
  }
}
