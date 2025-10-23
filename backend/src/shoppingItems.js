import { Router } from 'express';
import prisma from './prisma.js';
import auth from './middleware.js';

const router = Router();

router.use(auth);

// Create a new shopping item
router.post('/', async (req, res) => {
  const { name, quantity, listId } = req.body;

  if (!name || !listId) {
    return res.status(400).json({ error: 'Name and listId are required' });
  }

  try {
    const list = await prisma.shoppingList.findUnique({
      where: { id: listId },
    });

    if (!list || list.familyId !== req.user.familyId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const shoppingItem = await prisma.shoppingItem.create({
      data: {
        name,
        quantity,
        familyId: req.user.familyId,
        listId,
        ownerId: req.user.id,
        status: 'INCLUDED',
      },
      include: {
        owner: {
          select: { id: true, name: true },
        },
      },
    });

    res.json(shoppingItem);
  } catch (err) {
    console.error('Create item error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get all items for a specific list
router.get('/list/:listId', async (req, res) => {
  const listId = req.params.listId;

  try {
    const shoppingItems = await prisma.shoppingItem.findMany({
      where: {
        listId,
        familyId: req.user.familyId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: { id: true, name: true },
        },
      },
    });

    res.json(shoppingItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single item by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const shoppingItem = await prisma.shoppingItem.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true },
        },
        list: {
          select: { id: true, title: true },
        },
      },
    });

    if (!shoppingItem || shoppingItem.familyId !== req.user.familyId) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(shoppingItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { name, quantity, status, purchased } = req.body;

  try {
    const shoppingItem = await prisma.shoppingItem.findUnique({
      where: { id },
    });

    if (!shoppingItem || shoppingItem.familyId !== req.user.familyId) {
      return res.status(404).json({ error: 'Not found' });
    }

    let finalStatus = status;
    if (purchased !== undefined) {
      finalStatus = purchased ? 'PURCHASED' : 'INCLUDED';
    }

    const updated = await prisma.shoppingItem.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(quantity !== undefined && { quantity }),
        ...(finalStatus && { status: finalStatus }),
      },
      include: {
        owner: {
          select: { id: true, name: true },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an item
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const shoppingItem = await prisma.shoppingItem.findUnique({
      where: { id },
    });

    if (!shoppingItem || shoppingItem.familyId !== req.user.familyId) {
      return res.status(404).json({ error: 'Not found' });
    }


    await prisma.shoppingItem.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;