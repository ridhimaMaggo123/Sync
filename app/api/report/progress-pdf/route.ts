import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get backend URL with fallback
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    
    const response = await fetch(`${backendUrl}/api/report/progress-pdf`, {
      credentials: 'include',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    })

    if (!response.ok) {
      console.error('Backend response error:', response.status, response.statusText)
      return NextResponse.json(
        { message: 'Failed to generate progress report' },
        { status: response.status }
      )
    }

    // Get the PDF buffer from the backend
    const pdfBuffer = await response.arrayBuffer()
    
    // Return the PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="sync-progress-report-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error downloading progress PDF:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 