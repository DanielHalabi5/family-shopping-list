import { Router } from 'express';
import jwt from 'jsonwebtoken';
import prisma from './prisma.js';
import cors from 'cors';
import middleware from './middleware.js';

const router = Router();

router.use(cors());
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

const { sign } = jwt;

router.post('/', async (req, res) => {
  const { userId, familyId } = req.body;

  try {
    const existing = await prisma.familyJoinRequest.findFirst({
      where: { userId, familyId },
    });

    if (existing)
      return res.status(409).json({ error: 'Join Request was Already Sent!' });

    const request = await prisma.familyJoinRequest.create({
      data: {
        userId: userId,
        familyId: familyId,
        status: 'PENDING',
      },
    });

    res.json({
      request: {
        id: request.id,
        userId: userId,
        familyId: familyId,
        status: 'PENDING',
      },
    });
  } catch (err) {
    console.error('Full error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/:id', middleware, async (req, res) => {
  const requestId = req.params.id;
  const { action } = req.body;
  const ownerId = req.user.id;

  try {
    const request = await prisma.familyJoinRequest.findUnique({
      where: { id: parseInt(requestId) },
      include: { family: true, user: true },
    });

    if (!request) return res.status(404).json({ err: 'Request not found' });

    if (request.family.ownerId !== ownerId)
      return res.status(403).json({ err: 'Not authorized' });

    if (action === 'APPROVE') {
      await prisma.user.update({
        where: { id: request.userId },
        data: { familyId: request.familyId },
      });

      await prisma.familyJoinRequest.update({
        where: { id: request.id },
        data: { status: 'APPROVED' },
      });
    } else if (action === 'REJECT') {
      await prisma.familyJoinRequest.update({
        where: { id: request.id },
        data: { status: 'REJECTED' },
      });
    } else {
      return res.status(400).json({ err: 'Invalid action' });
    }

    res.json({ message: `Request ${action.toLowerCase()}ed successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Server error', details: err.message });
  }
});

router.get('/pending', middleware, async (req, res) => {
  try {
    const family = await prisma.family.findUnique({
      where: { ownerId: req.user.id }
    });

    if (!family) {
      return res.status(403).json({ error: 'Not a family owner' });
    }

    const requests = await prisma.familyJoinRequest.findMany({
      where: {
        familyId: family.id,
        status: 'PENDING'
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
