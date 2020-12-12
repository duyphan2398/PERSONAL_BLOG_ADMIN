import {
  BookIcon,
  UserCheckIcon,
  AlignCenterIcon
} from 'vue-feather-icons'

export const navigations = [
  { id: 'home', type: 'item', title: 'admin', routeName: 'admin.edit', icon: UserCheckIcon, exact: true },
  { id: 'post', type: 'item', title: 'post', routeName: 'post.index', icon: BookIcon },
  { id: 'category', type: 'item', title: 'category', routeName: 'category.index', icon: AlignCenterIcon }
]
