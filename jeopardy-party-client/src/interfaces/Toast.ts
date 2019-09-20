export interface Toast {
    id?: string;
    createdAt?: Date;
    status: 'info' | 'warn' | 'danger';
    message: string;
    title: string;
    image?: string;
  }
