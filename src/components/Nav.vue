<template>
  <nav class="navbar fixed-top navbar-light navbar-expand-xl pt-xl-3" style="z-index: 1">
    <div class="container">
      <router-link
          tag="a"
          class="navbar-brand"
          :to="{name: 'home'}">
        <img src="../assets/images/dummy_image.png" style="max-width: 120px;">
      </router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav text-nowrap ml-auto">
          <li v-for="item of navigations" :key="item.id" class="nav-item">
            <router-link
                v-if="hasPermission(item)"
                :active-class="'active'"
                :exact="item.exact"
                :to="{name: item.routeName}"
                class="nav-link">
              <component :is="item.icon" size="15" class="custom-class mr-2" v-if="item.icon"/>
              {{ $t(`${`nav_` + item.title}`) }}
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
               aria-haspopup="true" aria-expanded="false">
              <settings-icon size="15" class="custom-class mr-2"/>
              {{ userName }}
            </a>

            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" @click.prevent="logoutEvent">
                <log-out-icon size="15" class="custom-class mr-2"/>
                {{ $t('nav_logout') }}
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import {navigations} from '@/config'
import {PERMISSIONS} from '@/enum/permissions.enum'
import store from '@/store'
import {isEmpty} from 'lodash-es'
import {
  SettingsIcon,
  LogOutIcon
} from 'vue-feather-icons'

export default {
  name: 'Nav',
  components: {
    SettingsIcon,
    LogOutIcon
  },
  computed: {
    permissions () {
      return store.getters.currentPermissions || []
    },
    userName () {
      return store.getters.profile ? store.getters.profile.data.name : ''
    }
  },
  data () {
    return {
      navigations
    }
  },
  methods: {
    hasPermission (item) {
      const currentRoute = this.$router.resolve({name: item.routeName}).route
      if (currentRoute.meta.permissions.includes(PERMISSIONS.ALL)) {
        return true
      }
      if (!isEmpty(currentRoute.meta.permissions)) {
        return !!this.permissions.find(permission => currentRoute.meta.permissions.includes(permission.name))
      }
      return false
    },

    logoutEvent () {
      this.$emit('logout-event')
    }
  }
}
</script>

<style scoped>
  .active {
    font-weight: bold;
  }
</style>
