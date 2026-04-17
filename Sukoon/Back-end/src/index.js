import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Localization Map
const localization = {
  EN: {
    stationBusy: "Station Busy",
    sessionStarted: "Session Started Successfully",
    chargedRenewed: "Charged ... and Renewed",
    notAvailable: "Not Available",
  },
  AR: {
    stationBusy: "المحطة مشغولة",
    sessionStarted: "تم بدء الجلسة بنجاح",
    chargedRenewed: "مشحون ... ومُجدد",
    notAvailable: "غير متوفر",
  }
};

/**
 * Logic Requirement:
 * 1. Asset Management (10 Bays 1-10) - Seeded via Prisma
 * 2. Next available Bay ID (1-10)
 * 3. Unique Sequential Serial Number
 * 4. "Station Busy" if full
 * 5. Localization
 */

// Helper: Generate Sequential Serial Number (e.g., SKN-0001)
const generateSerial = async () => {
  const count = await prisma.session.count();
  return `SKN-${String(count + 1).padStart(4, '0')}`;
};

// Endpoint to get available bays count
app.get('/api/bays/available', async (req, res) => {
  try {
    const count = await prisma.bay.count({ where: { isAvailable: true } });
    return res.json({ count });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
});

// Helper: Complete Session
const completeSession = async (sessionId) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: parseInt(sessionId) },
      include: { bay: true }
    });

    if (!session || session.status === 'completed') return;

    await prisma.$transaction([
      prisma.session.update({
        where: { id: session.id },
        data: { status: 'completed', batteryLevel: 100 }
      }),
      prisma.bay.update({
        where: { id: session.bayId },
        data: { isAvailable: true }
      })
    ]);
    console.log(`Session ${sessionId} completed automatically/manually.`);
  } catch (error) {
    console.error('Error completing session:', error);
  }
};

// Endpoint to start a session
app.post('/api/sessions/start', async (req, res) => {
  const { chargeType, language = 'EN' } = req.body;
  const lang = (language.toUpperCase() === 'AR') ? 'AR' : 'EN';
  console.log(`Incoming request: Start ${chargeType} session (${lang})`);

  try {
    const bay = await prisma.bay.findFirst({
      where: { isAvailable: true },
      orderBy: { id: 'asc' }
    });

    console.log(`Bay search result: ${bay ? 'Bay ' + bay.id + ' found' : 'No bay available'}`);

    if (!bay) {
      return res.status(400).json({ status: localization[lang].stationBusy });
    }

    const serial = await generateSerial();
    // Improved check: handles English 'super' and Arabic 'الفائق'
    const isSuper = chargeType.toLowerCase().includes('super') || chargeType.includes('الفائق');
    const estimatedTime = isSuper ? "1m" : "2.5m";
    const durationMs = isSuper ? 60 * 1000 : 2.5 * 60 * 1000;

    const [updatedBay, session] = await prisma.$transaction([
      prisma.bay.update({
        where: { id: bay.id },
        data: { isAvailable: false }
      }),
      prisma.session.create({
        data: {
          serialNumber: serial,
          bayId: bay.id,
          chargeType,
          language: lang,
          status: 'active',
          batteryLevel: 0
        }
      })
    ]);

    // Auto-terminate logic
    setTimeout(() => {
      completeSession(session.id);
    }, durationMs);

    return res.status(201).json({
      message: localization[lang].sessionStarted,
      session: {
        id: session.id,
        serialNumber: session.serialNumber,
        bayId: session.bayId,
        chargeType: session.chargeType,
        estimatedTime: estimatedTime
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

// Endpoint to manually complete a session
app.post('/api/sessions/:id/complete', async (req, res) => {
  const { id } = req.params;
  await completeSession(id);
  return res.json({ message: "Session Completed" });
});

// Endpoint to simulate progress/battery level
app.post('/api/sessions/:id/update', async (req, res) => {
  const { id } = req.params;
  const { batteryLevel } = req.body;

  try {
    const session = await prisma.session.findUnique({
      where: { id: parseInt(id) },
      include: { bay: true }
    });

    if (!session) return res.status(404).json({ error: "Session Not Found" });

    let data = { batteryLevel };
    let responseMessage = "Progress Updated";

    if (batteryLevel >= 100) {
      await completeSession(id);
      responseMessage = localization[session.language].chargedRenewed;
    } else {
      await prisma.session.update({
        where: { id: parseInt(id) },
        data
      });
    }

    return res.json({
      message: responseMessage,
      session: await prisma.session.findUnique({ where: { id: parseInt(id) } })
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

// Startup: Clean up any stale sessions and reset all bays to available
(async () => {
  try {
    console.log('--- Server Startup / Resetting Bays ---');
    await prisma.bay.updateMany({
      data: { isAvailable: true }
    });
    await prisma.session.updateMany({
      where: { status: 'active' },
      data: { status: 'completed', batteryLevel: 100 }
    });
    const totalBays = await prisma.bay.count();
    const availableBays = await prisma.bay.count({ where: { isAvailable: true } });
    console.log(`Bays Status: ${availableBays}/${totalBays} available.`);
    console.log('---------------------------------------');
  } catch (error) {
    console.error('Error during startup reset:', error);
  }
})();

app.listen(PORT, () => {
  console.log(`Sukoon Backend listening on port ${PORT}`);
});
