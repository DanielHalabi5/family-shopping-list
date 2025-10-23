import { Router } from 'express';
import prisma from './prisma.js';
import auth from './middleware.js';

const router = Router();

router.use(auth);

// next Saturday
function getNextSaturday() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + daysUntilSaturday);
  nextSaturday.setHours(23, 59, 59, 999);
  return nextSaturday;
}

// the current week's Monday
function getThisMonday() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + daysToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}


router.get('/current', async (req, res) => {
  if (!req.user.familyId) {
    return res.status(400).json({ error: 'User must be part of a family' });
  }

  try {
    const today = new Date();
    const thisMonday = getThisMonday();
    const nextSaturday = getNextSaturday();

    await prisma.shoppingList.updateMany({
      where: {
        familyId: req.user.familyId,
        archived: false,
        dueDate: { lt: today },
      },
      data: { archived: true },
    });

    let currentList = await prisma.shoppingList.findFirst({
      where: {
        familyId: req.user.familyId,
        archived: false,
        dueDate: { gte: today },
      },
      include: {
        items: {
          include: {
            owner: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!currentList) {
      currentList = await prisma.shoppingList.create({
        data: {
          title: 'Weekly Shopping List',
          startDate: thisMonday,
          dueDate: nextSaturday,
          familyId: req.user.familyId,
        },
        include: {
          items: {
            include: {
              owner: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });
    }

    res.json(currentList);
  } catch (err) {
    console.error('Get current list error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// lists for the family (including archived)
router.get('/all', async (req, res) => {
  if (!req.user.familyId) {
    return res.status(400).json({ error: 'User must be part of a family' });
  }

  try {
    const lists = await prisma.shoppingList.findMany({
      where: { familyId: req.user.familyId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            owner: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    res.json(lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;