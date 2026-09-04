import {
  isActiveHabiticaPlan,
  publicEntitlementStatus,
} from '../../../../website/server/libs/habiticaEntitlements';

describe('Habitica entitlements', () => {
  const now = new Date('2026-01-01T00:00:00.000Z');

  it('requires a customer ID', () => {
    expect(isActiveHabiticaPlan({}, now)).to.equal(false);
  });

  it('accepts an active plan without a termination date', () => {
    expect(isActiveHabiticaPlan({ customerId: 'customer' }, now)).to.equal(true);
  });

  it('keeps a cancelled plan active until its termination date', () => {
    const plan = { customerId: 'customer', dateTerminated: '2026-02-01T00:00:00.000Z' };
    expect(isActiveHabiticaPlan(plan, now)).to.equal(true);
  });

  it('rejects an expired plan', () => {
    const plan = { customerId: 'customer', dateTerminated: '2025-12-01T00:00:00.000Z' };
    expect(isActiveHabiticaPlan(plan, now)).to.equal(false);
  });

  it('never exposes linked credentials in public status', () => {
    const status = publicEntitlementStatus({
      userId: 'habitica-user',
      encryptedApiToken: 'secret',
      active: true,
    });
    expect(status).to.eql({
      linked: true,
      active: true,
      lastVerifiedAt: null,
      terminationDate: null,
    });
  });
});
