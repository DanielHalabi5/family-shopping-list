import { Router } from 'express';
import jwt from 'jsonwebtoken';
import prisma from './prisma.js';
import auth from './middleware.js';
import cors from 'cors';

const router = Router();
router.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

const { sign } = jwt;

router.post('/create', async (req, res) => {
  const { name, userId } = req.body;
  if (!name) return res.status(400).json({ error: 'Family name required!' });

  try {
    const oneFamilyUser = await prisma.family.findUnique({
      where: { ownerId: userId },
    });
    if (oneFamilyUser)
      return res.status(409).json({ error: 'This User already has a Family!' });

    const family = await prisma.family.create({
      data: { name, ownerId: userId },
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { familyId: family.id },
      select: { id: true, name: true, email: true, familyId: true },
    });

    const token = sign(
      {
        userId: updatedUser.id,
        email: updatedUser.email,
        familyId: family.id,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: updatedUser,
      family: {
        id: family.id,
        name: family.name,
        ownerId: userId,
        members: [userId],
      },
    });
  } catch (error) {
    console.error('Full error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const family = await prisma.family.findUnique({
      where: { id: req.user.familyId },
      include: {
        members: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!family) {
      return res.json([]);
    }

    res.json([family]);
  } catch (err) {
    console.error('Fetch family error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const familyId = Number(req.params.id);
  const { userId } = req.body;

  try {
    const family = await prisma.family.findUnique({ where: { id: familyId } });
    if (!family) return res.status(404).json({ error: 'Family not found' });

    if (family.ownerId !== req.user.id)
      return res.status(403).json({ error: 'Forbidden' });

    await prisma.user.update({
      where: { id: userId },
      data: { familyId: null },
    });

    res.json({ message: `User was successfully removed from the family.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/details', auth, async (req, res) => {
  try {
    const family = await prisma.family.findUnique({
      where: { id: req.user.familyId },
      include: {
        owner: { select: { id: true, name: true } },
        members: { select: { id: true, name: true } },
      },
    });
    res.json(family);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/member/:memberId', auth, async (req, res) => {
  const memberId = parseInt(req.params.memberId);
  const ownerId = req.user.id;

  try {
    const family = await prisma.family.findUnique({
      where: { ownerId: ownerId },
    });

    if (!family) {
      return res
        .status(403)
        .json({ error: 'Not authorized - not a family owner' });
    }

    if (memberId === ownerId) {
      return res.status(400).json({ error: 'Cannot kick yourself' });
    }

    await prisma.user.update({
      where: { id: memberId },
      data: { familyId: null },
    });

    res.json({ message: 'Member removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

export default router;
