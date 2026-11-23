const fs = require('fs');
const os = require('os');
const path = require('path');
const { test, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');

const uploadsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-uploads-'));
Object.assign(process.env, {
  JWT_SECRET: 'test-secret',
  UPLOADS_DIR: uploadsDir,
  PYTHON_BIN: 'python-that-does-not-exist',
  EMAIL_USER: '',
  EMAIL_PASS: '',
  FRONTEND_URL: 'https://preview.example.com/',
});

const db = require('./helpers/memoryDb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Blog = require('../models/Blog');
const Message = require('../models/Message');
const Profile = require('../models/Profile');

const ID = '64b000000000000000000001';
const tokenFor = (role, secret = 'test-secret') => jwt.sign({ user: { id: ID, role } }, secret);
const admin = tokenFor('admin');
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

beforeEach(() => db.clear());
after(() => fs.rmSync(uploadsDir, { recursive: true, force: true }));

test('nobody can register over HTTP', async () => {
  const res = await request(app).post('/api/auth/register').send({ username: 'x', email: 'x@example.com', password: 'secret' });
  assert.equal(res.status, 404);
  assert.equal((await User.find()).length, 0);
});

test('only an admin token opens protected routes', async () => {
  const get = token => request(app).get('/api/contact').set(token ? { 'x-auth-token': token } : {});
  assert.equal((await get()).status, 401);
  assert.equal((await get('nonsense')).status, 401);
  assert.equal((await get(tokenFor('admin', 'other-secret'))).status, 401);
  assert.equal((await get(tokenFor('user'))).status, 403);
  assert.equal((await get(admin)).status, 200);
});

test('every write route is protected', async () => {
  for (const resource of ['projects', 'skills', 'achievements', 'education', 'experience', 'blog', 'course-certifications', 'leetcode-progress', 'demos', 'journey']) {
    assert.equal((await request(app).post(`/api/${resource}`).send({})).status, 401, `POST ${resource}`);
    assert.equal((await request(app).put(`/api/${resource}/${ID}`).send({})).status, 401, `PUT ${resource}`);
    assert.equal((await request(app).delete(`/api/${resource}/${ID}`)).status, 401, `DELETE ${resource}`);
  }
  assert.equal((await request(app).put('/api/profile').send({})).status, 401);
  assert.equal((await request(app).post('/api/job-scraper/scrape').send({})).status, 401);
});

test('login works, rejects query operators and limits guesses', async () => {
  await new User({ username: 'a', email: 'a@example.com', password: await bcrypt.hash('right-password', 4), role: 'admin' }).save();
  const login = body => request(app).post('/api/auth/login').send(body);

  const ok = await login({ email: 'a@example.com', password: 'right-password' });
  assert.equal(ok.status, 200);
  assert.equal(jwt.verify(ok.body.token, 'test-secret').user.role, 'admin');

  assert.equal((await login({ email: { $gt: '' }, password: 'right-password' })).status, 400);
  let last;
  for (let i = 0; i < 12; i += 1) last = await login({ email: 'a@example.com', password: 'wrong' });
  assert.equal(last.status, 429);
});

test('drafts stay private', async () => {
  const draft = await new Blog({ title: 'D', slug: 'draft', content: 'c', excerpt: 'e' }).save();
  await new Blog({ title: 'P', slug: 'live', content: 'c', excerpt: 'e', published: true }).save();

  assert.equal((await request(app).get('/api/blog')).body.length, 1);
  assert.equal((await request(app).get('/api/blog/draft')).status, 404);
  assert.equal((await request(app).get('/api/blog/live')).status, 200);
  assert.equal((await request(app).get(`/api/blog/admin/${draft._id}`)).status, 401);
  assert.equal((await request(app).get(`/api/blog/admin/${draft._id}`).set('x-auth-token', admin)).body.title, 'D');
});

test('a second post with the same slug gets a clear error', async () => {
  const post = () => request(app).post('/api/blog').set('x-auth-token', admin)
    .field({ title: 'T', slug: 'same', content: 'c', excerpt: 'e', published: 'true' });
  assert.equal((await post()).status, 200);
  const res = await post();
  assert.equal(res.status, 409);
  assert.match(res.body.msg, /slug/);
});

test('jobs can be saved without exact dates', async () => {
  const created = await request(app).post('/api/experience').set('x-auth-token', admin)
    .send({ company: 'C', role: 'R', startDate: '', endDate: '', current: true, createdAt: '2000-01-01' });
  assert.equal(created.status, 200);
  assert.equal(created.body.startDate, null);
  assert.equal(created.body.endDate, null);
  assert.equal(created.body.current, true);
  assert.notEqual(created.body.createdAt.slice(0, 4), '2000');

  const url = `/api/experience/${created.body._id}`;
  const updated = await request(app).put(url).set('x-auth-token', admin).send({ endDate: '2026-01-01' });
  assert.equal(updated.body.endDate.slice(0, 10), '2026-01-01');
  assert.equal(updated.body.role, 'R');
  assert.equal((await request(app).get('/api/experience')).body.length, 1);
  assert.equal((await request(app).delete(url).set('x-auth-token', admin)).status, 200);
  assert.equal((await request(app).get(url)).status, 404);
});

test('missing fields are named in the error', async () => {
  const res = await request(app).post('/api/skills').set('x-auth-token', admin).field({ level: 'Expert' });
  assert.equal(res.status, 400);
  assert.equal(res.body.msg, 'Please fill in: name, category');
});

test('single entries can be read by ID', async () => {
  const created = await request(app).post('/api/skills').set('x-auth-token', admin).field({ name: 'Python', category: 'Programming' });
  assert.equal((await request(app).get(`/api/skills/${created.body._id}`)).body.name, 'Python');
  for (const resource of ['skills', 'achievements', 'education', 'projects']) {
    assert.equal((await request(app).get(`/api/${resource}/${ID}`)).status, 404);
    assert.equal((await request(app).get(`/api/${resource}/not-an-id`)).status, 404);
  }
});

test('project images can be added and all removed', async () => {
  const fields = { title: 'P', description: 'd', techStack: 'React, Node.js, ', featured: 'false' };
  const created = await request(app).post('/api/projects').set('x-auth-token', admin).field(fields)
    .attach('images', PNG, { filename: 'a.html', contentType: 'image/png' });
  assert.equal(created.status, 200);
  assert.deepEqual(created.body.techStack, ['React', 'Node.js']);
  assert.match(created.body.image, /\.png$/);
  assert.equal((await request(app).get(created.body.image)).status, 200);

  const update = extra => request(app).put(`/api/projects/${created.body._id}`).set('x-auth-token', admin).field({ ...fields, ...extra });
  assert.equal((await update({})).body.images.length, 1);
  const cleared = await update({ existingImages: '[]' });
  assert.deepEqual(cleared.body.images, []);
  assert.equal(cleared.body.image, '');
  assert.equal((await update({ existingImages: 'oops' })).status, 400);
});

test('uploads accept only images up to 5 MB', async () => {
  const send = (buffer, options) => request(app).post('/api/projects').set('x-auth-token', admin)
    .field({ title: 'P', description: 'd', techStack: 'x' }).attach('images', buffer, options);
  assert.equal((await send(Buffer.from('<script>'), { filename: 'x.html', contentType: 'text/html' })).status, 400);
  assert.equal((await send(Buffer.from('<svg/>'), { filename: 'x.svg', contentType: 'image/svg+xml' })).status, 400);
  const big = await send(Buffer.alloc(6 * 1024 * 1024), { filename: 'x.png', contentType: 'image/png' });
  assert.equal(big.status, 400);
  assert.match(big.body.msg, /5 MB/);
});

test('images bundled with the repo are served next to the uploads folder', async () => {
  const res = await request(app).get('/uploads/1774562691810.jfif');
  assert.equal(res.status, 200);
  assert.equal(res.headers['content-type'], 'image/jpeg');
  assert.equal(res.headers['cross-origin-resource-policy'], 'cross-origin');
});

test('the profile has defaults, saves the first image and keeps fields that were not sent', async () => {
  const put = fields => request(app).put('/api/profile').set('x-auth-token', admin).field(fields);

  assert.equal((await request(app).get('/api/profile')).body.name, 'Muhammad Asad Jamil');
  assert.equal((await Profile.find()).length, 0);

  const saved = await put({ name: 'New Name', socialLinks: JSON.stringify({ github: 'https://github.com/x' }) })
    .attach('profileImage', PNG, { filename: 'me.png', contentType: 'image/png' });
  assert.equal(saved.status, 200);
  assert.match(saved.body.profileImage, /\.png$/);
  assert.equal(saved.body.socialLinks.github, 'https://github.com/x');

  const again = await put({ tagline: 'T' });
  assert.equal(again.body.name, 'New Name');
  assert.equal(again.body.profileImage, saved.body.profileImage);
  assert.equal((await Profile.find()).length, 1);
  assert.equal((await put({ socialLinks: '{' })).status, 400);
});

test('contact form validates, saves and limits messages', async () => {
  const body = { name: 'N', email: 'n@example.com', subject: 'S\r\nBcc: x@example.com', message: 'Hello' };
  const send = data => request(app).post('/api/contact').send(data);

  assert.equal((await send(body)).status, 200);
  const [message] = await Message.find();
  assert.equal(message.subject, 'S Bcc: x@example.com');

  assert.equal((await send({ ...body, name: { $gt: '' } })).status, 400);
  assert.equal((await send({ ...body, email: 'nope' })).status, 400);
  assert.equal((await send({ ...body, message: 'x'.repeat(5001) })).status, 400);
  assert.equal((await send(body)).status, 200);
  assert.equal((await send(body)).status, 429);
});

test('CORS allows the site, the admin panel and configured origins only', async () => {
  const allowed = async origin => (await request(app).get('/api/health').set('Origin', origin)).headers['access-control-allow-origin'];
  for (const origin of ['https://asadjamil.tech', 'https://www.asadjamil.tech', 'http://localhost:3001', 'https://preview.example.com']) {
    assert.equal(await allowed(origin), origin);
  }
  assert.equal(await allowed('https://evil.example.com'), undefined);
});

test('a server without Python answers instead of crashing', async () => {
  const scrape = body => request(app).post('/api/job-scraper/scrape').set('x-auth-token', admin).send(body);
  assert.equal((await scrape({ query: 'AI' })).status, 503);
  assert.equal((await scrape({ query: '' })).status, 400);
  assert.equal((await request(app).get('/api/profile')).status, 200);
});

test('unknown routes and broken JSON get JSON errors', async () => {
  assert.equal((await request(app).get('/api/nope')).body.msg, 'Not found');
  assert.equal((await request(app).post('/api/contact').type('json').send('{oops')).status, 400);
});
