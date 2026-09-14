import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding OleaD Board (ODB) V2.5 database with WHM setup dates, hosting and payment status...");

  // Clear existing data
  await prisma.timeLog.deleteMany();
  await prisma.project.deleteMany();
  await prisma.potentialLead.deleteMany();
  await prisma.systemSetting.deleteMany();

  // Seed system settings
  await prisma.systemSetting.createMany({
    data: [
      { key: "weekly_hours_target", value: "35" },
      { key: "monthly_revenue_target", value: "3500" },
      { key: "vps_server", value: "MyDataKnox VPS (Coolify Engine)" },
    ],
  });

  // Projects data with exact WHM setup dates, cPanel users and disk usage
  const projectsData = [
    // ===== TOTOHOST (cPanel/WHM) projekti =====
    {
      domain: "gm-korcula.com",
      altDomains: null,
      client: "Gradski Muzej Korčula",
      techStack: "Joomla 3.x / Mail",
      projectType: "MAINTENANCE",
      hosting: "TOTOHOST",
      isVps: false,
      cpanelUser: "gmkorcul",
      diskUsageMb: 7168, // 7.0 GB
      currentStatus: "Održavanje i update",
      stage: "MAINTENANCE",
      priority: "NORMAL",
      progress: 100,
      devPrice: 400.0,
      isDevPaid: true,
      hostingPrice: 80.0,
      isHostingPaid: true,
      setupDate: new Date("2007-08-16T13:31:00Z"),
      deadlineDate: null,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: true,
      hasCicd: false,
      notes: `Godišnji ugovor o održavanju web stranice i email servera. Plaćeno.`,
    },
    {
      domain: "korcula.me",
      altDomains: null,
      client: "Tomislav FAD / OleaD",
      techStack: "Joomla 5",
      projectType: "MAINTENANCE",
      hosting: "TOTOHOST",
      isVps: false,
      cpanelUser: "korculme",
      diskUsageMb: 2970, // 2.9 GB
      currentStatus: "Totohost",
      stage: "MAINTENANCE",
      priority: "LOW",
      progress: 100,
      devPrice: 50.0,
      isDevPaid: true,
      hostingPrice: 60.0,
      isHostingPaid: true,
      setupDate: new Date("2008-10-29T10:14:00Z"),
      deadlineDate: null,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: false,
      hasCicd: false,
      notes: `Ažurirano na Joomla 5.1.`,
    },
    {
      domain: "fromcroatiawithlove.com",
      altDomains: null,
      client: "Vlastiti",
      techStack: "Domena",
      projectType: "WEB",
      hosting: "TOTOHOST",
      isVps: false,
      cpanelUser: "fromcroa",
      diskUsageMb: 2765, // 2.7 GB
      currentStatus: "Test site",
      stage: "BACKLOG",
      priority: "LOW",
      progress: 10,
      devPrice: null,
      isDevPaid: false,
      hostingPrice: 30.0,
      isHostingPaid: false,
      setupDate: new Date("2009-11-08T11:41:00Z"),
      deadlineDate: null,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: false,
      hasCicd: false,
      notes: `Test site i domena parkirana.`,
    },
    {
      domain: "wifi-korcula.com",
      altDomains: "mokalo.hr",
      client: "Mokalo d.o.o.",
      techStack: "Astro + Payload",
      projectType: "WEB",
      hosting: "VPS",
      isVps: true,
      cpanelUser: "wifikorc",
      diskUsageMb: 5837, // 5.7 GB
      currentStatus: "U kontejneru; domena/VPS",
      stage: "WAITING_VPS",
      priority: "URGENT",
      progress: 75,
      devPrice: 899.0,
      isDevPaid: false,
      hostingPrice: 120.0,
      isHostingPaid: false,
      setupDate: new Date("2010-06-16T09:56:00Z"),
      deadlineDate: null,
      docUrl: "https://docs.google.com/document/d/mokalo-spec",
      devDevice: "WORKSTATION",
      hasGitBackup: true,
      hasCicd: true,
      notes: `### Mokalo Wi-Fi & Portal
- **Port:** \`3006\`
- **SSL:** Let's Encrypt auto-renewal preko Coolify Traefika.
- **Naplata:** Čeka odobrenje završnog računa nakon puštanja DNS-a.`,
    },
    {
      domain: "lastovo.com.hr",
      altDomains: null,
      client: "Porto Rosso",
      techStack: "Custom Lavre PHP",
      projectType: "WEB",
      hosting: "TOTOHOST",
      isVps: false,
      cpanelUser: "lastovoc",
      diskUsageMb: 1229, // 1.2 GB
      currentStatus: "Čeka upgrade",
      stage: "IN_PROGRESS",
      priority: "HIGH",
      progress: 20,
      devPrice: 50.0,
      isDevPaid: false,
      hostingPrice: 40.0,
      isHostingPaid: false,
      setupDate: new Date("2010-11-28T18:12:00Z"),
      deadlineDate: null,
      docUrl: null,
      devDevice: "LAPTOP",
      hasGitBackup: true,
      hasCicd: false,
      notes: `Stari PHP 7.4 skript; prebaciti na novu arhitekturu prije gašenja Totohost paketa.`,
    },
    {
      domain: "dingac.hr",
      altDomains: null,
      client: "IT Video obrt",
      techStack: "WordPress",
      projectType: "MAINTENANCE",
      hosting: "TOTOHOST",
      isVps: false,
      cpanelUser: "dingacko",
      diskUsageMb: 22733, // 22.2 GB
      currentStatus: "Totohost",
      stage: "MAINTENANCE",
      priority: "LOW",
      progress: 100,
      devPrice: 20.0,
      isDevPaid: true,
      hostingPrice: 35.0,
      isHostingPaid: true,
      setupDate: new Date("2011-10-17T14:19:00Z"),
      deadlineDate: null,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: false,
      hasCicd: false,
      notes: `Statički WordPress blog.`,
    },
    {
      domain: "dallmatia.com",
      altDomains: null,
      client: "Davor Bobanac",
      techStack: "Custom PHP 8",
      projectType: "WEB",
      hosting: "TOTOHOST",
      isVps: false,
      cpanelUser: "dallmati",
      diskUsageMb: 5632, // 5.5 GB
      currentStatus: "Totohost",
      stage: "MAINTENANCE",
      priority: "LOW",
      progress: 100,
      devPrice: 30.0,
      isDevPaid: true,
      hostingPrice: 45.0,
      isHostingPaid: true,
      setupDate: new Date("2011-10-24T18:06:00Z"),
      deadlineDate: null,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: false,
      hasCicd: false,
      notes: `PHP 8 skripte na Totohost poslužitelju.`,
    },
    {
      domain: "atlas.com.hr",
      altDomains: null,
      client: "Obrt Atlas",
      techStack: "React",
      projectType: "WEB",
      hosting: "TOTOHOST",
      isVps: false,
      cpanelUser: "atlascom",
      diskUsageMb: 2970, // 2.9 GB
      currentStatus: "Totohost",
      stage: "MAINTENANCE",
      priority: "LOW",
      progress: 100,
      devPrice: 30.0,
      isDevPaid: true,
      hostingPrice: 30.0,
      isHostingPaid: true,
      setupDate: new Date("2012-09-17T15:40:00Z"),
      deadlineDate: null,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: false,
      hasCicd: false,
      notes: `Totohost static hosting.`,
    },
    {
      domain: "terradalmatiae.com",
      altDomains: null,
      client: "Mile Brkanović",
      techStack: "WordPress",
      projectType: "MAINTENANCE",
      hosting: "TOTOHOST",
      isVps: false,
      cpanelUser: "terradal",
      diskUsageMb: 1024, // 1.0 GB
      currentStatus: "Totohost",
      stage: "MAINTENANCE",
      priority: "LOW",
      progress: 100,
      devPrice: 25.0,
      isDevPaid: true,
      hostingPrice: 30.0,
      isHostingPaid: true,
      setupDate: new Date("2014-03-13T08:06:00Z"),
      deadlineDate: null,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: false,
      hasCicd: false,
      notes: `Totohost godišnja obnova.`,
    },
    {
      domain: "suhamarina.eu",
      altDomains: null,
      client: "Proizd obrt",
      techStack: "Joomla 5 -> Astro",
      projectType: "WEB",
      hosting: "TOTOHOST",
      isVps: false,
      cpanelUser: "suhaman",
      diskUsageMb: 589, // 589 MB
      currentStatus: "Totohost",
      stage: "IN_PROGRESS",
      priority: "NORMAL",
      progress: 50,
      devPrice: 30.0,
      isDevPaid: false,
      hostingPrice: 25.0,
      isHostingPaid: false,
      setupDate: new Date("2015-03-27T12:11:00Z"),
      deadlineDate: null,
      docUrl: null,
      devDevice: "LAPTOP",
      hasGitBackup: true,
      hasCicd: false,
      notes: `U planu prebacivanje na Astro statički generator i Coolify VPS.`,
    },
    {
      domain: "ponta.com.hr",
      altDomains: null,
      client: "Camp Ponta",
      techStack: "Next.js",
      projectType: "WEB",
      hosting: "VPS",
      isVps: true,
      cpanelUser: "pontacom",
      diskUsageMb: 5939, // 5.8 GB
      currentStatus: "U kontejneru; čeka VPS",
      stage: "WAITING_VPS",
      priority: "URGENT",
      progress: 80,
      devPrice: 550.0,
      isDevPaid: false,
      hostingPrice: 150.0,
      isHostingPaid: false,
      setupDate: new Date("2020-06-03T19:38:00Z"),
      deadlineDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
      docUrl: "https://docs.google.com/document/d/camp-ponta-spec",
      devDevice: "WORKSTATION",
      hasGitBackup: true,
      hasCicd: true,
      notes: `### Camp Ponta Deployment
- **Coolify App UUID:** \`clfy-ponta-app-1120\`
- **Interni Port:** \`3005\`
- **Stanje:** Kontejner testiran lokalno, preostaje preusmjeravanje A zapisa na MyDataKnox VPS IP.`,
    },
    {
      domain: "velalukarent.com",
      altDomains: null,
      client: "Proizd obrt",
      techStack: "WordPress",
      projectType: "MAINTENANCE",
      hosting: "TOTOHOST",
      isVps: false,
      cpanelUser: "velalukarent",
      diskUsageMb: 4198, // 4.1 GB
      currentStatus: "Totohost",
      stage: "MAINTENANCE",
      priority: "LOW",
      progress: 100,
      devPrice: 30.0,
      isDevPaid: true,
      hostingPrice: 40.0,
      isHostingPaid: true,
      setupDate: new Date("2020-06-15T21:01:00Z"),
      deadlineDate: null,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: false,
      hasCicd: false,
      notes: `Totohost cPanel hosting.`,
    },
    {
      domain: "gradskimuzej-korcula.hr",
      altDomains: null,
      client: "Gradski Muzej Korčula",
      techStack: "Joomla 4",
      projectType: "MAINTENANCE",
      hosting: "TOTOHOST",
      isVps: false,
      cpanelUser: "gmkor",
      diskUsageMb: 852, // 852 MB
      currentStatus: "Održavanje",
      stage: "MAINTENANCE",
      priority: "NORMAL",
      progress: 100,
      devPrice: 300.0,
      isDevPaid: true,
      hostingPrice: 60.0,
      isHostingPaid: true,
      setupDate: new Date("2022-01-19T18:34:00Z"),
      deadlineDate: null,
      docUrl: null,
      devDevice: "WORKSTATION",
      hasGitBackup: true,
      hasCicd: false,
      notes: `Zasebna domena i hosting paket muzeja (gmkor).`,
    },
    {
      domain: "oleadigitalis.eu",
      altDomains: null,
      client: "OleaD Vlastiti",
      techStack: "Next.js / Django",
      projectType: "WEB",
      hosting: "VPS",
      isVps: true,
      cpanelUser: "oleadigieu",
      diskUsageMb: 11674, // 11.4 GB
      currentStatus: "Prebačeno na VPS",
      stage: "IN_PROGRESS",
      priority: "HIGH",
      progress: 90,
      devPrice: null,
      isDevPaid: true,
      hostingPrice: 0.0,
      isHostingPaid: true,
      setupDate: new Date("2025-09-01T14:23:00Z"),
      deadlineDate: null,
      docUrl: "https://drive.google.com/drive/u/0/folders/olead",
      devDevice: "WORKSTATION",
      hasGitBackup: true,
      hasCicd: true,
      notes: `### OleaDigitalis Core
- **Server:** MyDataKnox VPS Master
- **Port:** \`8080\`
- **Usluge:** Glavni landing portal i portfolio agencije OleaD.`,
    },
    {
      domain: "brido.hr",
      altDomains: null,
      client: "Faca d.o.o.",
      techStack: "React",
      projectType: "WEB",
      hosting: "TOTOHOST",
      isVps: false,
      cpanelUser: "brido",
      diskUsageMb: 19, // 19 MB
      currentStatus: "Čeka dockerizaciju",
      stage: "IN_PROGRESS",
      priority: "HIGH",
      progress: 40,
      devPrice: 30.0,
      isDevPaid: false,
      hostingPrice: 20.0,
      isHostingPaid: false,
      setupDate: new Date("2025-09-16T12:48:00Z"),
      deadlineDate: null,
      docUrl: null,
      devDevice: "LAPTOP",
      hasGitBackup: true,
      hasCicd: false,
      notes: `Potrebno napisati multi-stage Dockerfile za stari React SPA build.`,
    },

    // ===== Coolify VPS projekti (aktivan razvoj) =====
    {
      domain: "marcopolosport.com",
      altDomains: null,
      client: "Marko Polo Sport",
      techStack: "Astro, Payload CMS",
      projectType: "WEB",
      hosting: "VPS",
      isVps: true,
      cpanelUser: null,
      diskUsageMb: null,
      currentStatus: "Joomla -> Astro/Payload migracija. Funkcionalni test na VPS aktivan.",
      stage: "IN_PROGRESS",
      priority: "URGENT",
      progress: 60,
      devPrice: 650.0,
      isDevPaid: false,
      hostingPrice: 120.0,
      isHostingPaid: false,
      setupDate: new Date("2026-09-01T09:00:00Z"),
      deadlineDate: null,
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
    {
      domain: "oly-bot",
      altDomains: null,
      client: "OleaD R&D (Agrotech)",
      techStack: "Raspberry Pi 5, Python, ROS 2, LiFePO4",
      projectType: "HARDWARE_IOT",
      hosting: "VPS",
      isVps: false,
      cpanelUser: null,
      diskUsageMb: null,
      currentStatus: "Rana faza testiranja autonomije, motora i napajanja na Pi5.",
      stage: "IN_PROGRESS",
      priority: "HIGH",
      progress: 30,
      devPrice: null,
      isDevPaid: false,
      hostingPrice: 0.0,
      isHostingPaid: true,
      setupDate: new Date("2026-06-15T10:00:00Z"),
      deadlineDate: null,
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

  // Seed PotentialLeads (Pipeline / Najave mogućih poslova)
  const leadsData = [
    {
      title: "Web shop uljara",
      clientName: "OPG Ivanda",
      estimatedValue: 1200.0,
      probability: 60,
      status: "PROPOSAL_SENT",
      notes: "Žele webshop s lokalnom dostavom; dogovorena prva verzija u 4 tjedna.",
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Redizajn stranice za vinariju",
      clientName: "Vinarija Dingač",
      estimatedValue: 800.0,
      probability: 40,
      status: "INQUIRY",
      notes: "Inicijalni e-mail; traže konkretniju ponudu za novu brand stranicu.",
      targetDate: null,
    },
    {
      title: "Održavanje webshopa (godišnje)",
      clientName: "Proizd obrt",
      estimatedValue: 300.0,
      probability: 80,
      status: "NEGOTIATION",
      notes: "Proširenje postojećeg ugovora o održavanju za još jedan paket.",
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  ];

  await prisma.potentialLead.createMany({
    data: leadsData,
  });

  console.log(`Seeded ${projectsData.length} OleaD V2.5 projects and ${leadsData.length} potential leads successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });