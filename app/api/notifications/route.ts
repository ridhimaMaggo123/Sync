import { NextRequest, NextResponse } from 'next/server'

interface Notification {
  id: string
  type: 'period_reminder' | 'fertile_window' | 'wellness_tip' | 'cycle_prediction'
  title: string
  message: string
  triggerDate: string
  created: string
  read: boolean
  userId?: string
}

// In-memory storage for demo (in production, use a database)
let notifications: Notification[] = []

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const userId = url.searchParams.get('userId') || 'demo-user'
  
  // Filter notifications for the user
  const userNotifications = notifications.filter(n => n.userId === userId)
  
  // Add some default notifications if none exist
  if (userNotifications.length === 0) {
    const defaultNotifications: Notification[] = [
      {
        id: 'default-1',
        type: 'wellness_tip',
        title: 'Welcome to Period Tracking',
        message: 'Start tracking your cycle to get personalized predictions and health insights',
        triggerDate: new Date().toISOString().split('T')[0],
        created: new Date().toISOString(),
        read: false,
        userId
      }
    ]
    notifications.push(...defaultNotifications)
    return NextResponse.json({ notifications: defaultNotifications })
  }
  
  return NextResponse.json({ notifications: userNotifications })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cycleNotifications, userId = 'demo-user' } = body
    
    if (!cycleNotifications || !Array.isArray(cycleNotifications)) {
      return NextResponse.json(
        { error: 'Invalid notification data' },
        { status: 400 }
      )
    }
    
    // Remove existing cycle notifications for this user
    notifications = notifications.filter(n => 
      n.userId !== userId || !['period_reminder', 'fertile_window', 'cycle_prediction'].includes(n.type)
    )
    
    // Add new cycle notifications
    const newNotifications: Notification[] = cycleNotifications.map((notif: any, index: number) => ({
      id: `cycle-${userId}-${Date.now()}-${index}`,
      type: notif.type || 'cycle_prediction',
      title: notif.title || 'Cycle Notification',
      message: notif.message,
      triggerDate: notif.triggerDate,
      created: new Date().toISOString(),
      read: false,
      userId
    }))
    
    notifications.push(...newNotifications)
    
    return NextResponse.json({ 
      success: true, 
      count: newNotifications.length,
      notifications: newNotifications
    })
    
  } catch (error) {
    console.error('Notification creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create notifications' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, read } = body
    
    const notification = notifications.find(n => n.id === notificationId)
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }
    
    notification.read = read
    
    return NextResponse.json({ success: true, notification })
    
  } catch (error) {
    console.error('Notification update error:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}