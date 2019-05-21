/* eslint-disable global-require */
/* eslint-env mocha */
const assert = require('assert');
const td = require('testdouble');

describe('shExec', () => {
  let exec;
  let shExec;

  describe('resolve', () => {
    beforeEach(() => {
      exec = td.function();
      td.when(exec(td.matchers.isA(String), td.matchers.isA(Object))).thenCallback(0, 'stdout', 'stderr');
      td.replace('shelljs', { exec });
      shExec = require('./shExec');
    });

    afterEach(() => {
      td.reset();
    });

    it('should call exec with the correct arguments', () => {
      shExec('test', { cwd: 'cwd' });
      td.verify(exec('test', { cwd: 'cwd' }, td.matchers.isA(Function)));
    });

    it('should resolve with stdout', async () => {
      const out = await shExec('test', { cwd: 'cwd' });
      assert.equal(out, 'stdout');
    });
  });

  describe('reject', () => {
    beforeEach(() => {
      exec = td.function();
      td.when(exec(td.matchers.isA(String), td.matchers.isA(Object))).thenCallback(1, 'stdout', 'stderr');
      td.replace('shelljs', { exec });
      shExec = require('./shExec');
    });

    afterEach(() => {
      td.reset();
    });
    it('should reject with stderr', async () => {
      try {
        await shExec('test', { cwd: 'cwd' });
      } catch (e) {
        assert.equal(e, 'stderr');
      }
    });
  });
});
