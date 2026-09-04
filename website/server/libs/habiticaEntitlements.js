import got from 'got';
import nconf from 'nconf';

const DEFAULT_API_BASE_URL = 'https://habitica.com/api/v3';

export function isActiveHabiticaPlan (plan, now = new Date()) {
  if (!plan || !plan.customerId) return false;
  if (!plan.dateTerminated) return true;

  const terminationDate = new Date(plan.dateTerminated);
  return !Number.isNaN(terminationDate.getTime()) && terminationDate > now;
}

export function publicEntitlementStatus (link = {}) {
  return {
    linked: Boolean(link.userId),
    active: Boolean(link.active),
    lastVerifiedAt: link.lastVerifiedAt || null,
    terminationDate: link.terminationDate || null,
  };
}

export async function fetchHabiticaSubscription ({ userId, apiToken }) {
  const xClient = nconf.get('HABITICA_X_CLIENT');
  if (!xClient || xClient.startsWith('YOUR-')) {
    throw new Error('Habitica entitlement verification is not configured.');
  }

  const apiBaseUrl = nconf.get('HABITICA_API_BASE_URL') || DEFAULT_API_BASE_URL;
  const response = await got.get(`${apiBaseUrl}/user`, {
    headers: {
      'x-api-user': userId,
      'x-api-key': apiToken,
      'x-client': xClient,
    },
    searchParams: {
      userFields: 'purchased.plan',
    },
    timeout: 10000,
    retry: 0,
  }).json();

  const plan = response && response.data && response.data.purchased
    ? response.data.purchased.plan
    : null;

  return {
    active: isActiveHabiticaPlan(plan),
    terminationDate: plan && plan.dateTerminated ? new Date(plan.dateTerminated) : null,
  };
}
