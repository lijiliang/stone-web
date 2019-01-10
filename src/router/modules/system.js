/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: 'noredirect',
  name: 'system',
  meta: {
    title: 'system',
    icon: 'system'
  },
  children: [
    {
      path: 'role',
      component: () => import('@/views/system/role'),
      name: 'systemRole',
      meta: { title: 'systemRole', noCache: true }
    },
    {
      path: 'logs',
      component: () => import('@/views/system/logs'),
      name: 'systemLogs',
      meta: { title: 'systemLogs', noCache: true }
    },
    {
      path: 'admin',
      component: () => import('@/views/system/admin'),
      name: 'systemAdmin',
      meta: { title: 'systemAdmin', noCache: true }
    },
    {
      path: 'sensitive',
      component: () => import('@/views/system/sensitive'),
      name: 'systemSensitive',
      meta: { title: 'systemSensitive', noCache: true }
    },
    {
      path: 'interface',
      component: () => import('@/views/system/interface'),
      name: 'systemInterface',
      meta: { title: 'systemInterface', noCache: true }
    }
  ]
}

export default systemRouter
