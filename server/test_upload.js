const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Test upload image
async function testUpload() {
  try {
    console.log('Starting login...');
    // First login to get token
    const loginResponse = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'admin@fishing-shop.com',
      password: 'Admin123'
    });

    console.log('Login response status:', loginResponse.status);
    const token = loginResponse.data.accessToken;
    console.log('Login successful, token:', token ? 'received' : 'none');

    // Create form data with a test image
    const formData = new FormData();
    const testImagePath = path.join(__dirname, 'test.jpg');

    console.log('Test image path:', testImagePath);
    if (!fs.existsSync(testImagePath)) {
      console.log('Test image not found at:', testImagePath);
      return;
    }

    const imageStream = fs.createReadStream(testImagePath);
    formData.append('image', imageStream, 'test.jpg');

    console.log('Starting upload...');
    // Upload image
    const uploadResponse = await axios.post('http://localhost:4000/api/admin/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders(),
      },
    });

    console.log('Upload status:', uploadResponse.status);
    console.log('Upload response:', uploadResponse.data);

  } catch (error) {
    console.error('Error details:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testUpload();