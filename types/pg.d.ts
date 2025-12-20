declare module 'pg' {
  export class Pool {
    constructor(config?: {
      connectionString?: string
      host?: string
      port?: number
      database?: string
      user?: string
      password?: string
      max?: number
      idleTimeoutMillis?: number
      connectionTimeoutMillis?: number
    })
    query(text: string, params?: any[]): Promise<any>
    end(): Promise<void>
    on(event: string, listener: (...args: any[]) => void): this
  }
}


