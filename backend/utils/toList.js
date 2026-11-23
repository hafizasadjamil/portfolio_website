// Turns "React, Node.js, " into ['React', 'Node.js'].
module.exports = value => (
  typeof value === 'string' ? value.split(',').map(item => item.trim()).filter(Boolean) : []
);
