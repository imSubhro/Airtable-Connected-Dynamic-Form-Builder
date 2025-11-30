const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  airtableBaseId: {
    type: String,
    required: true
  },
  airtableTableId: {
    type: String,
    required: true
  },
  fields: [{
    airtableFieldId: String,
    fieldName: String,
    fieldType: String,
    isRequired: {
      type: Boolean,
      default: false
    },
    conditionalLogic: {
      enabled: {
        type: Boolean,
        default: false
      },
      operator: {
        type: String,
        enum: ['AND', 'OR'],
        default: 'AND'
      },
      conditions: [{
        fieldId: String,
        operator: String, // e.g., 'equals', 'not_equals', 'contains'
        value: mongoose.Schema.Types.Mixed
      }]
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Form', formSchema);
