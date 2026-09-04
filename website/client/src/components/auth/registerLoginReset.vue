<template>
  <div class="form-wrapper">
    <privacy-banner
      class="privacy-banner"
    />
    <form
      id="login-form"
      @submit.prevent.stop="login"
    >
      <a
        href="/static/home"
        class="cyberhabits-wordmark mb-4"
      >
        <span class="cyberhabits-monogram">CH</span>
        <span>CYBER<span class="wordmark-accent">HABITS</span></span>
      </a>

      <div class="header">
        <h1>Connect your Habitica account</h1>
        <p>
          CyberHabits is an alternative interface for Habitica. Your tasks,
          progress, Crew, and subscription stay on Habitica.
        </p>
      </div>

      <div class="form-group">
        <label for="habiticaUserId">Habitica User ID</label>
        <input
          id="habiticaUserId"
          v-model.trim="habiticaUserId"
          class="form-control dark"
          type="text"
          autocomplete="username"
          inputmode="text"
          placeholder="00000000-0000-0000-0000-000000000000"
          required
        >
      </div>

      <div class="form-group">
        <label for="habiticaApiToken">Habitica API Token</label>
        <input
          id="habiticaApiToken"
          v-model.trim="habiticaApiToken"
          class="form-control dark"
          type="password"
          autocomplete="current-password"
          required
        >
      </div>

      <p class="security-note">
        Credentials stay in this browser and are sent directly to Habitica over
        HTTPS. CyberHabits has no user database or authentication server.
      </p>

      <div
        v-if="errorMessage"
        class="input-error"
        role="alert"
      >
        {{ errorMessage }}
      </div>

      <button
        type="submit"
        class="btn btn-info w-100 mb-3"
        :disabled="connecting || !habiticaUserId || !habiticaApiToken"
      >
        {{ connecting ? 'Connecting…' : 'Connect to Habitica' }}
      </button>

      <a
        class="credential-link"
        href="https://habitica.com/user/settings/api"
        target="_blank"
        rel="noopener noreferrer"
      >Find your User ID and API Token on Habitica</a>
      <a
        class="credential-link"
        href="https://habitica.com/register"
        target="_blank"
        rel="noopener noreferrer"
      >Create an account on Habitica</a>
    </form>
    <div
      id="cyber-grid-horizon"
      aria-hidden="true"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/colors.scss';
@import '@/assets/scss/forms.scss';
@import '@/assets/scss/privacy.scss';

.form-wrapper {
  background:
    radial-gradient(circle at 20% 15%, rgba($cyber-magenta, .18), transparent 34%),
    radial-gradient(circle at 80% 25%, rgba($cyber-cyan, .14), transparent 32%),
    $cyber-void;
  color: $cyber-text;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
}

#login-form {
  margin: 0 auto;
  max-width: 480px;
  padding: 72px 24px 120px;
  position: relative;
  z-index: 1;
}

.header {
  margin: 36px 0 28px;

  h1 { color: $cyber-text; font-size: 28px; }
  p { color: $cyber-text-muted; line-height: 1.6; }
}

label { color: $cyber-text; font-weight: 700; }

.form-control.dark {
  background: $cyber-panel;
  border: 1px solid rgba($cyber-cyan, .35);
  color: $cyber-text;

  &:focus {
    border-color: $cyber-cyan;
    box-shadow: 0 0 0 2px rgba($cyber-cyan, .15);
  }
}

.security-note {
  border-left: 2px solid $cyber-cyan;
  color: $cyber-text-muted;
  font-size: 13px;
  line-height: 1.5;
  margin: 24px 0;
  padding-left: 12px;
}

.input-error { color: $cyber-danger; margin-bottom: 16px; }

.credential-link {
  color: $cyber-cyan;
  display: block;
  margin-top: 10px;
  text-align: center;
}

#cyber-grid-horizon {
  background-image:
    linear-gradient(rgba($cyber-cyan, .13) 1px, transparent 1px),
    linear-gradient(90deg, rgba($cyber-cyan, .13) 1px, transparent 1px);
  background-size: 32px 32px;
  bottom: -80px;
  height: 260px;
  position: absolute;
  transform: perspective(220px) rotateX(55deg);
  transform-origin: bottom;
  width: 100%;
}
</style>

<script>
import PrivacyBanner from '@/components/header/banners/privacy';

export default {
  components: { PrivacyBanner },
  data () {
    return {
      connecting: false,
      errorMessage: '',
      habiticaApiToken: '',
      habiticaUserId: '',
    };
  },
  mounted () {
    this.$store.dispatch('common:setTitle', { section: 'Connect' });
  },
  methods: {
    async login () {
      this.connecting = true;
      this.errorMessage = '';
      try {
        await this.$store.dispatch('auth:login', {
          username: this.habiticaUserId,
          password: this.habiticaApiToken,
        });
        const redirectTo = this.$route.query.redirectTo || '/';
        window.location.href = redirectTo;
      } catch (err) {
        this.errorMessage = 'Habitica rejected those credentials. Check your User ID and API Token.';
      } finally {
        this.connecting = false;
      }
    },
  },
};
</script>
