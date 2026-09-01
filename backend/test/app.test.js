const { test } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

test('a raiz informa que o backend está em execução', async () => {
  const server = app.listen(0);

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/`);

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(await response.json(), {
      message: 'DMS backend em execução.'
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
