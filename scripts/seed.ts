import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('johndoe123', 12);

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // Demo client
  const clientPassword = await bcrypt.hash('demo123', 12);
  const client = await prisma.user.upsert({
    where: { email: 'lisa@example.com' },
    update: {},
    create: {
      email: 'lisa@example.com',
      name: 'Lisa Chen',
      password: clientPassword,
      role: 'client',
      company: 'Chen Consulting',
    },
  });

  // Projects for the demo client
  const project1 = await prisma.project.upsert({
    where: { id: 'proj-lisa-website' },
    update: {},
    create: {
      id: 'proj-lisa-website',
      title: "Lisa's Efficient Website",
      description: 'High-converting business website with custom design, SEO optimization, and integrated lead capture system.',
      status: 'completed',
      progress: 100,
      imageUrl: 'https://cdn.abacus.ai/images/0db69897-1677-4c97-b359-7770ed7a4085.png',
      clientId: client.id,
    },
  });

  const project2 = await prisma.project.upsert({
    where: { id: 'proj-grayson-ecom' },
    update: {},
    create: {
      id: 'proj-grayson-ecom',
      title: "Grayson's 3D Prints E-commerce",
      description: 'Full e-commerce platform for 3D printed electric bike parts with custom configurator and automated fulfillment.',
      status: 'in_progress',
      progress: 72,
      imageUrl: 'https://cdn.abacus.ai/images/46a187b2-e495-4e6d-bd94-c008655541cd.png',
      clientId: client.id,
    },
  });

  const project3 = await prisma.project.upsert({
    where: { id: 'proj-genzic-executor' },
    update: {},
    create: {
      id: 'proj-genzic-executor',
      title: 'Genzic Executor Internal Tool',
      description: 'Custom project management and execution tracking platform with AI-driven task allocation.',
      status: 'in_progress',
      progress: 45,
      imageUrl: 'https://cdn.abacus.ai/images/20252650-6e91-4d8e-a72d-bd98ff50f3e1.png',
      clientId: admin.id,
    },
  });

  // Milestones
  const milestones = [
    { id: 'ms-1', title: 'Design Mockup Approved', status: 'completed', projectId: project1.id },
    { id: 'ms-2', title: 'Frontend Development', status: 'completed', projectId: project1.id },
    { id: 'ms-3', title: 'SEO Optimization', status: 'completed', projectId: project1.id },
    { id: 'ms-4', title: 'Launch & Go Live', status: 'completed', projectId: project1.id },
    { id: 'ms-5', title: 'Product Catalog Setup', status: 'completed', projectId: project2.id },
    { id: 'ms-6', title: '3D Configurator Integration', status: 'in_progress', projectId: project2.id },
    { id: 'ms-7', title: 'Payment & Checkout', status: 'pending', projectId: project2.id },
    { id: 'ms-8', title: 'Automated Fulfillment', status: 'pending', projectId: project2.id },
    { id: 'ms-9', title: 'Core Dashboard Layout', status: 'completed', projectId: project3.id },
    { id: 'ms-10', title: 'AI Task Allocation Engine', status: 'in_progress', projectId: project3.id },
    { id: 'ms-11', title: 'Team Analytics', status: 'pending', projectId: project3.id },
  ];

  for (const ms of milestones) {
    await prisma.milestone.upsert({
      where: { id: ms.id },
      update: {},
      create: ms,
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
