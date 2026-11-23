// Seeding deletes what is already stored, so it only runs on empty
// collections unless it is started with --force.
module.exports = async function confirmOverwrite(models) {
  if (process.argv.includes('--force')) return;

  for (const model of models) {
    const count = await model.countDocuments();
    if (count > 0) {
      throw new Error(`Stopped: ${model.modelName} already has ${count} entries that would be deleted. Run again with --force to replace them.`);
    }
  }
};
