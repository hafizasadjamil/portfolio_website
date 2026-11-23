// Creates the admin account, or resets its password if it already exists.
//
//   npm run admin
//
// Asks for the email and password, or reads ADMIN_EMAIL and ADMIN_PASSWORD.
const readline = require('readline/promises');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const connectDB = require('./config/db');
const User = require('./models/User');

const MIN_PASSWORD_LENGTH = 12;

const ask = async (question) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
};

const run = async () => {
  const email = process.env.ADMIN_EMAIL || await ask('Admin email: ');
  const password = process.env.ADMIN_PASSWORD || await ask(`New password (at least ${MIN_PASSWORD_LENGTH} characters, shown as you type): `);

  if (!validator.isEmail(email)) throw new Error('Enter a valid email');
  if (password.length < MIN_PASSWORD_LENGTH) throw new Error(`The password must have at least ${MIN_PASSWORD_LENGTH} characters`);
  // bcrypt ignores everything after 72 bytes.
  if (Buffer.byteLength(password) > 72) throw new Error('The password must be 72 bytes or shorter');

  await connectDB();
  const hash = await bcrypt.hash(password, 12);
  const user = await User.findOne({ email });

  if (user) {
    user.password = hash;
    user.role = 'admin';
    await user.save();
    console.log(`Password updated for ${email}`);
  } else {
    await new User({ username: email, email, password: hash, role: 'admin' }).save();
    console.log(`Admin ${email} created`);
  }
};

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
