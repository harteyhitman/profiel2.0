import { NextRequest, NextResponse } from 'next/server';

// docs/V2_MIGRATION_GUIDE.md: proxy /api to backend; backend base has no /api suffix.
// Incoming path is e.g. ["user"]; we forward to BACKEND_BASE + "/api/" + path.
const getApiUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL
    || (process.env.NODE_ENV === 'development' ? (process.env.LOCAL_API_URL || 'http://localhost:3001') : 'https://api.bedieningenprofiel.nl');
  const normalized = base.replace(/\/+$/, '');
  return normalized + (normalized.endsWith('/api') ? '' : '/api');
};

const API_URL = getApiUrl();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path, 'DELETE');
}

async function handleRequest(
  request: NextRequest,
  path: string[],
  method: string
) {
  try {
    const pathString = path.join('/');
    const url = `${API_URL}/${pathString}`;
    
    // Get request body if it exists
    let body: any = undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        body = await request.json();
      } catch {
        // No body or invalid JSON
      }
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Proxy] ${method} ${fullUrl}`);
    }

    // Forward the request to the API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let response: Response;
    try {
      response = await fetch(fullUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Forward authorization header if present
          ...(request.headers.get('authorization') && {
            Authorization: request.headers.get('authorization')!,
          }),
          // Forward cookies from the incoming request
          ...(request.headers.get('cookie') && {
            Cookie: request.headers.get('cookie')!,
          }),
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include', // Include cookies in request
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Handle specific error types
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout - the API server did not respond in time' },
          { status: 504 }
        );
      }
      
      if (fetchError.code === 'ECONNRESET' || fetchError.message?.includes('ECONNRESET')) {
        return NextResponse.json(
          { 
            error: 'Connection reset - the API server may be unavailable',
            message: 'Unable to connect to the backend API. Please check if the server is running.'
          },
          { status: 503 }
        );
      }
      
      if (fetchError.code === 'ECONNREFUSED' || fetchError.message?.includes('ECONNREFUSED')) {
        return NextResponse.json(
          { 
            error: 'Connection refused - the API server is not accepting connections',
            message: 'The backend API server appears to be down or unreachable.'
          },
          { status: 503 }
        );
      }
      
      // Re-throw other errors to be caught by outer catch
      throw fetchError;
    }

    // Forward Set-Cookie headers from API response to client
    const setCookieHeaders = response.headers.get('set-cookie');
    const responseHeaders: HeadersInit = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    };
    
    if (setCookieHeaders) {
      responseHeaders['Set-Cookie'] = setCookieHeaders;
    }

    // Get response data
    let data: any = {};
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        data = {};
      }
    } else {
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }
    }

    // Log error details in development
    if (process.env.NODE_ENV === 'development' && !response.ok) {
      console.error('API Error:', {
        url: fullUrl,
        method,
        status: response.status,
        requestBody: body,
        responseBody: data,
      });
    }

    // Return response with CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    // Enhanced error logging
    console.error('API Proxy Error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      url: error.config?.url || 'unknown',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        error: error.message || 'Proxy request failed',
        code: error.code,
        message: error.code === 'ECONNRESET' 
          ? 'The connection to the API server was reset. The server may be down or experiencing issues.'
          : error.code === 'ECONNREFUSED'
          ? 'The API server refused the connection. Please check if the server is running.'
          : 'An error occurred while processing the request.',
        details: process.env.NODE_ENV === 'development' ? {
          stack: error.stack,
          apiUrl: API_URL
        } : undefined
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

