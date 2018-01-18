describe('exact matches', function () {
  it('emits and receives', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('a', spy);
    bus.emit('a');

    sinon.assert.called(spy);
  });

  it('emits and receives multiple', function () {
    var bus = new Bus();
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();

    bus.on('a', spy1);
    bus.on('a', spy2);
    bus.emit('a');

    sinon.assert.called(spy1);
    sinon.assert.called(spy2);
  });

  it('sends message', function () {
    var bus = new Bus();
    var expected = 'b';
    var spy = sinon.spy();

    bus.on('a', spy);
    bus.emit('a', expected);

    sinon.assert.calledWith(spy, sinon.match.any, expected);
  });
});

describe('wildstar *', function () {
  it('a.* does not find a', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('a.*', spy);
    bus.emit('a');

    sinon.assert.notCalled(spy);
  });

  it('*.a does not find a', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('*.a', spy);
    bus.emit('a');

    sinon.assert.notCalled(spy);
  });

  it('a.* finds a.b', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('a.*', spy);
    bus.emit('a.b');

    sinon.assert.called(spy);
  });

  it('*.b finds a.b', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('*.b', spy);
    bus.emit('a.b');

    sinon.assert.called(spy);
  });

  it('a.*.c finds a.b.c', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('a.*.c', spy);
    bus.emit('a.b.c');

    sinon.assert.called(spy);
  });

  it('a.* does not find a.b.c', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('a.*', spy);
    bus.emit('a.b.c');

    sinon.assert.notCalled(spy);
  });

  it('*.c does not find a.b.c', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('*.c', spy);
    bus.emit('a.b.c');

    sinon.assert.notCalled(spy);
  });

  it('a.*.d does not find a.b.c.d', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('a.*.d', spy);
    bus.emit('a.b.c.d');

    sinon.assert.notCalled(spy);
  });

  it('a.*.d does not find a.b.c.d meanwhile a.#.d does', function () {
    var bus = new Bus();
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();

    bus.on('a.*.d', spy1);
    bus.on('a.#.d', spy2);
    bus.emit('a.b.c.d');

    sinon.assert.notCalled(spy1);
    sinon.assert.called(spy2);
  });

  it('emits and receives multiple', function () {
    var bus = new Bus();
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    var spy3 = sinon.spy();


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
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('a.#', spy);
    bus.emit('a.b');

    sinon.assert.called(spy);
  });

  it('a.# finds a.b.c', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('a.#', spy);
    bus.emit('a.b.c');

    sinon.assert.called(spy);
  });

  it('#.b finds a.b', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('#.b', spy);
    bus.emit('a.b');

    sinon.assert.called(spy);
  });

  it('#.c finds a.b.c', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('#.c', spy);
    bus.emit('a.b.c');

    sinon.assert.called(spy);
  });

  it('a.#.c finds a.b.c', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('a.#.c', spy);
    bus.emit('a.b.c');

    sinon.assert.called(spy);
  });

  it('a.# finds a', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('a.#', spy);
    bus.emit('a');

    sinon.assert.called(spy);
  });

  it('#.c finds c', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('#.c', spy);
    bus.emit('c');

    sinon.assert.called(spy);
  });

  it('a.#.b finds a.b', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('a.#.b', spy);
    bus.emit('a.b');

    sinon.assert.called(spy);
  });

  it('emits and receives multiple', function () {
    var bus = new Bus();
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    var spy3 = sinon.spy();

    bus.on('metrics.#', spy1);
    bus.on('#.changed', spy2);
    bus.on('metrics.#.changed', spy3);
    bus.emit('metrics.changed');

    sinon.assert.called(spy1);
    sinon.assert.called(spy2);
    sinon.assert.called(spy3);
  });

  it('avoids unneeded multiples', function () {
    var bus = new Bus();
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    var spy3 = sinon.spy();

    bus.on('metrics.#', spy1);
    bus.on('ads.#', spy2);
    bus.on('#.changed', spy3);
    bus.emit('metrics.changed');

    sinon.assert.called(spy1);
    sinon.assert.notCalled(spy2);
    sinon.assert.called(spy3);
  });
});

describe('history', function () {
  it('no events and no entries gives no history', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    expect(bus.history('a').length).to.equal(0);
  });

  it('mismatched topic gives no history', function () {
    var bus = new Bus();

    bus.emit('a');

    expect(bus.history('b').length).to.equal(0);
  });

  it('wildcard * gives selective history', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.emit('a');
    bus.emit('a.b');
    bus.emit('a.b.c');

    expect(bus.history('a.*').length).to.equal(1);
  });

  it('wildcard # gives selective history', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.emit('a');
    bus.emit('a.b');
    bus.emit('a.c');
    bus.emit('a.b.c');

    expect(bus.history('a.#.c').length).to.equal(2);
  });

  it('1 entry', function () {
    var bus = new Bus();
    var spy = sinon.spy();

    bus.on('a', spy);
    bus.emit('a');
    expect(bus.history('a')[0][0]).to.equal('a');

    sinon.assert.called(spy);
  });
});

describe('Ring', function () {
  it('no events and no entries gives no history', function () {
    var ring = new Bus.Ring(2);

    ring.push('hi');

    expect(ring.asArray()).to.deep.equal(['hi']);
  });

  it('no events and no entries gives no history', function () {
    var ring = new Bus.Ring(2);

    ring.push('a');
    ring.push('b');

    expect(ring.asArray()).to.deep.equal(['a', 'b']);
  });

  it('list can wrap', function () {
    var ring = new Bus.Ring(2);

    ring.push('a');
    expect(ring.list).to.deep.equal(['a']);
    ring.push('b');
    expect(ring.list).to.deep.equal(['a', 'b']);
    ring.push('c');
    expect(ring.list).to.deep.equal(['c', 'b']);
    ring.push('d');
    expect(ring.list).to.deep.equal(['c', 'd']);
  });

  it('asArray can wrap 2 3', function () {
    var ring = new Bus.Ring(2);

    ring.push('a');
    expect(ring.asArray()).to.deep.equal(['a']);
    ring.push('b');
    expect(ring.asArray()).to.deep.equal(['a', 'b']);
    ring.push('c');
    expect(ring.asArray()).to.deep.equal(['b', 'c']);
  });

  it('asArray can wrap 2 4', function () {
    var ring = new Bus.Ring(2);

    ring.push('a');
    expect(ring.asArray()).to.deep.equal(['a']);
    ring.push('b');
    expect(ring.asArray()).to.deep.equal(['a', 'b']);
    ring.push('c');
    expect(ring.asArray()).to.deep.equal(['b', 'c']);
    ring.push('d');
    expect(ring.asArray()).to.deep.equal(['c', 'd']);
  });


  it('asArray can wrap once', function () {
    var ring = new Bus.Ring(2);

    ring.push('a');
    expect(ring.asArray()).to.deep.equal(['a']);
    ring.push('b');
    expect(ring.asArray()).to.deep.equal(['a', 'b']);
    ring.push('c');
    expect(ring.asArray()).to.deep.equal(['b', 'c']);
    ring.push('d');
    expect(ring.asArray()).to.deep.equal(['c', 'd']);
    ring.push('e');
    expect(ring.asArray()).to.deep.equal(['d', 'e']);
  });

  it('asArray can wrap twice', function () {
    var ring = new Bus.Ring(5);

    ring.push('a');
    expect(ring.asArray()).to.deep.equal(['a']);
    ring.push('b');
    expect(ring.asArray()).to.deep.equal(['a', 'b']);
    ring.push('c');
    expect(ring.asArray()).to.deep.equal(['a', 'b', 'c']);
    ring.push('d');
    expect(ring.asArray()).to.deep.equal(['a', 'b', 'c', 'd']);
    ring.push('e');
    expect(ring.asArray()).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
    ring.push('f');
    expect(ring.asArray()).to.deep.equal(['b', 'c', 'd', 'e', 'f']);
    ring.push('g');
    expect(ring.asArray()).to.deep.equal(['c', 'd', 'e', 'f', 'g']);
    ring.push('h');
    expect(ring.asArray()).to.deep.equal(['d', 'e', 'f', 'g', 'h']);
    ring.push('i');
    expect(ring.asArray()).to.deep.equal(['e', 'f', 'g', 'h', 'i']);
    ring.push('j');
    expect(ring.asArray()).to.deep.equal(['f', 'g', 'h', 'i', 'j']);
    ring.push('k');
    expect(ring.asArray()).to.deep.equal(['g', 'h', 'i', 'j', 'k']);
    ring.push('l');
    expect(ring.asArray()).to.deep.equal(['h', 'i', 'j', 'k', 'l']);
  });
});


