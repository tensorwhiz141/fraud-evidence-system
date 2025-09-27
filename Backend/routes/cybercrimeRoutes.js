const express = require('express');
const router = express.Router();
const CybercrimeContact = require('../models/CybercrimeContact');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// Get all cybercrime contacts (public endpoint for police station selection)
router.get('/contacts', async (req, res) => {
  try {
    const { state, city, specialization, priority, search } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    
    if (state) {
      filter.state = { $regex: state, $options: 'i' };
    }
    
    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }
    
    if (specialization) {
      filter.specialization = { $regex: specialization, $options: 'i' };
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (search) {
      filter.$or = [
        { officerDesignation: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }
    
    const contacts = await CybercrimeContact.find(filter)
      .select('officerDesignation address email mobile telephone state city specialization priority')
      .sort({ priority: -1, state: 1, city: 1 });
    
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching cybercrime contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cybercrime contacts'
    });
  }
});

// Get cybercrime contact by ID
router.get('/contacts/:id', async (req, res) => {
  try {
    const contact = await CybercrimeContact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Cybercrime contact not found'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching cybercrime contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cybercrime contact'
    });
  }
});

// Search cybercrime contacts by location
router.get('/contacts/search/location', async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({
        success: false,
        error: 'Location parameter is required'
      });
    }
    
    const contacts = await CybercrimeContact.findByLocation(location);
    
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error searching cybercrime contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search cybercrime contacts'
    });
  }
});

// Get all states
router.get('/states', async (req, res) => {
  try {
    const states = await CybercrimeContact.getStates();
    
    res.json({
      success: true,
      count: states.length,
      data: states.sort()
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch states'
    });
  }
});

// Get all cities
router.get('/cities', async (req, res) => {
  try {
    const { state } = req.query;
    
    let filter = { isActive: true };
    if (state) {
      filter.state = { $regex: state, $options: 'i' };
    }
    
    const cities = await CybercrimeContact.distinct('city', filter);
    
    res.json({
      success: true,
      count: cities.length,
      data: cities.sort()
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cities'
    });
  }
});

// Get all specializations
router.get('/specializations', async (req, res) => {
  try {
    const specializations = await CybercrimeContact.distinct('specialization', { isActive: true });
    
    res.json({
      success: true,
      count: specializations.length,
      data: specializations.sort()
    });
  } catch (error) {
    console.error('Error fetching specializations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch specializations'
    });
  }
});

// Get contact statistics (admin only)
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const totalContacts = await CybercrimeContact.countDocuments({ isActive: true });
    const contactsByState = await CybercrimeContact.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const contactsByPriority = await CybercrimeContact.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const contactsBySpecialization = await CybercrimeContact.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$specialization', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalContacts,
        byState: contactsByState,
        byPriority: contactsByPriority,
        bySpecialization: contactsBySpecialization
      }
    });
  } catch (error) {
    console.error('Error fetching contact statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact statistics'
    });
  }
});

// Create new cybercrime contact (admin only)
router.post('/contacts', auth, adminOnly, async (req, res) => {
  try {
    const contactData = req.body;
    
    const contact = new CybercrimeContact(contactData);
    await contact.save();
    
    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error creating cybercrime contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create cybercrime contact'
    });
  }
});

// Update cybercrime contact (admin only)
router.put('/contacts/:id', auth, adminOnly, async (req, res) => {
  try {
    const contact = await CybercrimeContact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Cybercrime contact not found'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error updating cybercrime contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cybercrime contact'
    });
  }
});

// Delete cybercrime contact (admin only)
router.delete('/contacts/:id', auth, adminOnly, async (req, res) => {
  try {
    const contact = await CybercrimeContact.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Cybercrime contact not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Cybercrime contact deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting cybercrime contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete cybercrime contact'
    });
  }
});

// Bulk import cybercrime contacts (admin only)
router.post('/contacts/bulk-import', auth, adminOnly, async (req, res) => {
  try {
    const { contacts } = req.body;
    
    if (!Array.isArray(contacts)) {
      return res.status(400).json({
        success: false,
        error: 'Contacts must be an array'
      });
    }
    
    const result = await CybercrimeContact.insertMany(contacts);
    
    res.status(201).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    console.error('Error bulk importing cybercrime contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk import cybercrime contacts'
    });
  }
});

// Seed cybercrime contacts from JSON file (admin only)
router.post('/seed', auth, adminOnly, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Read the JSON file
    const jsonPath = path.join(__dirname, '../../Frontend/cybercrime_contacts.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const contactsData = JSON.parse(rawData);
    
    // Clear existing data
    await CybercrimeContact.deleteMany({});
    
    // Process and insert data
    const processedContacts = [];
    
    for (const contact of contactsData) {
      // Skip invalid entries
      if (!contact['Officer/Designation'] || contact['Officer/Designation'] === null) {
        continue;
      }
      
      // Extract state and city from officer designation
      let state = '';
      let city = '';
      
      // Extract state from officer designation
      const statePatterns = [
        /\(([^)]+)\)/g, // Extract text in parentheses
        /(Gujarat|Maharashtra|Karnataka|Tamil Nadu|Kerala|West Bengal|Rajasthan|Uttar Pradesh|Madhya Pradesh|Bihar|Odisha|Assam|Jammu & Kashmir|Himachal Pradesh|Punjab|Haryana|Delhi|Goa|Chhattisgarh|Jharkhand|Uttarakhand|Manipur|Meghalaya|Mizoram|Nagaland|Arunachal Pradesh|Sikkim|Tripura|Andhra Pradesh|Telangana)/gi
      ];
      
      for (const pattern of statePatterns) {
        const matches = contact['Officer/Designation'].match(pattern);
        if (matches) {
          state = matches[0].replace(/[()]/g, '').trim();
          break;
        }
      }
      
      // Extract city from officer designation
      const cityPatterns = [
        /^([^(]+)/, // Text before parentheses
        /(Agartala|Ahmedabad|Bangalore|Mumbai|Bhopal|Bhubaneshwar|Chandigarh|Chennai|Dehradun|Gangtok|Guwahati|Hyderabad|Jaipur|Jammu|Kanpur|Kolkata|Nagpur|New Delhi|Panaji|Patna|Raipur|Ranchi|Thiruvananthapuram)/gi
      ];
      
      for (const pattern of cityPatterns) {
        const matches = contact['Officer/Designation'].match(pattern);
        if (matches) {
          city = matches[0].trim();
          break;
        }
      }
      
      // Determine priority based on location and type
      const determinePriority = (officerDesignation, address) => {
        const highPriorityKeywords = ['FBI', 'Cyber Crime Cell', 'State Cyber', 'Economic Offences Wing'];
        const mediumPriorityKeywords = ['Police', 'CID', 'Crime Branch'];
        
        const text = `${officerDesignation} ${address}`.toLowerCase();
        
        if (highPriorityKeywords.some(keyword => text.includes(keyword.toLowerCase()))) {
          return 'high';
        } else if (mediumPriorityKeywords.some(keyword => text.includes(keyword.toLowerCase()))) {
          return 'medium';
        }
        
        return 'low';
      };
      
      // Determine specialization
      const determineSpecialization = (officerDesignation, address) => {
        const text = `${officerDesignation} ${address}`.toLowerCase();
        
        if (text.includes('cyber') || text.includes('cybercrime')) {
          return 'Cybercrime Investigation';
        } else if (text.includes('economic') || text.includes('eow')) {
          return 'Economic Offences';
        } else if (text.includes('fraud') || text.includes('financial')) {
          return 'Financial Crimes';
        } else if (text.includes('cid') || text.includes('crime branch')) {
          return 'Criminal Investigation';
        }
        
        return 'General Law Enforcement';
      };
      
      const processedContact = {
        regionalOffice: contact['Regional Office'] || '',
        officerDesignation: contact['Officer/Designation'],
        address: contact['Address'] || '',
        email: contact['Email'] || [],
        mobile: contact['Mobile'] || [],
        telephone: contact['Telephone'] || [],
        fax: contact['Fax'] || [],
        state: state,
        city: city,
        specialization: determineSpecialization(
          contact['Officer/Designation'], 
          contact['Address'] || ''
        ),
        priority: determinePriority(
          contact['Officer/Designation'], 
          contact['Address'] || ''
        ),
        isActive: true
      };
      
      processedContacts.push(processedContact);
    }
    
    // Insert all contacts
    const result = await CybercrimeContact.insertMany(processedContacts);
    
    // Get summary statistics
    const states = await CybercrimeContact.distinct('state');
    const cities = await CybercrimeContact.distinct('city');
    const specializations = await CybercrimeContact.distinct('specialization');
    
    res.json({
      success: true,
      message: 'Cybercrime contacts seeded successfully',
      count: result.length,
      summary: {
        totalContacts: result.length,
        states: states.length,
        cities: cities.length,
        specializations: specializations.length,
        highPriority: await CybercrimeContact.countDocuments({ priority: 'high' }),
        mediumPriority: await CybercrimeContact.countDocuments({ priority: 'medium' }),
        lowPriority: await CybercrimeContact.countDocuments({ priority: 'low' })
      }
    });
  } catch (error) {
    console.error('Error seeding cybercrime contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed cybercrime contacts'
    });
  }
});

module.exports = router;
