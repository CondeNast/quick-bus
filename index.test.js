describe('exact matches', function () {
  it('emits and receives', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('a', spy);
    bus.emit('a');

    sinon.assert.called(spy);
  });

  it('emits and receives multiple', function () {
    const bus = new Bus();
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();

    bus.on('a', spy1);
    bus.on('a', spy2);
    bus.emit('a');

    sinon.assert.called(spy1);
    sinon.assert.called(spy2);
  });

  it('sends message', function () {
    const bus = new Bus();
    const expected = 'b';
    const spy = sinon.spy();

    bus.on('a', spy);
    bus.emit('a', expected);

    sinon.assert.calledWith(spy, sinon.match.any, expected);
  });
});

describe('wildstar *', function () {
  it('a.* does not find a', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('a.*', spy);
    bus.emit('a');

    sinon.assert.notCalled(spy);
  });

  it('*.a does not find a', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('*.a', spy);
    bus.emit('a');

    sinon.assert.notCalled(spy);
  });

  it('a.* finds a.b', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('a.*', spy);
    bus.emit('a.b');

    sinon.assert.called(spy);
  });

  it('*.b finds a.b', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('*.b', spy);
    bus.emit('a.b');

    sinon.assert.called(spy);
  });

  it('a.*.c finds a.b.c', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('a.*.c', spy);
    bus.emit('a.b.c');

    sinon.assert.called(spy);
  });

  it('a.* does not find a.b.c', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('a.*', spy);
    bus.emit('a.b.c');

    sinon.assert.notCalled(spy);
  });

  it('*.c does not find a.b.c', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('*.c', spy);
    bus.emit('a.b.c');

    sinon.assert.notCalled(spy);
  });

  it('a.*.d does not find a.b.c.d', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('a.*.d', spy);
    bus.emit('a.b.c.d');

    sinon.assert.notCalled(spy);
  });

  it('a.*.d does not find a.b.c.d meanwhile a.#.d does', function () {
    const bus = new Bus();
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();

    bus.on('a.*.d', spy1);
    bus.on('a.#.d', spy2);
    bus.emit('a.b.c.d');

    sinon.assert.notCalled(spy1);
    sinon.assert.called(spy2);
  });

  it('emits and receives multiple', function () {
    const bus = new Bus();
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();


    bus.on('metrics.*', spy1);
    bus.on('*.changed', spy2);
    bus.on('metrics.*.changed', spy3);
    bus.emit('metrics.changed');

    sinon.assert.called(spy1);
    sinon.assert.called(spy2);
    sinon.assert.notCalled(spy3);
  });
});

describe('wildstar #', function () {
  it('a.# finds a.b', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('a.#', spy);
    bus.emit('a.b');

    sinon.assert.called(spy);
  });

  it('a.# finds a.b.c', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('a.#', spy);
    bus.emit('a.b.c');

    sinon.assert.called(spy);
  });

  it('#.b finds a.b', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('#.b', spy);
    bus.emit('a.b');

    sinon.assert.called(spy);
  });

  it('#.c finds a.b.c', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('#.c', spy);
    bus.emit('a.b.c');

    sinon.assert.called(spy);
  });

  it('a.#.c finds a.b.c', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('a.#.c', spy);
    bus.emit('a.b.c');

    sinon.assert.called(spy);
  });

  it('a.# finds a', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('a.#', spy);
    bus.emit('a');

    sinon.assert.called(spy);
  });

  it('#.c finds c', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('#.c', spy);
    bus.emit('c');

    sinon.assert.called(spy);
  });

  it('a.#.b finds a.b', function () {
    const bus = new Bus();
    const spy = sinon.spy();

    bus.on('a.#.b', spy);
    bus.emit('a.b');

    sinon.assert.called(spy);
  });

  it('emits and receives multiple', function () {
    const bus = new Bus();
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    bus.on('metrics.#', spy1);
    bus.on('#.changed', spy2);
    bus.on('metrics.#.changed', spy3);
    bus.emit('metrics.changed');

    sinon.assert.called(spy1);
    sinon.assert.called(spy2);
    sinon.assert.called(spy3);
  });

  it('avoids unneeded multiples', function () {
    const bus = new Bus();
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    bus.on('metrics.#', spy1);
    bus.on('ads.#', spy2);
    bus.on('#.changed', spy3);
    bus.emit('metrics.changed');

    sinon.assert.called(spy1);
    sinon.assert.notCalled(spy2);
    sinon.assert.called(spy3);
  });
});
