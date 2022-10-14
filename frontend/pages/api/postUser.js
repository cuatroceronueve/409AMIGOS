import prisma from "../../lib/prisma";

export default async function handle(req, res) {
  const { name, address } = req.body;
  
  const result = await prisma.users.create({
    data: {
      nombre: name,
      address: address,
    },
  });
  res.json(result);
}
