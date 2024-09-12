import router from '@/router'
import { useUserStoreHook } from '@/store/modules/user'
import { usePermissionStoreHook } from '@/store/modules/permission'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/cache/cookies'
import asyncRouteSettings from '@/config/async-route'
import isWhiteList from '@/config/white-list'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()

  if (to.path === '/login') {
    // 如果已经登录，并准备进入 Login 页面，则重定向到主页
    next({ path: '/' })
    NProgress.done()
  } else {
    // 检查用户是否已获得其权限角色
    if (permissionStore.routes.length === 0) {
      try {
        if (asyncRouteSettings.open) {
          // 注意：角色必须是一个数组！ 例如: ['admin'] 或 ['developer', 'editor']

          const roles = userStore.roles
          // 根据角色生成可访问的 Routes（可访问路由 = 常驻路由 + 有访问权限的动态路由）
          permissionStore.setRoutes(roles || ['user'])
        } else {
          // 没有开启动态路由功能，则启用默认角色
          userStore.setRoles(asyncRouteSettings.defaultRoles)
          permissionStore.setRoutes(asyncRouteSettings.defaultRoles)
        }

        // 将'有访问权限的动态路由' 添加到 Router 中
        permissionStore.dynamicRoutes.forEach(route => {
          router.addRoute(route)
        })

        // 确保添加路由已完成
        // 设置 replace: true, 因此导航将不会留下历史记录
        next({ ...to, replace: true })
      } catch (err: any) {
        // 过程中发生任何错误，都直接重置 Token，并重定向到登录页面
        userStore.resetToken()
        ElMessage.error(err.message || '路由守卫过程发生错误')
        next('/login')
        NProgress.done()
      }
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})