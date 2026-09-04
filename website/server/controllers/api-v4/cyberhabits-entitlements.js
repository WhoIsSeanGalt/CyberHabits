import validator from 'validator';
import nconf from 'nconf';
import { authWithHeaders } from '../../middlewares/auth';
import { BadRequest, NotAuthorized } from '../../libs/errors';
import { encrypt, decrypt } from '../../libs/encryption';
import {
  fetchHabiticaSubscription,
  publicEntitlementStatus,
} from '../../libs/habiticaEntitlements';

const api = {};
const enabled = () => nconf.get('HABITICA_ENTITLEMENTS_ENABLED') === 'true';

function requireEnabled () {
  if (!enabled()) {
    throw new NotAuthorized('Habitica subscription linking is not enabled on this server.');
  }
}

api.getHabiticaEntitlement = {
  method: 'GET',
  middlewares: [authWithHeaders({ userFieldsToInclude: ['cyberHabits.habiticaLink'] })],
  url: '/cyberhabits/entitlements/habitica',
  async handler (req, res) {
    requireEnabled();
    const link = res.locals.user.cyberHabits && res.locals.user.cyberHabits.habiticaLink;
    res.respond(200, publicEntitlementStatus(link));
  },
};

api.linkHabiticaEntitlement = {
  method: 'POST',
  middlewares: [authWithHeaders({ userFieldsToInclude: ['cyberHabits.habiticaLink'] })],
  url: '/cyberhabits/entitlements/habitica',
  async handler (req, res) {
    requireEnabled();
    const { habiticaUserId, habiticaApiToken } = req.body;
    if (!validator.isUUID(String(habiticaUserId || '')) || !habiticaApiToken) {
      throw new BadRequest('A valid Habitica user ID and API token are required.');
    }

    let verification;
    try {
      verification = await fetchHabiticaSubscription({
        userId: habiticaUserId,
        apiToken: habiticaApiToken,
      });
    } catch (err) {
      if (err.response && (err.response.statusCode === 401 || err.response.statusCode === 403)) {
        throw new NotAuthorized('Habitica rejected those credentials.');
      }
      throw err;
    }

    const now = new Date();
    const link = {
      userId: habiticaUserId,
      encryptedApiToken: encrypt(habiticaApiToken),
      linkedAt: now,
      lastVerifiedAt: now,
      active: verification.active,
      terminationDate: verification.terminationDate,
    };
    res.locals.user.cyberHabits.habiticaLink = link;
    await res.locals.user.save();
    res.respond(200, publicEntitlementStatus(link));
  },
};

api.refreshHabiticaEntitlement = {
  method: 'POST',
  middlewares: [authWithHeaders({ userFieldsToInclude: ['cyberHabits.habiticaLink'] })],
  url: '/cyberhabits/entitlements/habitica/refresh',
  async handler (req, res) {
    requireEnabled();
    const link = res.locals.user.cyberHabits && res.locals.user.cyberHabits.habiticaLink;
    if (!link || !link.userId || !link.encryptedApiToken) {
      throw new BadRequest('No Habitica account is linked.');
    }

    const verification = await fetchHabiticaSubscription({
      userId: link.userId,
      apiToken: decrypt(link.encryptedApiToken),
    });
    link.active = verification.active;
    link.terminationDate = verification.terminationDate;
    link.lastVerifiedAt = new Date();
    await res.locals.user.save();
    res.respond(200, publicEntitlementStatus(link));
  },
};

api.unlinkHabiticaEntitlement = {
  method: 'DELETE',
  middlewares: [authWithHeaders({ userFieldsToInclude: ['cyberHabits.habiticaLink'] })],
  url: '/cyberhabits/entitlements/habitica',
  async handler (req, res) {
    requireEnabled();
    await res.locals.user.updateOne({
      $unset: { 'cyberHabits.habiticaLink': 1 },
    });
    res.respond(200, publicEntitlementStatus());
  },
};

export default api;
