/**
 * @summary
 * In-memory store instance for User entity.
 * Provides singleton pattern for data storage without database.
 *
 * @module instances/user/userStore
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * User record structure
 */
export interface UserRecord {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  profile: 'iniciante' | 'experiente' | 'administrador';
  avatar: string | null;
  status: 'ativo' | 'inativo' | 'bloqueado' | 'pendente';
  loginAttempts: number;
  lastLoginAttempt: string | null;
  dateCreated: string;
  dateModified: string;
}

/**
 * In-memory store for User records
 */
class UserStore {
  private records: Map<string, UserRecord> = new Map();

  /**
   * Generate new UUID
   */
  generateId(): string {
    return uuidv4();
  }

  /**
   * Get all records
   */
  getAll(): UserRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Get record by ID
   */
  getById(id: string): UserRecord | undefined {
    return this.records.get(id);
  }

  /**
   * Find user by username
   */
  findByUsername(username: string): UserRecord | undefined {
    return Array.from(this.records.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  /**
   * Find user by email
   */
  findByEmail(email: string): UserRecord | undefined {
    return Array.from(this.records.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  /**
   * Add new record
   */
  add(record: UserRecord): UserRecord {
    this.records.set(record.id, record);
    return record;
  }

  /**
   * Update existing record
   */
  update(id: string, data: Partial<UserRecord>): UserRecord | undefined {
    const existing = this.records.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...data };
    this.records.set(id, updated);
    return updated;
  }

  /**
   * Delete record by ID
   */
  delete(id: string): boolean {
    return this.records.delete(id);
  }

  /**
   * Check if record exists
   */
  exists(id: string): boolean {
    return this.records.has(id);
  }

  /**
   * Get total count of records
   */
  count(): number {
    return this.records.size;
  }

  /**
   * Clear all records (useful for testing)
   */
  clear(): void {
    this.records.clear();
  }
}

/**
 * Singleton instance of UserStore
 */
export const userStore = new UserStore();
