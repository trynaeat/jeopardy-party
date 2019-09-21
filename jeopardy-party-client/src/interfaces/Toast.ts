export interface Toast {
    id?: string;
    createdAt?: Date;
    status: 'info' | 'warn' | 'error';
    message: string;
    title: string;
    image?: string;
  }
