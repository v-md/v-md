import { compareFileNames } from '@v-md/shared'
import { describe, expect, it } from 'vitest'

describe('compare file names', () => {
  it('should return -1 when a comes before b', () => {
    expect(compareFileNames('file1.txt', 'file2.txt')).toBe(-1)
    expect(compareFileNames('file1.1.txt', 'file1.2.txt')).toBe(-1)
    expect(compareFileNames('file-1.txt', 'file-2.txt')).toBe(-1)
    expect(compareFileNames('file_1.txt', 'file_2.txt')).toBe(-1)
  })

  it('should return 1 when a comes after b', () => {
    expect(compareFileNames('file2.txt', 'file1.txt')).toBe(1)
    expect(compareFileNames('file1.2.txt', 'file1.1.txt')).toBe(1)
    expect(compareFileNames('file-2.txt', 'file-1.txt')).toBe(1)
    expect(compareFileNames('file_2.txt', 'file_1.txt')).toBe(1)
  })

  it('should return 0 when a and b are equal', () => {
    expect(compareFileNames('file1.txt', 'file1.txt')).toBe(0)
    expect(compareFileNames('file1.1.txt', 'file1.1.txt')).toBe(0)
    expect(compareFileNames('file-1.txt', 'file-1.txt')).toBe(0)
    expect(compareFileNames('file_1.txt', 'file_1.txt')).toBe(0)
  })

  it('should handle numbers correctly', () => {
    expect(compareFileNames('10.file.txt', '2.file.txt')).toBe(1)
    expect(compareFileNames('2.file.txt', '10.file.txt')).toBe(-1)
    expect(compareFileNames('file1.10.txt', 'file1.2.txt')).toBe(1)
    expect(compareFileNames('file1.2.txt', 'file1.10.txt')).toBe(-1)
  })

  it('should handle mixed separators', () => {
    expect(compareFileNames('file-1.txt', 'file.2.txt')).toBe(-1)
    expect(compareFileNames('file.2.txt', 'file-1.txt')).toBe(1)
    expect(compareFileNames('file_1.txt', 'file.2.txt')).toBe(-1)
    expect(compareFileNames('file.2.txt', 'file_1.txt')).toBe(1)
  })

  it('should handle empty strings', () => {
    expect(compareFileNames('', '')).toBe(0)
    expect(compareFileNames('file1.txt', '')).toBe(1)
    expect(compareFileNames('', 'file1.txt')).toBe(-1)
  })

  it('should handle case sensitivity', () => {
    expect(compareFileNames('fileA.txt', 'fileB.txt')).toBe(-1)
    expect(compareFileNames('fileB.txt', 'fileA.txt')).toBe(1)
    expect(compareFileNames('fileA.txt', 'filea.txt')).toBe(1)
    expect(compareFileNames('filea.txt', 'fileA.txt')).toBe(-1)
  })
})
