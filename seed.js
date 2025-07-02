const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config()

// Load models
const User = require('./Models/users'); // adjust path as needed
const Post = require('./Models/posts'); // adjust path as needed

const MONGO_URI = process.env.URL; // replace with your MongoDB URI

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});

    const users = [];

    // Create one known ADMIN user
    const adminPassword = 'Admin@123';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

    const knownAdmin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    });
    await knownAdmin.save();
    users.push(knownAdmin);

    console.log('✅ Known ADMIN created');
    console.log(`Email: admin@example.com`);
    console.log(`Password: ${adminPassword}`);

    // Create one more ADMIN
    const secondAdmin = new User({
      name: 'Second Admin',
      email: 'admin2@example.com',
      passwordHash: await bcrypt.hash('AnotherAdmin123', 10),
      role: 'ADMIN',
    });
    await secondAdmin.save();
    users.push(secondAdmin);

    // Create 10 NORMAL users
    for (let i = 1; i <= 10; i++) {
      const user = new User({
        name: `Normal User ${i}`,
        email: `user${i}@example.com`,
        passwordHash: await bcrypt.hash(`User${i}Pass`, 10),
        role: 'NORMAL',
      });
      await user.save();
      users.push(user);
    }

    console.log('✅ Users created');

    // Create 5 posts for each user
    for (const user of users) {
      const postIds = [];

      for (let i = 1; i <= 5; i++) {
        const post = new Post({
          title: `Post ${i} by ${user.name}`,
          content: `This is the content of post ${i} by ${user.name}.`,
          user: user._id,
        });
        await post.save();
        postIds.push(post._id);
      }

      user.posts = postIds;
      await user.save();
    }

    console.log('✅ Posts created for all users');

    console.log('🎉 Seeding complete');
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
