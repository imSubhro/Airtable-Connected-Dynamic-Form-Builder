const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getBases, getTables, createRecord } = require('../services/airtable');
const Form = require('../models/Form');
const Response = require('../models/Response');
const User = require('../models/User');

// @route   GET /api/airtable/bases
// @desc    Get user's Airtable bases
// @access  Private
router.get('/airtable/bases', protect, async (req, res) => {
  try {
    const bases = await getBases(req.user.accessToken);
    res.json(bases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch bases' });
  }
});

// @route   GET /api/airtable/bases/:baseId/tables
// @desc    Get tables for a base
// @access  Private
router.get('/airtable/bases/:baseId/tables', protect, async (req, res) => {
  try {
    const tables = await getTables(req.user.accessToken, req.params.baseId);
    res.json(tables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch tables' });
  }
});

// @route   POST /api/forms
// @desc    Create a new form
// @access  Private
router.post('/forms', protect, async (req, res) => {
  try {
    const { name, airtableBaseId, airtableTableId, fields } = req.body;

    const form = await Form.create({
      userId: req.user._id,
      name,
      airtableBaseId,
      airtableTableId,
      fields
    });

    res.status(201).json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create form' });
  }
});

// @route   GET /api/forms
// @desc    Get user's forms
// @access  Private
router.get('/forms', protect, async (req, res) => {
  try {
    const forms = await Form.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch forms' });
  }
});

// @route   GET /api/forms/:id
// @desc    Get form by ID (Public for viewer, Private for editing?)
// @access  Public (for now, maybe restrict editing)
router.get('/forms/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch form' });
  }
});

// @route   PUT /api/forms/:id
// @desc    Update a form
// @access  Private
router.put('/forms/:id', protect, async (req, res) => {
  try {
    const { name, airtableBaseId, airtableTableId, fields } = req.body;
    let form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Make sure user owns form
    if (form.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    form = await Form.findByIdAndUpdate(
      req.params.id,
      { name, airtableBaseId, airtableTableId, fields },
      { new: true }
    );

    res.json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update form' });
  }
});



// @route   POST /api/forms/:formId/submit
// @desc    Submit a form response
// @access  Public
router.post('/forms/:formId/submit', async (req, res) => {
  try {
    const { answers } = req.body; // Object with fieldId: value
    const form = await Form.findById(req.params.formId);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // 1. Map answers to Airtable field names/IDs
    // The form.fields has the mapping.
    // answers keys should probably be the airtableFieldId or the internal fieldId?
    // Let's assume answers keys are airtableFieldId for simplicity or we match them.
    
    const airtableFields = {};
    
    // Validate and map
    for (const field of form.fields) {
      if (field.isRequired && !answers[field.airtableFieldId]) {
         return res.status(400).json({ message: `Field ${field.fieldName} is required` });
      }
      
      if (answers[field.airtableFieldId]) {
        airtableFields[field.fieldName] = answers[field.airtableFieldId];
      }
    }

    // 2. Save to Airtable
    // We need the user's access token. The form has a userId.
    const user = await User.findById(form.userId);
    if (!user) {
      return res.status(404).json({ message: 'Form owner not found' });
    }

    // TODO: Handle token refresh if expired
    
    let airtableRecord;
    try {
      airtableRecord = await createRecord(
        user.accessToken,
        form.airtableBaseId,
        form.airtableTableId,
        airtableFields
      );
    } catch (err) {
      console.error('Airtable Sync Error:', err.response?.data || err.message);
      // We might still want to save to DB even if Airtable fails, or fail completely?
      // Let's fail for now as sync is a key feature.
      return res.status(502).json({ message: 'Failed to sync with Airtable' });
    }

    // 3. Save to MongoDB
    const response = await Response.create({
      formId: form._id,
      airtableRecordId: airtableRecord.id,
      answers,
      submittedAt: new Date()
    });

    res.status(201).json(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit form' });
  }
});

module.exports = router;
