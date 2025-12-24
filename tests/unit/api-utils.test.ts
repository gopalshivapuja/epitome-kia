import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ZodError, z } from 'zod'
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseSearchParams,
  parsePagination,
  buildPaginationMeta,
} from '@/lib/api-utils'

describe('successResponse', () => {
  it('should return success response with data', async () => {
    const data = { id: '123', name: 'Test' }
    const response = successResponse(data)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data).toEqual(data)
  })

  it('should allow custom status code', async () => {
    const data = { id: '123' }
    const response = successResponse(data, 201)

    expect(response.status).toBe(201)
  })
})

describe('errorResponse', () => {
  it('should return error response with message', async () => {
    const response = errorResponse('Something went wrong', 400)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toBe('Something went wrong')
  })

  it('should include field errors when provided', async () => {
    const errors = {
      email: ['Invalid email'],
      phone: ['Required'],
    }
    const response = errorResponse('Validation failed', 400, errors)
    const json = await response.json()

    expect(json.errors).toEqual(errors)
  })

  it('should set headers when provided', () => {
    const headers = {
      'Retry-After': '60',
      'X-RateLimit-Limit': '5',
    }
    const response = errorResponse('Too many requests', 429, headers)

    expect(response.headers.get('Retry-After')).toBe('60')
    expect(response.headers.get('X-RateLimit-Limit')).toBe('5')
  })

  it('should default to 400 status', async () => {
    const response = errorResponse('Bad request')
    expect(response.status).toBe(400)
  })
})

describe('handleApiError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should handle ZodError with field errors', async () => {
    const schema = z.object({
      email: z.string().email(),
      name: z.string().min(2),
    })

    let zodError: ZodError | null = null
    try {
      schema.parse({ email: 'invalid', name: 'J' })
    } catch (e) {
      zodError = e as ZodError
    }

    const response = handleApiError(zodError!)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('Validation failed')
    expect(json.errors).toBeDefined()
    expect(json.errors?.email).toBeDefined()
    expect(json.errors?.name).toBeDefined()
  })

  it('should handle generic Error', async () => {
    const error = new Error('Database connection failed')
    const response = handleApiError(error)
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.success).toBe(false)
  })

  it('should handle unknown errors', async () => {
    const response = handleApiError('unexpected string error')
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('An unexpected error occurred')
  })
})

describe('parseSearchParams', () => {
  it('should parse single value params', () => {
    const searchParams = new URLSearchParams('foo=bar&baz=qux')
    const result = parseSearchParams(searchParams)

    expect(result).toEqual({ foo: 'bar', baz: 'qux' })
  })

  it('should parse multiple values as array', () => {
    const searchParams = new URLSearchParams('tag=a&tag=b&tag=c')
    const result = parseSearchParams(searchParams)

    expect(result.tag).toEqual(['a', 'b', 'c'])
  })

  it('should handle empty params', () => {
    const searchParams = new URLSearchParams('')
    const result = parseSearchParams(searchParams)

    expect(result).toEqual({})
  })
})

describe('parsePagination', () => {
  it('should return defaults for empty params', () => {
    const searchParams = new URLSearchParams('')
    const result = parsePagination(searchParams)

    expect(result).toEqual({ page: 1, limit: 10, skip: 0 })
  })

  it('should parse page and limit', () => {
    const searchParams = new URLSearchParams('page=3&limit=20')
    const result = parsePagination(searchParams)

    expect(result).toEqual({ page: 3, limit: 20, skip: 40 })
  })

  it('should enforce minimum page of 1', () => {
    const searchParams = new URLSearchParams('page=0')
    const result = parsePagination(searchParams)

    expect(result.page).toBe(1)
  })

  it('should enforce minimum limit of 1', () => {
    const searchParams = new URLSearchParams('limit=0')
    const result = parsePagination(searchParams)

    expect(result.limit).toBe(1)
  })

  it('should enforce maximum limit of 100', () => {
    const searchParams = new URLSearchParams('limit=200')
    const result = parsePagination(searchParams)

    expect(result.limit).toBe(100)
  })

  it('should calculate skip correctly', () => {
    const searchParams = new URLSearchParams('page=5&limit=25')
    const result = parsePagination(searchParams)

    expect(result.skip).toBe(100) // (5-1) * 25
  })
})

describe('buildPaginationMeta', () => {
  it('should calculate pagination metadata', () => {
    const result = buildPaginationMeta(100, 1, 10)

    expect(result).toEqual({
      total: 100,
      page: 1,
      limit: 10,
      totalPages: 10,
      hasNextPage: true,
      hasPrevPage: false,
    })
  })

  it('should indicate no next page on last page', () => {
    const result = buildPaginationMeta(100, 10, 10)

    expect(result.hasNextPage).toBe(false)
    expect(result.hasPrevPage).toBe(true)
  })

  it('should handle single page result', () => {
    const result = buildPaginationMeta(5, 1, 10)

    expect(result.totalPages).toBe(1)
    expect(result.hasNextPage).toBe(false)
    expect(result.hasPrevPage).toBe(false)
  })

  it('should handle empty results', () => {
    const result = buildPaginationMeta(0, 1, 10)

    expect(result.totalPages).toBe(0)
    expect(result.hasNextPage).toBe(false)
    expect(result.hasPrevPage).toBe(false)
  })

  it('should round up totalPages', () => {
    const result = buildPaginationMeta(95, 1, 10)

    expect(result.totalPages).toBe(10)
  })
})
