import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin access
    const session = await auth()
    if (!session || session.user?.type !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { startDate, endDate, groupBy = 'day' } = body

    // Build date filter
    const dateFilter: any = {
      active: true,
    }

    if (startDate || endDate) {
      dateFilter.createdAt = {}
      if (startDate) {
        dateFilter.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        dateFilter.createdAt.lte = new Date(endDate)
      }
    }

    // Fetch all orders
    const orders = await prisma.order.findMany({
      where: dateFilter,
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate statistics
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const deliveredOrders = orders.filter((o) => o.status === 'delivered')
    const deliveredRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0)

    // Sales by status
    const salesByStatus = orders.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + order.totalAmount
      return acc
    }, {})

    // Orders by status count
    const ordersByStatus = orders.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {})

    // Sales by payment method
    const salesByPaymentMethod = orders.reduce((acc: any, order) => {
      acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + order.totalAmount
      return acc
    }, {})

    // Orders by payment method count
    const ordersByPaymentMethod = orders.reduce((acc: any, order) => {
      acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1
      return acc
    }, {})

    // Sales by date (grouped)
    const salesByDate: any = {}
    orders.forEach((order) => {
      const date = new Date(order.createdAt)
      let key = ''

      if (groupBy === 'day') {
        key = date.toISOString().split('T')[0] // YYYY-MM-DD
      } else if (groupBy === 'week') {
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split('T')[0]
      } else if (groupBy === 'month') {
        const month = String(date.getMonth() + 1).padStart(2, '0')
        key = `${date.getFullYear()}-${month}`
      } else if (groupBy === 'year') {
        key = String(date.getFullYear())
      }

      if (!salesByDate[key]) {
        salesByDate[key] = {
          date: key,
          revenue: 0,
          orders: 0,
        }
      }
      salesByDate[key].revenue += order.totalAmount
      salesByDate[key].orders += 1
    })

    // Top selling products
    const productSales: any = {}
    orders.forEach((order) => {
      const items = Array.isArray(order.items) ? order.items : []
      items.forEach((item: any) => {
        const productId = item.id || item.name
        if (!productSales[productId]) {
          productSales[productId] = {
            id: productId,
            name: item.name || 'Unknown',
            quantity: 0,
            revenue: 0,
            image: item.image || '',
          }
        }
        const quantity = item.quantity || 1
        const price = parseFloat(String(item.price || '0').replace(/[^0-9.]/g, '')) || 0
        productSales[productId].quantity += quantity
        productSales[productId].revenue += price * quantity
      })
    })

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10)

    // Sales by category/type
    const salesByCategory: any = {}
    const salesByType: any = {}
    orders.forEach((order) => {
      const items = Array.isArray(order.items) ? order.items : []
      items.forEach((item: any) => {
        const category = item.category || 'Unknown'
        const type = item.type || 'Unknown'
        const quantity = item.quantity || 1
        const price = parseFloat(String(item.price || '0').replace(/[^0-9.]/g, '')) || 0
        const revenue = price * quantity

        salesByCategory[category] = (salesByCategory[category] || 0) + revenue
        salesByType[type] = (salesByType[type] || 0) + revenue
      })
    })

    // Average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Sales by city
    const salesByCity = orders.reduce((acc: any, order) => {
      acc[order.city] = (acc[order.city] || 0) + order.totalAmount
      return acc
    }, {})

    return NextResponse.json(
      {
        summary: {
          totalOrders,
          totalRevenue,
          deliveredOrders: deliveredOrders.length,
          deliveredRevenue,
          averageOrderValue,
        },
        salesByStatus,
        ordersByStatus,
        salesByPaymentMethod,
        ordersByPaymentMethod,
        salesByDate: Object.values(salesByDate).sort((a: any, b: any) => a.date.localeCompare(b.date)),
        topProducts,
        salesByCategory,
        salesByType,
        salesByCity,
        dateRange: {
          startDate: startDate || null,
          endDate: endDate || null,
          groupBy,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error generating sales report:', error)
    return NextResponse.json(
      { error: 'Failed to generate sales report' },
      { status: 500 }
    )
  }
}

