import { Prisma, DocumentType, UserRole, PaymentStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import bcrypt from 'bcrypt';

const hashedPassword = async () => await bcrypt.hash('123456', 10);

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.payment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.buyer.deleteMany();
  await prisma.events.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'LivePass Eventos LTDA',
      email: 'contato@livepass.com.br',
      documentType: DocumentType.CNPJ,
      documentNumber: '12345678000199',
      address: 'Av. Paulista, 1000 - São Paulo, SP',
    },
  });
  console.log(`✅ Organization created: ${org.name}`);

  // Create Users
  const password = await hashedPassword();

  const adminUser = await prisma.user.create({
    data: {
      organizationId: org.id,
      name: 'Niel Assis',
      email: 'niel@livepass.com.br',
      password,
      documentType: DocumentType.CPF,
      role: UserRole.ADMIN,
      documentNumber: '12345678901',
      address: 'Rua das Flores, 123 - São Paulo, SP',
    },
  });

  const supervisorUser = await prisma.user.create({
    data: {
      organizationId: org.id,
      name: 'Cinthia Assis',
      email: 'cinthia@livepass.com.br',
      password,
      documentType: DocumentType.CPF,
      role: UserRole.SUPERVISOR,
      documentNumber: '98765432109',
      address: 'Av. Brasil, 500 - Rio de Janeiro, RJ',
    },
  });

  const collaboratorUser = await prisma.user.create({
    data: {
      organizationId: org.id,
      name: 'João Silva',
      email: 'joao@livepass.com.br',
      password,
      documentType: DocumentType.CPF,
      role: UserRole.COLLABORATOR,
      documentNumber: '45678912300',
      address: 'Rua Nova, 45 - Belo Horizonte, MG',
    },
  });

  console.log(`✅ Users created: ${adminUser.name} (ADMIN), ${supervisorUser.name} (SUPERVISOR), ${collaboratorUser.name} (COLLABORATOR)`);

  // Create Events
  const events = await Promise.all([
    prisma.events.create({
      data: {
        organizationId: org.id,
        name: 'Rock in Rio 2024',
        description: 'O maior festival de música do mundo retorna ao Rio de Janeiro com artistas internacionais.',
        date: new Date('2024-09-15T18:00:00Z'),
        imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
        priceCents: 29900,
        isFree: false,
      },
    }),
    prisma.events.create({
      data: {
        organizationId: org.id,
        name: 'Lollapalooza Brasil 2024',
        description: 'O festival que reúne os maiores nomes da música alternativa e rock.',
        date: new Date('2024-03-22T14:00:00Z'),
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        priceCents: 35000,
        isFree: false,
      },
    }),
    prisma.events.create({
      data: {
        organizationId: org.id,
        name: 'Show Metallica - World Tour',
        description: 'A lendária banda Metallica apresenta seus maioreshits em São Paulo.',
        date: new Date('2024-05-12T20:00:00Z'),
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
        priceCents: 45000,
        isFree: false,
      },
    }),
    prisma.events.create({
      data: {
        organizationId: org.id,
        name: 'Festival de Verão Salvador 2024',
        description: 'O maior festival de verão do Brasil com muito axé e funk.',
        date: new Date('2024-01-06T16:00:00Z'),
        imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
        priceCents: 25000,
        isFree: false,
      },
    }),
    prisma.events.create({
      data: {
        organizationId: org.id,
        name: 'SPFW - Semana de Moda de São Paulo',
        description: 'O maior evento de moda da América Latina.',
        date: new Date('2024-04-15T10:00:00Z'),
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        priceCents: 15000,
        isFree: false,
      },
    }),
    prisma.events.create({
      data: {
        organizationId: org.id,
        name: 'Feira de Tecnologia Innovation Tech 2024',
        description: 'Feira de tecnologia e inovação com as maiores empresas do setor.',
        date: new Date('2024-08-20T09:00:00Z'),
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        priceCents: 12000,
        isFree: false,
      },
    }),
    prisma.events.create({
      data: {
        organizationId: org.id,
        name: 'Carnaval Rio 2024',
        description: 'O maior Carnaval do mundo com desfiles memoráveis.',
        date: new Date('2024-02-10T20:00:00Z'),
        imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800',
        priceCents: 50000,
        isFree: false,
      },
    }),
    prisma.events.create({
      data: {
        organizationId: org.id,
        name: 'Congresso Nacional de Startups 2024',
        description: 'Evento presencial gratuito sobre empreendedorismo e inovação.',
        date: new Date('2024-06-01T08:00:00Z'),
        imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
        priceCents: 0,
        isFree: true,
      },
    }),
  ]);

  console.log(`✅ Events created: ${events.length} events`);

  // Create Buyers
  const buyers = await Promise.all([
    prisma.buyer.create({
      data: {
        organizationId: org.id,
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        documentType: DocumentType.CPF,
        documentNumber: '11122233344',
        address: 'Av. Nossa Senhora de Copacabana, 200 - Rio de Janeiro, RJ',
      },
    }),
    prisma.buyer.create({
      data: {
        organizationId: org.id,
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@email.com',
        documentType: DocumentType.CPF,
        documentNumber: '22233344455',
        address: 'Rua Augusta, 500 - São Paulo, SP',
      },
    }),
    prisma.buyer.create({
      data: {
        organizationId: org.id,
        name: 'Ana Costa',
        email: 'ana.costa@email.com',
        documentType: DocumentType.CPF,
        documentNumber: '33344455566',
        address: 'Av. Afonso Pena, 1000 - Belo Horizonte, MG',
      },
    }),
    prisma.buyer.create({
      data: {
        organizationId: org.id,
        name: 'Lucas Ferreira',
        email: 'lucas.ferreira@email.com',
        documentType: DocumentType.CPF,
        documentNumber: '44455566677',
        address: 'Rua da Bahia, 800 - Salvador, BA',
      },
    }),
    prisma.buyer.create({
      data: {
        organizationId: org.id,
        name: 'Juliana Almeida',
        email: 'juliana.almeida@email.com',
        documentType: DocumentType.CPF,
        documentNumber: '55566677788',
        address: 'Av. Diário de Notícias, 300 - Porto Alegre, RS',
      },
    }),
    prisma.buyer.create({
      data: {
        organizationId: org.id,
        name: 'Ricardo Souza',
        email: 'ricardo.souza@email.com',
        documentType: DocumentType.CPF,
        documentNumber: '66677788899',
        address: 'Rua 13 de Maio, 50 - Recife, PE',
      },
    }),
    prisma.buyer.create({
      data: {
        organizationId: org.id,
        name: 'Fernanda Lima',
        email: 'fernanda.lima@email.com',
        documentType: DocumentType.CPF,
        documentNumber: '77788899900',
        address: 'Av.Getúlio Vargas, 1200 - Fortaleza, CE',
      },
    }),
    prisma.buyer.create({
      data: {
        organizationId: org.id,
        name: 'Carlos Eduardo',
        email: 'carlos.eduardo@email.com',
        documentType: DocumentType.CPF,
        documentNumber: '88899900011',
        address: 'Rua das Laranjeiras, 250 - Curitiba, PR',
      },
    }),
    prisma.buyer.create({
      data: {
        organizationId: org.id,
        name: 'Beatriz Rodrigues',
        email: 'beatriz.rodrigues@email.com',
        documentType: DocumentType.CPF,
        documentNumber: '99900011122',
        address: 'Av. Amazonas, 450 - Manaus, AM',
      },
    }),
    prisma.buyer.create({
      data: {
        organizationId: org.id,
        name: 'Marcelo Pereira',
        email: 'marcelo.pereira@email.com',
        documentType: DocumentType.CPF,
        documentNumber: '00011122233',
        address: 'Rua 24 de Outubro, 800 - Porto Alegre, RS',
      },
    }),
  ]);

  console.log(`✅ Buyers created: ${buyers.length} buyers`);

  // Create Tickets and Payments
  const ticketsData = [
    { buyer: buyers[0], event: events[0], status: PaymentStatus.PAID },
    { buyer: buyers[1], event: events[0], status: PaymentStatus.PENDING },
    { buyer: buyers[2], event: events[1], status: PaymentStatus.PAID },
    { buyer: buyers[3], event: events[1], status: PaymentStatus.PENDING },
    { buyer: buyers[4], event: events[2], status: PaymentStatus.PAID },
    { buyer: buyers[5], event: events[2], status: PaymentStatus.CANCELED },
    { buyer: buyers[6], event: events[3], status: PaymentStatus.PAID },
    { buyer: buyers[7], event: events[3], status: PaymentStatus.PENDING },
    { buyer: buyers[8], event: events[4], status: PaymentStatus.PAID },
    { buyer: buyers[9], event: events[5], status: PaymentStatus.PENDING },
    { buyer: buyers[0], event: events[6], status: PaymentStatus.PAID },
    { buyer: buyers[1], event: events[7], status: PaymentStatus.PAID },
    { buyer: buyers[2], event: events[7], status: PaymentStatus.PAID },
    { buyer: buyers[3], event: events[7], status: PaymentStatus.PAID },
  ];

  const createdTickets = [];

  for (const data of ticketsData) {
    const ticket = await prisma.ticket.create({
      data: {
        organizationId: org.id,
        eventId: data.event.id,
        buyerId: data.buyer.id,
      },
    });

    await prisma.payment.create({
      data: {
        organizationId: org.id,
        ticketId: ticket.id,
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        amountCents: data.event.priceCents,
        status: data.status,
      },
    });

    createdTickets.push(ticket);
  }

  console.log(`✅ Tickets created: ${createdTickets.length} tickets with payments`);

  console.log(`
  🎉 Seed completed successfully!

  📊 Summary:
  - 1 Organization
  - 3 Users (1 ADMIN, 1 SUPERVISOR, 1 COLLABORATOR)
  - ${events.length} Events (${events.filter(e => !e.isFree).length} paid, ${events.filter(e => e.isFree).length} free)
  - ${buyers.length} Buyers
  - ${createdTickets.length} Tickets with Payments

  🔑 Login credentials:
  - Admin: niel@livepass.com.br / 123456
  - Supervisor: cinthia@livepass.com.br / 123456
  - Collaborator: joao@livepass.com.br / 123456
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });