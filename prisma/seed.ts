import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Create session types
  const powerPlay = await prisma.sessionType.upsert({
    where: { id: 'power-play' },
    update: {
      name: 'POWER PLAY',
      description: 'Move with intent. A session encompassing full body movement patterns with speed and impetus creating the appropriate stimulus to unlock our bodies full potential.',
    },
    create: {
      id: 'power-play',
      name: 'POWER PLAY',
      description: 'Move with intent. A session encompassing full body movement patterns with speed and impetus creating the appropriate stimulus to unlock our bodies full potential.',
    },
  })

  const liftAndShift = await prisma.sessionType.upsert({
    where: { id: 'lift-and-shift' },
    update: {
      name: 'LIFT & SHIFT',
      description: 'Strength-focused classes derived from professional training experience, centering on compound movement patterns with progressive training blocks and form-focused progressions/regressions.',
    },
    create: {
      id: 'lift-and-shift',
      name: 'LIFT & SHIFT',
      description: 'Strength-focused classes derived from professional training experience, centering on compound movement patterns with progressive training blocks and form-focused progressions/regressions.',
    },
  })

  const engineRoom = await prisma.sessionType.upsert({
    where: { id: 'engine-room' },
    update: {
      name: 'ENGINE ROOM',
      description: 'Designed to build cardiovascular fitness and fatigue tolerance through high-intensity mixed modality workouts that test aerobic capacity.',
    },
    create: {
      id: 'engine-room',
      name: 'ENGINE ROOM',
      description: 'Designed to build cardiovascular fitness and fatigue tolerance through high-intensity mixed modality workouts that test aerobic capacity.',
    },
  })

  const cardioClub = await prisma.sessionType.upsert({
    where: { id: 'cardio-club' },
    update: {
      name: 'CARDIO CLUB',
      description: 'Saturday group sessions - a high intensity, lung busting workout featuring mixed modalities in a supportive community environment.',
    },
    create: {
      id: 'cardio-club',
      name: 'CARDIO CLUB',
      description: 'Saturday group sessions - a high intensity, lung busting workout featuring mixed modalities in a supportive community environment.',
    },
  })

  const mumClub = await prisma.sessionType.upsert({
    where: { id: 'mum-club' },
    update: {
      name: 'MUM CLUB',
      description: 'A safe, supportive, and energising space for mums to move, sweat, and connect. Focused on strength rebuilding and mental wellness.',
    },
    create: {
      id: 'mum-club',
      name: 'MUM CLUB',
      description: 'A safe, supportive, and energising space for mums to move, sweat, and connect. Focused on strength rebuilding and mental wellness.',
    },
  })

  console.log('Created session types:', { powerPlay, liftAndShift, engineRoom, cardioClub, mumClub })

  // Create sessions (time slots)
  const sessions = [
    // Monday - Power Play
    { id: 'mon-1', sessionTypeId: 'power-play', dayOfWeek: 1, startTime: '06:15', endTime: '07:00' },
    { id: 'mon-2', sessionTypeId: 'power-play', dayOfWeek: 1, startTime: '18:00', endTime: '18:45' },
    // Tuesday - Engine Room
    { id: 'tue-1', sessionTypeId: 'engine-room', dayOfWeek: 2, startTime: '07:00', endTime: '07:45' },
    { id: 'tue-2', sessionTypeId: 'engine-room', dayOfWeek: 2, startTime: '18:00', endTime: '18:45' },
    // Wednesday - Lift and Shift
    { id: 'wed-1', sessionTypeId: 'lift-and-shift', dayOfWeek: 3, startTime: '06:15', endTime: '07:00' },
    { id: 'wed-2', sessionTypeId: 'lift-and-shift', dayOfWeek: 3, startTime: '07:15', endTime: '08:00' },
    { id: 'wed-3', sessionTypeId: 'mum-club', dayOfWeek: 3, startTime: '10:00', endTime: '10:45' },
    { id: 'wed-4', sessionTypeId: 'lift-and-shift', dayOfWeek: 3, startTime: '17:45', endTime: '18:30' },
    // Thursday - Power Play
    { id: 'thu-1', sessionTypeId: 'power-play', dayOfWeek: 4, startTime: '06:15', endTime: '07:00' },
    { id: 'thu-2', sessionTypeId: 'power-play', dayOfWeek: 4, startTime: '18:00', endTime: '18:45' },
    // Friday - Lift and Shift
    { id: 'fri-1', sessionTypeId: 'lift-and-shift', dayOfWeek: 5, startTime: '06:15', endTime: '07:00' },
    { id: 'fri-2', sessionTypeId: 'lift-and-shift', dayOfWeek: 5, startTime: '07:15', endTime: '08:00' },
    // Saturday - Cardio Club
    { id: 'sat-1', sessionTypeId: 'cardio-club', dayOfWeek: 6, startTime: '08:00', endTime: '08:45' },
    { id: 'sat-2', sessionTypeId: 'cardio-club', dayOfWeek: 6, startTime: '09:00', endTime: '09:45' },
  ]

  for (const session of sessions) {
    await prisma.session.upsert({
      where: { id: session.id },
      update: {
        sessionTypeId: session.sessionTypeId,
        dayOfWeek: session.dayOfWeek,
        startTime: session.startTime,
        endTime: session.endTime,
      },
      create: {
        id: session.id,
        sessionTypeId: session.sessionTypeId,
        dayOfWeek: session.dayOfWeek,
        startTime: session.startTime,
        endTime: session.endTime,
        maxCapacity: 10,
        isPrivate: false,
      },
    })
  }

  console.log(`Created ${sessions.length} sessions`)

  // Create site config with updated pricing
  const siteConfig = await prisma.siteConfig.upsert({
    where: { id: 'default' },
    update: {
      sessionPrice: 15.00, // Indoor class price
      currency: 'GBP',
    },
    create: {
      id: 'default',
      sessionPrice: 15.00,
      currency: 'GBP',
    },
  })

  console.log('Created site config:', siteConfig)

  // Create credit packages
  const creditPackages = [
    { id: 'single', name: 'Single Session', sessionCount: 1, price: 15.00, sortOrder: 0 },
    { id: 'pack-5', name: '5 Session Pack', sessionCount: 5, price: 65.00, sortOrder: 1 },
    { id: 'pack-10', name: '10 Session Pack', sessionCount: 10, price: 120.00, sortOrder: 2 },
    { id: 'pack-20', name: '20 Session Pack', sessionCount: 20, price: 220.00, sortOrder: 3 },
  ]

  for (const pkg of creditPackages) {
    await prisma.creditPackage.upsert({
      where: { id: pkg.id },
      update: {
        name: pkg.name,
        sessionCount: pkg.sessionCount,
        price: pkg.price,
        sortOrder: pkg.sortOrder,
        isActive: true,
      },
      create: {
        id: pkg.id,
        name: pkg.name,
        sessionCount: pkg.sessionCount,
        price: pkg.price,
        sortOrder: pkg.sortOrder,
        isActive: true,
      },
    })
  }

  console.log(`Created ${creditPackages.length} credit packages`)

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
