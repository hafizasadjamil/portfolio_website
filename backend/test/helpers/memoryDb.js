// Keeps documents in memory behind the Mongoose model methods the app uses,
// so tests never need (or touch) a real database.
const mongoose = require('mongoose');

const Model = mongoose.Model;
const stores = new Map();

const storeOf = model => {
  if (!stores.has(model.modelName)) stores.set(model.modelName, new Map());
  return stores.get(model.modelName);
};

const matches = (doc, filter) => Object.entries(filter || {}).every(([key, value]) => {
  if (value !== null && typeof value === 'object') throw new Error(`Unexpected query operator for ${key}`);
  return String(doc.get(key)) === String(value);
});

const castId = id => {
  try {
    return String(new mongoose.Types.ObjectId(String(id)));
  } catch (err) {
    throw new mongoose.Error.CastError('ObjectId', id, '_id');
  }
};

// Behaves like a Mongoose query: chainable and awaitable.
const query = run => {
  let order = null;
  const q = {
    sort(spec) { order = spec; return q; },
    select() { return q; },
    populate() { return q; },
    then(resolve, reject) {
      return Promise.resolve().then(run).then(result => {
        if (!order || !Array.isArray(result)) return result;
        const keys = Object.entries(order);
        return [...result].sort((a, b) => {
          for (const [key, dir] of keys) {
            if (a.get(key) < b.get(key)) return -dir;
            if (a.get(key) > b.get(key)) return dir;
          }
          return 0;
        });
      }).then(resolve, reject);
    },
    catch(reject) { return q.then(undefined, reject); },
  };
  return q;
};

Model.find = function (filter) {
  return query(() => [...storeOf(this).values()].filter(doc => matches(doc, filter)));
};

Model.findOne = function (filter) {
  return query(() => [...storeOf(this).values()].find(doc => matches(doc, filter)) || null);
};

Model.findById = function (id) {
  return query(() => storeOf(this).get(castId(id)) || null);
};

Model.findByIdAndUpdate = function (id, update) {
  return query(async () => {
    const doc = storeOf(this).get(castId(id));
    if (!doc) return null;
    doc.set(Object.fromEntries(Object.entries(update.$set).filter(([, value]) => value !== undefined)));
    await doc.validate();
    return doc;
  });
};

Model.findByIdAndDelete = function (id) {
  return query(() => {
    const key = castId(id);
    const doc = storeOf(this).get(key) || null;
    storeOf(this).delete(key);
    return doc;
  });
};

Model.prototype.save = async function () {
  await this.validate();
  const store = storeOf(this.constructor);
  for (const [path, type] of Object.entries(this.schema.paths)) {
    if (!type.options.unique) continue;
    for (const other of store.values()) {
      if (String(other._id) !== String(this._id) && other.get(path) === this.get(path)) {
        throw Object.assign(new Error('duplicate key'), { code: 11000, keyPattern: { [path]: 1 } });
      }
    }
  }
  store.set(String(this._id), this);
  return this;
};

module.exports = { clear: () => stores.clear() };
