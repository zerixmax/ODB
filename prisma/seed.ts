import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding OleaD Board (ODB) V2.1 database with hosting, payment status and technical notes...");

  // Clear existing data
  await prisma.timeLog.deleteMany();
  await prisma.project.deleteMany();
  await prisma.systemSetting.deleteMany();

  // Seed system settings
  await prisma.systemSetting.createMany({
    data: [
      { key: "weekly_hours_target", value: "35" },
      { key: "monthly_revenue_target", value: "3500" },
      { key: "vps_server", value: "MyDataKnox VPS (Coolify Engine)" },
    ],
  });

  // Projects data including V2.1 fields
  const projectsData = [
    // 1. Marko Polo Sport
    {
      domain: "marcopolosport.com",
      client: "Marko Polo Sport",
      techStack: "Astro, Payload CMS",
      hosting: "VPS",
      isVps: true,
      currentStatus: "Joomla -> Astro/Payload migracija. Funkcionalni test na VPS aktivan.",
      stage: "IN_PROGRESS",
      priority: "URGENT",
      progress: 60,
      price: 650.0,
      isPaid: false,
      docUrl: "https://docs.google.com/document/d/marcopolosport-spec",
      devDevice: "LAPTOP",
      hasGitBackup: true,
      hasCicd: true,
      notes: `### Tehnički detalji (Marko Polo Sport)
- **Coolify App UUID:** \`clfy-mps-prod-9942\`
- **Interni Port:** \`3008\`
- **Baza Podataka:** PostgreSQL 16 (baza: \`mps_payload_db\`)
- **Docker Kontejner:** \`mps-astro-payload:latest\`
- **CI/CD:** GitHub Webhook povezan na Coolify main branch trigger.
- **Napomena:** Dovršiti migraciju korisničkih članaka iz Joomle (SQL dump u \`/backups/joomla_mps.sql\`).`,
    },
    // 2. Oly bot
    {
      domain: "oly-bot",
      client: "OleaD R&D (Agrotech)",
      techStack: "Raspberry Pi 5, Python, ROS, LiFePO4",
      hosting: "VPS",
      isVps: false,
      currentStatus: "Rana faza testiranja autonomije, motora i napajanja na Pi5.",
      stage: "IN_PROGRESS",
      priority: "HIGH",
      progress: 30,
      price: null,
      isPaid: false,
      docUrl: "https://drive.google.com/drive/u/0/folders/oly-bot-rd",
      devDevice: "WORKSTATION",
      hasGitBackup: true,
      hasCicd: false,
      notes: `### Hardware & R&D Bilješke
- **Ploča:** Raspberry Pi 5 (8GB)
- **Napajanje:** LiFePO4 12.8V 20Ah + custom BMS + buck pretvarači 5V/5A
- **Motori:** 2x DC 24V s planetarnim enkoderima (Cytron MDDS30 driver)
- **Software:** Ubuntu Server 24.04 ARM64 + ROS 2 Jazzy + Micro-ROS na ESP32.`,
    },
    // 3. Camp Ponta
    {
      domain: "ponta.com.hr",
      client: "Camp Ponta",
      techStack: "Next.js",
      hosting: "VPS",
      isVps: true,
      currentStatus: "U kontejneru; čeka VPS",
      stage: "WAITING_VPS",
      priority: "URGENT",
      progress: 80,
      price: 550.0,
      isPaid: false,
      docUrl: "https://docs.google.com/document/d/camp-ponta-spec",
      devDevice: "WORKSTATION",
      hasGitBackup: true,
      hasCicd: true,
      notes: `### Camp Ponta Deployment
- **Coolify App UUID:** \`clfy-ponta-app-1120\`
- **Interni Port:** \`3005\`
- **Stanje:** Kontejner testiran lokalno, preostaje preusmjeravanje A zapisa na MyDataKnox VPS IP.`,
    },
    // 4. Mokalo
    {
      domain: "wifi-korcula.com / mokalo.hr",
      client: "Mokalo d.o.o.",
      techStack: "Astro + Payload",
      hosting: "VPS",
      isVps: true,
      currentStatus: "U kontejneru; domena/VPS",
      stage: "WAITING_VPS",
      priority: "URGENT",
      progress: 75,
      price: 899.0,
      isPaid: false,
      docUrl: "https://docs.google.com/document/d/mokalo-spec",
      devDevice: "WORKSTATION",
      hasGitBackup: true,
      hasCicd: true,
      notes: `### Mokalo Wi-Fi & Portal
- **Port:** \`3006\`
- **SSL:** Let's Encrypt auto-renewal preko Coolify Traefika.
- **Naplata:** Čeka odobrenje završnog računa nakon puštanja DNS-a.`,
    },
    // 5. Olea Digitalis
    {
      domain: "oleadigitalis.eu",
      client: "OleaD Vlastiti",
      techStack: "Next.js / Django",
      hosting: "VPS",
      isVps: true,
      currentStatus: "Prebačeno na VPS",
      stage: "IN_PROGRESS",
      priority: "HIGH",
      progress: 90,
      price: null,
      isPaid: true,
      docUrl: "https://drive.google.com/drive/u/0/folders/olead",
      devDevice: "WORKSTATION",
      hasGitBackup: true,
      hasCicd: true,
      notes: `### OleaDigitalis Core
- **Server:** MyDataKnox VPS Master
- **Port:** \`8080\`
- **Usluge:** Glavni landing portal i portfolio agencije OleaD.`,
    },
    // 6. Concrete Tech Solutions
    {
      domain: "concrete-ts.eu",
      client: "Concrete Tech Solutions",
      techStack: "Astro",
      hosting: "VPS",
      isVps: true,
      currentStatus: "Produkcija aktivna",
      stage: "PRODUCTION",
      priority: "NORMAL",
      progress: 100,
      price: 515.0,
      isPaid: true,
      docUrl: "https://docs.google.com/document/d/concrete-spec",
      devDevice: "WORKSTATION",
      hasGitBackup: true,
      hasCicd: true,
      notes: `### Concrete TS
- **Status:** Produkcija 100% stabilna na Coolifyju.
- **Naplata:** Plaćeno u cijelosti.`,
    },
    // 7. Brido / Faca
    {
      domain: "brido.hr",
      client: "Faca d.o.o.",
      techStack: "React",
      hosting: "VPS",
      isVps: true,
      currentStatus: "Čeka dockerizaciju",
      stage: "IN_PROGRESS",
      priority: "HIGH",
      progress: 40,
      price: 30.0,
      isPaid: false,
      docUrl: null,
      devDevice: "LAPTOP",
      hasGitBackup: true,
      hasCicd: false,
      notes: `Potrebno napisati multi-stage Dockerfile za stari React SPA build.`,
    },
    // 8. Porto Rosso
    {
      domain: "lastovo.com.hr",
      client: "Porto Rosso",
      techStack: "Custom Lavre PHP",
      hosting: "TOTOHOST",
      isVps: false,
      currentStatus: "Čeka upgrade",
      stage: "IN_PROGRESS",
      priority: "HIGH",
      progress: 20,
      price: 50.0,
      isPaid: false,
      docUrl: null,
      devDevice: "LAPTOP",
      hasGitBackup: true,
      hasCicd: false,
      notes: `Stari PHP 7.4 skript; prebaciti na novu arhitekturu prije gašenja Totohost paketa.`,
    },
    // 9. Gradski Muzej Korčula
    {
      domain: "gm-korcula.com",
      client: "Gradski Muzej Korčula",
      techStack: "Joomla 3.x / Mail",
      hosting: "TOTOHOST",
      isVps: false,
      currentStatus: "Održavanje i update",
      stage: "MAINTENANCE",
      priority: "NORMAL",
      progress: 100,
      price: 400.0,
      isPaid: true,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: true,
      hasCicd: false,
      notes: `Godišnji ugovor o održavanju web stranice i email servera. Plaćeno.`,
    },
    // 10. Vela Luka Rent
    {
      domain: "velalukarent.com",
      client: "Proizd obrt",
      techStack: "WordPress",
      hosting: "TOTOHOST",
      isVps: false,
      currentStatus: "Totohost",
      stage: "MAINTENANCE",
      priority: "LOW",
      progress: 100,
      price: 30.0,
      isPaid: true,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: false,
      hasCicd: false,
      notes: `Totohost cPanel hosting.`,
    },
    // 11. Korcula.me
    {
      domain: "korcula.me",
      client: "Tomislav FAD / OleaD",
      techStack: "Joomla 5",
      hosting: "TOTOHOST",
      isVps: false,
      currentStatus: "Totohost",
      stage: "MAINTENANCE",
      priority: "LOW",
      progress: 100,
      price: 50.0,
      isPaid: true,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: false,
      hasCicd: false,
      notes: `Ažurirano na Joomla 5.1.`,
    },
    // 12. Dingač
    {
      domain: "dingac.hr",
      client: "IT Video obrt",
      techStack: "WordPress",
      hosting: "TOTOHOST",
      isVps: false,
      currentStatus: "Totohost",
      stage: "MAINTENANCE",
      priority: "LOW",
      progress: 100,
      price: 20.0,
      isPaid: true,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: false,
      hasCicd: false,
      notes: `Statički WordPress blog.`,
    },
    // 13. Atlas
    {
      domain: "atlas.com.hr",
      client: "Obrt Atlas",
      techStack: "React",
      hosting: "TOTOHOST",
      isVps: false,
      currentStatus: "Totohost",
      stage: "MAINTENANCE",
      priority: "LOW",
      progress: 100,
      price: 30.0,
      isPaid: true,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: false,
      hasCicd: false,
      notes: `Totohost static hosting.`,
    },
    // 14. Dallmatia
    {
      domain: "dallmatia.com",
      client: "Davor Bobanac",
      techStack: "Custom PHP 8",
      hosting: "TOTOHOST",
      isVps: false,
      currentStatus: "Totohost",
      stage: "MAINTENANCE",
      priority: "LOW",
      progress: 100,
      price: 30.0,
      isPaid: true,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: false,
      hasCicd: false,
      notes: `PHP 8 skripte na Totohost poslužitelju.`,
    },
    // 15. Suha Marina
    {
      domain: "suhamarina.eu",
      client: "Proizd obrt",
      techStack: "Joomla 5 -> Astro",
      hosting: "TOTOHOST",
      isVps: false,
      currentStatus: "Totohost",
      stage: "IN_PROGRESS",
      priority: "NORMAL",
      progress: 50,
      price: 30.0,
      isPaid: false,
      docUrl: null,
      devDevice: "LAPTOP",
      hasGitBackup: true,
      hasCicd: false,
      notes: `U planu prebacivanje na Astro statički generator i Coolify VPS.`,
    },
    // 16. Terra Dalmatiae
    {
      domain: "terradalmatiae.com",
      client: "Mile Brkanović",
      techStack: "WordPress",
      hosting: "TOTOHOST",
      isVps: false,
      currentStatus: "Totohost",
      stage: "MAINTENANCE",
      priority: "LOW",
      progress: 100,
      price: 25.0,
      isPaid: true,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: false,
      hasCicd: false,
      notes: `Totohost godišnja obnova.`,
    },
    // 17. From Croatia With Love
    {
      domain: "fromcroatiawithlove.com",
      client: "Vlastiti",
      techStack: "Domena",
      hosting: "VPS",
      isVps: true,
      currentStatus: "Test site",
      stage: "BACKLOG",
      priority: "LOW",
      progress: 10,
      price: null,
      isPaid: false,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: false,
      hasCicd: false,
      notes: `Test site i domena parkirana na Coolifyju.`,
    },
  ];

  for (const item of projectsData) {
    const project = await prisma.project.create({
      data: item,
    });

    // Add initial time logs
    if (item.priority === "URGENT") {
      await prisma.timeLog.createMany({
        data: [
          {
            projectId: project.id,
            hours: 2.5,
            description: "Dockerizacija i priprema Coolify webhooka",
            createdAt: new Date(),
          },
          {
            projectId: project.id,
            hours: 1.5,
            description: "Podešavanje Payload CMS sheme i migracija sadržaja",
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        ],
      });
    } else if (item.domain === "oly-bot") {
      await prisma.timeLog.createMany({
        data: [
          {
            projectId: project.id,
            hours: 3.0,
            description: "Povezivanje motornih drivera i testiranje LiFePO4 napajanja na Pi5",
            createdAt: new Date(),
          },
        ],
      });
    }
  }

  console.log(`Seeded ${projectsData.length} real OleaD V2.1 projects successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
