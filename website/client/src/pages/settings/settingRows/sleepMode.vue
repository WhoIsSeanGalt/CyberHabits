<template>
  <tbody class="d-content">
    <tr
      v-if="!mixinData.inlineSettingMixin.modalVisible"
    >
      <td class="settings-label">
        Hibernate
      </td>
      <td class="settings-value">
        {{ user.preferences.sleep ? 'Active' : 'Inactive' }}
      </td>
      <td class="settings-button">
        <a
          class="edit-link"
          @click.prevent="openModal()"
        >Manage</a>
      </td>
    </tr>
    <tr
      v-if="mixinData.inlineSettingMixin.modalVisible"
      class="expanded"
    >
      <td colspan="3">
        <div class="dialog-title">
          Hibernate
        </div>
        <div class="dialog-disclaimer">
          Hibernate when illness, travel, or life makes your normal schedule
          unavailable. This setting is separate from The Sprawl.
        </div>
        <ul>
          <li>Missed Dailies will not damage your Health.</li>
          <li>Task streaks and Habit counters will not reset.</li>
          <li>Contract progress remains pending until you resume.</li>
        </ul>
        <div class="input-area">
          <save-cancel-buttons
            :primary-button-label="user.preferences.sleep ? 'Wake Up' : 'Hibernate'"
            @saveClicked="toggleSleep(); requestCloseModal();"
            @cancelClicked="requestCloseModal();"
          />
        </div>
      </td>
    </tr>
  </tbody>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/colors.scss';

.dialog-title { color: $cyber-cyan; }
.dialog-disclaimer { color: $gray-50; margin-bottom: 16px; }
</style>

<script>
import { mapState } from '@/libs/store';
import { InlineSettingMixin } from '../components/inlineSettingMixin';
import SaveCancelButtons from '../components/saveCancelButtons.vue';

export default {
  components: { SaveCancelButtons },
  mixins: [InlineSettingMixin],
  computed: {
    ...mapState({ user: 'user.data' }),
  },
  methods: {
    toggleSleep () {
      this.$store.dispatch('user:sleep');
    },
  },
};
</script>
