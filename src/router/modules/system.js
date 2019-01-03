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
      path: 'logs',
      component: () => import('@/views/system/logs'),
      name: 'systemLogs',
      meta: { title: 'systemLogs', noCache: true }
    },
    {
      path: 'line',
      component: () => import('@/views/charts/line'),
      name: 'LineChart',
      meta: { title: 'lineChart', noCache: true }
    },
    {
      path: 'mixchart',
      component: () => import('@/views/charts/mixChart'),
      name: 'MixChart',
      meta: { title: 'mixChart', noCache: true }
    }
  ]
}

export default systemRouter
