import api from './api';

export interface Admin {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin';
  zone?: {
    wilaya: string;
    cities: string[];
  };
  isBlocked: boolean;
  blockReason?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  driver: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  amount: number;
  commissionAmount: number;
  month: number;
  year: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentDate?: string;
  transactionId?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'client' | 'driver' | 'both';
  isBlocked: boolean;
  blockReason?: string;
  city?: string;
  rating: number;
  totalTrips: number;
  createdAt: string;
}

class AdminService {
  /**
   * Connexion admin
   */
  async loginAdmin(email: string, password: string): Promise<{ admin: Admin; accessToken: string; refreshToken: string }> {
    const response = await api.post('/admin/auth/login', { email, password });
    return response.data.data;
  }

  /**
   * Changer le mot de passe admin
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.put('/admin/auth/change-password', { oldPassword, newPassword });
  }

  /**
   * Créer un nouvel admin (Super Admin uniquement)
   */
  async createAdmin(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'admin';
    wilaya?: string;
  }): Promise<Admin> {
    const response = await api.post('/admin/admins', data);
    return response.data.data;
  }

  /**
   * Obtenir tous les admins (Super Admin uniquement)
   */
  async getAdmins(): Promise<Admin[]> {
    const response = await api.get('/admin/admins');
    return response.data.data;
  }

  /**
   * Bloquer/Débloquer un admin (Super Admin uniquement)
   */
  async toggleBlockAdmin(adminId: string, isBlocked: boolean, blockReason?: string): Promise<Admin> {
    const response = await api.put(`/admin/admins/${adminId}/block`, { isBlocked, blockReason });
    return response.data.data;
  }

  /**
   * Obtenir tous les utilisateurs
   */
  async getUsers(): Promise<User[]> {
    const response = await api.get('/admin/users');
    return response.data.data;
  }

  /**
   * Bloquer/Débloquer un utilisateur
   */
  async toggleBlockUser(userId: string, isBlocked: boolean, blockReason?: string): Promise<User> {
    const response = await api.put(`/admin/users/${userId}/block`, { isBlocked, blockReason });
    return response.data.data;
  }

  /**
   * Obtenir les statistiques d'un utilisateur
   */
  async getUserStats(userId: string, month?: number, year?: number): Promise<any> {
    const params = month && year ? `?month=${month}&year=${year}` : '';
    const response = await api.get(`/admin/users/${userId}/stats${params}`);
    return response.data.data;
  }

  /**
   * Obtenir les paiements en attente pour un conducteur
   */
  async getDriverPayments(driverId: string): Promise<Payment[]> {
    const response = await api.get(`/admin/payments/drivers/${driverId}`);
    return response.data.data;
  }

  /**
   * Obtenir tous les paiements en attente
   */
  async getAllPendingPayments(): Promise<Payment[]> {
    const response = await api.get('/admin/payments/pending');
    return response.data.data;
  }

  /**
   * Mettre à jour le statut d'un paiement
   */
  async updatePaymentStatus(paymentId: string, status: 'paid' | 'cancelled', transactionId?: string): Promise<Payment> {
    const response = await api.put(`/admin/payments/${paymentId}/status`, { status, transactionId });
    return response.data.data;
  }

  /**
   * Générer les paiements mensuels (Super Admin uniquement)
   */
  async generateMonthlyPayments(month: number, year: number): Promise<Payment[]> {
    const response = await api.post('/admin/payments/generate-monthly', { month, year });
    return response.data.data;
  }

  /**
   * Obtenir le taux de commission actuel
   */
  async getCommissionRate(): Promise<{ rate: number }> {
    const response = await api.get('/admin/commission');
    return response.data.data;
  }

  /**
   * Mettre à jour le taux de commission (Super Admin uniquement)
   */
  async updateCommissionRate(rate: number): Promise<{ rate: number }> {
    const response = await api.put('/admin/commission', { rate });
    return response.data.data;
  }
}

export const adminService = new AdminService();

